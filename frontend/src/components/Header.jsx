import { h, Component } from 'preact';
import { Link } from 'preact-router/match';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            itemCount: 0,
            showCartAddedNotification: false,
        };
    }

    componentDidMount() {
        this.updateItemCount();
        window.addEventListener('cartUpdated', this.updateItemCount.bind(this));
        window.addEventListener('storage', this.handleStorageEvent.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('cartUpdated', this.updateItemCount.bind(this));
        window.removeEventListener('storage', this.handleStorageEvent.bind(this));
    }

    async updateItemCount() {
        const response = await fetch('http://127.0.0.1:8000/cart-api/carts/?status=Open');
        const carts = await response.json();
        if (carts.length && carts[0].items) {
            this.setState({ itemCount: carts[0].items.reduce((acc, item) => acc + item.quantity, 0) });
        } else {
            this.setState({ itemCount: 0 });
        }
    }

    handleStorageEvent() {
        const notification = localStorage.getItem('cartNotification');
        if (notification === 'added') {
            this.setState({ showCartAddedNotification: true });
            setTimeout(() => {
                this.setState({ showCartAddedNotification: false });
                localStorage.removeItem('cartNotification');
            }, 3000);
        }
    }

    render() {
        const { itemCount, showCartAddedNotification } = this.state;

        return (
            <>
                {showCartAddedNotification && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                        <p className="font-bold">Added to Cart</p>
                        <p>The product has been successfully added to your cart.</p>
                    </div>
                )}
                <header className="text-gray-600 body-font">
                    <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                        <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                            <span className="ml-3 text-xl">CodingChallenge</span>
                        </Link>
                        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 flex flex-wrap items-center text-base justify-center">
                            <Link href="/" className="mr-5 hover:text-gray-900">Product List</Link>
                        </nav>
                        <Link href="/cart" className="relative inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full text-xs px-2 py-1">{itemCount}</span>
                            )}
                        </Link>
                    </div>
                </header>
            </>
        );
    }
}

export default Header;