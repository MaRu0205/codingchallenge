import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const fetchOpenCart = async () => {
        const sessionKey = localStorage.getItem('sessionKey');
        const userId = localStorage.getItem('userId');

        let query = userId ? `?user=${userId}` : `?session_key=${sessionKey}`;
        const response = await fetch(`http://127.0.0.1:8000/cart-api/carts/${query}&status=Open`);
        const carts = await response.json();
        if (carts.length) {
            setCart(carts[0]);
        }
    };

    useEffect(() => {
        fetchOpenCart();

        const handleLogin = () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                updateCartWithUserId(userId);
            }
        };

        window.addEventListener('authChange', handleLogin);

        return () => {
            window.removeEventListener('authChange', handleLogin);
        };
    }, []);

    const updateCartWithUserId = async (userId) => {
        if (cart && !cart.user) {
            await fetch(`http://127.0.0.1:8000/cart-api/carts/${cart.id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: userId })
            });
            fetchOpenCart();
        }
    };

    const handleUpdateQuantity = async (itemId, cartId, articleId, newQuantity) => {
        await fetch(`http://127.0.0.1:8000/cart-api/cart-items/${itemId}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cart: cartId,
                article: articleId,
                quantity: parseInt(newQuantity, 10)
            })
        });
        fetchOpenCart();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    };
    
    const handleRemoveItem = async (itemId) => {
        await fetch(`http://127.0.0.1:8000/cart-api/cart-items/${itemId}/`, { method: 'DELETE' });
        fetchOpenCart();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    };

    const handleOrderCart = async () => {
        const userId = localStorage.getItem('userId');
        if (cart) {
            // Update the cart with the user ID if not already done
            if (!cart.user && userId) {
                await updateCartWithUserId(userId);
            }
    
            // Create a new object for the updated cart
            const updatedCart = {
                id: cart.id,
                user: cart.user || userId, // Use the user ID from the cart or the one from localStorage
                created_at: cart.created_at,
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

    if (orderPlaced) {
        return (
            <div className="container mx-auto text-center py-24">
                <h2 className="text-2xl font-bold">Thanks for your order.</h2>
                <p>Your ordered products will arrive soon :-)</p>
            </div>
        );
    }

    // Check if the cart is empty
    const isCartEmpty = cart && cart.items && cart.items.length === 0;

    if (orderPlaced) {
        return (
            <div className="container mx-auto text-center py-24">
                <h2 className="text-2xl font-bold">Thanks for your order.</h2>
                <p>Your ordered products will arrive soon :-)</p>
            </div>
        );
    }

    if (!cart) {
        return <p>Loading cart...</p>;
    }

    if (isCartEmpty) {
        return (
            <div className="container mx-auto text-center py-24">
                <h2 className="text-2xl font-bold">Your cart is empty.</h2>
                <p>Let's start shopping :-)</p>
            </div>
        );
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
                            <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">Product Details</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Quantity</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Price</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Remove</h3>
                        </div>
                        {cart.items.map(item => (
                            <div key={item.id} className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
                                <div className="w-2/5 flex">
                                    {/* Use the actual image URL from the cart item */}
                                    <img className="h-24 w-24 object-cover rounded" src={item.image} alt={item.name} />
                                    <div className="flex flex-col justify-between ml-4 flex-grow">
                                        <span className="font-bold text-sm">{item.name}</span>
                                        <span className="text-sm text-gray-500">Size: {item.size}, Color: {item.color}</span>
                                        <span className="text-sm text-gray-500">GTIN: {item.gtin}</span>
                                    </div>
                                </div>
                               <div className="w-1/5 flex justify-center">
                                    <input
                                        className="mx-2 border text-center w-8"
                                        type="text"
                                        value={item.quantity}
                                        onChange={(e) => handleUpdateQuantity(item.id, cart.id, item.article, e.target.value)}
                                    />
                                </div>
                                <span className="w-1/5 text-center font-semibold text-sm">${item.price}</span>
                                <div className="w-1/5 text-center">
                                    <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 font-semibold">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        {cart && cart.items.length > 0 && (
                            <div className="text-center mt-6">
                                <button 
                                    onClick={handleOrderCart} 
                                    className="text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded">
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