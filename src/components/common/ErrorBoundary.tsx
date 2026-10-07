import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.hash = '#home';
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center p-4 sm:p-6 text-[#211D1C]">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#211D1C]">
                Something Interrupted Your Experience
              </h1>
              <p className="text-xs text-stone-600 leading-relaxed">
                An unexpected interface issue occurred. Your bag items and preferences remain safely preserved.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#211D1C] hover:bg-[#FF2E93] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-[#FFD94A]" />
                <span>Reload Boutique Interface</span>
              </button>

              <button
                onClick={() => {
                  window.location.hash = '#home';
                  window.location.reload();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
