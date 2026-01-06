import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminForm from "../../components/AdminForm";

export default function EditProduct() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`/api/products/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    setProduct(data);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p style={{ color: 'var(--text-secondary)' }}>Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
                <div className="text-center">
                    <p className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Product not found</p>
                    <button onClick={() => router.push("/")} className="btn-primary">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return <AdminForm product={product} isEdit={true} />;
}
