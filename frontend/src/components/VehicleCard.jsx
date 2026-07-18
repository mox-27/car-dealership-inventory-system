import { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { IndianRupee, ShoppingCart, Loader2, Package, Pencil, Trash2, RotateCcw, CheckCircle, X, Plus, Minus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

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

  const handleConfirm = async () => {
    if (qty <= 0) return;
    setLoading(true);
    try {
      await onConfirm(qty);
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Restock failed');
      setLoading(false);
    }
  };

  const catStyle = categoryColors[vehicle.category] || categoryColors.Sedan;

  return createPortal(
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'var(--shadow-strong)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden animate-fade-in-up"
        style={{
          background: 'var(--gradient-card)',
          border: '1px solid var(--border-strong)',
          boxShadow: '0 25px 80px var(--shadow-strong), 0 0 0 1px var(--border-subtle)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}
            >
              <RotateCcw className="h-4 w-4" style={{ color: '#34d399' }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-tight">Restock Vehicle</h3>
              <p className="text-xs mt-0.5 text-[var(--text-muted)]">
                {vehicle.make} {vehicle.model}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all bg-[var(--bg-input)] hover:bg-[var(--bg-input-hover)] text-[var(--text-muted)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Current stock info */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]"
          >
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <Package className="h-3.5 w-3.5" />
              <span className="text-xs">Current stock</span>
            </div>
            <span className="text-sm font-semibold" style={{ color: vehicle.quantity > 0 ? '#34d399' : '#f87171' }}>
              {vehicle.quantity} units
            </span>
          </div>

          {/* Quantity selector */}
          <div>
            <label className="block text-xs font-semibold mb-2 text-[var(--text-secondary)]">
              Add quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 transition-all bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-input-hover)]"
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
                className="flex-1 min-w-0 text-center text-xl font-bold rounded-xl py-2 no-spinner bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
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
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all bg-[var(--bg-input)] hover:bg-[var(--bg-input-hover)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
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
  const [purchased, setPurchased] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const catStyle = categoryColors[vehicle.category] || categoryColors.Sedan;
  const isOutOfStock = vehicle.quantity <= 0;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/vehicles/${vehicle._id}/purchase`);
      toast.success('Vehicle purchased successfully!');
      setPurchased(true);
      setTimeout(() => {
        setPurchased(false);
        if (onUpdate) onUpdate();
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${vehicle.make} ${vehicle.model}?`)) return;
    setLoading(true);
    try {
      await axios.delete(`/api/vehicles/${vehicle._id}`);
      toast.success('Vehicle deleted successfully');
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Delete failed');
      setLoading(false);
    }
  };

  const handleRestockConfirm = async (qty) => {
    await axios.post(`/api/vehicles/${vehicle._id}/restock`, { quantity: qty });
    toast.success(`Restocked ${qty} units`);
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
          background: 'var(--gradient-card)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 24px var(--shadow-color)',
        }}
      >
        {/* Color accent bar */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${catStyle.color}, transparent)` }} />

        <div className="p-5 flex-1 flex flex-col">
          {/* Header row */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-700 text-[var(--text-primary)] truncate leading-snug">
                {vehicle.make} <span className="text-[var(--text-secondary)]">{vehicle.model}</span>
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
              <span className="text-xs text-[var(--text-muted)]">
                <span className="font-semibold" style={{ color: '#34d399' }}>{vehicle.quantity}</span> in stock
              </span>
            )}
          </div>

          {/* Stock bar */}
          <div className="mb-4 h-1 w-full rounded-full bg-[var(--bg-input-hover)]">
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
                ? { background: 'var(--bg-input)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }
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
