import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const { submitContact, fetchContent } = useData();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [content, setContent] = useState({
      'contact-hero-title': 'Let\'s Get Your',
      'contact-hero-subtitle': 'Have questions about our services or need a quick update? Reach out to us through any of these channels.',
      'contact-form-title': 'Send us a Message',
  });

  useEffect(() => {
    const loadContent = async () => {
        const data = await fetchContent('contact');
        if (data && Object.keys(data).length > 0) {
            setContent(prev => ({ ...prev, ...data }));
        }
    };
    loadContent();
  }, [fetchContent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitContact(formData);
    
    if (result.success) {
        showToast("Message sent! We'll get back to you soon.", 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
        showToast(`Error sending message: ${result.message}`, 'error');
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-white">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Contact Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                {content['contact-hero-title']} <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-navy-900 to-lime-500">Tech Fixed.</span>
              </h1>
              <p className="text-xl text-gray-500 mb-12">
                {content['contact-hero-subtitle']}
              </p>

                <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-navy-50 text-navy-900 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{content['contact-email-label']}</div>
                    <div className="text-xl font-bold text-gray-900">{content['contact-email-value']}</div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-navy-50 text-navy-900 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{content['contact-phone-label']}</div>
                    <div className="text-xl font-bold text-gray-900">{content['contact-phone-value']}</div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-navy-50 text-navy-900 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{content['contact-location-label']}</div>
                    <div className="text-xl font-bold text-gray-900">{content['contact-location-value']}</div>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-16 border-t border-gray-100 flex gap-6">
                  <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-navy-900 cursor-pointer transition-colors shadow-sm"><Facebook /></div>
                  <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-navy-600 cursor-pointer transition-colors shadow-sm"><Instagram /></div>
                  <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-navy-900 cursor-pointer transition-colors shadow-sm"><Twitter /></div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
              <h2 className="text-2xl font-black text-gray-900 mb-8 relative z-10">{content['contact-form-title']}</h2>
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-medium"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-medium"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Subject</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-medium"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Message</label>
                  <textarea 
                    required 
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-medium h-40"
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full py-5 bg-navy-900 text-white rounded-2xl font-black shadow-xl shadow-navy-900/20 hover:bg-navy-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                  Send Message <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
