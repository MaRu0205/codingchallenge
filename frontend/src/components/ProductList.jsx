import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router/match';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/product-api/products/')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap -m-4">
                    {products.map(product => (
                        <div key={product.id} className="lg:w-1/4 md:w-1/2 p-4 w-full">
                            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-4"> {/* Add padding around the image */}
                                    <img 
                                        alt={product.title} 
                                        className="object-cover object-center w-full h-full block"  // Ensure image fills the padded area
                                        src={product.image || 'https://placehold.co/300x300'}
                                    />
                                </div>
                                
                                {/* Grey Line */}
                                <div className="w-4/5 mx-auto h-px bg-gray-300"></div> 

                                <div className="p-6">
                                    <h2 className="text-gray-900 title-font text-lg font-medium">{product.title}</h2>
                                    <p className="mt-1">${product.price}</p>
                                    <Link href={`/products/${product.id}`} class="text-blue-500 inline-flex items-center mt-3">
                                        View Details
                                        {/* Optional: Add an icon or arrow for the link here */}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductList;