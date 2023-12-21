

import { h } from 'preact';
import Router from 'preact-router';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';

const App = () => {
    return (
        <div id="app">
            <Router>
                <ProductList path="/" />
                <ProductDetail path="/products/:id" />
            </Router>
        </div>
    );
};

export default App;




