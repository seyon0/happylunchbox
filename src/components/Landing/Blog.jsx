import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';

const POSTS = [
  { id: 1, title: 'The Health Benefits of Traditional Tiffin Diets', desc: 'Discover how portion-controlled lunches prepared from fresh grains and lentils keep your energy high all afternoon.', readTime: '5 min read' },
  { id: 2, title: 'Generational Cooking: Keeping Traditional Heritage Alive', desc: 'A look into how local home cooks are translating long-lost recipes into premium tiffin services.', readTime: '4 min read' },
  { id: 3, title: 'Supporting Local Home Kitchens post-Brexit', desc: 'How our platform is empowering immigrant cooks to establish successful food businesses in the UK.', readTime: '6 min read' }
];

export const Blog = () => {
  const { navigateTo } = useApp();
  return (
    <div className="min-h-screen bg-[#FDFDFB] text-slate-800 flex flex-col font-sans py-16 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <button onClick={() => navigateTo('landing')} className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-ink-900 transition-colors uppercase tracking-wider">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>

        <div className="space-y-2">
          <h1 className="font-heading text-4xl font-black text-ink-900 tracking-tight">Our Blog & Stories</h1>
          <p className="text-stone-500 text-sm font-medium">Insights into recipes, nutrition, and local partner kitchens.</p>
        </div>

        <div className="space-y-6 pt-4">
          {POSTS.map(post => (
            <div key={post.id} className="border border-stone-200 rounded-3xl p-6 bg-white shadow-sm space-y-3">
              <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                <Clock className="w-3 h-3" /> {post.readTime}
              </span>
              <h3 className="font-heading font-extrabold text-lg text-ink-900">{post.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-medium">{post.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
