import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router/match';

const Header = () => {
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        // Fetch the number of items in the cart
        // This should be replaced with your actual API call
        const fetchCartItems = async () => {
            const response = await fetch('http://127.0.0.1:8000/cart-api/carts/?status=Open');
            const carts = await response.json();
            if (carts.length && carts[0].items) {
                setCartItemCount(carts[0].items.reduce((acc, item) => acc + item.quantity, 0));
            }
        };

        fetchCartItems();
    }, []); // Run once on component mount

    return (
        <header class="text-gray-600 body-font">
            <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                {/* Logo and Brand Name */}
                <Link href="/" class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    {/* Logo SVG here */}
                    <span class="ml-3 text-xl">CodingChallenge</span>
                </Link>

                {/* Navigation Links */}
                <nav class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 flex flex-wrap items-center text-base justify-center">
                    <Link href="/" class="mr-5 hover:text-gray-900">Product List</Link>
                    {/* Other links can be added here */}
                </nav>

                {/* Cart Link with Icon and Item Count */}
                <Link href="/cart" class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    {cartItemCount > 0 && (
                        <span class="bg-blue-500 text-white rounded-full text-xs px-2 py-1 ml-2">{cartItemCount}</span>
                    )}
                </Link>
            </div>
        </header>
    );
};

export default Header;




