import { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { fetchProducts } from '../api';
import { Product } from '../types';

export const Store = () => {
    const [products, setProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchProducts().then(res => {
            if (res.success) {
                // Sort: pinned products first, then by createdAt
                const sorted = [...res.data].sort((a, b) => {
                    if (a.pinned && !b.pinned) return -1;
                    if (!a.pinned && b.pinned) return 1;
                    return 0;
                });
                setProducts(sorted);
            } else {
                setError(true);
            }
        }).catch(() => setError(true)).finally(() => setLoading(false));
    }, []);

    const pinnedProducts = products.filter(p => p.pinned);
    const otherProducts = products.filter(p => !p.pinned);

    return (
        <div className="pt-24 px-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4 text-gray-900">GoTechy Store</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Curated gadgets and tech essentials reviewed by us.
                </p>
            </div>

            {/* Pinned / Featured Products */}
            {pinnedProducts.length > 0 && (
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        📌 Featured Picks
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pinnedProducts.map((product, idx) => (
                            <ProductCard
                                key={idx}
                                type="product"
                                {...product}
                                link={product.buyLink}
                                meta2={product.source}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* All Other Products */}
            {otherProducts.length > 0 && (
                <div>
                    {pinnedProducts.length > 0 && (
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Products</h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
                        {otherProducts.map((product, idx) => (
                            <ProductCard
                                key={idx}
                                type="product"
                                {...product}
                                link={product.buyLink}
                                meta2={product.source}
                            />
                        ))}
                    </div>
                </div>
            )}

            {loading && (
                <p className="text-center text-gray-500">Loading products...</p>
            )}
            {!loading && error && (
                <p className="text-center text-red-500">Failed to load products.</p>
            )}
            {!loading && !error && products.length === 0 && (
                <p className="text-center text-gray-500">No products available at the moment.</p>
            )}
        </div>
    );
};
