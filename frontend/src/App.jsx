import { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import AppLayout from "./ui_components/AppLayout";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Page404 from "./pages/Page404";
import PackageDetail from "./pages/PakageDetail";
import Products from "./pages/products";
import ProductDetail from "./pages/ProductDetail";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AppLayout />}>
						<Route index element={<Home />} />
						<Route path="/packages" element={<Packages />} />
						<Route path="/packages/detail/:id" element={<PackageDetail />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/detail/:id" element={<ProductDetail />} />
						<Route path="*" element={<Page404 />} />
					</Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
