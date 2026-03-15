import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">Get in Touch</h1>
        <p className="text-lg text-gray-500">
          Have a question about your order, our farm partners, or anything else? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info Cards */}
        <div className="lg:col-span-1 space-y-6">
          <a href="mailto:support@freshmart.com" className="card p-6 flex items-start gap-4 hover:border-primary-200 hover:shadow-md transition-all group block">
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Email Us</h3>
              <p className="text-sm text-gray-500 mb-2">Our friendly team is here to help.</p>
              <span className="text-primary-600 font-medium">support@freshmart.com</span>
            </div>
          </a>

          <a href="tel:+1234567890" className="card p-6 flex items-start gap-4 hover:border-primary-200 hover:shadow-md transition-all group block">
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Call Us</h3>
              <p className="text-sm text-gray-500 mb-2">Mon-Fri from 8am to 6pm.</p>
              <span className="text-primary-600 font-medium">+1 (234) 567-890</span>
            </div>
          </a>

          <a href="https://maps.google.com/?q=123+Fresh+Valley+Road,+Green+District,+45678" target="_blank" rel="noreferrer" className="card p-6 flex items-start gap-4 hover:border-primary-200 hover:shadow-md transition-all group block">
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Visit Us</h3>
              <p className="text-sm text-gray-500 mb-2">Come say hello at our main office.</p>
              <span className="text-primary-600 font-medium">123 Fresh Valley Road, Green District</span>
            </div>
          </a>
        </div>

        {/* Contact Form Shell */}
        <div className="lg:col-span-2">
          <div className="card p-8 md:p-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input type="text" className="input-field py-3" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input type="text" className="input-field py-3" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" className="input-field py-3" placeholder="you@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea rows="5" className="input-field py-3 min-h-[120px]" placeholder="How can we help you?"></textarea>
              </div>

              <button type="button" className="btn-primary w-full md:w-auto py-3 px-8 flex items-center justify-center">
                Send Message <Send size={18} className="ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
