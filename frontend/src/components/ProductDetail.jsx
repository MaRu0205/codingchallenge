import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';


const ProductDetail = ({ id }) => {
    const [product, setProduct] = useState(null);
    const [selectedSizeId, setSelectedSizeId] = useState(null);
    const [selectedColorId, setSelectedColorId] = useState(null);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/product-api/products/${id}/`)
            .then(response => response.json())
            .then(data => {
                setProduct(data);
                if (data.available_sizes.length > 0) {
                    setSelectedSizeId(data.available_sizes[0].id);
                }
                if (data.available_colors.length > 0) {
                    setSelectedColorId(data.available_colors[0].id);
                }
            })
            .catch(error => console.error('Error fetching product:', error));
    }, [id]);

    const handleAddToCart = async () => {
        const productId = parseInt(id, 10);
        const response = await fetch('http://127.0.0.1:8000/cart-api/carts/?status=Open');
        const carts = await response.json();
        let cartId = carts.length ? carts[0].id : null;

        const cartItemData = {
            cart: cartId,
            product: productId,
            quantity: 1,
            size: parseInt(selectedSizeId, 10),
            color: parseInt(selectedColorId, 10)
        };

        if (cartId) {
            await fetch('http://127.0.0.1:8000/cart-api/cart-items/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cartItemData)
            });
        } else {
            const newCartResponse = await fetch('http://127.0.0.1:8000/cart-api/carts/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: [] })
            });
            const newCart = await newCartResponse.json();
            cartItemData.cart = newCart.id;
            await fetch('http://127.0.0.1:8000/cart-api/cart-items/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cartItemData)
            });
        }

        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    };

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <section className="text-gray-600 body-font overflow-hidden">
            <div className="container px-5 py-24 mx-auto">
                <div className="lg:w-4/5 mx-auto flex flex-wrap">
                    <img alt={product.title} className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src={product.image || 'https://dummyimage.com/300x300'} />
                    <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{product.title}</h1>
                        <p className="leading-relaxed">{product.description}</p>
                        <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                            <div className="flex">
                                <span className="mr-3">Size</span>
                                <select value={selectedSizeId} onChange={(e) => setSelectedSizeId(e.target.value)} className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-base pl-3 pr-10">
                                    {product.available_sizes.map(size => (
                                        <option key={size.id} value={size.id}>{size.size}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex ml-6 items-center">
                                <span className="mr-3">Color</span>
                                <select value={selectedColorId} onChange={(e) => setSelectedColorId(e.target.value)} className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-base pl-3 pr-10">
                                    {product.available_colors.map(color => (
                                        <option key={color.id} value={color.id}>{color.color}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex">
                            <span className="title-font font-medium text-2xl text-gray-900">${product.price}</span>
                            <button onClick={handleAddToCart} className="flex ml-auto text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded">Add to Cart</button>
                        </div>
                        {showNotification && (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                                <p className="font-bold">Added to Cart</p>
                                <p>The product has been successfully added to your cart.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;



