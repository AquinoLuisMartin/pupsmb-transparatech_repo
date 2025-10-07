import React, { useEffect, useState } from 'react';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

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
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-blue-900/95 backdrop-blur-md shadow-lg' : 'bg-blue-900'
      } text-white`}>
        <div className="header-container">
          <div className="header-content">
            <div className="logo-container">
              <div className="logo-icon">
                <span className="text-blue-900 font-bold text-lg"></span>
              </div>
              <div>
                <h1 className="text-xl font-bold">PUPSMB TransparaTech</h1>
                <p className="text-blue-200 text-sm">Official Management system of PUPSMB</p>
              </div>
            </div>
            <nav className="nav-menu">
              <button onClick={() => scrollToSection('home')} className="nav-link">Home</button>
              <button onClick={() => scrollToSection('about')} className="nav-link">About</button>
              <button onClick={() => scrollToSection('features')} className="nav-link">Features</button>
              <button onClick={() => scrollToSection('contact')} className="nav-link">Get Started</button>
            </nav>
          </div>
        </div>
      </header>

      <section id="home" className="hero-section">
        <div 
          className="hero-overlay"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        
        <div className="hero-content">
          <div className="transform transition-all duration-1000 ease-out">
            <h1 className="hero-title">
              Transparency in<br />
              <span className="text-yellow-300 inline-block">Organizational Spending</span>
            </h1>
            <p className="hero-description">
              Explore how the federal government spends your tax dollars. Search contracts, grants, loans, and other financial assistance.
            </p>
            <div className="hero-buttons">
              <button 
                onClick={() => scrollToSection('features')}
                className="primary-button"
              >
                Lorem Ipsum
              </button>
              <button className="secondary-button">
                Lorem Ipsum
              </button>
            </div>
          </div>
        </div>

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

      <section 
        id="about" 
        data-animate
        className={`section-animated ${
          isVisible[0] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="section-content">
          <div className="section-header">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Our Platform</h2>
            <p className="text-gray-600 text-lg">Empowering transparency through technology</p>
          </div>
          <div className="stats-grid">
            <div className={`stat-card ${isVisible[0] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="text-4xl font-bold text-blue-900 mb-2">6.8T</div>
              <div className="text-gray-600">Total Federal Spending (FY 2024)</div>
            </div>
            <div className={`stat-card ${isVisible[0] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
              <div className="text-4xl font-bold text-blue-900 mb-2">2.3M+</div>
              <div className="text-gray-600">Contracts & Awards</div>
            </div>
            <div className={`stat-card ${isVisible[0] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
              <div className="text-4xl font-bold text-blue-900 mb-2">350+</div>
              <div className="text-gray-600">Federal Agencies</div>
            </div>
          </div>
        </div>
      </section>

      <section 
        data-animate
        className={`section-animated-gray ${
          isVisible[1] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="section-content">
          <div className="section-header">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sample Data Visualization</h2>
            <p className="text-gray-600 text-lg">Interactive data presentation</p>
          </div>

          <div className="table-container">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="table-header">Rank</th>
                    <th className="table-header">Agency Name</th>
                    <th className="table-header-right">Amount</th>
                    <th className="table-header-center">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="text-center">
                    <td colSpan="4" className="px-6 py-8 text-gray-500">
                      No data available at this time
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section 
        id="features"
        data-animate
        className={`section-animated ${
          isVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="section-content">
          <div className="section-header">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Federal Spending</h2>
            <p className="text-gray-600 text-lg">Powerful tools to understand government expenditures</p>
          </div>
          <div className="features-grid">
            <div className={`feature-card ${isVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="feature-icon bg-blue-100">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Search</h3>
              <p className="text-gray-600">Search by agency, recipient, location, and more</p>
            </div>
            <div className={`feature-card ${isVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
              <div className="feature-icon bg-green-100">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Download Data</h3>
              <p className="text-gray-600">Export data in multiple formats for analysis</p>
            </div>
            <div className={`feature-card ${isVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
              <div className="feature-icon bg-purple-100">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Agency Profiles</h3>
              <p className="text-gray-600">Detailed spending profiles for each agency</p>
            </div>
          </div>
        </div>
      </section>

      <footer 
        id="contact"
        data-animate
        className={`footer-section ${
          isVisible[3] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
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
}

export default App;
