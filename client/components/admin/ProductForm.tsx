import { useState, useEffect } from 'react';
import { addProduct, fetchProducts, deleteProduct, togglePinProduct, updateProduct } from '../../api';
import Input from './Input';
import { Trash2, Pin, PinOff, Search, Pencil, X, Check } from 'lucide-react';
import { Product } from '../../types';

const ProductForm = () => {
    const [formData, setFormData] = useState({
        title: '', image: '', description: '', status: 'In Stock', source: 'amazon', buyLink: ''
    });
    const [statusMsg, setStatusMsg] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState({ title: '', image: '', source: '', buyLink: '' });

    const loadProducts = () => {
        fetchProducts().then(res => {
            if (res.success && Array.isArray(res.data)) setProducts(res.data);
        });
    };

    useEffect(() => { loadProducts(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addProduct(formData);
            setStatusMsg('Product added successfully!');
            setFormData({ title: '', image: '', description: '', status: 'In Stock', source: 'amazon', buyLink: '' });
            loadProducts();
        } catch (error) {
            setStatusMsg('Error adding product.');
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Delete product "${title}"?`)) return;
        try {
            const res = await deleteProduct(id);
            if (res.success) {
                setStatusMsg(`Deleted "${title}"`);
                loadProducts();
            } else {
                setStatusMsg('Failed to delete.');
            }
        } catch {
            setStatusMsg('Error deleting product.');
        }
    };

    const handleTogglePin = async (id: string) => {
        try {
            const res = await togglePinProduct(id);
            if (res.success) {
                setStatusMsg(res.message);
                loadProducts();
            } else {
                setStatusMsg(res.message || 'Failed to toggle pin.');
            }
        } catch {
            setStatusMsg('Error toggling pin.');
        }
    };

    const startEdit = (p: Product) => {
        setEditingId(p._id);
        setEditData({ title: p.title, image: p.image, source: p.source, buyLink: p.buyLink || '' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({ title: '', image: '', source: '', buyLink: '' });
    };

    const saveEdit = async () => {
        if (!editingId) return;
        try {
            const res = await updateProduct(editingId, editData);
            if (res.success) {
                setStatusMsg('Product updated!');
                setEditingId(null);
                loadProducts();
            } else {
                setStatusMsg('Failed to update.');
            }
        } catch {
            setStatusMsg('Error updating product.');
        }
    };

    const filteredProducts = products.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase())
    );

    const pinnedCount = products.filter(p => p.pinned).length;

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">Add Product</h2>
                <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                <Input label="Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} required />
                <Input label="Buy Link" value={formData.buyLink} onChange={(e) => setFormData({ ...formData, buyLink: e.target.value })} />

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Source</label>
                    <select
                        className="shadow border rounded w-full py-2 px-3 text-gray-700"
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    >
                        <option value="amazon">Amazon</option>
                        <option value="flipkart">Flipkart</option>
                    </select>
                </div>

                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Product</button>
                {statusMsg && <p className="mt-2 text-sm text-green-600">{statusMsg}</p>}
            </form>

            {/* Existing Products List */}
            <div className="bg-white p-6 rounded shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Existing Products</h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        📌 {pinnedCount}/6 pinned
                    </span>
                </div>

                {/* Search bar */}
                <div className="relative mb-4">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {filteredProducts.length === 0 ? (
                    <p className="text-gray-500 text-sm">{search ? 'No matching products.' : 'No products found.'}</p>
                ) : (
                    <div className="space-y-3">
                        {filteredProducts.map((p: Product) => (
                            <div key={p._id} className={`border rounded-lg p-3 hover:bg-gray-50 transition-colors ${p.pinned ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200'}`}>
                                {editingId === p._id ? (
                                    /* Edit Mode */
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-semibold text-blue-600">Editing:</span>
                                        </div>
                                        <input
                                            value={editData.title}
                                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                            placeholder="Title"
                                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <input
                                            value={editData.image}
                                            onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                                            placeholder="Image URL"
                                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <input
                                            value={editData.buyLink}
                                            onChange={(e) => setEditData({ ...editData, buyLink: e.target.value })}
                                            placeholder="Buy Link"
                                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <select
                                            value={editData.source}
                                            onChange={(e) => setEditData({ ...editData, source: e.target.value })}
                                            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="amazon">Amazon</option>
                                            <option value="flipkart">Flipkart</option>
                                        </select>
                                        <div className="flex gap-2 pt-1">
                                            <button onClick={saveEdit} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700">
                                                <Check size={14} /> Save
                                            </button>
                                            <button onClick={cancelEdit} className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300">
                                                <X size={14} /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* View Mode */
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {p.image ? (
                                                <img src={p.image} alt={p.title} className="w-10 h-10 rounded object-contain bg-white" />
                                            ) : (
                                                <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-gray-500 text-xs">N/A</div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                                                    {p.pinned && <span className="text-blue-600">📌</span>}
                                                    {p.title}
                                                </p>
                                                <p className="text-xs text-gray-500">{p.source}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => startEdit(p)}
                                                className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                                title="Edit product"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleTogglePin(p._id)}
                                                className={`p-2 rounded-lg transition-colors ${p.pinned ? 'text-blue-600 hover:bg-blue-100' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                                                title={p.pinned ? 'Unpin product' : 'Pin product'}
                                            >
                                                {p.pinned ? <PinOff size={16} /> : <Pin size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p._id, p.title)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                title="Delete product"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductForm;
