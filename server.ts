import express from 'express';
import dns from 'dns';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { INITIAL_MENU_ITEMS } from './src/data';

dns.setServers(['8.8.8.8', '1.1.1.1']);

console.log('Node DNS servers:', dns.getServers());

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 5000);
const mongoUri = process.env.MONGODB_URI;
const mongoFallbackUri = process.env.MONGODB_FALLBACK_URI;
const dbName = process.env.MONGODB_DB ?? 'ibbani-cafe';
const jwtSecret = process.env.JWT_SECRET;

if (!mongoUri) {
  console.error('Missing MONGODB_URI. Add it to .env.local or .env.');
  process.exit(1);
}

if (!jwtSecret) {
  console.error('Missing JWT_SECRET. Add it to .env.local or .env.');
  process.exit(1);
}

const parseMongoUri = (uri: string) => {
  const username = uri.match(/^mongodb(?:\+srv)?:\/\/([^:]+):/)?.[1] ?? '<unknown>';
  const host = uri.match(/@([^/?]+)/)?.[1] ?? '<unknown>';
  return { username, host };
};

const { username, host } = parseMongoUri(mongoUri);
console.log(`MongoDB user: ${username}`);
console.log(`MongoDB host: ${host}`);
console.log(`MongoDB URI type: ${mongoUri.startsWith('mongodb+srv://') ? 'SRV' : 'standard'}`);

let client = new MongoClient(mongoUri, {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
});

const connectToAtlas = async () => {
  try {
    await client.connect();
  } catch (error) {
    if (
      mongoFallbackUri &&
      mongoUri.startsWith('mongodb+srv://') &&
      error instanceof Error &&
      error.message.includes('querySrv ECONNREFUSED')
    ) {
      console.warn('SRV lookup failed; trying fallback non-SRV connection string from MONGODB_FALLBACK_URI.');
      client = new MongoClient(mongoFallbackUri, {
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000,
      });
      await client.connect();
      return;
    }

    throw error;
  }
};

try {
  await connectToAtlas();
  console.log(`Connected to MongoDB database: ${dbName}`);
} catch (error) {
  console.error('MongoDB connection failed:', error);
  if (mongoFallbackUri) {
    console.error('If fallback was used, verify MONGODB_FALLBACK_URI.');
  } else {
    console.error('If using mongodb+srv, your environment may block SRV DNS lookups.');
    console.error('Set MONGODB_FALLBACK_URI to a mongodb:// host list URL as a workaround.');
  }
  process.exit(1);
}

const db = client.db(dbName);

await db.createCollection('reservations').catch((error) => {
  if ((error as any)?.codeName !== 'NamespaceExists') {
    console.error('Unable to ensure reservations collection exists:', error);
  }
});

await db.createCollection('menu').catch((error) => {
  if ((error as any)?.codeName !== 'NamespaceExists') {
    console.error('Unable to ensure menu collection exists:', error);
  }
});

const messagesCollection = db.collection('messages');
const reservationsCollection = db.collection('reservations');
const menuCollection = db.collection('menu');

const existingMenuCount = await menuCollection.countDocuments();
if (existingMenuCount === 0) {
  const seedDocs = INITIAL_MENU_ITEMS.map(({ id, _id, ...rest }) => ({
    ...rest,
    available: true,
    createdAt: new Date().toISOString(),
  }));
  await menuCollection.insertMany(seedDocs as any[]);
}

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

// JWT Verification Middleware
const verifyAdminToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'No token provided. Please login first.' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret!);
    req.admin = decoded; // Attach decoded token to request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
  }
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', db: db.databaseName });
});

app.get('/api/messages', async (_req, res) => {
  const docs = await messagesCollection.find({}).sort({ createdAt: -1 }).toArray();
  res.json(docs);
});

app.post('/api/messages', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required message fields.' });
  }

  const doc = {
    name,
    email,
    subject,
    message,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  const result = await messagesCollection.insertOne(doc);
  res.status(201).json({ _id: result.insertedId, ...doc });
});

app.get('/api/reservations', async (_req, res) => {
  const docs = await reservationsCollection.find({}).sort({ createdAt: -1 }).toArray();
  const mapped = docs.map(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));
  res.json(mapped);
});

