import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 animate-fade-in-up py-20">
      <AlertTriangle className="h-16 w-16 text-[var(--signal)] mb-6" />
      <h1 className="text-8xl font-display text-[var(--ink)] mb-2 tracking-tight">
        404
      </h1>
      <h2 className="text-xl font-mono uppercase tracking-widest text-[var(--text-secondary)] mb-6">
        System Fault / Page Not Found
      </h2>
      <p className="text-sm font-mono text-[var(--text-muted)] max-w-md mx-auto mb-10 leading-relaxed">
        The requested module or directory does not exist in the AutoVerse inventory system. Please verify your routing parameters.
      </p>
      <Link
        to="/"
        className="btn-primary flex items-center gap-2 px-8 py-3 text-sm font-mono uppercase tracking-widest"
      >
        <ArrowLeft className="h-4 w-4" />
        Return to Base
      </Link>
    </div>
  );
};

export default NotFound;
