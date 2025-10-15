import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Import logo images for navigation and organization sections
import navLogo from '../images/navlogo.png';      
import SCLogo from '../images/SC.png';            
import JPIALogo from '../images/JPIA.png';        
import iSITELogo from '../images/iSITE.png';      
import HMSOCLogo from '../images/HMSOC.png';      
import CEMLogo from '../images/CEM.png';          
import AFTLogo from '../images/AFT.png';          
import ACESLogo from '../images/ACES.png';        
/**
 * Home Component - Main landing page for PUPSMB TransparaTech portal
 * 
 * Features:
 * - Dynamic navbar with scroll effects and background blur
 * - Parallax hero section with call-to-action buttons
 * - Animated sections that appear on scroll
 * - Organization logos showcase
 * - Features grid with staggered animations
 * - Responsive footer with navigation links
 */
const Home = () => {
  // State for tracking scroll position to trigger navbar background changes
  const [scrollY, setScrollY] = useState(0);
  
  // State for tracking which sections are visible for scroll animations
  const [isVisible, setIsVisible] = useState({});

  /**
   * Effect hook to handle scroll events and animations
   * - Updates scrollY state for parallax effects
   * - Tracks which sections are in viewport for scroll animations
   * - Adds/removes scroll event listener
   */
  useEffect(() => {
    const handleScroll = () => {
      // Update scroll position for navbar and parallax effects
      setScrollY(window.scrollY);
      
      // Check which animated sections are currently visible
      const sections = document.querySelectorAll('[data-animate]');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        // Consider section visible when it's 80% into the viewport
        const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        setIsVisible(prev => ({
          ...prev,
          [index]: isInView
        }));
      });
    };

    // Add scroll listener and trigger initial check
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    // Cleanup listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Smooth scroll function to navigate to specific sections
   * @param {string} sectionId - The ID of the target section
   */
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Fixed Navigation Header - Changes background on scroll */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-blue-900/95 backdrop-blur-md shadow-lg' : 'bg-blue-900'
      } text-white`}>
        <div className="header-container">
          <div className="header-content">
            {/* Logo and Brand Section */}
            <div className="logo-container">
              <div className="flex items-center mr-3">
                <img src={navLogo} alt="PUPSMB Logo" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold">PUPSMB TransparaTech</h1>
                <p className="text-blue-200 text-sm">Official Management System of PUPSMB</p>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <nav className="nav-menu">
              <button onClick={() => scrollToSection('home')} className="nav-link">Home</button>
              <button onClick={() => scrollToSection('about')} className="nav-link">About</button>
              <button onClick={() => scrollToSection('features')} className="nav-link">Features</button>
              <Link to="/student-portal" className="nav-link">Get Started</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Full-screen landing area with parallax effect */}
      <section id="home" className="hero-section">
        {/* Parallax Background Overlay */}
        <div 
          className="hero-overlay"
          style={{
            transform: `translateY(${scrollY * 0.5}px)` // Parallax effect
          }}
        />
        
        {/* Hero Content Container */}
        <div className="hero-content">
          <div className="transform transition-all duration-1000 ease-out">
            <h1 className="hero-title">
              <strong>Making Technology</strong><br />
              <span className="text-yellow-300 inline-block"><strong>Transparent & Accessible</strong></span>
            </h1>
            <p className="hero-description">
               TransparaTech provides innovative technology solutions with <em>transparency at the core</em> of everything we do. Builidng a better future through <em>accessible tech.</em>
            </p>
            {/* Call-to-Action Buttons */}
            <div className="hero-buttons">
              <Link to="/student-portal" className="primary-button">
                Log In
              </Link>
              <Link to="/student-portal" className="secondary-button">
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="scroll-indicator">
          <button 
            onClick={() => scrollToSection('about')}
            className="text-white/70 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </button>
        </div>
      </section>

      {/* About Section - Mission and vision content with scroll animation */}
      <section 
        id="about" 
        data-animate
        className={`section-animated ${
          isVisible[0] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="section-content">
          <div className="section-header">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Transparatech</h2>
            <p className="text-gray-600 text-lg">The PUP Sta. Maria Campus Transparency Portal is a digital platform dedicated to <b>promoting openness, accountability, and responsible governance</b> within the university community. It serves as a central hub for managing, submitting, and reviewing organizational and financial reports with clarity and integrity.<br />
              Our mission is to <em>strengthen trust between students, organizations, and administrators</em> by ensuring that all processes are transparent, ethical, and efficiently documented. Through this initiative, we aim to foster a culture of <b>honesty, collaboration, and good governance</b> that reflects the true spirit of the Polytechnic University of the Philippines.<br />
              More than a system for compliance, the PUPSMB Transparency Portal is a commitment — <em>a step toward building a transparent, accountable, and progressive student community.</em></p>
          </div>
          
        </div>
      </section>

      
      {/* Student Organizations Logos Section - Showcases partner organizations */}
      <section 
        data-animate
        className={`py-12 bg-white ${
          isVisible[1] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="section-content">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Organizations</h2>
            <p className="text-gray-600">Supporting campus community through various student organizations</p>
          </div>
          {/* Organization Logos Grid - Each logo has hover animation */}
          <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
            {/* Student Council Logo */}
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-md transition-transform duration-300 hover:scale-110">
              <img src={SCLogo} alt="Student Council" className="w-full h-full object-cover" />
            </div>
            {/* Civil Engineering Management Logo */}
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-md transition-transform duration-300 hover:scale-110">
              <img src={CEMLogo} alt="CEM" className="w-full h-full object-cover" />
            </div>
            {/* iSITE Organization Logo */}
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-md transition-transform duration-300 hover:scale-110">
              <img src={iSITELogo} alt="iSITE" className="w-full h-full object-cover" />
            </div>
            {/* ACES Organization Logo */}
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-md transition-transform duration-300 hover:scale-110">
              <img src={ACESLogo} alt="ACES" className="w-full h-full object-cover" />
            </div>
            {/* AFT Organization Logo */}
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-md transition-transform duration-300 hover:scale-110">
              <img src={AFTLogo} alt="AFT" className="w-full h-full object-cover" />
            </div>
            {/* HMSOC Organization Logo */}
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-md transition-transform duration-300 hover:scale-110">
              <img src={HMSOCLogo} alt="HMSOC" className="w-full h-full object-cover" />
            </div>
            {/* JPIA Organization Logo */}
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-md transition-transform duration-300 hover:scale-110">
              <img src={JPIALogo} alt="JPIA" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Spacer Section - Provides visual separation */}
      <section 
        data-animate
        className={`section-animated-gray ${
          isVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}>
      </section>

      {/* Features Section - Highlights key platform capabilities */}
      <section 
        id="features"
        data-animate
        className={`section-animated ${
          isVisible[3] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}>
        <div className="section-content">
          <div className="section-header">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Key Features</h2>
            <p className="text-gray-600 text-lg">Experience Transparency and Efficiency with Transparatech</p>
          </div>
          {/* Features Grid - Three main feature cards with staggered animations */}
          <div className="features-grid">
            {/* Feature 1: Transparency Dashboard */}
            <div className={`feature-card ${isVisible[3] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="feature-icon bg-blue-100">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparency Dashboard</h3>
              <p className="text-gray-600"><strong>Empowering organization with real-time visibility and control</strong></p>
              <p className="text-gray-600">Gain instant access to performance data and operational metrics through an intuitive dashboard. Our system visualizes workflows, tracks efficiency, and highlights areas for improvement- enabling faster, smarter, and more transparent decision-making.</p>
            </div>
            {/* Feature 2: Automation Solutions (200ms delay) */}
            <div className={`feature-card ${isVisible[3] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
              <div className="feature-icon bg-green-100">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Automation Solutions</h3>
              <p className="text-gray-600"><strong>Reducing manual work, increasing productivity</strong></p>
            </div>
            {/* Feature 3: Data Management Services (400ms delay) */}
            <div className={`feature-card ${isVisible[3] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
              <div className="feature-icon bg-purple-100">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Management Services</h3>
              <p className="text-gray-600"><strong>Transparent, efficient, and accessible from anywhere</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section - Contact information and navigation links */}
      <footer 
        id="contact"
        data-animate
        className={`footer-section ${
          isVisible[4] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="section-content">
          {/* Footer Grid Layout - Four columns with different link categories */}
          <div className="footer-grid">
            {/* Column 1: About Information */}
            <div className="transition-transform duration-300">
              <h3 className="text-lg font-semibold mb-4">About PUPSMB TransparaTech</h3>
              <p className="text-gray-300">
                The official management system for transparency and efficiency.
              </p>
            </div>
            {/* Column 2: Quick Navigation Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => scrollToSection('home')} className="transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection('about')} className="transition-colors">About</button></li>
                <li><button onClick={() => scrollToSection('features')} className="transition-colors">Features</button></li>
              </ul>
            </div>
            {/* Column 3: Resource Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#documentation" className="transition-colors">Documentation</a></li>
                <li><a href="#support" className="transition-colors">Support</a></li>
                <li><a href="#privacy" className="transition-colors">Privacy</a></li>
              </ul>
            </div>
            {/* Column 4: Contact Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#help" className="transition-colors">Help & Support</a></li>
                <li><a href="#feedback" className="transition-colors">Feedback</a></li>
                <li><a href="#contact" className="transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          {/* Copyright Notice */}
          <div className="footer-copyright">
            <p>&copy; Hexadevs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;