import { h, Component } from 'preact';
import { Link } from 'preact-router/match';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            itemCount: 0,
        };
    }

    componentDidMount() {
        this.updateItemCount();
        window.addEventListener('cartUpdated', this.updateItemCount.bind(this));
        window.addEventListener('authChange', this.handleAuthChange.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('cartUpdated', this.updateItemCount.bind(this));
        window.removeEventListener('authChange', this.handleAuthChange.bind(this));
    }

    handleAuthChange = () => {
        this.setState({ isLoggedIn: !!localStorage.getItem('accessToken') });
        this.updateItemCount(); // Update cart count on auth change
    }

    updateItemCount = async () => {
        const sessionKey = localStorage.getItem('sessionKey');
        const userId = localStorage.getItem('userId'); // Assuming you store user ID in local storage upon login

        let query = userId ? `?user=${userId}` : `?session_key=${sessionKey}`;
        const response = await fetch(`http://127.0.0.1:8000/cart-api/carts/${query}&status=Open`);
        const carts = await response.json();
        
        if (carts.length && carts[0].items) {
            this.setState({ itemCount: carts[0].items.reduce((acc, item) => acc + item.quantity, 0) });
        } else {
            this.setState({ itemCount: 0 });
        }
    };

    handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            await fetch('http://127.0.0.1:8000/customer-api/logout/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            window.location.href = '/'; // Redirect to home
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    render() {
        const { itemCount, isLoggedIn } = this.state;
        // const isLoggedIn = !!localStorage.getItem('accessToken');

        return (
            <header className="text-gray-600 body-font">
                <div className="container mx-auto flex flex-wrap p-5 items-center justify-between md:flex-row flex-col">
                    {/* Site Title */}
                    <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-2 md:mb-0 md:order-1">
                        <span className="text-xl">CodingChallenge</span>
                    </Link>

                    {/* Search Field */}
                    <div className="relative mx-auto text-gray-600 md:order-2 md:flex-grow" style={{ maxWidth: '600px' }}>
                        <input 
                            className="border-2 border-gray-300 bg-white h-10 pl-5 pr-10 rounded-lg text-sm focus:outline-none w-full"
                            type="search" 
                            name="search" 
                            placeholder="What are you looking for?"
                        />
                        <button type="submit" className="absolute right-0 top-0 mt-2 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </div>


                    <div className="flex items-center md:order-3 order-4 mt-2 md:mt-0">
                        {/* Placeholder Button */}
                        <button className="relative inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base ml-5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </button>

                        {/* My Account/Register Button */}
                        <Link href={isLoggedIn ? "/myaccount" : "/register"} className="relative inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base ml-5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </Link>

                        {/* Cart Button */}
                        <Link href="/cart" className="relative inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base ml-5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full text-xs px-2 py-1">{itemCount}</span>
                            )}
                        </Link>

                        {/* Login/Logout Button */}
                        {isLoggedIn ? (
                            <button onClick={this.handleLogout} className="relative inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base ml-5">
                                Logout
                            </button>
                        ) : (
                            <Link href="/register" className="relative inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base ml-5">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;