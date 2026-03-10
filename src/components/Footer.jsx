import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";

const Footer = () => {
  const { fetchContent } = useData();
  const [siteName, setSiteName] = useState('Fixonic');

  useEffect(() => {
    const loadSiteName = async () => {
        const data = await fetchContent('settings');
        if (data && data['settings-site-name']) {
            setSiteName(data['settings-site-name']);
        }
    };
    loadSiteName();
  }, [fetchContent]);

  return (
    <footer className="bg-navy-900 border-t border-white/5 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex items-center gap-3">
          <div className="bg-lime-500 p-2 rounded-xl shadow-xl shadow-lime-500/10">
            <Wrench className="w-6 h-6 text-navy-900" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            {siteName}
          </span>
        </div>
        <div className="flex gap-10 text-white font-bold uppercase tracking-widest text-[10px]">
          <Link to="/about" className="hover:text-lime-500 transition-colors">
            About
          </Link>
          <Link
            to="/services"
            className="hover:text-lime-500 transition-colors"
          >
            Services
          </Link>
          <Link
            to="/journals"
            className="hover:text-lime-500 transition-colors"
          >
            Journals
          </Link>
          <Link to="/privacy" className="hover:text-lime-500 transition-colors">
            Privacy
          </Link>
          <Link to="/contact" className="hover:text-lime-500 transition-colors">
            Contact
          </Link>
        </div>
        <p className="text-white text-xs font-black uppercase tracking-widest">
          © 2026 {siteName} Inc.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
