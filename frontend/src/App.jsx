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
import AlertProvider from "./contexts/AlertContext";
import ProtectedRoute from "./ui_components/ProtectedRoute";
import ValidateUser from "./pages/ValidateUser";
import Account from "./pages/Account";

import { CartProvider } from "./contexts/CartContext";
import Cart from "./pages/Cart";
import UpdateProfile from "./pages/UpdateProfile";

import MyWallet from "./pages/MyWallet";
import MyAddresses from "./pages/MyAddresses";

import ContactUs from "./pages/ContactUs";

import ListOrder from "./pages/OrderList";
import OrderDetail from "./pages/OrderDetail";
import ChangePassword from "./pages/ChangePassword";
import ForgotePassword from "./pages/ForgotePassword";

import MakeSalad from "./pages/MakeSalad";
import MyTransactions from "./pages/MyTransactions";
import AboutUs from "./pages/AboutUs";

function App() {
    return (
        <>
            <AlertProvider>
                <AuthProvider>
                    <CartProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<AppLayout />}>
                                    <Route index element={<Home />} />
                                    <Route
                                        path="/about-us"
                                        element={<AboutUs />}
                                    />
                                    <Route path="/cart" element={<Cart />} />
                                    <Route
                                        path="/makeSalad"
                                        element={<MakeSalad />}
                                    />
                                    <Route
                                        path="/contactUs"
                                        element={<ContactUs />}
                                    />
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

                                    <Route
                                        path="/accounts/forgetPassword"
                                        element={<ForgotePassword />}
                                    />

                                    <Route element={<ProtectedRoute />}>
                                        <Route
                                            path="/accounts"
                                            element={<Account />}
                                        />

                                        <Route
                                            path="/accounts/changePassword"
                                            element={<ChangePassword />}
                                        />

                                        <Route
                                            path="/accounts/profile/edit"
                                            element={<UpdateProfile />}
                                        />

                                        <Route
                                            path="/accounts/validate"
                                            element={<ValidateUser />}
                                        />

                                        <Route
                                            path="/accounts/myWallet"
                                            element={<MyWallet />}
                                        />

                                        <Route
                                            path="/accounts/myAddresses"
                                            element={<MyAddresses />}
                                        />

                                        <Route
                                            path="/accounts/orders"
                                            element={<ListOrder />}
                                        />
                                        <Route
                                            path="/accounts/orders/:id"
                                            element={<OrderDetail />}
                                        />

                                        <Route
                                            path="/accounts/myTransactions"
                                            element={<MyTransactions />}
                                        />
                                    </Route>

                                    <Route path="*" element={<Page404 />} />
                                </Route>
                            </Routes>
                        </BrowserRouter>
                    </CartProvider>
                </AuthProvider>
            </AlertProvider>
        </>
    );
}

export default App;
