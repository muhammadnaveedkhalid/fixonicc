import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

const Journals = () => {
  const navigate = useNavigate();
  const { blogs, fetchBlogs, loadingBlogs, fetchContent } = useData();
  const [content, setContent] = useState({
      'journals-hero-title': 'Tech Insights & Repair Guides',
      'journals-hero-subtitle': 'Stay updated with the latest tips, tricks, and news from the world of technology repair.'
  });

  useEffect(() => {
    fetchBlogs();
    const loadContent = async () => {
         const data = await fetchContent('journals');
         if (data && Object.keys(data).length > 0) {
             setContent(prev => ({ ...prev, ...data }));
         }
    };
    loadContent();
  }, [fetchBlogs, fetchContent]);

  return (
    <div className="pt-24 bg-white min-h-screen">
      <div className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="mb-10 mt-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-navy-900 mb-6 tracking-tight">
              {content['journals-hero-title']}
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              {content['journals-hero-subtitle']}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loadingBlogs ? (
              // Skeleton Loading
              [...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 h-full animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-8 flex flex-col flex-1 gap-4">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-8 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded mt-auto pt-6"></div>
                  </div>
                </div>
              ))
            ) : blogs.length > 0 ? (
              blogs.map((blog) => (
              <div 
                key={blog._id} 
                className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 hover:border-lime-200 transition-all duration-300 cursor-pointer h-full"
                onClick={() => navigate(`/journals/${blog._id}`)}
              >
                <div className="h-64 relative overflow-hidden">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-xs font-black text-navy-900 uppercase tracking-widest shadow-sm">
                        {blog.category}
                    </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="text-xs font-bold text-gray-400 mb-4">{blog.date}</div>
                  <h3 className="text-2xl font-black text-navy-900 mb-4 leading-tight group-hover:text-lime-600 transition-colors">{blog.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-8 font-medium leading-relaxed flex-1">{blog.content}</p>
                  
                  <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-auto">
                      <span className="text-navy-900 font-bold text-sm group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                          Read Article <ArrowRight className="w-4 h-4 text-lime-500" />
                      </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty State
            <div className="col-span-full py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-gray-400 rotate-45" />
              </div>
              <h3 className="text-xl font-black text-navy-900 mb-2">No Articles Found</h3>
              <p className="text-gray-500 max-w-sm">We're working on some fresh content! Check back soon for the latest repair guides and tech news.</p>
            </div>
          )}
          </div>
       </div>
    </div>
  );
};

export default Journals;
