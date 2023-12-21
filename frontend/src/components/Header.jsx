import { h } from 'preact';
import { Link } from 'preact-router/match'; // Import Link component

const Header = () => {
    return (
        <header class="text-gray-600 body-font">
            <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                {/* Logo and Brand Name */}
                <Link href="/" class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"> {/* Updated this line */}
                    {/* Logo SVG here */}
                    <span class="ml-3 text-xl">CodingChallenge</span>
                </Link> {/* Updated this line */}

                {/* Navigation Links */}
                <nav class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 flex flex-wrap items-center text-base justify-center">
                    <Link href="/" class="mr-5 hover:text-gray-900">Product List</Link> {/* Updated this line */}
                    <a class="mr-5 hover:text-gray-900">Second Link</a>
                    <a class="mr-5 hover:text-gray-900">Third Link</a>
                    <a class="mr-5 hover:text-gray-900">Fourth Link</a>
                </nav>

                {/* Action Button */}
                <button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    Cart
                    {/* Button SVG here */}
                </button>
            </div>
        </header>
    );
};

export default Header;