app.post('/api/reservations', async (req, res) => {
  const { customerName, email, phone, date, time, guests, tablePreference, specialRequest } = req.body;
  if (!customerName || !email || !phone || !date || !time || !guests) {
    return res.status(400).json({ error: 'Missing required reservation fields.' });
  }

  const reservationId = 'IBN-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
  const createdAt = new Date().toISOString();

  const doc = {
    reservationId,
    customerName,
    email,
    phone: phone ?? '',
    date,
    time,
    guests,
    tablePreference: tablePreference ?? 'standard',
    specialRequest: specialRequest ?? '',
    status: 'pending',
    createdAt,
  };

  const result = await reservationsCollection.insertOne(doc);
  res.status(201).json({
    id: result.insertedId.toString(),
    ...doc,
  });
});

app.patch('/api/reservations/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { status, tableNumber } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Missing status field.' });
  }

  const { ObjectId } = await import('mongodb');
  const filter = ObjectId.isValid(id)
    ? { _id: new ObjectId(id) }
    : { reservationId: id };

  const updateFields: Record<string, unknown> = { status, updatedAt: new Date().toISOString() };
  if (typeof tableNumber === 'string' && tableNumber.trim().length > 0) {
    updateFields.tableNumber = tableNumber.trim();
  }

  const result = await reservationsCollection.updateOne(filter, { $set: updateFields });

  if (result.matchedCount === 0) {
    return res.status(404).json({ error: 'Reservation not found.' });
  }

  res.json({ success: true, status, tableNumber });
});

// Menu collection endpoints
app.get('/api/menu', async (_req, res) => {
  const docs = await menuCollection.find({}).sort({ createdAt: -1 }).toArray();
  const items = docs.map(({ _id, available, createdAt, ...rest }) => ({
    ...rest,
    id: _id.toString(),
    available: available ?? true,
    createdAt: createdAt ?? new Date().toISOString(),
  }));
  res.json(items);
});

app.post('/api/menu', verifyAdminToken, async (req, res) => {
  const { name, description, category, subCategory, price, image, available, isVegetarian, caffeineLevel } = req.body;

  if (!name || !description || !category || !subCategory || !price || !image) {
    return res.status(400).json({ error: 'Missing required menu fields.' });
  }

  const doc = {
    name,
    description,
    category,
    subCategory,
    price: Number(price),
    image,
    available: typeof available === 'boolean' ? available : true,
    isVegetarian: Boolean(isVegetarian),
    caffeineLevel: caffeineLevel || 'high',
    createdAt: new Date().toISOString(),
  };

  const result = await menuCollection.insertOne(doc);

  res.status(201).json({
    id: result.insertedId.toString(),
    ...doc,
  });
});

app.put('/api/menu/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const updateFields: Record<string, unknown> = {};
  const { name, description, category, subCategory, price, image, available, isVegetarian, caffeineLevel } = req.body;

  if (name !== undefined) updateFields.name = name;
  if (description !== undefined) updateFields.description = description;
  if (category !== undefined) updateFields.category = category;
  if (subCategory !== undefined) updateFields.subCategory = subCategory;
  if (price !== undefined) updateFields.price = Number(price);
  if (image !== undefined) updateFields.image = image;
  if (available !== undefined) updateFields.available = Boolean(available);
  if (isVegetarian !== undefined) updateFields.isVegetarian = Boolean(isVegetarian);
  if (caffeineLevel !== undefined) updateFields.caffeineLevel = caffeineLevel;
  updateFields.updatedAt = new Date().toISOString();

  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
  const result = await menuCollection.findOneAndUpdate(filter, { $set: updateFields }, { returnDocument: 'after' });

  if (!result || !result.value) {
    return res.status(404).json({ error: 'Menu item not found.' });
  }

  const updatedItem = {
    ...result.value,
    id: result.value._id.toString(),
  };
  res.json(updatedItem);
});

app.delete('/api/menu/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
  const result = await menuCollection.deleteOne(filter);

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'Menu item not found.' });
  }

  res.json({ success: true });
});

// Admin login authentication
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.error('Admin credentials not configured in environment variables.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  // Verify credentials
  if (username.trim() === adminUsername && password === adminPassword) {
    // Generate JWT token
    const token = jwt.sign(
      { username: adminUsername, role: 'admin' },
      jwtSecret!,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
    });
  } else {
    res.status(401).json({ error: 'Invalid username or password.' });
  }
});

// Verify token endpoint
app.post('/api/admin/verify-token', verifyAdminToken, (req, res) => {
  res.json({ success: true, message: 'Token is valid.' });
});

// Admin logout endpoint (client-side token removal, but this confirms logout)
app.post('/api/admin/logout', verifyAdminToken, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});
import path from 'path';

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, 'dist')));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}
app.listen(port, () => {
  console.log(`MongoDB backend listening on http://localhost:${port}`);
});
