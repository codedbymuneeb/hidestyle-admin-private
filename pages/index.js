import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
        setLoading(false);
    };

    const deleteProduct = async (id) => {
        if (confirm("Delete this product?")) {
            await fetch(`/api/products/${id}`, { method: "DELETE" });
            fetchProducts();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <nav className="bg-slate-900 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <span className="text-xl font-bold">HideStyle Admin</span>
                    <Link href="/add" className="bg-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-700">
                        + Add Product
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6 text-slate-800">Product Management</h1>

                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : (
                    <div className="bg-white rounded-xl shadow border overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-4">Product</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {products.map((p) => (
                                    <tr key={p._id}>
                                        <td className="p-4 flex items-center gap-3">
                                            <img src={p.images[0]} className="w-10 h-10 object-cover rounded" />
                                            <span className="font-medium">{p.name}</span>
                                        </td>
                                        <td className="p-4 text-slate-500">{p.category}</td>
                                        <td className="p-4 font-bold text-blue-600">${p.price}</td>
                                        <td className="p-4 space-x-2">
                                            <Link href={`/edit/${p._id}`} className="text-blue-600 hover:underline">Edit</Link>
                                            <button onClick={() => deleteProduct(p._id)} className="text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
