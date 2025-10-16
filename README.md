# Transparatech - Full-Stack Web Application

## Project Overview

Transparatech is a full-stack web application designed to promote organizational accountability through transparent budget access. The application features a React-based frontend with a modern responsive design and a Node.js/Express backend with PostgreSQL database integration.

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

## Features

- **Full-Stack Architecture** - React frontend with Node.js/Express backend
- **Role-Based Access Control** - Four distinct user roles with specific permissions
- **Modern Tech Stack** - ES modules, latest React, Express, and PostgreSQL
- **Clean, Professional UI** - Modern blue-themed design with smooth animations
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **RESTful API** - Well-structured backend API with proper routing
- **Database Integration** - PostgreSQL with proper environment configuration

### User Roles

1. **Viewer (Student/Faculty)** - Basic access to transparency information
2. **Officer** - Can upload files and manage content
3. **Auditor** - Can approve files and review submissions
4. **Admin** - Monitor and supervise all portal activities

### Development Tools
- **Nodemon 3.1.0** - Development server with auto-restart
- **Create React App** - Frontend development environment

## Project Structure

```
transparatech/
├── client/                         # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page with navigation
│   │   │   ├── Login/
│   │   │   │   ├── Login.jsx      # Role-based login component
│   │   │   │   └── Login.css      # Login-specific styling
│   │   │   ├── Signup/
│   │   │   │   ├── Signup.jsx     # Role-based registration
│   │   │   │   └── Signup.css     # Signup-specific styling
│   │   │   └── StudentPortal/
│   │   │       ├── StudentPortal.jsx # Main portal with 4 role buttons
│   │   │       └── StudentPortal.css # Portal-specific styling
│   │   ├── App.js                 # Main app with routing configuration
│   │   ├── index.js               # Application entry point
│   │   └── index.css              # Global styles and Tailwind imports
│   ├── package.json               # Frontend dependencies
│   └── README.md                  # Project documentation
└── server/                        # Node.js Backend
    ├── src/
    │   ├── api/                   # API routes
    │   ├── config/                # Database and app configuration
    │   ├── controllers/           # Request handlers
    │   ├── middleware/            # Custom middleware
    │   ├── models/                # Database models
    │   └── server.js              # Main server file
    ├── .env                       # Environment variables
    └── package.json               # Backend dependencies
```

## Design System

### Color Scheme
- **Primary Blue:** `#1565c0` - Headings and primary text
- **Accent Blue:** `#2196f3` - Buttons and interactive elements
- **Hover Blue:** `#1976d2` - Button hover states
- **Light Blue:** `#e3f2fd` - Backgrounds and borders
- **Background Gradient:** `linear-gradient(135deg, #e3f2fd 0%, #f5f9ff 100%)`

### CSS Architecture
- **BEM Methodology** - Block, Element, Modifier naming convention
- **Component Isolation** - Each component has its own CSS file
- **Responsive Design** - Mobile-first approach with proper breakpoints
- **Semantic HTML** - Proper use of header, main, form, and other semantic elements

## Installation and Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)
- PostgreSQL (for database)

### Getting Started
>>>>>>> 53c6e7c22a9c16f85c777dca96e01360a4b536d8

1. **Clone the repository:**
```bash
git clone https://github.com/AquinoLuisMartin/dummy-transparatech.git
cd full-stack-transparatech
```

2. **Backend Setup:**
```bash
cd server
npm install
<<<<<<< HEAD
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

**Built with by the Hexadevs Team**
=======
```

3. **Configure Environment Variables:**
Edit `server/.env` file with your database credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=transparatech_db
DB_USER=your_username
DB_PASSWORD=your_password

# Server Configuration
PORT=5000
NODE_ENV=development
```

4. **Start the Backend Server:**
```bash
npm run dev
```
The server will run on `http://localhost:5000`

5. **Frontend Setup (in a new terminal):**
```bash
cd client
npm install
```

