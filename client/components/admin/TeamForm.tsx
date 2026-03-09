import React, { useState, useEffect } from 'react';
import { addTeamMember, fetchTeam, deleteTeamMember } from '../../api';
import Input from './Input';
import { Trash2 } from 'lucide-react';

const TeamForm = () => {
    const [formData, setFormData] = useState({
        name: '', role: '', bio: '', avatar: '',
        socials: { linkedin: '', twitter: '', instagram: '', github: '' }
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [status, setStatus] = useState('');
    const [members, setMembers] = useState<any[]>([]);

    const loadMembers = () => {
        fetchTeam().then(res => {
            if (res.success && Array.isArray(res.data)) setMembers(res.data);
        });
    };

    useEffect(() => { loadMembers(); }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('role', formData.role);
            data.append('bio', formData.bio);
            data.append('socials[linkedin]', formData.socials.linkedin);
            data.append('socials[twitter]', formData.socials.twitter);
            data.append('socials[instagram]', formData.socials.instagram);
            data.append('socials[github]', formData.socials.github);

            if (avatarFile) {
                data.append('avatar', avatarFile);
            } else if (formData.avatar) {
                data.append('avatar', formData.avatar);
            }

            await addTeamMember(data);
            setStatus('Team member added successfully!');
            setFormData({ name: '', role: '', bio: '', avatar: '', socials: { linkedin: '', twitter: '', instagram: '', github: '' } });
            setAvatarFile(null);
            loadMembers();
        } catch (error) {
            setStatus('Error adding team member.');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete team member "${name}"?`)) return;
        try {
            const res = await deleteTeamMember(id);
            if (res.success) {
                setStatus(`Deleted "${name}"`);
                loadMembers();
            } else {
                setStatus('Failed to delete.');
            }
        } catch {
            setStatus('Error deleting member.');
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">Add Team Member</h2>
                <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <Input label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
                <Input label="Bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">Avatar Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <h3 className="font-semibold mt-4 mb-2">Social Links</h3>
                <Input label="LinkedIn" value={formData.socials.linkedin} onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, linkedin: e.target.value } })} />
                <Input label="Instagram" value={formData.socials.instagram} onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })} />

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Member</button>
                {status && <p className="mt-2 text-sm text-green-600">{status}</p>}
            </form>

            {/* Existing Members List */}
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">Existing Team Members</h2>
                {members.length === 0 ? (
                    <p className="text-gray-500 text-sm">No team members found.</p>
                ) : (
                    <div className="space-y-3">
                        {members.map((m: any) => (
                            <div key={m._id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    {m.avatar ? (
                                        <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">{m.name?.charAt(0)}</div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">{m.name}</p>
                                        <p className="text-xs text-gray-500">{m.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(m._id, m.name)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    title="Delete member"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamForm;
