# Car Showroom Backend API

Backend service for the Car Showroom application built with Node.js, Express, and MongoDB.

## 🚀 Features

- 🔐 Authentication & Authorization
- 🚗 Car Management
- 💰 Sold Cars Management
- 🏢 Brand Management
- 🖼️ Banner Management
- 📅 Rental Management
- 📤 Image Upload Handling

## 🛠️ Setup

1. **Clone the repository:**
```bash
git clone https://github.com/pyaemoe23212/car-showroom-backend.git
cd car-showroom-backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment Setup:**
```bash
cp .env.example .env
```

4. **Configure Environment:**
   - Update `.env` with your MongoDB URI
   - Set JWT secret key
   - Configure other environment variables

5. **Start Development Server:**
```bash
npm run dev
```

## 📚 API Documentation

### 🔑 Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

### 🚗 Cars
- `GET /api/cars` - Get all cars
- `POST /api/cars` - Create new car
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car

### 💰 Sold Cars
- `GET /api/sold-cars` - Get all sold cars
- `POST /api/sold-cars` - Add new sold car
- `PUT /api/sold-cars/:id` - Update sold car
- `DELETE /api/sold-cars/:id` - Delete sold car

## 📝 License

MIT

## 🔗 Related Repositories
- [Car Showroom Admin Frontend](https://github.com/pyaemoe23212/car-showroom-admin)
- [Car Showroom User Frontend](https://github.com/pyaemoe23212/car-showroom-frontend)