import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyAdminToken } from '../api';
import TeamForm from '../components/admin/TeamForm';
import ProductForm from '../components/admin/ProductForm';
import AboutForm from '../components/admin/AboutForm';
import InstagramReelForm from '../components/admin/InstagramReelForm';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('team');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin/login', { replace: true });
                return;
            }

            try {
                const result = await verifyAdminToken();
                if (result.success) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login', { replace: true });
                }
            } catch {
                localStorage.removeItem('adminToken');
                navigate('/admin/login', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login', { replace: true });
    };

    const tabs = [
        { id: 'team', label: 'Manage Team' },
        { id: 'products', label: 'Manage Products' },
        { id: 'about', label: 'Edit About Us' },
        { id: 'instagram', label: '📸 Instagram Reels' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-lg">Verifying access...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 pt-24">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                        Logout
                    </button>
                </div>

                <div className="flex space-x-4 mb-8 border-b border-gray-300 pb-2 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-white text-blue-600 border border-b-0 border-gray-300'
                                : 'text-gray-600 hover:text-blue-500'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-b-lg">
                    {activeTab === 'team' && <TeamForm />}
                    {activeTab === 'products' && <ProductForm />}
                    {activeTab === 'about' && <AboutForm />}
                    {activeTab === 'instagram' && <InstagramReelForm />}
                </div>
            </div>
        </div>
    );
};

export default Admin;
