import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { CompareProvider } from './context/CompareContext.jsx';

// Layout & Common Components
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import CompareBar from './components/product/CompareBar.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderTrackingPage from './pages/OrderTrackingPage.jsx';
import ComparePage from './pages/ComparePage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-md">
      <h1 className="text-6xl font-black text-brand-600 dark:text-brand-400">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-2">
        The electronics page or product you were searching for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white transition-colors duration-200">
                  <Navbar />
                  
                  <main className="flex-1">
                    <ErrorBoundary>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<CatalogPage />} />
                        <Route path="/product/:slug" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/orders/track/:orderNumber" element={<OrderTrackingPage />} />
                        <Route path="/track-order" element={<OrderTrackingPage />} />
                        <Route path="/compare" element={<ComparePage />} />
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </ErrorBoundary>
                  </main>

                  <CompareBar />
                  <Footer />
                </div>
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
