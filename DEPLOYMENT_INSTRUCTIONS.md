# Deployment Instructions for Backend and Frontend

## Backend (Node.js Express + PostgreSQL)

### 1. Environment Variables
- Create a `.env` file in your backend project root.
- Use the `.env.example` file as a template.
- Set the `DATABASE_URL` to your PostgreSQL connection string.
- Optionally set `PORT` if you want to use a custom port.

Example `.env`:
```
DATABASE_URL=postgresql://username:password@hostname:port/database_name
PORT=5000
```

### 2. Deployment Platforms
You can deploy your backend on platforms that support Node.js backend servers:

- **Vercel**: Use serverless functions or a full Node.js backend deployment.
- **Heroku**: Easy deployment with Git and environment variable support.
- **Render**: Similar to Heroku, supports Node.js backend.

### 3. Deploying on Vercel
- Configure your project to use API routes or serverless functions.
- Set environment variables in Vercel dashboard.
- Adjust `vercel.json` to route API requests to your backend functions.

### 4. Deploying on Heroku or Render
- Push your code to the platform's Git remote.
- Set environment variables via dashboard or CLI.
- The platform will run `npm start` by default (runs `server.js`).

---

## Frontend (Static SPA)

### 1. Files to Deploy
- `index.html`
- `styles.css`
- `script.js`
- Any other static assets (images, etc.)

### 2. Deploying on Netlify
- Create a new site on Netlify.
- Connect your Git repository or drag and drop your frontend build folder.
- Netlify will serve your static files.
- No backend server is needed on Netlify for static frontend.

---

## Summary
- Backend and frontend are deployed separately.
- Backend requires environment variables for database connection.
- Frontend is deployed as static files on Netlify.
- Adjust your frontend API calls to point to the backend deployment URL.

If you want, I can help you create example deployment configs for Vercel backend or Netlify frontend.
