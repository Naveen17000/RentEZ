import React, { forwardRef } from 'react';

const Footer = forwardRef((props, ref) => {
  return (
    <footer ref={ref} className="footer">
      <div className="footer-content">
        {/* Company Info */}
        <div className="footer-section">
          <h3>RentEZ</h3>
          <p className="company-desc">Our vision is to provide convenience<br />and help increase your sales business</p>
        </div>

        {/* About Section */}
        <div className="footer-section">
          <h4>About</h4>
          <ul>
            <li><a href="/how-it-works">How It Works</a></li>
            <li><a href="/featured">Featured</a></li>
            <li><a href="/partnership">Partnership</a></li>
            <li><a href="/business-relation">Business Relation</a></li>
          </ul>
        </div>

        {/* Community Section */}
        <div className="footer-section">
          <h4>Community</h4>
          <ul>
            <li><a href="/events">Events</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/podcast">Podcast</a></li>
            <li><a href="/invite-friend">Invite a friend</a></li>
          </ul>
        </div>

        {/* Socials Section */}
        <div className="footer-section">
          <h4>Socials</h4>
          <ul>
            <li><a href="/discord">Discord</a></li>
            <li><a href="/instagram">Instagram</a></li>
            <li><a href="/twitter">Twitter</a></li>
            <li><a href="/facebook">Facebook</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>©2024 RENTEZ. All rights reserved</p>
        <div className="legal-links">
          <a href="/privacy">Privacy & Policy</a>
          <a href="/terms">Terms & Condition</a>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
