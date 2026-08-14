import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Register from "./components2/register";
import Login from "./components2/login";
import Todo from "./components2/todo";

function SafeRouting({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/todo" element={<SafeRouting><Todo /></SafeRouting>} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
