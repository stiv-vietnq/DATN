import { BrowserRouter as Router } from "react-router-dom";
import './App.css';
import AppRouter from './routes/AppRouter';
import { ToastProvider } from "./components/toastProvider/ToastProvider";

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppRouter />
      </Router>
    </ToastProvider>
  )
}

export default App
