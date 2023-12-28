import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const ProductDetail = ({ id }) => {
    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/product-api/products/${id}/`)
            .then(response => response.json())
            .then(data => {
                setProduct(data);
                if (data.articles.length > 0) {
                    const firstArticle = data.articles[0];
                    setSelectedArticle(firstArticle);
                    setSelectedColor(firstArticle.color);
                    setSelectedSize(firstArticle.size);
                }
            })
            .catch(error => console.error('Error fetching product:', error));
    }, [id]);

    useEffect(() => {
        if (product) {
            const article = product.articles.find(a => a.color === selectedColor && a.size === selectedSize);
            setSelectedArticle(article || product.articles.find(a => a.color === selectedColor));
        }
    }, [selectedColor, selectedSize, product]);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        const sizesInSelectedColor = product.articles.filter(article => article.color === color).map(article => article.size);
        if (!sizesInSelectedColor.includes(selectedSize)) {
            setSelectedSize(sizesInSelectedColor[0]);
        }
    };

    const renderColorOptions = () => {
        const uniqueColors = Array.from(new Set(product.articles.map(a => a.color)));
        const colorImages = uniqueColors.map(color => ({
            color,
            image: product.articles.find(article => article.color === color).image || 'https://dummyimage.com/400x400'
        }));

        return colorImages.map(colorImage => (
            <img
                key={colorImage.color}
                src={colorImage.image}
                alt={colorImage.color}
                onClick={() => handleColorSelect(colorImage.color)}
                className={`object-cover w-16 h-16 rounded-full m-2 cursor-pointer ${selectedColor === colorImage.color ? 'ring-2 ring-blue-500' : ''}`}
            />
        ));
    };

    const renderSizeOptions = () => {
        const sizesInSelectedColor = Array.from(new Set(product.articles.filter(article => article.color === selectedColor).map(article => article.size)));
        return sizesInSelectedColor.map(size => (
            <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`p-2 m-1 border rounded ${selectedSize === size ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
            >
                {size}
            </button>
        ));
    };

    const addToCart = async () => {
        let openCart = null;

        // Check for an open cart
        const cartResponse = await fetch('http://127.0.0.1:8000/cart-api/carts/?status=Open');
        const carts = await cartResponse.json();
        if (carts.length > 0) {
            openCart = carts[0];
        } else {
            // Create a new cart
            const newCartResponse = await fetch('http://127.0.0.1:8000/cart-api/carts/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: null, status: 'Open', items: [] })
            });
            openCart = await newCartResponse.json();
        }

        // Add the article to the cart
        await fetch('http://127.0.0.1:8000/cart-api/cart-items/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cart: openCart.id,
                article: selectedArticle.id,
                quantity: 1,
                size: selectedArticle.size,
                color: selectedArticle.color,
                gtin: selectedArticle.gtin,
                name: selectedArticle.name
            })
        });

        // Dispatch the custom event to update the cart count
        window.dispatchEvent(new Event('cartUpdated'));
    };

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <section className="text-gray-600 body-font overflow-hidden">
            <div className="container px-5 py-24 mx-auto">
                <div className="lg:w-4/5 mx-auto flex flex-wrap">
                    <img alt={selectedArticle?.name} className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src={selectedArticle?.image || 'https://dummyimage.com/400x400'} />
                    <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{selectedArticle?.name}</h1>
                        <p className="leading-relaxed">{product.description}</p>
                        <p className="mt-1 mb-4 text-lg">GTIN: {selectedArticle?.gtin}</p>
                        <div className="flex flex-wrap mt-4">
                            {renderColorOptions()}
                        </div>
                        <div className="flex flex-wrap mt-4">
                            {renderSizeOptions()}
                        </div>
                        <button onClick={addToCart} className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;