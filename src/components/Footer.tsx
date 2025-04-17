import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center py-6 text-white font-sf text-sm bg-transparent">
      Developed by{' '}
      <a
        href="https://abbasslp.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-extrabold hover:text-gray-100 transition"
      >
        SLP
      </a>{' '}
      &{' '}
      <a
        href="https://www.linkedin.com/in/parham-houshmand/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-extrabold hover:text-gray-100 transition"
      >
        PHD
      </a>
    </footer>
  );
};

export default Footer;