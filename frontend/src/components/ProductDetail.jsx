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
        <section class="text-gray-600 body-font overflow-hidden">
            <div class="container px-5 py-24 mx-auto">
                <div class="lg:w-4/5 mx-auto flex flex-wrap">
                    <img alt="ecommerce" class="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src={product.image || 'https://dummyimage.com/300x300'} />
                    <div class="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
                        <h2 class="text-sm title-font text-gray-500 tracking-widest">BRAND NAME</h2>
                        <h1 class="text-gray-900 text-3xl title-font font-medium mb-4">{product.title}</h1>
                        <div class="flex mb-4">
                            <a class="flex-grow text-blue-500 border-b-2 border-blue-500 py-2 text-lg px-1">Description</a>
                            <a class="flex-grow border-b-2 border-gray-300 py-2 text-lg px-1">Reviews</a>
                            <a class="flex-grow border-b-2 border-gray-300 py-2 text-lg px-1">Details</a>
                        </div>
                        <p class="leading-relaxed mb-4">{product.description}</p>
                        
                        {/* Size Dropdown */}
                        <div class="flex border-t border-gray-200 py-2">
                            <span class="text-gray-500">Size</span>
                            <select id="size-select" class="ml-auto border rounded p-2">
                                {product.available_sizes.map(size => (
                                    <option key={size.id} value={size.size}>{size.size}</option>
                                ))}
                            </select>
                        </div>

                        {/* Color Dropdown */}
                        <div class="flex border-t border-gray-200 py-2">
                            <span class="text-gray-500">Color</span>
                            <select id="color-select" class="ml-auto border rounded p-2">
                                {product.available_colors.map(color => (
                                    <option key={color.id} value={color.color}>{color.color}</option>
                                ))}
                            </select>
                        </div>

                        <div class="flex border-t border-b mb-6 border-gray-200 py-2">
                            <span class="text-gray-500">Quantity</span>
                            <span class="ml-auto text-gray-900">4</span> {/* Placeholder for quantity */}
                        </div>
                        <div class="flex">
                            <span class="title-font font-medium text-2xl text-gray-900">${product.price}</span>
                            <button class="flex ml-auto text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded">Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;




