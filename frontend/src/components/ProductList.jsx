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
                            <a className="block relative h-48 rounded overflow-hidden">
                                <img 
                                    alt={product.title} 
                                    className="object-cover object-center w-full h-full block" 
                                    src={product.image || 'https://placehold.co/300x300'}
                                />
                            </a>
                            <div className="mt-4">
                                <h2 className="text-gray-900 title-font text-lg font-medium">{product.title}</h2>
                                <p className="mt-1">${product.price}</p>
                                <Link href={`/products/${product.id}`} class="flex ml-auto text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductList;



