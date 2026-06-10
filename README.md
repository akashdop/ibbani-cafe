<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d5300ad5-fe08-4f31-8a0e-cd0b0912c7af

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Add your MongoDB connection string to `.env.local` as `MONGODB_URI`
4. If `mongodb+srv` fails because your machine cannot resolve SRV DNS, add `MONGODB_FALLBACK_URI` with the non-SRV Atlas URI.
5. Add your EmailJS values to `.env.local`:
   `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY`
6. Add admin authentication credentials to `.env.local`:
   `ADMIN_USERNAME` and `ADMIN_PASSWORD`
7. Run the backend server in a second terminal:
   `npm run server`
8. Run the app:
   `npm run dev`
