# Transparatech - Full-Stack Web Application

A modern transparency portal built with React and Node.js to promote organizational accountability through transparent budget access.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- npm

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/AquinoLuisMartin/dummy-transparatech.git
cd full-stack-transparatech
```

2. **Backend Setup:**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

3. **Frontend Setup (new terminal):**
```bash
cd client
npm install
npm start
```

4. **Access the application:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📁 Project Structure

```
transparatech/
├── client/          # React Frontend
│   ├── src/
│   │   ├── pages/   # Application pages
│   │   └── ...
│   └── package.json
├── server/          # Node.js Backend  
│   ├── src/         # Server source code
│   │   ├── api/     # API routes
│   │   ├── config/  # Configuration
│   │   └── ...
│   ├── .env.example # Environment template
│   └── package.json
└── README.md
```

## 🛠️ Technology Stack

**Frontend:**
- React 19.2.0
- React Router DOM 7.9.3
- Tailwind CSS 3.4.0

**Backend:**
- Node.js with ES Modules
- Express 4.19.2
- PostgreSQL 8.11.5
- Joi (validation)

## 🔒 Security Features

- Environment variables properly managed
- CORS configured
- Input validation with Joi
- Secure file structure

## 📚 Documentation

Detailed documentation is available in the `/client/README.md` file.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is part of the Transparatech initiative.

---

**Built with ❤️ by the Hexadevs Team**