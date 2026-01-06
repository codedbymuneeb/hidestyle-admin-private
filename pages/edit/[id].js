import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminForm from "../../components/AdminForm";

export default function EditProduct() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`/api/products/${id}`)
                .then((res) => res.json())
                .then((data) => setProduct(data));
        }
    }, [id]);

    if (!product) return <div className="p-20 text-center">Loading product...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-2xl mx-auto">
                <AdminForm product={product} isEdit={true} />
            </div>
        </div>
    );
}
