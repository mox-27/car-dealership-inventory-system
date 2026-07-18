import { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { IndianRupee, ShoppingCart, Loader2, Package, Pencil, Trash2, RotateCcw, CheckCircle, X, Plus, Minus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const categoryColors = {
  Sedan: { bg: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', border: 'rgba(99,102,241,0.3)' },
  SUV: { bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
  Truck: { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  Sports: { bg: 'rgba(239, 68, 68, 0.12)', color: '#f87171', border: 'rgba(239,68,68,0.3)' },
  Coupe: { bg: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', border: 'rgba(168,85,247,0.3)' },
  Hatchback: { bg: 'rgba(6, 182, 212, 0.12)', color: '#22d3ee', border: 'rgba(6,182,212,0.3)' },
  Van: { bg: 'rgba(249, 115, 22, 0.12)', color: '#fb923c', border: 'rgba(249,115,22,0.3)' },
};

/* ─── Restock Modal ─────────────────────────────────────────── */
const RestockModal = ({ vehicle, onConfirm, onClose }) => {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    if (qty <= 0) return;
    setLoading(true);
    setError(null);
    try {
      await onConfirm(qty);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Restock failed');
      setLoading(false);
    }
  };

  const catStyle = categoryColors[vehicle.category] || categoryColors.Sedan;

  return createPortal(
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden animate-fade-in-up"
        style={{
          background: 'linear-gradient(145deg, rgba(21,21,31,0.97) 0%, rgba(15,15,26,0.99) 100%)',
          border: '1px solid rgba(99,102,241,0.3)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5" style={{ borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}
            >
              <RotateCcw className="h-4 w-4" style={{ color: '#34d399' }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white leading-tight">Restock Vehicle</h3>
              <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                {vehicle.make} {vehicle.model}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Current stock info */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-2">
              <Package className="h-3.5 w-3.5" style={{ color: '#64748b' }} />
              <span className="text-xs" style={{ color: '#64748b' }}>Current stock</span>
            </div>
            <span className="text-sm font-semibold" style={{ color: vehicle.quantity > 0 ? '#34d399' : '#f87171' }}>
              {vehicle.quantity} units
            </span>
          </div>

          {/* Quantity selector */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: '#94a3b8' }}>
              Add quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
              >
                <Minus className="h-4 w-4" />
              </button>

              <input
                id="restock-qty"
                type="number"
                min="1"
                value={qty}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v) && v >= 1) setQty(v);
                }}
                className="flex-1 text-center text-xl font-bold rounded-xl py-2"
                style={{
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  color: '#e2e8f0',
                  outline: 'none',
                }}
              />

              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 transition-all"
                style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* After restock preview */}
            <p className="text-xs mt-2 text-center" style={{ color: '#475569' }}>
              Stock after restock:{' '}
              <span className="font-semibold" style={{ color: '#34d399' }}>
                {vehicle.quantity + qty} units
              </span>
            </p>
          </div>

          {error && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || qty <= 0}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <RotateCcw className="h-4 w-4" />
                Restock {qty} unit{qty !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ─── Vehicle Card ──────────────────────────────────────────── */
const VehicleCard = ({ vehicle, onUpdate, onEdit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [purchased, setPurchased] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const catStyle = categoryColors[vehicle.category] || categoryColors.Sedan;
  const isOutOfStock = vehicle.quantity <= 0;

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/api/vehicles/${vehicle._id}/purchase`);
      setPurchased(true);
      setTimeout(() => {
        setPurchased(false);
        if (onUpdate) onUpdate();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${vehicle.make} ${vehicle.model}?`)) return;
    setLoading(true);
    try {
      await axios.delete(`/api/vehicles/${vehicle._id}`);
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Delete failed');
      setLoading(false);
    }
  };

  const handleRestockConfirm = async (qty) => {
    await axios.post(`/api/vehicles/${vehicle._id}/restock`, { quantity: qty });
    setShowRestockModal(false);
    if (onUpdate) onUpdate();
  };

  return (
    <>
      {showRestockModal && (
        <RestockModal
          vehicle={vehicle}
          onConfirm={handleRestockConfirm}
          onClose={() => setShowRestockModal(false)}
        />
      )}

      <div
        className="card-hover rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(145deg, rgba(21,21,31,0.9) 0%, rgba(15,15,26,0.95) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.12)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Color accent bar */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${catStyle.color}, transparent)` }} />

        <div className="p-5 flex-1 flex flex-col">
          {/* Header row */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-700 text-white truncate leading-snug">
                {vehicle.make} <span className="text-slate-300">{vehicle.model}</span>
              </h3>
              <span
                className="badge mt-1.5"
                style={{ background: catStyle.bg, color: catStyle.color, border: `1px solid ${catStyle.border}` }}
              >
                {vehicle.category}
              </span>
            </div>
            <div className="ml-3 text-right flex-shrink-0">
              <div className="flex items-center justify-end gap-0.5 font-700 text-lg" style={{ color: '#818cf8' }}>
                <IndianRupee className="h-4 w-4" />
                <span>{vehicle.price.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-3.5 w-3.5 flex-shrink-0" style={{ color: isOutOfStock ? '#f87171' : '#34d399' }} />
            {isOutOfStock ? (
              <span className="text-xs font-medium" style={{ color: '#f87171' }}>Out of stock</span>
            ) : (
              <span className="text-xs" style={{ color: '#94a3b8' }}>
                <span className="font-semibold" style={{ color: '#34d399' }}>{vehicle.quantity}</span> in stock
              </span>
            )}
          </div>

          {/* Stock bar */}
          <div className="mb-4 h-1 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (vehicle.quantity / 10) * 100)}%`,
                background: isOutOfStock
                  ? 'rgba(239, 68, 68, 0.5)'
                  : vehicle.quantity <= 2
                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : 'linear-gradient(90deg, #10b981, #34d399)',
              }}
            />
          </div>

          {error && (
            <p className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)' }}>
              {error}
            </p>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Purchase button */}
          <button
            onClick={handlePurchase}
            disabled={isOutOfStock || loading || purchased}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-600 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            style={
              purchased
                ? { background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }
                : isOutOfStock
                ? { background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)' }
                : { background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: 'white', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }
            }
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : purchased ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Purchased!
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                {isOutOfStock ? 'Out of Stock' : 'Purchase'}
              </>
            )}
          </button>

          {/* Admin buttons */}
          {isAdmin && (
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              <button
                onClick={onEdit}
                disabled={loading}
                className="flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all"
                style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all"
                style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
              <button
                onClick={() => setShowRestockModal(true)}
                disabled={loading}
                className="flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all"
                style={{ background: 'rgba(16,185,129,0.08)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                <RotateCcw className="h-3 w-3" />
                Restock
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VehicleCard;
