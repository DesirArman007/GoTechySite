import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ContentCardProps } from '../types';

export const ProductCard: React.FC<ContentCardProps> = ({ image, title, meta1, meta2, link }) => (
    <motion.div
        whileHover={{ y: -8, boxShadow: "0px 20px 40px -10px rgba(59, 130, 246, 0.15)" }}
        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer flex flex-col h-full"
        onClick={() => link && window.open(link, '_blank')}
    >
        <div className="relative aspect-square overflow-hidden bg-white flex items-center justify-center p-2 border-b border-gray-100">
            <img src={image} alt={title} className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105" />

        </div>

        <div className="p-3 flex flex-col flex-grow">
            <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1.5 group-hover:text-brand-600 transition-colors line-clamp-2">
                {title}
            </h3>

            <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                {meta1}
            </p>

            <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-[10px] font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded uppercase">
                    {meta2 || 'GADGET'}
                </span>

                <a
                    href={link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-brand-600 transition-colors"
                >
                    Buy Now <ArrowUpRight size={16} />
                </a>
            </div>
        </div>
    </motion.div>
);