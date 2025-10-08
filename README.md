# PUPSMB Transparency Portal

## Project Overview

The PUPSMB Transparency Portal is a role-based web application designed to promote organizational accountability through transparent budget access within the PUPSMB (Polytechnic University of the Philippines Santa Maria Bulacan) campus community. The portal provides different access levels for various user roles including Viewers, Officers, Auditors, and Administrators.

## Features

- **Role-Based Access Control** - Four distinct user roles with specific permissions
- **Clean, Professional UI** - Modern blue-themed design with smooth animations
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Semantic HTML Structure** - Clean, maintainable code following best practices
- **Modular CSS Architecture** - Separate CSS files for better maintainability
- **Inter Font Integration** - Professional typography using Google Fonts

### User Roles

1. **Viewer (Student/Faculty)** - Basic access to transparency information
2. **Officer** - Can upload files and manage content
3. **Auditor** - Can approve files and review submissions
4. **Admin** - Monitor and supervise all portal activities

## Technology Stack

- **React 19.2.0** - Modern JavaScript framework with latest features
- **React Router DOM 7.9.3** - Client-side routing for SPA navigation
- **Tailwind CSS 3.4.0** - Utility-first CSS framework (for Home component)
- **Custom CSS** - Component-specific styling with BEM methodology
- **Inter Font** - Professional typography from Google Fonts
- **Create React App** - Development environment and build tools

## Project Structure

```
src/
├── pages/
│   ├── Home.jsx                    # Landing page with navigation
│   ├── Login/
│   │   ├── Login.jsx              # Role-based login component
│   │   └── Login.css              # Login-specific styling
│   ├── Signup/
│   │   ├── Signup.jsx             # Role-based registration
│   │   └── Signup.css             # Signup-specific styling
│   └── StudentPortal/
│       ├── StudentPortal.jsx      # Main portal with 4 role buttons
│       └── StudentPortal.css      # Portal-specific styling
├── App.js                         # Main app with routing configuration
├── index.js                       # Application entry point
└── index.css                      # Global styles and Tailwind imports
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

### Getting Started

1. **Clone the repository:**
```bash
git clone https://github.com/AquinoLuisMartin/dummy-transparatech.git
cd dummy-transparatech
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

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

In the project directory, you can run:

### `npm start`
Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.\
The page will reload when you make changes.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.\
Optimizes the build for the best performance with minified files.

### `npm run eject`
**Note: This is a one-way operation. Once you eject, you can't go back!**

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

### Build for Production
```bash
npm run build
```

### Deployment Options
- **Netlify** - Connect Git repository for automatic deployments
- **Vercel** - Optimized for React applications with zero configuration
- **GitHub Pages** - Free hosting for public repositories
- **AWS S3 + CloudFront** - Scalable cloud hosting solution

### Environment Configuration
No environment variables required for basic functionality.

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

- **Authentication System** - Backend integration for user management
- **File Upload Functionality** - Document management for Officers
- **Approval Workflow** - Review system for Auditors
- **Dashboard Analytics** - Reporting features for Admins
- **Email Notifications** - System alerts and updates
- **Dark Mode** - Theme switching capability

## License

This project is developed for the PUPSMB Transparency Initiative.

## Contact & Support

**Development Team:** Hexadevs\
**Repository:** [dummy-transparatech](https://github.com/AquinoLuisMartin/dummy-transparatech)\
**Issues:** Report bugs and feature requests through GitHub Issues

---

*Promoting organizational accountability through transparent budget access within the PUPSMB campus community.*
