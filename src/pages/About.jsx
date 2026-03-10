import React, { useEffect, useState } from 'react';
import { Target, Users, Award, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';
import { useData } from '../context/DataContext';

const About = () => {
  const { fetchContent } = useData();
  const [content, setContent] = useState({
      'about-hero-title': 'Fixing Technology,', 
      'about-hero-subtitle': 'Fixonic is the leading marketplace for high-quality device repair services.  We connect thousands of customers with certified technicians every single day.',
      'about-mission-title': 'Our Mission',
      'about-mission-text': 'To provide fast, reliable, and transparent repair services for every home and office. We believe that technology should be a solution, not a source of stress, which is why we bring the best technicians directly to your doorstep.'
  });

  useEffect(() => {
    const loadContent = async () => {
        const data = await fetchContent('about');
        if (data && Object.keys(data).length > 0) {
            setContent(prev => ({ ...prev, ...data }));
        }
    };
    loadContent();
  }, [fetchContent]);

  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary-50 pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto text-center pb-5">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            {content['about-hero-title']} <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-500 to-lime-600">Empowering People.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {content['about-hero-subtitle']}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-20 pt-10 px-4  border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-black text-primary-600 mb-2">50k+</div>
            <div className="text-gray-500 font-bold uppercase tracking-widest text-xs">Happy Clients</div>
          </div>
          <div>
            <div className="text-4xl font-black text-secondary-600 mb-2">150+</div>
            <div className="text-gray-500 font-bold uppercase tracking-widest text-xs">Expert Vendors</div>
          </div>
          <div>
            <div className="text-4xl font-black text-primary-600 mb-2">98%</div>
            <div className="text-gray-500 font-bold uppercase tracking-widest text-xs">Success Rate</div>
          </div>
          <div>
            <div className="text-4xl font-black text-secondary-600 mb-2">24/7</div>
            <div className="text-gray-500 font-bold uppercase tracking-widest text-xs">Support</div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
            <Target className="w-12 h-12 text-primary-600 mb-6" />
            <h2 className="text-2xl font-black text-gray-900 mb-4">{content['about-mission-title']}</h2>
            <p className="text-gray-600 leading-relaxed">
              {content['about-mission-text']}
            </p>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
            <Users className="w-12 h-12 text-secondary-600 mb-6" />
            <h2 className="text-2xl font-black text-gray-900 mb-4">{content['about-community-title']}</h2>
            <p className="text-gray-600 leading-relaxed">
              {content['about-community-text']}
            </p>
          </div>
        </div>
      </section>

       {/* Values */}
       <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900">{content['about-values-title']}</h2>
            <p className="text-gray-500 mt-2">{content['about-values-subtitle']}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
               <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary-100">
                 <ShieldCheck className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold mb-3">Unmatched Trust</h3>
               <p className="text-gray-500">Every technician is background checked and verified for your peace of mind.</p>
            </div>
            <div className="text-center">
               <div className="w-16 h-16 bg-secondary-50 text-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-secondary-100">
                 <Award className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold mb-3">Quality Parts</h3>
               <p className="text-gray-500">We only use high-grade parts for all repairs, backed by a 90-day warranty.</p>
            </div>
            <div className="text-center">
               <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary-100">
                 <MapPin className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold mb-3">Always Local</h3>
               <p className="text-gray-500">Supporting local businesses and keeping services fast through proximity.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
