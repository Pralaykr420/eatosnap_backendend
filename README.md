# 🖥️ EATOSNAP Backend

Node.js/Express backend API for EATOSNAP - All-in-One Food Ordering Platform

## 🚀 Tech Stack

- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- Socket.io
- Bcrypt
- Winston (Logging)

## 📦 Installation

```bash
npm install
```

## 🔧 Environment Variables

Create `.env` file:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLIENT_URL=your_frontend_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🏃 Run Development

```bash
npm run dev
```

## 🏗️ Run Production

```bash
npm start
```

## 🚀 Deploy to Render

1. Connect this GitHub repo
2. Add environment variables
3. Deploy

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Restaurants
- `GET /api/restaurants` - List all
- `GET /api/restaurants/:id` - Get one
- `POST /api/restaurants` - Create (seller)
- `PUT /api/restaurants/:id` - Update (seller)
- `DELETE /api/restaurants/:id` - Delete (seller)

### Products
- `GET /api/products` - List all
- `POST /api/products` - Create (seller)
- `PUT /api/products/:id` - Update (seller)
- `DELETE /api/products/:id` - Delete (seller)

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update status
- `PUT /api/orders/:id/review` - Add review

### Reels
- `GET /api/reels` - List all
- `POST /api/reels` - Create (seller)
- `POST /api/reels/:id/like` - Like
- `POST /api/reels/:id/comment` - Comment

## 🔐 Security

- JWT Authentication
- Bcrypt Password Hashing
- Rate Limiting
- CORS Protection
- Input Validation
- MongoDB Sanitization

## 📊 Database Models

- User
- Restaurant
- Product
- Order
- Reel
- Chat

---

**Made with ❤️ for food lovers**
