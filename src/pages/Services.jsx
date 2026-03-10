import { Smartphone, Laptop, Tablet, Watch, Speaker, Monitor, ArrowRight, Check, Zap, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SERVICE_CATEGORIES } from '../data/mockData';
import { useData } from '../context/DataContext';

const Services = () => {
  const { fetchContent } = useData();
  const [content, setContent] = useState({
    'services-hero-title': 'Our Professional',
    'services-hero-subtitle': 'Choose from a wide range of specialized repair categories. Our experts handle everything with precision.',
    'services-grid-title': 'Devices We Excel At',
    'services-grid-subtitle': 'From smartphones to wearables, our technicians are equipped with state-of-the-art tools for every device.',
    'services-process-title': 'How it works?',
    'services-cta-title': "Don't see your device?",
    'services-cta-subtitle': "Fear not! Our technicians are versatile masters of repair. Contact us and we'll see if we can help bring your device back to life.",
    'services-show-smartphone': 'true',
    'services-show-laptop': 'true',
    'services-show-tablet': 'true',
    'services-show-watch': 'true',
    'services-show-speaker': 'true',
    'services-show-monitor': 'true',
  });

  useEffect(() => {
    const loadContent = async () => {
      const data = await fetchContent('services');
      if (data && Object.keys(data).length > 0) {
        setContent(prev => ({ ...prev, ...data }));
      }
    };
    loadContent();
  }, [fetchContent]);

  const icons = {
    smartphone: <Smartphone className="w-10 h-10" />,
    laptop: <Laptop className="w-10 h-10" />,
    tablet: <Tablet className="w-10 h-10" />,
    watch: <Watch className="w-10 h-10" />,
    speaker: <Speaker className="w-10 h-10" />,
    monitor: <Monitor className="w-10 h-10" />
  };

  const steps = [
    { icon: <Smartphone className="w-6 h-6" />, title: 'Book Online', desc: 'Select your device and issue in minutes.' },
    { icon: <Zap className="w-6 h-6" />, title: 'Expert Repair', desc: 'Our certified techs fix it at speed of life.' },
    { icon: <Shield className="w-6 h-6" />, title: 'Ready to Go', desc: 'Get your device back with a full warranty.' },
  ];

  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 px-4 bg-gray-50/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-50 rounded-full border border-navy-100 mb-8 animate-fade-in">
            <Zap className="w-4 h-4 text-lime-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-navy-400">Expert Repair Solutions</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-navy-900 mb-8 leading-tight tracking-tighter">
            {content['services-hero-title']} <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-500 to-lime-600">Services</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            {content['services-hero-subtitle']}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/signup" className="px-10 py-5 bg-navy-900 text-white font-black rounded-2xl shadow-2xl shadow-navy-900/20 hover:-translate-y-1 transition-all">
              Book a Repair Now
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-navy-900 mb-4 tracking-tight">{content['services-grid-title']}</h2>
              <p className="text-gray-500 font-medium">{content['services-grid-subtitle']}</p>
            </div>
            <div className="flex items-center gap-4 text-sm font-bold text-navy-400 uppercase tracking-widest bg-white px-6 py-3 rounded-2xl border border-gray-100">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Fast Turnaround</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> 6-Month Warranty</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICE_CATEGORIES.filter(s => content[`services-show-${s.iconKey}`] !== 'false').map((service, i) => (
              <div key={i} className="group relative bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-navy-900/10 transition-all duration-500 hover:-translate-y-2 flex flex-col">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 ${service.color} group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-inherit/20`}>
                  {icons[service.iconKey]}
                </div>
                <h3 className="text-2xl font-black text-navy-900 mb-4">{service.title}</h3>
                <ul className="space-y-4 mb-10 flex-grow">
                  {service.features.map((f, j) => (
                    <li key={j} className="flex items-center text-gray-500 gap-3 font-medium text-sm">
                      <div className="w-5 h-5 rounded-full bg-lime-50 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-lime-600 stroke-[4px]" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                  <div>
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Starting from</div>
                    <div className="text-2xl font-black text-navy-900">{service.price}</div>
                  </div>
                  <Link to="/signup" className="w-14 h-14 bg-navy-50 text-navy-900 rounded-2xl flex items-center justify-center group-hover:bg-navy-900 group-hover:text-white transition-all duration-300 shadow-sm border border-navy-100/50">
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 border-y border-gray-100 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-lime-600 font-black text-xs uppercase tracking-widest">Our Method</span>
            <h2 className="text-4xl font-black text-navy-900 mt-2 tracking-tight">{content['services-process-title']}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Horizontal Line for Tablet/Desktop */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-dashed bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50"></div>

            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl shadow-gray-200 flex items-center justify-center text-navy-900 relative z-10 border border-gray-50 mb-8 transition-transform hover:scale-110">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center text-xs font-black">
                    0{i + 1}
                  </div>
                </div>
                <h4 className="text-xl font-black text-navy-900 mb-3 tracking-tight">{step.title}</h4>
                <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-[200px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-navy-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-navy-900/40">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-400/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{content['services-cta-title']}</h2>
              <p className="text-gray-400 mb-12 max-w-xl mx-auto text-lg font-medium leading-relaxed">
                {content['services-cta-subtitle']}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/contact" className="w-full sm:w-auto px-12 py-6 bg-lime-500 text-navy-900 font-black rounded-2xl shadow-2xl shadow-lime-500/30 hover:bg-lime-400 hover:scale-105 transition-all uppercase tracking-widest text-sm">
                  Request Custom Quote
                </Link>
                <Link to="/blogs" className="w-full sm:w-auto px-12 py-6 bg-white/10 text-white font-black rounded-2xl border border-white/20 hover:bg-white/20 transition-all uppercase tracking-widest text-sm">
                  Read Repair Guides
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
