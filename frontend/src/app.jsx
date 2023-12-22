import { h } from 'preact';
import Router from 'preact-router';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';


const App = () => {
    return (
        <div id="app">
            <Header />
            <Router>
                <ProductList path="/" />
                <ProductDetail path="/products/:id" />
                <Cart path="/cart" />
            </Router>
        </div>
    );
};

export default App;






