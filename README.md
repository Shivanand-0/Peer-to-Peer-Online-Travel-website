# 🧳 Peer-to-Peer Online Travel Website

An end-to-end web application that allows users to list and book travel accommodations, built with a Node.js backend and modern web technologies. This project simulates a real-world peer-to-peer travel platform similar to Airbnb.

---

## 🌐 Live Demo
> https://peer-to-peer-online-travel-website.onrender.com

---

## 🛠️ Tech Stack

| Layer      | Technology                                                                 |
|------------|-----------------------------------------------------------------------------|
| Frontend   | HTML, CSS, JavaScript, EJS Templates                                        |
| Backend    | Node.js, Express.js                                                         |
| Database   | MongoDB Atlas                                                               |
| Auth       | Passport.js (Local Strategy), Sessions with `connect-mongo`                |
| Maps       | Mappls Map Integration                                                      |
| Geocoding  | Nominatim OpenStreetMap API                                                 |
| Image Hosting | Cloudinary                                                              |
| UI Tools   | Bootstrap (assumed)                                                         |
| Deployment | _Render                                    |
| Version Control | Git & GitHub                                                           |

---

## 📁 Project Structure

Peer-to-Peer-Online-Travel-website/
│
├── public/               → Static assets (CSS, JS)
├── views/                → EJS templates for dynamic HTML rendering
├── routes/               → Express route handlers
├── controllers/          → Logic for route handling
├── init/                 → Sample initialisation
├── models/               → Mongoose schemas for MongoDB
├── middleware.js           → Custom middleware for authentication etc.
├── utils/                → Helper functions (e.g., ExpressError, wrapAsync)
├── cloudConfig.js        → Cloudinary config
├── app.js                → Main server file
├── Schema.js             → Validate Schema
├── package.json          → Dependencies and scripts
└── .env.example          → Example environment variables



---

## 🔐 Features

- ✅ User authentication (Signup, Login, Logout)
- ✅ User authorization 
- ✅ Session management with MongoDB session store
- ✅ Add / Edit / Delete travel listings
- ✅ Search listings with integrated Mappls Map and Nominatim Geocoding
- ✅ Cloud image uploads using Cloudinary
- ✅ Flash messages and validation
- ✅ Modular MVC-style structure
- ✅ RESTful routing

---

## 🌍 Map & Location Integration

- **Map Display**: Powered by [Mappls Maps](https://www.mappls.com/)
- **Geocoding**: Using **Nominatim API** to convert address ↔ coordinates

---

## ☁️ Image Uploads

- Uploads are handled via **Multer** and stored in **Cloudinary**.
- Image URLs are saved to MongoDB for rendering.

---

## 🔧 How to Run Locally

1. **Clone the repo**  
   
   git clone https://github.com/Shivanand-0/Peer-to-Peer-Online-Travel-website.git
   cd Peer-to-Peer-Online-Travel-website

2. **Install dependencies**

   npm install

3. **Create a `.env` file**
   convert '.env.example' named file to '.env' and fill in the following:

   DB_URL=your_mongodb_atlas_url
   MAPPLS_API_KEY=your_mappls_api_key
   NOMINATIM_URL=https://nominatim.openstreetmap.org
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   SESSION_SECRET=your_random_session_secret

4. **Run the app**

   node app.js

   Then visit `http://localhost:3000`

---

## 🧪 Future Improvements

* Add role-based access control (Admin panel)
* Booking and payment system
* Pagination & filtering
* Test coverage with Jest or Mocha
* Responsive design enhancements

---

## 👤 Author

* **Name**: Shivanand
* **GitHub**: [Shivanand-0](https://github.com/Shivanand-0)
* **LinkedIn**: [Shivanand Gupta](https://www.linkedin.com/in/ishivanandgupta/)

---
