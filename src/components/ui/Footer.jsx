import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const Footer = ({
  variant = 'full',
  className = '',
}) => {
  const isCompact = variant === 'compact';

  const mainLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const legalLinks = [
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Cookie Policy', path: '/cookies' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: 'Facebook', url: 'https://facebook.com' },
    { name: 'Twitter', icon: 'Twitter', url: 'https://twitter.com' },
    { name: 'Instagram', icon: 'Instagram', url: 'https://instagram.com' },
    { name: 'LinkedIn', icon: 'Linkedin', url: 'https://linkedin.com' },
  ];

  const renderLogo = () => (
    <div className="flex items-center">
      <Link to="/" className="flex items-center">
        <div className="font-display font-bold text-xl text-primary">
          ParkEase
        </div>
      </Link>
      {!isCompact && (
        <p className="mt-2 text-sm text-gray-500 max-w-xs">
          Find and book parking spots in your area quickly and easily.
        </p>
      )}
    </div>
  );

  const renderMainLinks = () => (
    <div className={`${isCompact ? 'flex flex-wrap justify-center' : ''}`}>
      <h3 className={`font-semibold text-gray-900 ${isCompact ? 'sr-only' : 'mb-3'}`}>
        Quick Links
      </h3>
      <ul className={`space-y-2 ${isCompact ? 'flex flex-wrap space-y-0' : ''}`}>
        {mainLinks.map((link) => (
          <li key={link.name} className={isCompact ? 'mx-3 my-1' : ''}>
            <Link 
              to={link.path} 
              className="text-gray-500 hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderLegalLinks = () => (
    <div className={`${isCompact ? 'w-full text-center mt-4' : ''}`}>
      <h3 className={`font-semibold text-gray-900 ${isCompact ? 'sr-only' : 'mb-3'}`}>
        Legal
      </h3>
      <ul className={`space-y-2 ${isCompact ? 'flex flex-wrap justify-center space-y-0' : ''}`}>
        {legalLinks.map((link) => (
          <li key={link.name} className={isCompact ? 'mx-3 my-1' : ''}>
            <Link 
              to={link.path} 
              className="text-gray-500 hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderSocialLinks = () => (
    <div className={isCompact ? 'w-full flex justify-center mt-4' : ''}>
      <h3 className={`font-semibold text-gray-900 ${isCompact ? 'sr-only' : 'mb-3'}`}>
        Follow Us
      </h3>
      <div className="flex space-x-4">
        {socialLinks.map((link) => (
          <a 
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-primary transition-colors"
            aria-label={link.name}
          >
            <Icon name={link.icon} size={20} />
          </a>
        ))}
      </div>
    </div>
  );

  const renderNewsletter = () => (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Stay Updated</h3>
      <p className="text-sm text-gray-500 mb-3">
        Subscribe to our newsletter for the latest updates.
      </p>
      <form className="flex">
        <input
          type="email"
          placeholder="Your email"
          className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-dark transition-colors"
        >
          Subscribe
        </button>
      </form>
    </div>
  );

  const renderFullFooter = () => (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          {renderLogo()}
        </div>
        <div>
          {renderMainLinks()}
        </div>
        <div>
          {renderLegalLinks()}
          <div className="mt-6">
            {renderSocialLinks()}
          </div>
        </div>
        <div>
          {renderNewsletter()}
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ParkEase. All rights reserved.
        </p>
      </div>
    </div>
  );

  const renderCompactFooter = () => (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col items-center">
        {renderLogo()}
        <div className="mt-4 w-full">
          {renderMainLinks()}
        </div>
        <div className="mt-4 flex flex-wrap justify-center">
          {renderSocialLinks()}
        </div>
        <div className="mt-4 w-full">
          {renderLegalLinks()}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ParkEase. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <footer className={`bg-white border-t border-gray-200 ${className}`}>
      {isCompact ? renderCompactFooter() : renderFullFooter()}
    </footer>
  );
};

export default Footer;