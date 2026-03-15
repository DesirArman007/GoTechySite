import { useState, useEffect } from 'react';
import Input from './Input';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface InstagramReel {
    _id: string;
    platformId: string;
    thumbnail: string;
    permalink: string;
    caption: string;
    publishedAt: string;
}

const InstagramReelForm = () => {
    const [formData, setFormData] = useState({
        shortcode: ''
    });
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
    const [reels, setReels] = useState<InstagramReel[]>([]);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    // Get Auth Token for Admin Requests
    const getAuthToken = () => {
        return localStorage.getItem('adminToken') || '';
    };

    // Fetch existing reels
    const fetchReels = async () => {
        try {
            const res = await fetch(`${API_BASE}/content/instagram`);
            const data = await res.json();
            if (data.success) {
                setReels(data.data);
            }
        } catch (error) {
            // Silently fail or track error state if needed
        }
    };

    useEffect(() => {
        fetchReels();
    }, []);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnailFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Extract shortcode from Instagram URL
    const extractShortcode = (url: string) => {
        const match = url.match(/\/reel\/([^\/\?]+)/) || url.match(/\/p\/([^\/\?]+)/);
        return match ? match[1] : url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        if (!thumbnailFile) {
            setStatus('❌ Please select a thumbnail image');
            setLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('shortcode', formData.shortcode);
            formDataToSend.append('thumbnail', thumbnailFile);

            const res = await fetch(`${API_BASE}/content/instagram`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: formDataToSend
            });

            const data = await res.json();

            if (data.success) {
                setStatus('✅ Instagram reel added successfully!');
                setFormData({ shortcode: '' });
                setThumbnailFile(null);
                setThumbnailPreview('');
                fetchReels();
            } else {
                setStatus(`❌ ${data.message}`);
            }
        } catch (error) {
            setStatus('❌ Error adding Instagram reel.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this reel?')) return;

        try {
            const res = await fetch(`${API_BASE}/content/instagram/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            const data = await res.json();

            if (data.success) {
                setStatus('✅ Reel deleted.');
                fetchReels();
            }
        } catch (error) {
            setStatus('❌ Error deleting reel.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Add Reel Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">📸 Add Instagram Reel</h2>

                <p className="text-sm text-gray-600 mb-4">
                    Add Instagram reels manually. Enter the reel shortcode (or full URL) and upload a thumbnail image.
                </p>

                <Input
                    label="Reel Shortcode or URL"
                    value={formData.shortcode}
                    onChange={(e) => setFormData({
                        ...formData,
                        shortcode: extractShortcode(e.target.value)
                    })}
                    placeholder="e.g., ABC123xyz or https://instagram.com/reel/ABC123xyz/"
                    required
                />

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">Thumbnail Image *</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload a screenshot or thumbnail of the reel</p>
                </div>

                {thumbnailPreview && (
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Preview</label>
                        <img
                            src={thumbnailPreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                >
                    {loading ? 'Uploading...' : 'Add Reel'}
                </button>

                {status && (
                    <p className={`mt-3 text-sm ${status.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                        {status}
                    </p>
                )}
            </form>

            {/* Existing Reels List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Existing Reels ({reels.length})</h3>

                {reels.length === 0 ? (
                    <p className="text-gray-500">No Instagram reels added yet.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {reels.map((reel) => (
                            <div key={reel._id} className="relative group">
                                <a href={reel.permalink} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={reel.thumbnail}
                                        alt={reel.caption}
                                        className="w-full h-32 object-cover rounded-lg border hover:border-pink-500 transition-all"
                                    />
                                </a>
                                <button
                                    onClick={() => handleDelete(reel._id)}
                                    className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                >
                                    ×
                                </button>
                                <p className="text-xs text-gray-500 mt-1 truncate">{reel.platformId}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstagramReelForm;
