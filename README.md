# 🔎 Findora – Lost & Found Management System

<p align="center">
  <img src="https://img.shields.io/badge/Project-Findora-6366F1?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Stack-MERN-22C55E?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Development-orange?style=for-the-badge" />
</p>

<p align="center">
  <b>Helping people reconnect with their lost belongings.</b>
</p>

## 📌 About the Project

**Findora** is a full-stack Lost & Found Management System designed to make reporting, searching, and recovering lost belongings easier.

The platform provides a centralized place where users can report lost or found items, explore reports, and discover possible matches. It also includes an administrative dashboard to manage users, reports, and matching requests.

Findora aims to simplify the traditional lost-and-found process through a digital platform that makes information more accessible and organized.

## ✨ Key Features

### 👤 User Features
- User registration and login.
- Email OTP verification.
- Report lost or found belongings.
- Add item details, including name, category, color, location, date, time, description, and photo.
- Explore available lost and found reports.
- View personal reports.
- View possible item matches.
- Submit claims for matched items.
- Manage personal reports.

### 🔍 Item Matching Algorithm
Findora includes a custom matching algorithm that compares lost and found reports using:

- Item name similarity.
- Description similarity.
- Category comparison.
- Color similarity.
- Location similarity.
- Date similarity.

The algorithm calculates a matching score and returns potential matches when the score reaches the configured threshold of **70%**.

### 🛡️ Admin Dashboard
- View dashboard statistics.
- Manage student accounts.
- Review lost and found reports.
- Change report status.
- Review possible item matches.
- Resolve or reject matching requests.
- Export administrative data.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| JavaScript | Application logic |
| HTML5 | Web page structure |
| CSS3 | Styling and responsive design |
| Node.js | Backend runtime |
| Express.js | Backend API |
| MongoDB | Database |
| Mongoose | Database modeling |
| Passport.js | Authentication |
| Express Session | Session management |
| Axios | Frontend API requests |
| Vite | Frontend development and build tool |
| Git & GitHub | Version control and collaboration |

## 📂 Project Structure

```text
Findora/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── schema/
│   ├── utils/
│   ├── middlewares.js
│   ├── Alogirthms.js
│   ├── app.js
│   ├── package.json
│   └── .env.example
│
├── Frontend/
│   └── Findora/
│       ├── src/
│       │   ├── Pages/
│       │   ├── components/
│       │   ├── context/
│       │   ├── utils/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── index.html
│       ├── package.json
│       └── .env.example
│
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Findora
```

### 2. Backend Setup

Open a terminal:

```bash
cd Backend
npm install
```

Create a `.env` file inside the Backend folder using `.env.example` as a reference.

```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/findora
SESSION_SECRET=your_secure_random_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password
ADMIN_EMAIL=your_admin_email
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm start
```

The backend will run on:

`http://localhost:5000`

### 3. Frontend Setup

Open another terminal:

```bash
cd Frontend/Findora
npm install
```

Create a `.env` file using `.env.example`.

```env
VITE_API_URL=/api
VITE_API_PROXY_TARGET=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL provided by Vite, usually:

`http://localhost:5173`

## 🔐 Security

- Authentication and protected routes.
- Session-based user authentication.
- Admin-only operations.
- Environment variables for sensitive configuration.
- Server-side validation and error handling.

**Important:** Never upload real `.env` files, database credentials, passwords, or private API keys to GitHub.

## 👥 Our Team

This project is developed collaboratively by a team of three computer science students.

### Vaniza Batool
- Project Lead / Full-Stack Development
- GitHub: [@vanizabatool-cs](https://github.com/vanizabatool-cs)
- LinkedIn: [Vaniza Batool](https://www.linkedin.com/in/vaniza-batool-5157663a3/)

### Bilal Ali
- Frontend Development / UI Integration
- GitHub: https://github.com/alibilaldev
 

### Ishtiaque Ali
- Backend Development
- GitHub: [@IshtiaqueDev](https://github.com/IshtiaqueDev)
- LinkedIn: [Ishtiaque Ali](https://www.linkedin.com/in/ishtiaqueali3/)

## 🚀 Future Improvements

- Improve item matching accuracy.
- Add more advanced search and filtering.
- Enhance user experience and accessibility.
- Expand administrative features.
- Improve application deployment and scalability.

## 📸 Screenshots

Screenshots of the application will be added here.

## 📄 License

No open-source license has been selected yet.

---

<p align="center">
  <b>Findora – Helping Lost Things Find Their Way Back.</b>
</p>

<p align="center">
  Made with ❤️ by the Findora Team
</p>
