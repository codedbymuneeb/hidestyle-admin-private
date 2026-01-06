import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    description: { type: String },
    images: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
