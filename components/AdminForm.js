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
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow border">
            <h2 className="text-2xl font-bold text-slate-800">{isEdit ? "Edit Product" : "Add New Product"}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-slate-600 mb-1">Product Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="p-3 border rounded-lg outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-slate-600 mb-1">Category</label>
                    <input
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="p-3 border rounded-lg outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-slate-600 mb-1">Price ($)</label>
                    <input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        className="p-3 border rounded-lg outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-slate-600 mb-1">Old Price ($) - Discount</label>
                    <input
                        name="oldPrice"
                        type="number"
                        value={formData.oldPrice}
                        onChange={handleChange}
                        className="p-3 border rounded-lg outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="p-3 border rounded-lg outline-none focus:border-blue-500"
                ></textarea>
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1">Upload Images</label>
                <input type="file" onChange={handleImageUpload} className="mb-2" />
                <div className="flex gap-2 flex-wrap">
                    {formData.images.map((img, idx) => (
                        <img key={idx} src={img} className="w-20 h-20 object-cover rounded border" />
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save Product"}
            </button>
        </form>
    );
}
