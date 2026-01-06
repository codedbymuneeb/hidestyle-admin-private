import { useState } from "react";
import { useRouter } from "next/router";

export default function AdminForm({ product = {}, isEdit = false }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: product.name || "",
        category: product.category || "",
        price: product.price || 0,
        oldPrice: product.oldPrice || 0,
        description: product.description || "",
        stock: product.stock || 0,
        featured: product.featured || false,
        images: product.images || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "hidestyle_preset");

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: data,
                }
            );
            const fileData = await res.json();
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, fileData.secure_url],
            }));
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const url = isEdit ? `/api/products/${product._id}` : "/api/products";
        const method = isEdit ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/");
            }
        } catch (err) {
            console.error("Failed to save product", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-8 px-6" style={{ background: 'var(--bg-primary)' }}>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 mb-4 transition-all hover:gap-3"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        {isEdit ? "Edit Product" : "Add New Product"}
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="float-card p-8 space-y-6">
                    {/* Product Name & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                Product Name *
                            </label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Premium T-Shirt"
                                className="input-field"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                Category
                            </label>
                            <input
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g. Apparel"
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Price & Old Price */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                Price ($) *
                            </label>
                            <input
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                Old Price ($)
                            </label>
                            <input
                                name="oldPrice"
                                type="number"
                                value={formData.oldPrice}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                Stock
                            </label>
                            <input
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="input-field resize-none"
                            placeholder="Describe your product..."
                        ></textarea>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                            Product Images
                        </label>
                        <div className="border-2 border-dashed rounded-xl p-6 text-center transition-all hover:border-blue-400" style={{ borderColor: 'var(--border-color)' }}>
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                                accept="image/*"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                                <svg className="w-12 h-12 mx-auto mb-2" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    {loading ? "Uploading..." : "Click to upload image"}
                                </p>
                            </label>
                        </div>
                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={img}
                                            alt={`Product ${idx + 1}`}
                                            className="w-full h-24 object-cover rounded-lg shadow-sm transition-transform group-hover:scale-105"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                images: prev.images.filter((_, i) => i !== idx)
                                            }))}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Featured Toggle */}
                    <div className="flex items-center gap-3 p-4 rounded-xl transition-colors hover:bg-opacity-50" style={{ background: 'var(--bg-tertiary)' }}>
                        <input
                            name="featured"
                            type="checkbox"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="w-5 h-5 rounded transition-all cursor-pointer"
                            style={{ accentColor: 'var(--accent-primary)' }}
                            id="featured-checkbox"
                        />
                        <label htmlFor="featured-checkbox" className="font-medium cursor-pointer flex-grow" style={{ color: 'var(--text-primary)' }}>
                            Mark as Featured Product
                        </label>
                        <svg className="w-5 h-5" style={{ color: 'var(--warning)' }} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            isEdit ? "Update Product" : "Create Product"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
