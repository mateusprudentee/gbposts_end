import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Api from "./Api/api"

function Routes2() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/apicheck" element={<Api />} />
      </Routes>
    </Router>
  );
}

export default Routes2;