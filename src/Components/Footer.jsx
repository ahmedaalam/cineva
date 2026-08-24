import "./Footer.css";

const Footer = () => {
  return (
    <footer className="netflix-footer">
      <div className="footer-wrapper">
        <div className="footer-social-row">
          <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
          <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
          <a href="#" aria-label="Twitter"><i className="fa-brands fa-x-twitter"></i></a>
          <a href="#" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
        </div>

        <div className="footer-links-columns">
          <ul>
            <li><a href="#">Audio Description</a></li>
            <li><a href="#">Investor Relations</a></li>
            <li><a href="#">Legal Notices</a></li>
          </ul>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Jobs</a></li>
            <li><a href="#">Cookie Preferences</a></li>
          </ul>
          <ul>
            <li><a href="#">Gift Cards</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Corporate Information</a></li>
          </ul>
          <ul>
            <li><a href="#">Media Center</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        <div className="service-code-btn">
          <span>Service Code</span>
        </div>

        <div className="footer-copyright">
          © 1997-{new Date().getFullYear()} Cineva, Inc.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
