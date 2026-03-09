import React, { useState, useEffect } from 'react';
import { fetchAbout, updateAbout } from '../../api';
import Input from './Input';

const AboutForm = () => {
    const [formData, setFormData] = useState({
        title: '', description: '', story: '', imageUrl: ''
    });
    const [status, setStatus] = useState('');

    useEffect(() => {
        const load = async () => {
            const res = await fetchAbout();
            if (res.success && res.data) {
                setFormData({
                    title: res.data.title || '',
                    description: res.data.description || '',
                    story: res.data.story || '',
                    imageUrl: res.data.imageUrl || ''
                });
            }
        };
        load();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateAbout(formData);
            setStatus('About Us updated successfully!');
        } catch (error) {
            setStatus('Error updating content.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Edit About Us</h2>
            <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            <Input label="Description (Short)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Our Story (Long)</label>
                <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                    value={formData.story}
                    onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                />
            </div>

            <Input label="Hero Image URL" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />

            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Update About Us</button>
            {status && <p className="mt-2 text-sm text-green-600">{status}</p>}
        </form>
    );
};

export default AboutForm;
