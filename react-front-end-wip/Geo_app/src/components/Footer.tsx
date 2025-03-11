import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 py-8 border-t border-gray-200">
      <div className="site-footer__bottom">
        <div className="container">
          <div className="site-footer__logo-container">
            <div className="site-footer__logos-and-copyright">
              <div className="site-footer__logos">
                <a className="site-footer__logo" href="https://ca.gov/">
                  <img
                    src="https://hcai.ca.gov/wp-content/themes/oshpd/assets/images/ca-logo-color.svg"
                    alt="California State Logo"
                  />
                  <div className="screen-reader-text"> </div>
                </a>
                <a className="site-footer__logo" href="/">
                  <img
                    src="https://hcai.ca.gov/wp-content/themes/oshpd/assets/images/logo-color.svg"
                    alt="Department of Health Care Access and Information Logo"
                  />
                  <div className="screen-reader-text"> </div>
                </a>
              </div>

              <div id="js-copyright-container">
                <p className="copyright" id="js-copyright">
                  © Copyright 2024 State of California{" "}
                </p>
              </div>
            </div>
            <div className="site-footer__mental-health site-footer__logos-and-copyright">
              <a
                className="site-footer__mental-health-logo"
                href="https://www.mentalhealth.ca.gov/"
              >
                <img
                  src="https://hcai.ca.gov/wp-content/themes/oshpd/assets/images/MHFA%20Logo%20Full%20Color.png"
                  alt="Mental Health for All"
                />
                <div className="screen-reader-text"> </div>
              </a>
            </div>

            <div className="site-footer__social">
              <p className="site-footer__social__heading">HCAI Social Media:</p>

              <div className="social-links">
                <ul className="social-links__list">
                  <li className="social-links__item">
                    <a
                      href="https://www.facebook.com/CaliforniaHCAI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-links__link"
                    >
                      <svg
                        role="presentation"
                        height="24"
                        width="10"
                        className="icon-facebook icon"
                        aria-label="facebook"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="https://hcai.ca.gov/wp-content/themes/oshpd/dist/icons/icons.svg#sprite-icon-facebook" />
                      </svg>
                      <img src="Geo\front-end\public\assets\facebook-icon.png" />{" "}
                      <span className="social-links__text">
                        Facebook<span className="screen-reader-text"> </span>
                      </span>
                    </a>
                  </li>
                  <li className="social-links__item">
                    <a
                      href="https://twitter.com/CA_HCAI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-links__link"
                    >
                      <svg
                        role="presentation"
                        height="24"
                        width="24"
                        className="icon-twitter icon"
                        aria-label="twitter"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="https://hcai.ca.gov/wp-content/themes/oshpd/dist/icons/icons.svg#sprite-icon-twitter" />
                      </svg>
                      <img src="Geo\front-end\public\assets\twitter-icon.png" />{" "}
                      <span className="social-links__text">
                        Twitter<span className="screen-reader-text"> </span>
                      </span>
                    </a>
                  </li>
                  <li className="social-links__item">
                    <a
                      href="https://www.linkedin.com/company/department-of-health-care-access-and-information"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-links__link"
                    >
                      <svg
                        role="presentation"
                        height="24"
                        width="24"
                        className="icon-linkedin icon"
                        aria-label="linkedin"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="https://hcai.ca.gov/wp-content/themes/oshpd/dist/icons/icons.svg#sprite-icon-linkedin" />
                      </svg>
                      <img src="Geo\front-end\public\assets\linkedin-icon.png" />{" "}
                      <span className="social-links__text">
                        LinkedIn<span className="screen-reader-text"> </span>
                      </span>
                    </a>
                  </li>
                  <li className="social-links__item">
                    <a
                      href="https://www.youtube.com/channel/UCWZlucPkJlQa8bvmf39SRqw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-links__link"
                    >
                      <svg
                        role="presentation"
                        height="18"
                        width="24"
                        className="icon-youtube icon"
                        aria-label="youtube"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="https://hcai.ca.gov/wp-content/themes/oshpd/dist/icons/icons.svg#sprite-icon-youtube" />
                      </svg>
                      <img src="Geo\front-end\public\assets\youtube-icon.png" />{" "}
                      <span className="social-links__text">
                        YouTube<span className="screen-reader-text"> </span>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="subscribe-button">
              <a
                className="c-button"
                id="js-subscribe-button"
                href="/mailing-list/"
              >
                Subscribe{" "}
              </a>
            </div>
          </div>
          <hr aria-hidden="true" />
          <ul id="menu-footer-menu-bottom" className="site-footer__menu-bottom">
            <li
              id="menu-item-85554"
              className="menu-item menu-item-type-custom menu-item-object-custom menu-item-85554"
            >
              <u>
                <a href="https://covid19.ca.gov/">COVID-19 Updates</a>
              </u>
            </li>
            <li
              id="menu-item-13782"
              className="menu-item menu-item-type-custom menu-item-object-custom menu-item-13782"
            >
              <u>
                <a href="https://registertovote.ca.gov/">Register to Vote</a>
              </u>
            </li>
            <li
              id="menu-item-9079"
              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-9079"
            >
              <u>
                <a href="https://hcai.ca.gov/home/privacy-policy/">
                  Privacy Policy Statement
                </a>
              </u>
            </li>
            <li
              id="menu-item-22321"
              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-22321"
            >
              <u>
                <a href="https://hcai.ca.gov/home/accessibility/">
                  Accessibility
                </a>
              </u>
            </li>
            <li
              id="menu-item-22320"
              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-22320"
            >
              <u>
                <a href="https://hcai.ca.gov/home/conditions-of-use/">
                  Data Collection/Conditions of Use
                </a>
              </u>
            </li>
            <li
              id="menu-item-19672"
              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-19672"
            >
              <u>
                <a href="https://hcai.ca.gov/about/contact-us/">Contact Us</a>
              </u>
            </li>
          </ul>{" "}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
