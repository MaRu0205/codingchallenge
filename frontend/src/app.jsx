import { h } from 'preact';
import Router from 'preact-router';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Register from './components/Register';
import MyAccount from './components/MyAccount';


const App = () => {
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