6. **Start the Frontend Development Server:**
```bash
npm start
```
The frontend will run on `http://localhost:3000`

### Development Workflow
- Backend API: `http://localhost:5000`
- Frontend App: `http://localhost:3000`
- Both servers support hot reloading for development

## Usage Guide

### Navigation Flow
1. **Home Page** (`/`) - Landing page with project information
2. **Student Portal** (`/student-portal`) - Main portal with 4 role selection buttons
3. **Login** (`/login?role=<role>`) - Role-specific login forms
4. **Signup** (`/signup?role=<role>`) - Role-specific registration forms

### Role Selection
- Click "Get Started" on the home page
- Choose your role from the 4 available options
- Complete the login or signup process

## Development Guidelines

### Code Standards
- **Clean Code** - Follow semantic HTML and meaningful naming conventions
- **Component Structure** - Each component in its own folder with accompanying CSS
- **CSS Organization** - Use BEM methodology for class naming
- **Responsive Design** - Ensure all components work on mobile and desktop

### File Naming Conventions
- **Components:** PascalCase (e.g., `StudentPortal.jsx`)
- **CSS Files:** Match component name (e.g., `StudentPortal.css`)
- **CSS Classes:** BEM methodology (e.g., `.portal__container`, `.role-button__title`)

### Styling Guidelines
- **Separate Concerns** - Keep styling separate from JavaScript logic
- **Consistent Spacing** - Use consistent padding and margin values
- **Blue Theme** - Maintain the established blue color scheme
- **Smooth Transitions** - Use CSS transitions for interactive elements

## Available Scripts

### Frontend (client/)
- **`npm start`** - Runs React app in development mode on `http://localhost:3000`
- **`npm test`** - Launches the test runner in interactive watch mode
- **`npm run build`** - Builds the app for production to the `build` folder
- **`npm run eject`** - Ejects from Create React App (one-way operation)

### Backend (server/)
- **`npm run dev`** - Runs server with nodemon for development on `http://localhost:5000`
- **`npm start`** - Runs server in production mode (after building)

## API Documentation

### Base URL
Development: `http://localhost:5000`

### Available Endpoints
- **GET `/`** - Server status check
- **GET `/health`** - Health check endpoint

*Additional API endpoints will be documented as they are implemented.*

## Database Setup

### PostgreSQL Configuration
1. Install PostgreSQL on your system
2. Create a new database: `transparatech_db`
3. Update the `.env` file with your database credentials
4. Database schema and migrations will be added as the project develops

### Environment Variables
Required environment variables in `server/.env`:
```env
DB_HOST=localhost          # Database host
DB_PORT=5432              # Database port
DB_NAME=transparatech_db  # Database name
DB_USER=your_username     # Database username
DB_PASSWORD=your_password # Database password
PORT=5000                 # Server port
NODE_ENV=development      # Environment mode
```

## Component Documentation

### StudentPortal Component
**Purpose:** Main portal interface with 4 role selection buttons\
**Props:** None\
**Styling:** `StudentPortal.css` with blue theme and responsive grid layout

### Login Component
**Purpose:** Role-aware login form with dynamic titles\
**Props:** Reads `role` from URL search parameters\
**Features:** Form validation, role-specific navigation

### Signup Component
**Purpose:** Role-aware registration form\
**Props:** Reads `role` from URL search parameters\
**Features:** Password confirmation, terms acceptance

### Home Component
**Purpose:** Landing page with project information\
**Styling:** Uses Tailwind CSS with custom animations

## Deployment

### Frontend Deployment
```bash
cd client
npm run build
```

### Backend Deployment
```bash
cd server
# Set NODE_ENV=production in .env
npm start
```

### Deployment Options
- **Frontend:** Netlify, Vercel, GitHub Pages, AWS S3 + CloudFront
- **Backend:** Heroku, DigitalOcean, AWS EC2, Railway
- **Database:** PostgreSQL on cloud providers (AWS RDS, Google Cloud SQL, etc.)

