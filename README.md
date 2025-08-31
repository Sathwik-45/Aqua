# 💧 PureDrop – Smart Water Delivery & Shop Locator App

**PureDrop** is a MERN stack-based web application that allows users to locate nearby water delivery shops, place orders, and track deliveries. It also helps shop owners manage orders efficiently. Designed for accessibility and real-time interaction, PureDrop brings simplicity to essential water logistics.

---

## 🌟 Key Features

### 🔍 For Users:
- 📍 **Locate Nearby Water Shops** within a 10km radius using geolocation
- 🛒 **Place Orders** for water can deliveries
- 📦 **Track Order Status** in real-time
- 📊 **Order History** and Profile Management

### 🛠️ For Shop Owners:
- ✅ **Accept / Reject Orders**
- 🧾 **View Order History**
- 📍 **Update Shop Info & Delivery Range**
- 🚚 **Real-time Status Updates**

---

## 🛠 Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Express.js, Node.js
- **Database:** MongoDB
- **Authentication:** JWT-based Auth System
- **Maps & Location:** Leaflet.js with OpenStreetMap API
- **Deployment:** Render / Vercel

---

## ⚙️ Setup Instructions

```bash
# Clone the repo
git clone https://github.com/Sathwik-45/Aqua.git

# Navigate to project directory
cd Aqua

# Install frontend dependencies
cd client
npm install

# Start frontend
npm start

# Install backend dependencies
cd ../server
npm install

# Add your .env variables (Mongo URI, JWT secret, etc.)

# Start backend
npm run dev
