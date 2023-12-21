
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const ProductDetail = ({ id }) => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/product-api/products/${id}/`)
            .then(response => response.json())
            .then(data => setProduct(data))
            .catch(error => console.error('Error fetching product:', error));
    }, [id]);

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <a href="/" className="text-blue-600 hover:text-blue-800">Back to Product List</a>
            <h1 className="text-3xl font-bold my-4">{product.title}</h1>
            <img src={product.image || 'https://placehold.co/400x400'} alt={product.title} className="w-full h-64 object-cover mb-2" />
            <p className="text-lg text-blue-600">${product.price}</p>
            <p className="text-gray-700">{product.description}</p>
            
            {/* Size Dropdown */}
            <div className="my-4">
                <label htmlFor="size-select" className="block mb-2">Size:</label>
                <select id="size-select" className="border rounded p-2">
                    {product.available_sizes.map(size => (
                        <option key={size.id} value={size.size}>{size.size}</option>
                    ))}
                </select>
            </div>

            {/* Color Dropdown */}
            <div className="my-4">
                <label htmlFor="color-select" className="block mb-2">Color:</label>
                <select id="color-select" className="border rounded p-2">
                    {product.available_colors.map(color => (
                        <option key={color.id} value={color.color}>{color.color}</option>
                    ))}
                </select>
            </div>

            {/* Additional product details can be added here */}
        </div>
    );
};

export default ProductDetail;



