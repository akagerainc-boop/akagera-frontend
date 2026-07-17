import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, MessageCircle, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Akagera Inc</h3>
            <p>Building innovative software solutions, business portals, and digital products for modern organizations.</p>
            <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" title="Facebook" style={{ color: '#ff8d3c' }}>
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" title="Twitter" style={{ color: '#ff8d3c' }}>
                <Twitter size={20} />
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" title="LinkedIn" style={{ color: '#ff8d3c' }}>
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/apps">Apps</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/business">Business Portal</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Info</h3>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Mail size={20} style={{ color: '#ff8d3c', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <a href="mailto:akagerainc@gmail.com">akagerainc@gmail.com</a>
                </div>
              </li>
              <li style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Phone size={20} style={{ color: '#ff8d3c', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <a href="tel:+250795226123">+250 795 226 123</a>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={20} style={{ color: '#ff8d3c', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <p>Musanze, Rwanda</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="mailto:support@akagerainc.com">Technical Support</a></li>
              <li><Link to="/pricing">FAQ</Link></li>
              <li><Link to="/about">Documentation</Link></li>
              <li>
                <a href="https://wa.me/250795226123" target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={16} style={{ display: 'inline', marginRight: '5px' }} />
                  WhatsApp Chat
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', color: 'var(--dark-gray)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><Globe size={16} /> Production-ready React + FastAPI</span>
          <span>JWT auth ready</span>
          <span>Marketplace + business portal</span>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Akagera Inc. All rights reserved. | Smart Mobile Solutions</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
