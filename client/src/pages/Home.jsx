import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// Navigation and brand assets
import navLogo from '../images/navlogo.png';      
import backgroundImage from '../images/background.png';

// Organization logos
import SCLogo from '../images/SC.png';            
import JPIALogo from '../images/JPIA.png';        
import iSITELogo from '../images/iSITE.png';      
import HMSOCLogo from '../images/HMSOC.png';      
import CEMLogo from '../images/CEM.png';          
import AFTLogo from '../images/AFT.png';          
import ACESLogo from '../images/ACES.png';        
// Organization logos data
const ORGANIZATION_LOGOS = [
  { src: SCLogo, alt: 'Student Council', name: 'Student Council' },
  { src: CEMLogo, alt: 'CEM', name: 'Civil Engineering Management' },
  { src: iSITELogo, alt: 'iSITE', name: 'iSITE Organization' },
  { src: ACESLogo, alt: 'ACES', name: 'ACES Organization' },
  { src: AFTLogo, alt: 'AFT', name: 'AFT Organization' },
  { src: HMSOCLogo, alt: 'HMSOC', name: 'HMSOC Organization' },
  { src: JPIALogo, alt: 'JPIA', name: 'JPIA Organization' },
];

// Features data
const FEATURES_DATA = [
  {
    id: 'transparency-dashboard',
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
    title: 'Transparency Dashboard',
    subtitle: 'Empowering organization with real-time visibility and control',
    description: 'Gain instant access to performance data and operational metrics through an intuitive dashboard. Our system visualizes workflows, tracks efficiency, and highlights areas for improvement- enabling faster, smarter, and more transparent decision-making.',
    bgColor: 'bg-blue-100'
  },
  {
    id: 'automation-solutions',
    icon: (
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      </svg>
    ),
    title: 'Automation Solutions',
    subtitle: 'Reducing manual work, increasing productivity',
    description: '',
    bgColor: 'bg-green-100'
  },
  {
    id: 'data-management',
    icon: (
      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
      </svg>
    ),
    title: 'Data Management Services',
    subtitle: 'Transparent, efficient, and accessible from anywhere',
    description: '',
    bgColor: 'bg-purple-100'
  }
];

/**
 * Home Component - Main landing page for PUPSMB TransparaTech portal
 * 
 * This component serves as the main entry point for the TransparaTech system,
 * providing an overview of the platform's features and capabilities.
 * 
 * @component
 * @author TransparaTech Development Team
 * @version 1.0.0
 * 
 * @features
 * - Dynamic navigation header with scroll-based background changes
 * - Parallax hero section with animated background and call-to-action buttons
 * - Scroll-triggered section animations using Intersection Observer pattern
 * - Student organization logos showcase
 * - Feature cards grid with staggered animations
 * - Comprehensive footer with navigation and contact links
 * 
 * @structure
 * - NavigationHeader: Fixed header with logo, navigation, and scroll effects
 * - HeroSection: Full-screen hero with background image, overlays, and CTAs
 * - AboutSection: Mission and vision content with scroll animations
 * - OrganizationsSection: Showcases partner student organizations
 * - FeaturesSection: Highlights key platform capabilities
 * - FooterSection: Contact information and navigation links
 */
