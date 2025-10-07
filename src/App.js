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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-900 font-bold text-lg"></span>
              </div>
              <div>
                <h1 className="text-xl font-bold">PUPSMB TransparaTech</h1>
                <p className="text-blue-200 text-sm">Official Management system of PUPSMB</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button onClick={() => scrollToSection('home')} className="text-blue-200 hover:text-white transition-colors">Home</button>
              <button onClick={() => scrollToSection('about')} className="text-blue-200 hover:text-white transition-colors">About</button>
              <button onClick={() => scrollToSection('features')} className="text-blue-200 hover:text-white transition-colors">Features</button>
              <button onClick={() => scrollToSection('contact')} className="text-blue-200 hover:text-white transition-colors">Get Started</button>
            </nav>
          </div>
        </div>
      </header>

      <section id="home" className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="transform transition-all duration-1000 ease-out">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              Transparency in<br />
              <span className="text-yellow-300 inline-block">Organizational Spending</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-fade-in-up animation-delay-300">
              Explore how the federal government spends your tax dollars. Search contracts, grants, loans, and other financial assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
              <button 
                onClick={() => scrollToSection('features')}
                className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
              >
                Lorem Ipsum
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                Lorem Ipsum
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
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
        className={`py-16 bg-white transform transition-all duration-1000 ${
          isVisible[0] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Our Platform</h2>
            <p className="text-gray-600 text-lg">Empowering transparency through technology</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className={`p-6 transform transition-all duration-800 ${isVisible[0] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="text-4xl font-bold text-blue-900 mb-2">6.8T</div>
              <div className="text-gray-600">Total Federal Spending (FY 2024)</div>
            </div>
            <div className={`p-6 transform transition-all duration-800 ${isVisible[0] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
              <div className="text-4xl font-bold text-blue-900 mb-2">2.3M+</div>
              <div className="text-gray-600">Contracts & Awards</div>
            </div>
            <div className={`p-6 transform transition-all duration-800 ${isVisible[0] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
              <div className="text-4xl font-bold text-blue-900 mb-2">350+</div>
              <div className="text-gray-600">Federal Agencies</div>
            </div>
          </div>
        </div>
      </section>

      <section 
        data-animate
        className={`py-16 bg-gray-50 transform transition-all duration-1000 ${
          isVisible[1] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sample Data Visualization</h2>
            <p className="text-gray-600 text-lg">Interactive data presentation</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Agency Name</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-blue-900 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-blue-900 uppercase tracking-wider">Action</th>
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
        className={`py-16 bg-white transform transition-all duration-1000 ${
          isVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Federal Spending</h2>
            <p className="text-gray-600 text-lg">Powerful tools to understand government expenditures</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`text-center p-6 rounded-lg border border-gray-200 transition-all duration-500 transform ${isVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Search</h3>
              <p className="text-gray-600">Search by agency, recipient, location, and more</p>
            </div>
            <div className={`text-center p-6 rounded-lg border border-gray-200 transition-all duration-500 transform ${isVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Download Data</h3>
              <p className="text-gray-600">Export data in multiple formats for analysis</p>
            </div>
            <div className={`text-center p-6 rounded-lg border border-gray-200 transition-all duration-500 transform ${isVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300">
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
        className={`bg-gray-900 text-white py-12 transform transition-all duration-1000 ${
          isVisible[3] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; Hexadevs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
