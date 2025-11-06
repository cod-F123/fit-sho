import "./App.css";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import AppLayout from "./ui_components/AppLayout";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Page404 from "./pages/Page404";
import PackageDetail from "./pages/PakageDetail";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./ui_components/ProtectedRoute";
import ValidateUser from "./pages/ValidateUser";
import Account from "./pages/Account";

import { CartProvider } from "./contexts/CartContext";
import Cart from "./pages/Cart";
import UpdateProfile from "./pages/UpdateProfile";

function App() {
    return (
        <>
            <AuthProvider>
                <CartProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<AppLayout />}>
                                <Route index element={<Home />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route
                                    path="/packages"
                                    element={<Packages />}
                                />
                                <Route
                                    path="/packages/detail/:id"
                                    element={<PackageDetail />}
                                />
                                <Route
                                    path="/products"
                                    element={<Products />}
                                />
                                <Route
                                    path="/products/detail/:id"
                                    element={<ProductDetail />}
                                />

                                <Route
                                    path="/accounts/login"
                                    element={<Login />}
                                />
                                <Route
                                    path="/accounts/register"
                                    element={<Register />}
                                />

                                <Route element={<ProtectedRoute />}>
                                    <Route
                                        path="/accounts"
                                        element={<Account />}
                                    />
                                    <Route path="/accounts/profile/edit" element={<UpdateProfile />} />
                                    <Route
                                        path="/accounts/validate"
                                        element={<ValidateUser />}
                                    />
                                </Route>

                                <Route path="*" element={<Page404 />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </CartProvider>
            </AuthProvider>
        </>
    );
}

export default App;
