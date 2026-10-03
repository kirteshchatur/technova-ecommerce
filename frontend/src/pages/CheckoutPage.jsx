import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, MapPin, Truck, CreditCard, ShieldCheck, 
  ArrowRight, ArrowLeft, QrCode, Building, Wallet, Sparkles, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, coupon, couponDiscount, taxAmount, shippingFee, finalTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [step, setStep] = useState(1); // 1: Address, 2: Shipping, 3: Payment, 4: Confirmed
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Address form
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '+91 9876543210',
    addressLine: 'Flat 402, Skyline Towers, Cyber City',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103'
  });

  // Simulated payment inputs
  const [upiId, setUpiId] = useState('alex.morgan@oksbi');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4532 8901 2345 6789',
    cardName: 'Alex Morgan',
    expiry: '08/29',
    cvv: '892'
  });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  useEffect(() => {
    if (items.length === 0 && step !== 4) {
      navigate('/cart');
    }
  }, [items, step, navigate]);

  // Handle final order submission
  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      addToast('Please log in to complete your order.', 'error');
      navigate('/auth?redirect=/checkout');
      return;
    }

    try {
      setPlacingOrder(true);
      const payload = {
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId || null,
          quantity: i.quantity,
          name: i.name
        })),
        shippingAddress: address,
        shippingMethod,
        paymentMethod,
        couponCode: coupon?.code || null
      };

      const res = await api.createOrder(payload);
      if (res.success && res.order) {
        setConfirmedOrder(res.order);
        setStep(4);
        clearCart();

        // Celebration Confetti!
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      addToast(err.message || 'Order placement failed', 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
      {/* Wizard Progress Bar */}
      <div className="flex items-center justify-between relative max-w-2xl mx-auto px-4">
        {[
          { num: 1, label: 'Delivery' },
          { num: 2, label: 'Shipping' },
          { num: 3, label: 'Payment' },
          { num: 4, label: 'Confirmed' }
        ].map((s, idx) => (
          <div key={s.num} className="flex flex-col items-center relative z-10">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step > s.num
                  ? 'bg-emerald-600 text-white shadow-md'
                  : step === s.num
                  ? 'bg-brand-600 text-white shadow-md ring-4 ring-brand-500/20'
                  : 'bg-gray-200 dark:bg-slate-800 text-gray-500'
              }`}
            >
              {step > s.num ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span className={`text-[11px] font-semibold mt-1.5 ${step >= s.num ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
        ))}
        {/* Connector line */}
        <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-200 dark:bg-slate-800 -z-0"></div>
      </div>

      {/* STEP 1: Delivery Address */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Delivery Address</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">Where should we deliver your order?</p>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={address.fullName}
                onChange={(e) => setAddress(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={address.phone}
                onChange={(e) => setAddress(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Street Address / Flat / Building</label>
              <input
                type="text"
                required
                value={address.addressLine}
                onChange={(e) => setAddress(prev => ({ ...prev, addressLine: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">City</label>
              <input
                type="text"
                required
                value={address.city}
                onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">State</label>
              <input
                type="text"
                required
                value={address.state}
                onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">PIN Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={address.pincode}
                onChange={(e) => setAddress(prev => ({ ...prev, pincode: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div className="sm:col-span-2 pt-4 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2"
              >
                <span>Continue to Shipping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: Shipping Method */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: Shipping Method</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">Choose your delivery timeline preference</p>
            </div>
          </div>

          <div className="space-y-4">
            <label
              onClick={() => setShippingMethod('standard')}
              className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                shippingMethod === 'standard'
                  ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 ring-2 ring-brand-500/20'
                  : 'border-gray-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingMethod === 'standard'}
                  onChange={() => setShippingMethod('standard')}
                  className="w-4 h-4 text-brand-600"
                />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Standard Delivery (3-5 Business Days)</p>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">Complimentary free insured delivery across all serviceable pincodes.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
            </label>

            <label
              onClick={() => setShippingMethod('express')}
              className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                shippingMethod === 'express'
                  ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 ring-2 ring-brand-500/20'
                  : 'border-gray-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingMethod === 'express'}
                  onChange={() => setShippingMethod('express')}
                  className="w-4 h-4 text-brand-600"
                />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Express Air Cargo (1-2 Days Priority)</p>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">Next-flight priority courier dispatch with dedicated tracking officer.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-white">₹150</span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Address
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Payment */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Safe Payment Gateway</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">Select simulated development payment method</p>
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'UPI', label: 'UPI (GPay / PhonePe)', icon: QrCode },
              { id: 'Card', label: 'Credit / Debit Card', icon: CreditCard },
              { id: 'NetBanking', label: 'Net Banking', icon: Building },
              { id: 'COD', label: 'Cash on Delivery', icon: Wallet }
            ].map(m => {
              const IconComp = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === m.id
                      ? 'border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold ring-2 ring-brand-500/20'
                      : 'border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:border-gray-300'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                  <span className="text-[11px] leading-tight">{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Payment details container */}
          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-800">
            {paymentMethod === 'UPI' && (
              <div className="space-y-4 text-center max-w-sm mx-auto">
                <div className="w-32 h-32 mx-auto bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center">
                  <QrCode className="w-28 h-28 text-slate-900" />
                </div>
                <p className="text-xs text-gray-500">Scan QR using any UPI App or enter VPA below</p>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-center font-mono font-bold"
                />
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="space-y-3 max-w-md mx-auto">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'NetBanking' && (
              <div className="space-y-3 max-w-sm mx-auto">
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                >
                  <option>HDFC Bank</option>
                  <option>State Bank of India</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="text-center space-y-2 py-2">
                <p className="text-xs font-bold text-gray-900 dark:text-white">Pay cash at doorstep upon physical delivery.</p>
                <p className="text-[11px] text-gray-500">Please keep exact change ready to speed up delivery handover.</p>
              </div>
            )}
          </div>

          {/* Amount to pay summary */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Total Payable Amount</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                ₹{(finalTotal + (shippingMethod === 'express' ? 150 : 0)).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep(2)}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white px-3 py-2"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {placingOrder ? 'Confirming Order...' : 'Authorize & Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Order Confirmation */}
      {step === 4 && confirmedOrder && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-8 text-center space-y-6 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
              Payment Completed · Order Confirmed
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-3">
              Thank You for Your Order!
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Your electronics package has been reserved and sent to our fulfillment hub for packing.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-6 max-w-lg mx-auto border border-gray-200 dark:border-slate-700/60 text-left space-y-3">
            <div className="flex justify-between text-xs pb-2 border-b border-gray-200 dark:border-slate-700">
              <span className="font-bold text-gray-500">Order Reference</span>
              <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{confirmedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between text-xs pb-2 border-b border-gray-200 dark:border-slate-700">
              <span className="font-bold text-gray-500">Total Paid</span>
              <span className="font-extrabold text-gray-900 dark:text-white">₹{confirmedOrder.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs pb-2 border-b border-gray-200 dark:border-slate-700">
              <span className="font-bold text-gray-500">Delivery To</span>
              <span className="text-gray-700 dark:text-slate-300 text-right">{address.city}, {address.pincode}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-bold text-gray-500">Estimated Delivery</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {new Date(confirmedOrder.estimatedDelivery).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Action links */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to={`/orders/track/${confirmedOrder.orderNumber}`}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track Shipment Live</span>
            </Link>

            <Link
              to="/products"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-2xl text-xs font-bold transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
