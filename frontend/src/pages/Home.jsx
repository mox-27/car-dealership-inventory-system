import { Link } from 'react-router-dom';
import { Car, ArrowRight, ShieldCheck, Zap, Database } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto w-full pt-10 pb-20">
      
      {/* Hero Section */}
      <div className="spec-panel p-10 sm:p-16 flex flex-col items-center text-center animate-fade-in-up">
        <div className="w-16 h-16 flex items-center justify-center bg-[var(--ink)] text-[var(--paper)] mb-6">
          <Car className="h-8 w-8" />
        </div>
        <h1 className="font-display text-4xl sm:text-6xl text-[var(--ink)] tracking-widest uppercase mb-4">
          AutoVerse
        </h1>
        <p className="font-mono text-sm sm:text-base text-[var(--text-secondary)] uppercase tracking-widest max-w-2xl mb-10">
          Precision Inventory Management System. Authorized Dealer Access Only. 
        </p>
        <Link 
          to="/dashboard" 
          className="btn-signal px-8 py-4 text-sm flex items-center gap-2 group"
        >
          ENTER INVENTORY
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="spec-panel p-6 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          <ShieldCheck className="h-6 w-6 text-[var(--ink)] mb-4" />
          <h3 className="font-mono text-sm font-bold text-[var(--ink)] mb-2 uppercase tracking-wider">Secure Inventory Control</h3>
          <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed">
            Keep your dealership's data safe. Only authorized staff can add, edit, or remove vehicles from the lot, ensuring your inventory is always accurate.
          </p>
        </div>

        <div className="spec-panel p-6 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <Database className="h-6 w-6 text-[var(--ink)] mb-4" />
          <h3 className="font-mono text-sm font-bold text-[var(--ink)] mb-2 uppercase tracking-wider">Seamless Bulk Import</h3>
          <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed">
            Moving from an old system? Quickly upload your entire lot using CSV or JSON files. We'll automatically handle duplicates so you don't have to.
          </p>
        </div>

        <div className="spec-panel p-6 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          <Zap className="h-6 w-6 text-[var(--ink)] mb-4" />
          <h3 className="font-mono text-sm font-bold text-[var(--ink)] mb-2 uppercase tracking-wider">Lightning Fast Management</h3>
          <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed">
            Search, filter, and track your vehicles instantly. Whether you have 10 cars or 10,000, our system is built to handle it without breaking a sweat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