const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  // Handle scroll events for parallax and animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const sections = document.querySelectorAll('[data-animate]');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        setIsVisible(prev => ({
          ...prev,
          [index]: isInView
        }));
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Component for navigation header
  const NavigationHeader = () => (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrollY > 50 ? 'bg-blue-900/95 backdrop-blur-md shadow-lg' : 'bg-blue-900'
    } text-white`}>
      <div className="header-container">
        <div className="header-content">
          <div className="logo-container">
            <div className="flex items-center mr-3">
              <img src={navLogo} alt="PUPSMB Logo" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PUPSMB TransparaTech</h1>
              <p className="text-blue-200 text-sm">Official Management System of PUPSMB</p>
            </div>
          </div>
          
          <nav className="nav-menu">
            <button onClick={() => scrollToSection('home')} className="nav-link">Home</button>
            <button onClick={() => scrollToSection('about')} className="nav-link">About</button>
            <button onClick={() => scrollToSection('features')} className="nav-link">Features</button>
            <Link to="/signup" className="nav-link">Get Started</Link>
          </nav>
        </div>
      </div>
    </header>
  );

  // Component for hero section
  const HeroSection = () => (
    <section id="home" className="hero-section">
      <div 
        className="hero-background"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />
      
      <div className="hero-gradient-overlay" />
      <div className="hero-secondary-overlay" />
      
      <div className="hero-particles">
        <div className="hero-particle" />
        <div className="hero-particle" />
        <div className="hero-particle" />
        <div className="hero-particle" />
        <div className="hero-particle" />
      </div>
      
      <div className="hero-content">
        <div className="hero-content-inner">
          <h1 className="hero-title">
            <span className="hero-title-main">Making Technology</span>
            <span className="hero-title-highlight">Transparent & Accessible</span>
          </h1>
          
          <p className="hero-description">
            TransparaTech provides innovative technology solutions with{' '}
            <span className="hero-description-highlight">transparency at the core</span>{' '}
            of everything we do. Building a better future through{' '}
            <span className="hero-description-highlight-blue">accessible tech</span>.
          </p>
          
          <div className="hero-buttons">
            <Link to="/login" className="hero-button-primary">
              Log In
            </Link>
            <Link to="/signup" className="hero-button-secondary">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <button 
          onClick={() => scrollToSection('about')}
          className="scroll-indicator-button"
        >
          <svg className="scroll-indicator-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </button>
      </div>
    </section>
  );

  // Component for organization logo
  const OrganizationLogo = ({ logo }) => (
    <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
      <img src={logo.src} alt={logo.alt} className="w-full h-full object-cover" title={logo.name} />
    </div>
  );

  // Component for feature card
  const FeatureCard = ({ feature, isVisible, delay = 0 }) => (
    <div 
      className={`feature-card ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} 
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`feature-icon ${feature.bgColor}`}>
        {feature.icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
      <p className="text-gray-600">
        <strong>{feature.subtitle}</strong>
      </p>
      {feature.description && <p className="text-gray-600">{feature.description}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />

      <HeroSection />

      {/* About Section */}
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
            <p className="text-gray-600 text-lg">
              The PUP Sta. Maria Campus Transparency Portal is a digital platform dedicated to{' '}
              <strong>promoting openness, accountability, and responsible governance</strong>{' '}
              within the university community. It serves as a central hub for managing, submitting, 
              and reviewing organizational and financial reports with clarity and integrity.
              <br /><br />
              Our mission is to <em>strengthen trust between students, organizations, and administrators</em>{' '}
              by ensuring that all processes are transparent, ethical, and efficiently documented. 
              Through this initiative, we aim to foster a culture of{' '}
              <strong>honesty, collaboration, and good governance</strong>{' '}
              that reflects the true spirit of the Polytechnic University of the Philippines.
              <br /><br />
              More than a system for compliance, the PUPSMB Transparency Portal is a commitment —{' '}
              <em>a step toward building a transparent, accountable, and progressive student community.</em>
            </p>
          </div>
        </div>
      </section>

      {/* Student Organizations Section */}
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
          <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
            {ORGANIZATION_LOGOS.map((logo, index) => (
              <OrganizationLogo key={index} logo={logo} />
            ))}
          </div>
        </div>
      </section>

      {/* Spacer Section */}
      <section 
        data-animate
        className={`section-animated-gray ${
          isVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      />

      {/* Features Section */}
      <section 
        id="features"
        data-animate
        className={`section-animated ${
          isVisible[3] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="section-content">
          <div className="section-header">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Key Features</h2>
            <p className="text-gray-600 text-lg">Experience Transparency and Efficiency with Transparatech</p>
          </div>
          <div className="features-grid">
            {FEATURES_DATA.map((feature, index) => (
              <FeatureCard 
                key={feature.id}
                feature={feature}
                isVisible={isVisible[3]}
                delay={index * 200}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer 
        id="contact"
        data-animate
        className={`footer-section ${
          isVisible[4] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="section-content">
          <div className="footer-grid">
            <div className="transition-transform duration-300">
              <h3 className="text-lg font-semibold mb-4">About PUPSMB TransparaTech</h3>
              <p className="text-gray-300">
                The official management system for transparency and efficiency.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => scrollToSection('home')} className="transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection('about')} className="transition-colors">About</button></li>
                <li><button onClick={() => scrollToSection('features')} className="transition-colors">Features</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#documentation" className="transition-colors">Documentation</a></li>
                <li><a href="#support" className="transition-colors">Support</a></li>
                <li><a href="#privacy" className="transition-colors">Privacy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#help" className="transition-colors">Help & Support</a></li>
                <li><a href="#feedback" className="transition-colors">Feedback</a></li>
                <li><a href="#contact" className="transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-copyright">
            <p>&copy; Hexadevs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;