


import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/product-api/products/')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Product List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                    <div key={product.id} className="border rounded shadow hover:shadow-md p-4">
                        {/* Product Image */}
                        <img src={product.image || 'https://placehold.co/50x50'} alt={product.title} className="w-full h-64 object-cover mb-2" />

                        {/* Product Title */}
                        <h2 className="font-semibold text-lg">{product.title}</h2>

                        {/* Product Price */}
                        <p className="text-lg text-blue-600">${product.price}</p>

                        {/* Product Description */}
                        <p className="text-gray-700">{product.description}</p>

                        {/* View Details Button */}
                        <div className="text-right mt-4">
                            <a href={`/products/${product.id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Product Detail
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;

