import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Package, CheckCircle2, Clock, Truck, Home, 
  Search, ArrowRight, ShieldCheck, MapPin, AlertCircle 
} from 'lucide-react';
import api from '../services/api.js';

export default function OrderTrackingPage() {
  const { orderNumber: paramOrderNumber } = useParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(paramOrderNumber || '');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (paramOrderNumber) {
      loadTracking(paramOrderNumber);
    }
  }, [paramOrderNumber]);

  const loadTracking = async (number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.trackOrder(number.trim());
      if (res.success && res.tracking) {
        setTrackingData(res.tracking);
      }
    } catch (err) {
      setError(err.message || 'No active shipment found with this tracking ID.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/orders/track/${encodeURIComponent(searchInput.trim())}`);
      loadTracking(searchInput.trim());
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
      {/* Header & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-sm text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Track Your Shipment
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 max-w-md mx-auto">
          Enter your order reference number (e.g. TN-2026-90412) to see live fulfillment and courier transit updates.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto pt-2">
          <input
            type="text"
            required
            placeholder="e.g. TN-2026-90412"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md"
          >
            Track
          </button>
        </form>
      </div>

      {loading && (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Results Card */}
      {trackingData && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-8 shadow-sm">
          {/* Top Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-100 dark:border-slate-800 gap-4">
            <div>
              <span className="text-xs font-bold text-gray-400">Order Number</span>
              <h2 className="text-xl font-mono font-black text-gray-900 dark:text-white mt-0.5">
                {trackingData.order_number}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400">Current Status:</span>
              <span className="bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 px-3 py-1 rounded-full text-xs font-extrabold uppercase">
                {trackingData.status?.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Timeline Visualizer */}
          <div className="py-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-8">Shipment Progress Timeline</h3>
            <div className="relative pl-6 space-y-8 border-l-2 border-brand-500/30 dark:border-slate-700 ml-4">
              {trackingData.timeline?.map((step, idx) => (
                <div key={idx} className="relative group">
                  <div
                    className={`absolute -left-[33px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-white transition-all ${
                      step.completed
                        ? 'bg-brand-600 ring-4 ring-brand-500/20 shadow-md'
                        : 'bg-gray-300 dark:bg-slate-700'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5 text-gray-500" />}
                  </div>

                  <div className="space-y-1">
                    <p className={`text-xs font-extrabold uppercase tracking-wide ${step.completed ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {step.time && (
                      <p className="text-[11px] text-gray-400 font-mono">
                        {new Date(step.time).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items in Package */}
          <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-4">
              Package Contents ({trackingData.items?.length || 0})
            </h4>
            <div className="space-y-3">
              {trackingData.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700">
                  <img src={item.product_image} alt={item.product_name} className="w-12 h-12 object-contain rounded-lg bg-white p-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{item.product_name}</p>
                    <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
