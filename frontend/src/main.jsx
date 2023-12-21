import './index.css'; // Importing the CSS file with Tailwind directives
import { h, render } from 'preact';
import App from './app';

const root = document.getElementById('app');

render(<App />, root);

