import React from 'react';
import { Hero } from '../components/Hero';
import { StatsBar } from '../components/StatsBar';
import { ContentShowcase } from '../components/ContentShowcase';
import { Footer } from '../components/Footer';

export const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-brand-100 selection:text-brand-900 relative">

            {/* Background Grid Pattern */}
            <div className="fixed inset-0 z-0 pointer-events-none grid-pattern opacity-60"></div>

            <div className="relative z-10">
                <Hero />
                <StatsBar />
                <ContentShowcase />
                <Footer />
            </div>
        </div>
    );
};
