import React from "react";

const Footer = () => {
  return (
        <footer className="border-t border-blue-100 py-8">
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            <a href="/about" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">About</a>
            <a href="/providers" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">For Providers</a>
            <a href="/research" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">Research</a>
            <a href="/privacy" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">Privacy</a>
            <a href="/terms" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">Terms</a>
            <a href="/contact" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">Contact</a>
          </div>
          <p className="text-center text-gray-500 text-sm">&copy; {new Date().getFullYear()} Perceptria. All rights reserved.</p>
        </footer>

  );
};

export default Footer;
