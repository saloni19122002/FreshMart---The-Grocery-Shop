import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group mb-6">
              <div className="bg-primary-600 text-white p-2 rounded-xl">
                <Store size={24} />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
                FreshMart
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your neighborhood's freshest farm produce delivered directly to your doorstep. We connect local farmers with conscious consumers.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">About Us</Link></li>
              <li><Link to="/shop" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Shop All</Link></li>
              <li><Link to="/categories" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Categories</Link></li>
              <li><Link to="/offers" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Special Offers</Link></li>
              <li><Link to="/farmer" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Become a Farmer</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-gray-900 font-bold mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li><Link to="/account" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">My Account</Link></li>
              <li><Link to="/account/orders" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Track Order</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Contact Support</Link></li>
              <li><Link to="/faq" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">FAQs</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="text-gray-900 font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary-600 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-500">123 Fresh Valley Road, Green District, 45678</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary-600 shrink-0" />
                <a href="tel:+1234567890" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary-600 shrink-0" />
                <a href="mailto:support@freshmart.com" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">support@freshmart.com</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} FreshMart. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-gray-400 font-medium">Secure Delivery</span>
            <span className="text-xs text-gray-400 font-medium">Quality Guaranteed</span>
            <span className="text-xs text-gray-400 font-medium">Farm Fresh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
