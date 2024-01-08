import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import Router from 'preact-router';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Register from './components/Register';
import MyAccount from './components/MyAccount';

const App = () => {
    useEffect(() => {
        initializeSessionKey();
    }, []);

    const initializeSessionKey = () => {
        const existingKey = localStorage.getItem('sessionKey');
        if (!existingKey) {
            const newKey = uuidv4(); // Generate a new UUID
            localStorage.setItem('sessionKey', newKey);
        }
    };

    return (
        <div id="app">
            <Header />
            <Router>
                <ProductList path="/" />
                <ProductDetail path="/products/:id" />
                <Cart path="/cart" />
                <Register path="/register" />
                <MyAccount path="/myaccount" />
            </Router>
        </div>
    );
};

export default App;