## Development Guidelines

### Full-Stack Development
- **API First** - Design and document API endpoints before frontend implementation
- **Environment Separation** - Use proper environment configurations for development/production
- **Error Handling** - Implement proper error handling on both client and server
- **Security** - Follow security best practices for authentication and data validation

### Frontend Guidelines
- **Component Structure** - Each component in its own folder with accompanying CSS
- **State Management** - Use React hooks for state management
- **API Integration** - Use fetch or axios for backend communication
- **Responsive Design** - Ensure all components work on mobile and desktop

### Backend Guidelines
- **RESTful Design** - Follow REST principles for API design
- **Validation** - Use Joi for input validation
- **Middleware** - Implement proper middleware for authentication, logging, etc.
- **Database** - Use proper SQL practices and connection pooling

## Troubleshooting

### Common Issues

**Q: Backend server won't start**\
A: Check if PostgreSQL is running and .env variables are correctly set

**Q: Frontend can't connect to backend**\
A: Ensure CORS is properly configured and both servers are running

**Q: Database connection errors**\
A: Verify PostgreSQL is installed, running, and credentials in .env are correct

**Q: Module import errors**\
A: Ensure package.json has "type": "module" for ES modules in backend

## Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Contributing

### Development Process
1. Fork the repository
2. Create feature branch: `git checkout -b feature/feature-name`
3. Follow coding standards and component structure
4. Test across different screen sizes
5. Commit changes: `git commit -m 'Add feature description'`
6. Push to branch: `git push origin feature/feature-name`
7. Create Pull Request

### Code Review Checklist
- [ ] Components follow BEM CSS methodology
- [ ] Responsive design works on mobile and desktop
- [ ] Blue color scheme is maintained
- [ ] Semantic HTML is used
- [ ] CSS is properly organized in separate files
- [ ] No console errors or warnings

## Troubleshooting

### Common Issues

**Q: Tailwind classes not working**\
A: Tailwind is only used in the Home component. Other components use custom CSS files.

**Q: Role parameter not detected in Login/Signup**\
A: Ensure you're navigating with the correct URL format: `/login?role=viewer`

**Q: CSS changes not reflecting**\
A: Hard refresh the browser (Ctrl+F5) or clear browser cache.

**Q: Build errors related to Tailwind**\
A: The @tailwind directives in index.css are normal and won't affect the build.

## Future Enhancements

### Phase 1 - Core Backend Features
- **Authentication System** - JWT-based user authentication
- **User Management** - Registration, login, and role-based permissions
- **Database Schema** - Complete database design with proper relationships
- **API Routes** - CRUD operations for all entities

### Phase 2 - Advanced Features
- **File Upload Functionality** - Document management for Officers
- **Approval Workflow** - Review system for Auditors
- **Dashboard Analytics** - Reporting features for Admins
- **Email Notifications** - System alerts and updates

### Phase 3 - Enhanced UX
- **Real-time Updates** - WebSocket integration for live updates
- **Advanced Search** - Full-text search capabilities
- **Data Visualization** - Charts and graphs for transparency data
- **Mobile App** - React Native mobile application

### Phase 4 - Enterprise Features
- **Audit Logging** - Complete audit trail for all actions
- **Backup & Recovery** - Automated data backup systems
- **Multi-tenant Support** - Support for multiple organizations
- **Advanced Security** - Two-factor authentication, encryption

## License

This project is developed for the PUPSMB Transparency Initiative.

## Contact & Support

**Development Team:** Hexadevs\
**Repository:** [dummy-transparatech](https://github.com/AquinoLuisMartin/dummy-transparatech)\
**Issues:** Report bugs and feature requests through GitHub Issues

---

*Promoting organizational accountability through transparent budget access within the PUPSMB campus community.*
>>>>>>> 53c6e7c22a9c16f85c777dca96e01360a4b536d8
