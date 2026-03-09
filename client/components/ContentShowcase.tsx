import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Instagram, ArrowUpRight } from 'lucide-react';
import { ContentCardProps } from '../types';
import { fetchLatestContent } from '../api';

const VideoCard: React.FC<ContentCardProps> = ({ image, title, meta1, meta2, badge, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
    <motion.div
      whileHover={{ y: -8, boxShadow: "0px 20px 40px -10px rgba(59, 130, 246, 0.15)" }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer h-full flex flex-col"
    >
      <div className="relative aspect-video overflow-hidden shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">
          <Play size={10} fill="currentColor" /> {badge}
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
            <Play size={20} className="text-brand-600 ml-1" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-sm md:text-base leading-tight mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">{title}</h3>
        <div className="flex items-center text-xs text-gray-500 gap-2 mt-auto">
          <span>{meta1 || 'N/A Views'}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span>{meta2}</span>
        </div>
      </div>
    </motion.div>
  </a>
);

const PostCard: React.FC<ContentCardProps> = ({ image, title, meta1, meta2, badge, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
    <motion.div
      whileHover={{ y: -8, boxShadow: "0px 20px 40px -10px rgba(192, 38, 211, 0.15)" }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer h-full flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">
          <Instagram size={10} /> {badge}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-pink-600 transition-colors truncate">{title}</h3>
        <div className="flex items-center text-xs text-gray-500 gap-2 mt-auto">
          <span>{meta1 || 'N/A Likes'}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span>{meta2}</span>
        </div>
      </div>
    </motion.div>
  </a>
);

export const ContentShowcase: React.FC = () => {
  const [videos, setVideos] = useState<ContentCardProps[]>([]);
  const [posts, setPosts] = useState<ContentCardProps[]>([]);

  useEffect(() => {
    fetchLatestContent().then(res => {
      if (res.success && res.data) {
        // Transform Backend Videos -> Frontend Props
        const mappedVideos = res.data.videos.map((v: any) => ({
          type: 'video',
          image: v.thumbnail,
          title: v.title,
          meta1: v.views ? `${v.views} Views` : 'New',
          meta2: new Date(v.publishedAt).toLocaleDateString(),
          badge: 'YouTube',
          link: v.videoUrl
        }));

        // Transform Backend Posts -> Frontend Props
        const mappedPosts = res.data.posts.map((p: any) => ({
          type: 'post',
          // Use thumbnail if available (Reels), otherwise mediaUrl (Images)
          image: p.thumbnail || p.mediaUrl,
          title: p.caption || 'Instagram Post',
          meta1: p.likes ? `${p.likes} Likes` : 'New',
          meta2: new Date(p.publishedAt).toLocaleDateString(),
          badge: 'Instagram',
          link: p.permalink
        }));

        setVideos(mappedVideos);
        setPosts(mappedPosts);
      }
    });
  }, []);

  return (
    <div className="space-y-24 py-24 relative">

      {/* YouTube Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900 text-center w-full relative">
            Latest Reviews & Videos
            <span className="absolute -top-6 right-10 hidden lg:block opacity-20 rotate-12">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-gray-400">
                <path d="M20,20 L50,80 L80,20" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </h2>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, idx) => (
              <VideoCard key={idx} {...video} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading videos...</p>
        )}

        <div className="mt-12 text-center">
          <a href="https://www.youtube.com/@Go_Techy" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-brand-600 text-white font-semibold rounded-full shadow-lg shadow-brand-200 hover:shadow-xl hover:bg-brand-700 transition-all flex items-center gap-2 mx-auto group w-fit">
            View Channel <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Instagram Feed
          </h2>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post, idx) => (
                <PostCard key={idx} {...post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Loading posts...</p>
          )}

          <div className="mt-12 text-center">
            <a href="https://www.instagram.com/go_techy/" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-white text-pink-600 border border-pink-200 font-semibold rounded-full shadow-sm hover:shadow-lg hover:border-pink-300 transition-all flex items-center gap-2 mx-auto group w-fit">
              Follow @Go_techy <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
