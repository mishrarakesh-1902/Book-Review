# 📚 Book Review Platform

A full-stack **Book Review Web Application** built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.  
It allows users to browse, add, edit, delete, and review books with authentication and image uploads.

---

## 🚀 Live Demo
https://book-review-1-rf3j.onrender.com

---

## 🖼️ Screenshots

### 🏠 Home Page  

<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/5758c97d-fafd-4687-b171-6adc6a7a3e39" />


### 📖 Book Details  
<img width="1919" height="968" alt="image" src="https://github.com/user-attachments/assets/7fa9481b-ff6d-43d6-80f7-8ace5097ee33" />


### ➕ Add Book  
<img width="1919" height="969" alt="image" src="https://github.com/user-attachments/assets/79a73ef5-ff1d-4eef-b483-45a2fe342569" />


---

## ✨ Features

✅ User authentication (JWT based Login & Register)  
✅ Add, edit, and delete books (with image upload via Multer)  
✅ Add reviews and star ratings for each book  
✅ Paginated and searchable book listing  
✅ Secure routes — only the creator can edit or delete their books  
✅ Responsive and modern UI  
✅ Average rating calculated dynamically  

---

## 🛠️ Tech Stack

| Layer | Technology |
|:------|:------------|
| **Frontend** | React.js, Axios, Bootstrap |
| **Backend** | Node.js, Express.js, Multer |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT (JSON Web Token) |
| **Image Storage** | Local `uploads/` folder |
| **Other Tools** | bcryptjs, dotenv, nodemon |

---

## 📂 Folder Structure

book-review-platform/
│
├── backend/
│ ├── models/
│ │ ├── Book.js
│ │ ├── Review.js
│ │ └── User.js
│ ├── routes/
│ │ ├── auth.js
│ │ ├── books.js
│ │ └── reviews.js
│ ├── middleware/
│ │ └── auth.js
│ ├── uploads/ # Book images stored here
│ ├── server.js
│ └── config/
│ └── db.js
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ │ ├── BookDetails.js
│ │ │ ├── BookForm.js
│ │ │ └── Home.js
│ │ ├── utils/
│ │ ├── App.js
│ │ └── index.js
│ └── package.json
│
└── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/book-review-platform.git
cd book-review-platform
cd backend
npm install


MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

npm run dev

cd ../frontend
npm install
npm start

🧑‍💻 Author

Rakesh Mishra
📧 mishrarakeshkumar766@gmail.com
