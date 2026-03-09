import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Smile } from 'lucide-react';
import { fetchAbout } from '../api';
import { Footer } from '../components/Footer';

export const About: React.FC = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetchAbout().then(res => {
            if (res.success && res.data && res.data.title) setData(res.data);
        });
    }, []);

    const story = data?.story || null;

    const paragraphs = story
        ? story.split('\n').filter((p: string) => p.trim() !== '')
        : [
            "We present tech products in simple and easy to understand language. Our goal is to provide tech related information and help people make informed buying decisions. As the creator of GoTechy, I take pride in the fact that we not only focus on tech product unboxing and reviews but have also helped many people avoid scams and frauds. We have stood up for consumer rights and raised our voice for them whenever needed.",
            "We aim to inspire and motivate the youth with positive messages, whether through our YouTube channel or other social media platforms.",
            "In Summary, I am here to learn, earn, grow, and most importantly, help my viewers make the right decisions when purchasing tech products through my reviews and bring a positive impact to my viewers' lives.",
            "We collaborate only with good and reputed brands, and we strictly avoid promoting gambling or any platform that could negatively impact the lives of our youth.",
        ];

    return (
        <>
            <div className="pt-28 pb-20 px-6" style={{ background: 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)' }}>

                {/* Decorative gradient line */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, #c084fc, #818cf8, #60a5fa, #f472b6, #fb923c)' }} />
                </div>

                {/* About Us Pill Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-10"
                >
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 px-8 py-3 border-2 border-gray-800 rounded-full">
                        About Us
                    </h1>
                </motion.div>

                {/* Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl mx-auto relative"
                >
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12 relative overflow-hidden">


                        {/* Story Paragraphs */}
                        <div className="space-y-5">
                            {paragraphs.map((para: string, i: number) => (
                                <p key={i} className="text-gray-600 text-sm md:text-base leading-relaxed">
                                    {para}
                                </p>
                            ))}
                        </div>

                        {/* Thank You */}
                        <p className="mt-8 text-base font-bold text-gray-900">Thank You</p>

                        {/* Smiley Icon */}
                        <div className="absolute bottom-6 right-6 text-gray-200">
                            <Smile size={40} strokeWidth={1} />
                        </div>
                    </div>
                </motion.div>

                {/* Bottom decorative gradient line */}
                <div className="max-w-4xl mx-auto mt-8">
                    <div className="h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, #fb923c, #f472b6, #60a5fa, #818cf8, #c084fc)' }} />
                </div>
            </div>
            <Footer />
        </>
    );
};
