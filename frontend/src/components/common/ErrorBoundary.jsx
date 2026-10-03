import React, { Component } from 'react';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({ error: this.state.error, reset: this.handleReset });
      }

      return (
        <div className="container mx-auto px-4 py-20 text-center max-w-lg">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-8 shadow-xl space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                Something went wrong
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
                We encountered an unexpected issue rendering this section. Our engineers have been notified.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
              <a
                href="/products"
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Products</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
