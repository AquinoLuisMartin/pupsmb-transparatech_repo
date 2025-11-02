import React, { useEffect, useRef, useState } from 'react';
import './Signup.css';

const Icon = ({ name }) => {
  switch (name) {
    case 'shield':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 2l7 3v5c0 5-3.5 9.7-7 11-3.5-1.3-7-6-7-11V5l7-3z" stroke="#1565c0" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'lock':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="#1565c0" strokeWidth="1.2" fill="none" />
          <path d="M7 11V8a5 5 0 0110 0v3" stroke="#1565c0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'file':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" stroke="#1565c0" strokeWidth="1.2" fill="none" />
          <path d="M14 3v6h6" stroke="#1565c0" strokeWidth="1.2" fill="none" />
        </svg>
      );
    case 'database':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <ellipse cx="12" cy="5" rx="8" ry="3" stroke="#1565c0" strokeWidth="1.2" fill="none" />
          <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" stroke="#1565c0" strokeWidth="1.2" fill="none" />
          <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" stroke="#1565c0" strokeWidth="1.2" fill="none" />
        </svg>
      );
    default:
      return null;
  }
};

const Section = ({ icon, title, children }) => (
  <section className="tp-section">
    <div className="tp-section__icon" aria-hidden="true"><Icon name={icon} /></div>
    <div className="tp-section__content">
      <h4 className="tp-section__title">{title}</h4>
      <div className="tp-section__body">{children}</div>
    </div>
  </section>
);

const TermsAndPrivacyModal = ({ isOpen, onClose, defaultTab = 'terms' }) => {
  const [tab, setTab] = useState(defaultTab === 'privacy' ? 'privacy' : 'terms');
  const modalRef = useRef(null);
  const scrollPosRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab === 'privacy' ? 'privacy' : 'terms');
    }
  }, [isOpen, defaultTab]);

  // Prevent background/page scrolling when modal is open.
  useEffect(() => {
    if (!isOpen) return;
    // Save current scroll position
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    scrollPosRef.current = scrollY;
    // Lock body: position fixed with negative top to preserve scroll position
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';

    return () => {
      // Restore
      const prev = scrollPosRef.current || 0;
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      window.scrollTo(0, prev);
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Tab') {
        // simple focus trap
        const focusable = modalRef.current ? modalRef.current.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])') : [];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // focus the close button or first tabbable
      const focusable = modalRef.current.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
      if (focusable && focusable.length) focusable[0].focus();
    }
  }, [isOpen, tab]);

  if (!isOpen) return null;

  return (
    <div className="tp-backdrop" role="dialog" aria-modal="true" aria-label={tab === 'terms' ? 'Terms of Use' : 'Privacy Policy'}>
      <div className="tp-backdrop__overlay" onClick={onClose} aria-hidden="true" />
      <div className="tp-modal" ref={modalRef}>
        <header className="tp-header">
          <div className="tp-header__left">
            <div className="tp-tabs" role="tablist" aria-label="Terms and Privacy Tabs">
              <button className={`tp-tab ${tab === 'terms' ? 'active' : ''}`} role="tab" aria-selected={tab === 'terms'} onClick={() => setTab('terms')}>Terms of Use</button>
              <button className={`tp-tab ${tab === 'privacy' ? 'active' : ''}`} role="tab" aria-selected={tab === 'privacy'} onClick={() => setTab('privacy')}>Privacy Policy</button>
            </div>
            <div className="tp-last-updated">Last updated: <span>Nov 2, 2025</span></div>
          </div>
          <button className="tp-close-btn" aria-label="Close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6 6L18 18M6 18L18 6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </header>

        <div className="tp-content">
          <div className="tp-scroll">
            {tab === 'terms' ? (
              <div>
                <Section icon="shield" title="Introduction">
                  <p>Welcome to our service. By registering, you agree to these Terms of Use which govern your access and use of the platform.</p>
                </Section>
                <Section icon="file" title="Account Registration">
                  <p>Users must provide accurate information during registration and are responsible for maintaining account security.</p>
                </Section>
                <Section icon="shield" title="Acceptable Use Policy">
                  <p>Use the service respectfully. Prohibited activities include harassment, abuse, and unlawful conduct.</p>
                </Section>
                <Section icon="file" title="User Content">
                  <p>Content you upload remains yours, but you grant the service a license to display and distribute it as needed to operate the service.</p>
                </Section>
                <Section icon="database" title="Service Availability">
                  <p>We strive for high availability but cannot guarantee uninterrupted service. Maintenance windows may occur.</p>
                </Section>
                <Section icon="shield" title="Account Termination">
                  <p>Accounts may be suspended or terminated for violations of these terms or for abusive behavior.</p>
                </Section>
                <Section icon="file" title="Limitation of Liability">
                  <p>To the extent permitted by law, our liability is limited. We are not liable for consequential damages arising from use of the service.</p>
                </Section>
                <Section icon="file" title="Changes to Terms">
                  <p>We may update these terms. Continued use after changes indicates acceptance. Important changes will be highlighted.</p>
                </Section>
              </div>
            ) : (
              <div>
                <Section icon="database" title="Data Collection">
                  <p>We collect information you provide directly and technical data about your device and usage to operate and improve the service.</p>
                </Section>
                <Section icon="lock" title="Usage">
                  <p>Collected data is used to personalize experience, provide support, prevent abuse, and for analytics.</p>
                </Section>
                <Section icon="database" title="Sharing">
                  <p>We do not sell personal data. We may share data with service providers and as required by law.</p>
                </Section>
                <Section icon="lock" title="Security">
                  <p>We implement reasonable measures to protect data, but no method is 100% secure. Report security issues to the contact below.</p>
                </Section>
                <Section icon="database" title="Retention">
                  <p>Data is retained as long as necessary to provide the service and comply with legal obligations.</p>
                </Section>
                <Section icon="file" title="User Rights">
                  <p>Users can request access, correction, or deletion of their personal data where applicable under local law.</p>
                </Section>
                <Section icon="file" title="Cookies">
                  <p>We use cookies to provide essential functionality and analytics. You can manage cookie preferences in your browser.</p>
                </Section>
                <Section icon="shield" title="Children's Privacy">
                  <p>Our services are not intended for young children. We do not knowingly collect data from children under the age of 13.</p>
                </Section>
                <Section icon="file" title="Policy Changes">
                  <p>Privacy practices may change; significant updates will be posted and highlighted for review.</p>
                </Section>
              </div>
            )}
          </div>
        </div>

        <footer className="tp-footer">
          <button className="tp-understand-btn" onClick={onClose}>I Understand</button>
        </footer>
      </div>
    </div>
  );
};

export default TermsAndPrivacyModal;
