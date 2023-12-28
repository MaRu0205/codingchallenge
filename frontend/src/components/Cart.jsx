import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [cartItemsDetails, setCartItemsDetails] = useState({});
    const [orderPlaced, setOrderPlaced] = useState(false);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/product-api/sizes/')
            .then(response => response.json())
            .then(data => setSizes(data));
        fetch('http://127.0.0.1:8000/product-api/colors/')
            .then(response => response.json())
            .then(data => setColors(data));

        fetchOpenCart();
    }, []);

    const fetchOpenCart = async () => {
        const response = await fetch('http://127.0.0.1:8000/cart-api/carts/?status=Open');
        const carts = await response.json();
        if (carts.length) {
            setCart(carts[0]);
            fetchCartItemsDetails(carts[0].items);
        }
    };

    const fetchCartItemsDetails = (cartItems) => {
        cartItems.forEach(item => {
            fetch(`http://127.0.0.1:8000/product-api/products/${item.product}/`)
                .then(response => response.json())
                .then(data => setCartItemsDetails(prevDetails => ({ ...prevDetails, [item.id]: data })));
        });
    };

    const handleRemoveItem = async (itemId) => {
        await fetch(`http://127.0.0.1:8000/cart-api/cart-items/${itemId}/`, { method: 'DELETE' });
        fetchOpenCart();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    };

    const handleOrderCart = async () => {
        if (cart) {
            const updatedCart = {
                ...cart,
                status: 'Ordered'
            };

            await fetch(`http://127.0.0.1:8000/cart-api/carts/${cart.id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCart)
            });

            setCart(null);
            setOrderPlaced(true);
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        }
    };

    const getSizeLabel = (sizeId) => sizes.find(size => size.id === sizeId)?.size || 'Unknown';
    const getColorLabel = (colorId) => colors.find(color => color.id === colorId)?.color || 'Unknown';

    if (orderPlaced) {
        return (
            <div className="container mx-auto text-center py-24">
                <h2 className="text-2xl font-bold">Thanks for your order.</h2>
                <p>Your ordered product will arrive soon :-)</p>
            </div>
        );
    }

    if (!cart || !sizes.length || !colors.length || Object.keys(cartItemsDetails).length < cart.items.length) {
        return <p>Loading cart...</p>;
    }

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex shadow-md my-10">
                    <div className="w-full bg-white px-10 py-10">
                        <div className="flex justify-between border-b pb-8">
                            <h1 className="font-semibold text-2xl">Shopping Cart</h1>
                            <h2 className="font-semibold text-2xl">{cart.items.length} Items</h2>
                        </div>
                        <div className="flex mt-10 mb-5">
                            <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/4">Product Details</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Size/Color</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Quantity</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Price</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Total</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Remove</h3>
                        </div>
                        {cart.items.map(item => {
                            const productDetails = cartItemsDetails[item.id];
                            const sizeLabel = getSizeLabel(item.size);
                            const colorLabel = getColorLabel(item.color);
                            return (
                                <div key={item.id} className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
                                    <div className="w-1/4 flex">
                                        <img className="h-24 w-24 object-cover rounded" src={productDetails.image || 'https://placehold.co/100x100'} alt={productDetails.title} />
                                        <div className="flex flex-col justify-between ml-4 flex-grow">
                                            <span className="font-bold text-sm">{productDetails.title}</span>
                                            <span className="text-sm text-gray-500">{productDetails.description}</span>
                                        </div>
                                    </div>
                                    <div className="w-1/5 text-center">
                                        <span className="font-semibold">{sizeLabel} / {colorLabel}</span>
                                    </div>
                                    <div className="w-1/5 flex justify-center">
                                        <input className="mx-2 border text-center w-8" type="text" value={item.quantity} />
                                    </div>
                                    <span className="w-1/5 text-center font-semibold text-sm">${productDetails.price}</span>
                                    <span className="w-1/5 text-center font-semibold text-sm">${(item.quantity * parseFloat(productDetails.price)).toFixed(2)}</span>
                                    <div className="w-1/5 text-center">
                                        <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 font-semibold">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {cart && cart.items.length > 0 && (
                            <div className="text-center mt-6">
                                <button 
                                    onClick={handleOrderCart} 
                                    className="text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded"
                                >
                                    Order Cart
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Cart;