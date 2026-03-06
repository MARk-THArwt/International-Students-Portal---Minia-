import React from "react";
import "./Footer.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Column 1 */}
        <div className="footer-col">
          <div className="logo-section">
            <div ><img className="logo-circle" src="../../public/logo minia university.webp" /></div>
            <div>
              <h2>Minia University</h2>
              <p className="subtitle">International Portal</p>
            </div>
          </div>

          <p className="description">
            Providing excellence in higher education and research since 1976.
            Minia University is committed to fostering a diverse and inclusive
            academic environment.
          </p>

          <div className="social-icons">
            <FaFacebookF />
            <FaInstagram />
            <FaTwitter />
          </div>
        </div>

        {/* Column 2 */}
        <div className="footer-col">
          <h3>QUICK LINKS</h3>
          <ul>
            <li>About University</li>
            <li>Academic Calendar</li>
            <li>E-Learning Portal</li>
            <li>Library</li>
            <li>Staff Directory</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-col">
          <h3>ADMISSION</h3>
          <ul>
            <li>How to Apply</li>
            <li>Tuition Fees</li>
            <li>Scholarships</li>
            <li>Transfer Students</li>
            <li>FAQ</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="footer-col">
          <h3>CONTACT US</h3>
          <ul className="contact">
            <li><FaMapMarkerAlt /> Main Campus, Minia City, Egypt</li>
            <li><FaPhoneAlt /> +20 86 236 2365</li>
            <li><FaEnvelope /> info@minia.edu.eg</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Minia University. All Rights Reserved.</p>
        <div className="footer-links">
          <span>Privacy Policy</span>
          <span>Terms of Use</span>
          <span>Sitemap</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;