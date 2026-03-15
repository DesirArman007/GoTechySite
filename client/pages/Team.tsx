import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { fetchTeam } from '../api';

interface TeamMember {
    name: string;
    role: string;
    avatar: string;
    bio: string;
    socials: {
        twitter?: string;
        linkedin?: string;
        github?: string;
        instagram?: string;
    }
}

const TeamCard: React.FC<TeamMember> = ({ name, role, avatar, bio, socials }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer aspect-[3/4]"
    >
        {/* Full Photo */}
        {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-6xl font-bold text-gray-400">{name.charAt(0)}</span>
            </div>
        )}

        {/* Bottom gradient overlay with name & role */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-5 pt-16">
            <h3 className="text-xl font-bold text-white leading-tight">{name}</h3>
            <p className="text-sm font-medium text-brand-300 italic">{role}</p>
        </div>

        {/* Social icons on hover */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-blue-400 shadow-md transition-colors"><Twitter size={14} /></a>
            )}
            {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-blue-700 shadow-md transition-colors"><Linkedin size={14} /></a>
            )}
            {socials.github && (
                <a href={socials.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 shadow-md transition-colors"><Github size={14} /></a>
            )}
            {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-pink-600 shadow-md transition-colors"><Instagram size={14} /></a>
            )}
        </div>
    </motion.div>
);

export const Team = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTeam()
            .then(res => {
                if (res.success && Array.isArray(res.data)) {
                    setTeam(res.data);
                } else {
                    setError('Unable to load team at the moment.');
                }
            })
            .catch((err) => {
                setError(err.message || 'Unable to load team at the moment.');
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="pt-24 px-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4 text-gray-900">Meet the Team</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    The geeks, creators, and coffee addicts behind GoTechy.
                </p>
            </div>

            {loading && (
                <p className="text-center text-gray-500">Loading team...</p>
            )}
            {!loading && error && (
                <p className="text-center text-red-600">{error}</p>
            )}
            {!loading && !error && team.length === 0 && (
                <p className="text-center text-gray-500">No team members yet.</p>
            )}
            {!loading && !error && team.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-24">
                    {team.map((member, idx) => (
                        <TeamCard key={idx} {...member} />
                    ))}
                </div>
            )}
        </div>
    );
};
