import React from 'react';
import { ShieldCheck, Truck, Sprout, HeartHandshake } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-primary-900 py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1595855761358-0ceec0e8a719?auto=format&fit=crop&q=80&w=2000" 
            alt="Farm landscape" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Our Mission is <span className="text-primary-400">Freshness</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-primary-100 leading-relaxed">
            We bridge the gap between local farmers and conscious consumers, bringing farm-fresh, organic produce directly to your table.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">How It Started</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              FreshMart was born from a simple realization: the produce we buy in supermarkets was often weeks old and stripped of its natural nutrients. We wanted better for our families, and we knew local farmers were growing exactly what we needed.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              By cutting out the middlemen and massive distribution centers, we created a direct marketplace. Farmers get a fair price for their hard work, and you get the freshest, healthiest food possible.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl relative">
            <img 
              src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=1000" 
              alt="Farmer holding fresh produce" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-500 text-lg">Everything we do is guided by these four principles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card bg-white p-8 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-50 text-green-600 outline outline-4 outline-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sprout size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainability</h3>
              <p className="text-gray-500">We prioritize eco-friendly farming practices that protect our soil and environment.</p>
            </div>
            
            <div className="card bg-white p-8 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 outline outline-4 outline-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartHandshake size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-500">We believe in thoroughly supporting local agricultural economies and families.</p>
            </div>

            <div className="card bg-white p-8 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 outline outline-4 outline-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparency</h3>
              <p className="text-gray-500">You will always know exactly where your food comes from and how it was grown.</p>
            </div>

            <div className="card bg-white p-8 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 outline outline-4 outline-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Reliability</h3>
              <p className="text-gray-500">We guarantee fresh delivery to your door exactly when you need it.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
