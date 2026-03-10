import { Shield, Lock, Eye, FileText, CheckCircle } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-lime-500 selection:text-white">
      {/* Header */}
      <div className="bg-navy-900 text-white py-20 px-4 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-20 opacity-10">
             <Shield className="w-96 h-96 -rotate-12" />
         </div>

         <div className="absolute top-10 left-10 w-32 h-32 bg-lime-500 rounded-full blur-[80px] opacity-20"></div>

         <div className="max-w-5xl mx-auto relative mt-10 z-10 text-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-8">
                <Shield className="w-4 h-4 text-lime-400" />
                <span className="text-lime-400 text-xs font-black uppercase tracking-widest">Legal & Trust</span>
             </div>
             <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Privacy Policy</h1>
             <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8 font-medium">We value your trust and are committed to protecting your personal data.</p>
             <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Last updated: March 15, 2024</p>
         </div>
      </div>

      <section className="py-20 px-4 mt-5 relative z-20">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Section 1 */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-lime-200 transition-all">
             <div className="flex items-start gap-6">
                 <div className="p-4 bg-lime-50 text-lime-600 rounded-2xl shrink-0">
                     <Eye className="w-8 h-8" />
                 </div>
                 <div>
                     <h2 className="text-2xl font-black text-navy-900 mb-4">1. Data Collection</h2>
                     <p className="text-gray-500 leading-relaxed font-medium">
                        At Fixonic, we collect information that you provide directly to us when you create an account, 
                        request a repair, or communicate with us. This may include your name, email address, phone number, 
                        physical address, and details about your electronic devices.
                     </p>
                 </div>
             </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-lime-200 transition-all">
             <div className="flex items-start gap-6">
                 <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                     <Lock className="w-8 h-8" />
                 </div>
                 <div>
                     <h2 className="text-2xl font-black text-navy-900 mb-4">2. Data Usage</h2>
                     <p className="text-gray-500 leading-relaxed font-medium mb-6">
                        Your data is used solely to facilitate repair services, process payments, and provide you with 
                        updates regarding your service status. We do not sell your personal information to third parties.
                     </p>
                     <ul className="space-y-3">
                         {['Facilitate repairs', 'Process payments', 'Service updates', 'Quality assurance'].map((item, i) => (
                             <li key={i} className="flex items-center gap-3 text-sm font-bold text-navy-900">
                                 <CheckCircle className="w-4 h-4 text-lime-500" /> {item}
                             </li>
                         ))}
                     </ul>
                 </div>
             </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-lime-200 transition-all">
             <div className="flex items-start gap-6">
                 <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl shrink-0">
                     <FileText className="w-8 h-8" />
                 </div>
                 <div>
                     <h2 className="text-2xl font-black text-navy-900 mb-4">3. Your Rights</h2>
                     <p className="text-gray-500 leading-relaxed font-medium">
                        You have the right to access, update, or delete your personal information at any time. 
                        If you wish to exercise these rights or have questions about our privacy practices, 
                        please contact our data protection officer at <span className="text-navy-900 font-bold decoration-lime-500 underline-offset-4 cursor-pointer hover:text-lime-600 transition-colors">privacy@fixonic.com</span>.
                     </p>
                 </div>
             </div>
          </div>

          {/* Quote */}
          <div className="p-12 bg-navy-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-navy-900/30 text-center">
             <div className="absolute top-0 right-0 p-10 opacity-5">
               <Shield className="w-48 h-48 rotate-12" />
             </div>
             <div className="relative z-10 max-w-2xl mx-auto">
                 <Shield className="w-12 h-12 text-lime-500 mx-auto mb-6" />
                 <p className="text-white text-xl font-bold italic leading-relaxed mb-6">
                   "We take the security of your device and data seriously. Our technicians strictly follow 
                   data handling protocols to ensure your digital privacy is never compromised during a physical repair."
                 </p>
                 <div className="text-gray-400 text-xs font-black uppercase tracking-widest">
                     The Fixonic Promise
                 </div>
             </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Privacy;
