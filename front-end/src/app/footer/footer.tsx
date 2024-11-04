import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 py-8 border-t border-gray-200">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start px-6 space-y-6 md:space-y-0">

        {/* Left Section - Logos and Copyright */}
        <div className="flex flex-col items-start space-y-4">
          {/* Logos Section */}
          <div className="flex items-center space-x-4">
            <img
              src="/assets/ca-gov-logo.png"
              alt="CA Gov Logo"
              className="h-10"
            />
            <img
              src="/assets/hcai-logo.png"
              alt="HCAI Logo"
              className="h-12"
            />
          </div>
          {/* Copyright Information */}
          <div className="text-sm text-gray-600 ml-6">
            © Copyright 2021 State of California
          </div>
        </div>

        {/* Center Section - Useful Links */}
        <div className="flex flex-col items-end space-y-4 md:items-end md:space-y-4 w-full md:w-auto">
          <div className="flex flex-wrap justify-center md:justify-end space-x-8">
            {[
              { name: 'COVID-19 Updates', href: 'https://www.covid19.ca.gov/' },
              { name: 'Register to Vote', href: 'https://registertovote.ca.gov/' },
              { name: 'Privacy', href: 'https://hcai.ca.gov/home/privacy-policy/' },
              { name: 'Accessibility', href: 'https://hcai.ca.gov/home/accessibility/' },
              { name: 'Conditions of Use', href: 'https://hcai.ca.gov/home/conditions-of-use/' },
              { name: 'Contact Us', href: 'https://hcai.ca.gov/about/contact-us/' },
            ].map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-md font-semibold text-blue-800 hover:text-blue-900 transition duration-200 hover:underline underline-offset-4"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Social Media Icons, Subscribe Button */}
          <div className="flex flex-col items-end space-y-4">
            <div className="flex items-center space-x-6 mt-4 md:justify-end">
              {/* Subscribe Button */}
              <a
                href="https://hcai.ca.gov/mailing-list/"
                className="border border-blue-600 text-blue-800 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition duration-200 shadow-md hover:shadow-lg"
              >
                SUBSCRIBE
              </a>

              {/* Social Media Icons */}
              <div className="flex space-x-4">
                {[
                  {
                    name: 'Facebook',
                    href: 'https://www.facebook.com/CaliforniaHCAI',
                    src: '/assets/facebook-icon.png',
                  },
                  {
                    name: 'Twitter',
                    href: 'https://x.com/CA_HCAI',
                    src: '/assets/twitter-icon.png',
                  },
                  {
                    name: 'LinkedIn',
                    href: 'https://www.linkedin.com/company/department-of-health-care-access-and-information/',
                    src: '/assets/linkedin-icon.png',
                  },
                  {
                    name: 'YouTube',
                    href: 'https://www.youtube.com/channel/UCWZlucPkJlQa8bvmf39SRqw',
                    src: '/assets/youtube-icon.png',
                  },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                  >
                    <img
                      src={social.src}
                      alt={social.name}
                      className="h-8 hover:opacity-80 transition duration-200 shadow-md hover:shadow-lg rounded-md"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
