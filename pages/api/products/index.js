import dbConnect from "../../../lib/dbConnect";
import Product from "../../../models/Product";

export default async function handler(req, res) {
    const { method } = req;
    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const products = await Product.find({}).sort({ createdAt: -1 });
                res.status(200).json(products);
            } catch (err) {
                res.status(500).json({ error: "Failed to fetch products" });
            }
            break;
        case "POST":
            try {
                const product = await Product.create(req.body);
                res.status(201).json(product);
            } catch (err) {
                res.status(500).json({ error: "Failed to create product" });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
