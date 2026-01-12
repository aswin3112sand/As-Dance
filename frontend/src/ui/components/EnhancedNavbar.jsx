import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const EnhancedNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      setIsScrolled(currentScrollY > 50);

      if (scrollDifference > 5) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 150);
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [lastScrollY]);

  const handleNavLinkHover = (e) => {
    const link = e.currentTarget;
    const rect = link.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    link.style.setProperty('--mouse-x', `${x}px`);
    link.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <nav 
      ref={navRef}
      className={`navbar-glass ${isScrolled ? 'scrolled' : ''} ${isVisible ? 'show' : 'hide'}`}
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      <div className="container-max">
        <div className="brand">
          AS DANCE
        </div>

        {!isMobile && (
          <div className="nav-center">
            <a 
              href="#bundle" 
              className="nav-link"
              onMouseMove={handleNavLinkHover}
            >
              <span className="nav-label">Bundle</span>
              <span className="nav-emoji" aria-hidden="true">📦</span>
            </a>
            <a 
              href="#services" 
              className="nav-link"
              onMouseMove={handleNavLinkHover}
            >
              <span className="nav-label">Services</span>
              <span className="nav-emoji" aria-hidden="true">⚙</span>
            </a>
            <a 
              href="#preview" 
              className="nav-link"
              onMouseMove={handleNavLinkHover}
            >
              <span className="nav-label">Preview</span>
              <span className="nav-emoji" aria-hidden="true">▶</span>
            </a>
            <a 
              href="#reviews" 
              className="nav-link"
              onMouseMove={handleNavLinkHover}
            >
              <span className="nav-label">Reviews</span>
              <span className="nav-emoji" aria-hidden="true">⭐</span>
            </a>
            <a 
              href="#contacts" 
              className="nav-link"
              onMouseMove={handleNavLinkHover}
            >
              <span className="nav-label">Contacts</span>
              <span className="nav-emoji" aria-hidden="true">📞✉</span>
            </a>
          </div>
        )}

        <div className="header-actions">
          <Link to="/login" className="btn nav-cta nav-cta-primary">
            Login
          </Link>
          <Link to="/register" className="btn nav-cta nav-cta-primary">
            Create Account
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default EnhancedNavbar;
