# Boi Station

Boi Station is a book-centered marketplace for students and readers in Bangladesh. It helps people buy, sell, exchange, and eventually donate books, with the goal of making books more affordable and reducing unused book waste.

## Current MVP Features

- User signup and login
- Buy & Sell book posts
- Exchange book posts
- Book details page
- Book posting flow
- Saved books
- User profiles
- Real-time messaging
- Order/request flow
- Admin order management
- Donation page as a coming soon feature

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Socket.io Client

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.io
- Cloudinary

## Project Structure

```txt
BoiStation/
  frontend/
  backend/
  design.md
```

## Environment Variables

Create local environment files from the example files.

### Frontend

Create:

```txt
frontend/.env.local
```

Example:

```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

### Backend

Create:

```txt
backend/.env
```

Example:

```env
NODE_ENV=development
PORT=5001
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend will run at:

```txt
http://localhost:5001
```

Health check:

```txt
http://localhost:5001/api/health
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```txt
http://localhost:5173
```

## Deployment Plan

- Frontend: Cloudflare Pages
- Backend: Render
- Database: MongoDB Atlas
- Image hosting: Cloudinary

Production frontend environment variables:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
```

Production backend environment variables:

```env
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Notes

- Do not commit `.env` files.
- Keep API keys, database credentials, JWT secrets, and Cloudinary secrets private.
- `design.md` contains product, UI, and flow decisions for the project.

## Status

MVP in active development.
