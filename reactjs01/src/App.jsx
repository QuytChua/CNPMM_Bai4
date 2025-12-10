import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./components/context/AuthContext";
import { HomeProvider } from "./components/context/HomeContext";
import MainLayout from "./components/layout/MainLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AddProduct from "./pages/AddProduct";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <HomeProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/add-product"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </HomeProvider>
    </AuthProvider>
  );
}
