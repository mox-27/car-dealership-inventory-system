import React from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center p-4">
          <div className="w-full max-w-md spec-panel animate-fade-in-up">
            {/* Header */}
            <div className="p-4 spec-border-b flex justify-between items-start bg-[var(--paper)]">
              <div>
                <h3 className="font-display text-xl text-[var(--out-of-stock)] flex items-center gap-2">
                  <AlertOctagon className="h-5 w-5" />
                  SYSTEM FAULT
                </h3>
                <p className="font-mono text-xs text-[var(--text-secondary)] mt-1">
                  CRITICAL RENDER ERROR DETECTED
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 bg-[var(--panel)]">
              <p className="font-mono text-sm text-[var(--ink)] mb-4">
                The application encountered an unexpected error and failed to render.
              </p>
              <div className="p-3 bg-[var(--paper)] border border-[var(--out-of-stock)] overflow-auto max-h-32 mb-4">
                <p className="font-mono text-xs text-[var(--out-of-stock)]">
                  {this.state.error?.toString()}
                </p>
              </div>
              <p className="font-mono text-xs text-[var(--text-muted)]">
                Please reload the interface or return to base to recover session state.
              </p>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-4 spec-border-t bg-[var(--paper)]">
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 py-2.5 text-xs btn-outline flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                RETURN TO BASE
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 text-xs btn-outline border-[var(--signal)] text-[var(--signal)] hover:bg-[var(--signal)] hover:text-[var(--paper)] flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                RELOAD SYSTEM
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
