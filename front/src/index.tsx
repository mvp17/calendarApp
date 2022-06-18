import { createRoot, Root } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App';


const container = document.getElementById("root");
const root: Root = createRoot(container!);
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
    );
