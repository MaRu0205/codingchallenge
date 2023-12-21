import { h } from 'preact';
import Router from 'preact-router';
import Header from './components/Header'; // Import the Header component
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';

const App = () => {
    return (
        <div id="app">
            <Header /> {/* Render the Header */}
            <Router>
                <ProductList path="/" />
                <ProductDetail path="/products/:id" />
            </Router>
        </div>
    );
};

export default App;





