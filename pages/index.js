import { useEffect, useState } from "react";
import Link from "next/link";
import StatsCard from "../components/StatsCard";
import Toast from "../components/Toast";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [toast, setToast] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        inStock: 0,
        lowStock: 0,
        featured: 0
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);

            // Calculate stats
            setStats({
                total: data.length,
                inStock: data.filter(p => p.stock > 10).length,
                lowStock: data.filter(p => p.stock > 0 && p.stock <= 10).length,
                featured: data.filter(p => p.featured).length
            });

            setLoading(false);
        } catch (err) {
            setToast({ message: "Failed to load products", type: "error" });
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (confirm("Delete this product?")) {
            try {
                await fetch(`/api/products/${id}`, { method: "DELETE" });
                setToast({ message: "Product deleted successfully!", type: "success" });
                fetchProducts();
            } catch (err) {
                setToast({ message: "Failed to delete product", type: "error" });
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Header */}
            <nav className="sticky top-0 z-40 backdrop-blur-lg border-b" style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderColor: 'var(--border-color)'
            }}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-gradient">HideStyle Admin</h1>
                            <div className="hidden md:flex items-center gap-6 ml-8">
                                <Link href="/" className="nav-link active text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                    Dashboard
                                </Link>
                                <Link href="/add" className="nav-link text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    Products
                                </Link>
                            </div>
                        </div>
                        <Link href="/add">
                            <button className="btn-primary flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Product
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 fade-in">
                    <StatsCard
                        title="Total Products"
                        value={stats.total}
                        color="blue"
                        trend={12}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        }
                    />
                    <StatsCard
                        title="In Stock"
                        value={stats.inStock}
                        color="green"
                        trend={8}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <StatsCard
                        title="Low Stock"
                        value={stats.lowStock}
                        color="orange"
                        trend={-5}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        }
                    />
                    <StatsCard
                        title="Featured"
                        value={stats.featured}
                        color="purple"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        }
                    />
                </div>

                {/* Products Table */}
                <div className="float-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Product Management
                        </h2>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field w-64"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="skeleton h-16"></div>
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p style={{ color: 'var(--text-secondary)' }}>No products found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                                        <th className="text-left py-3 px-4 font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>Product</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>Category</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>Price</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>Stock</th>
                                        <th className="text-right py-3 px-4 font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((p, idx) => (
                                        <tr
                                            key={p._id}
                                            className="border-b transition-colors hover:bg-opacity-50"
                                            style={{
                                                borderColor: 'var(--border-color)',
                                                animation: `fadeIn ${200 + idx * 50}ms ease-out`
                                            }}
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={p.images?.[0] || "https://via.placeholder.com/50"}
                                                        alt={p.name}
                                                        className="w-12 h-12 rounded-lg object-cover shadow-sm"
                                                    />
                                                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{
                                                    background: 'var(--bg-tertiary)',
                                                    color: 'var(--text-secondary)'
                                                }}>
                                                    {p.category || "Uncategorized"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 font-semibold" style={{ color: 'var(--accent-primary)' }}>
                                                ${p.price}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.stock > 10 ? 'bg-green-100 text-green-700' :
                                                        p.stock > 0 ? 'bg-orange-100 text-orange-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {p.stock} units
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/edit/${p._id}`}>
                                                        <button className="p-2 rounded-lg transition-all hover:bg-blue-50 hover:scale-110" style={{ color: 'var(--accent-primary)' }}>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteProduct(p._id)}
                                                        className="p-2 rounded-lg transition-all hover:bg-red-50 hover:scale-110"
                                                        style={{ color: 'var(--error)' }}
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
