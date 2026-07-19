import { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { IndianRupee, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/* ─── Delete Modal ─────────────────────────────────────────── */
const DeleteModal = ({ vehicle, onConfirm, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Delete failed');
      setLoading(false);
    }
  };

  return createPortal(
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--ink)]/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div className="w-full max-w-sm spec-panel animate-fade-in-up">
        {/* Header */}
        <div className="p-4 spec-border-b flex justify-between items-start bg-[var(--paper)]">
          <div>
            <h3 className="font-display text-xl text-[var(--out-of-stock)]">DELETE VEHICLE</h3>
            <p className="font-mono text-xs text-[var(--text-secondary)] mt-1">
              ID: {vehicle._id.slice(-6).toUpperCase()} | {vehicle.make.toUpperCase()} {vehicle.model.toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--ink)] font-mono text-sm px-2"
          >
            [X]
          </button>
        </div>

        {/* Body */}
        <div className="p-5 bg-[var(--panel)]">
          <p className="font-mono text-sm text-[var(--ink)] mb-2">
            Are you sure you want to permanently delete this vehicle?
          </p>
          <p className="font-mono text-xs font-bold text-[var(--out-of-stock)]">
            THIS ACTION CANNOT BE UNDONE.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 spec-border-t bg-[var(--paper)]">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs btn-outline"
          >
            CANCEL
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2 text-xs btn-outline border-[var(--out-of-stock)] text-[var(--out-of-stock)] hover:bg-[var(--out-of-stock)] hover:text-white flex items-center justify-center"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'CONFIRM DELETE'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
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

  return createPortal(
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--ink)]/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div className="w-full max-w-sm spec-panel animate-fade-in-up">
        {/* Header */}
        <div className="p-4 spec-border-b flex justify-between items-start bg-[var(--paper)]">
          <div>
            <h3 className="font-display text-xl text-[var(--ink)]">RESTOCK VEHICLE</h3>
            <p className="font-mono text-xs text-[var(--text-secondary)] mt-1">
              ID: {vehicle._id.slice(-6).toUpperCase()} | {vehicle.make.toUpperCase()} {vehicle.model.toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--ink)] font-mono text-sm px-2"
          >
            [X]
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 bg-[var(--panel)]">
          <div className="flex items-center justify-between font-mono text-sm spec-border-b pb-3">
            <span className="text-[var(--text-secondary)]">CURRENT QTY</span>
            <span className="font-bold text-[var(--ink)]">{vehicle.quantity}</span>
          </div>

          <div>
            <label className="block font-mono text-xs text-[var(--text-secondary)] mb-2">
              ADD QUANTITY
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 btn-outline text-lg leading-none"
              >
                -
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
                className="flex-1 min-w-0 text-center font-mono text-xl py-2 no-spinner input-theme"
              />
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 btn-outline text-lg leading-none"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-sm pt-2">
            <span className="text-[var(--text-secondary)]">NEW TOTAL</span>
            <span className="font-bold text-[var(--in-stock)]">{vehicle.quantity + qty}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 spec-border-t bg-[var(--paper)]">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs btn-outline"
          >
            CANCEL
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || qty <= 0}
            className="flex-1 py-2 text-xs btn-signal flex items-center justify-center"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'CONFIRM'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ─── Vehicle Card ──────────────────────────────────────────── */
const VehicleCard = ({ vehicle, onUpdate, onEdit, viewMode = 'grid' }) => {
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

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

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/vehicles/${vehicle._id}`);
      toast.success('Vehicle deleted successfully');
      setShowDeleteModal(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Delete failed');
    }
  };

  const handleRestockConfirm = async (qty) => {
    await axios.post(`/api/vehicles/${vehicle._id}/restock`, { quantity: qty });
    toast.success(`Restocked ${qty} units`);
    setShowRestockModal(false);
    if (onUpdate) onUpdate();
  };

  /* ─── Shared Modals ──────────────────────────────────────── */
  const modals = (
    <>
      {showRestockModal && (
        <RestockModal
          vehicle={vehicle}
          onConfirm={handleRestockConfirm}
          onClose={() => setShowRestockModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          vehicle={vehicle}
          onConfirm={handleDeleteConfirm}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );

  /* ─── List View ──────────────────────────────────────────── */
  if (viewMode === 'list') {
    return (
      <>
        {modals}
        <div className="spec-panel flex flex-col sm:flex-row sm:items-center gap-3 p-4">
          {/* Name + Category */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg text-[var(--ink)] leading-none truncate">
              {vehicle.make} {vehicle.model}
            </h3>
            <span className="spec-tag mt-1 inline-block">{vehicle.category}</span>
          </div>

          {/* Price */}
          <div className="font-mono text-base font-medium text-[var(--ink)] tracking-tight flex items-center flex-shrink-0">
            <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
            {vehicle.price.toLocaleString('en-IN')}
          </div>

          {/* Stock badge + qty */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isOutOfStock ? (
              <span className="stamp-badge stamp-out-of-stock">OUT OF STOCK</span>
            ) : (
              <span className="stamp-badge stamp-in-stock">IN STOCK</span>
            )}
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              QTY: <span className="font-bold text-[var(--ink)]">{vehicle.quantity}</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handlePurchase}
              disabled={isOutOfStock || loading || purchased}
              className={`py-1.5 px-4 text-xs flex items-center justify-center ${
                purchased
                  ? 'btn-outline border-[var(--in-stock)] text-[var(--in-stock)]'
                  : isOutOfStock
                  ? 'btn-outline opacity-50'
                  : 'btn-signal'
              }`}
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : purchased ? (
                'PURCHASED'
              ) : isOutOfStock ? (
                'N/A'
              ) : (
                'PURCHASE'
              )}
            </button>

            {isAdmin && (
              <>
                <button onClick={onEdit} disabled={loading} className="btn-outline py-1.5 px-3 text-xs text-[var(--text-secondary)]">
                  EDIT
                </button>
                <button onClick={() => setShowRestockModal(true)} disabled={loading} className="btn-outline py-1.5 px-3 text-xs text-[var(--text-secondary)]">
                  RESTOCK
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={loading}
                  className="btn-outline border-[var(--out-of-stock)] text-[var(--out-of-stock)] hover:bg-[var(--out-of-stock)] hover:text-white py-1.5 px-3 text-xs"
                >
                  DELETE
                </button>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  /* ─── Grid View (default) ────────────────────────────────── */
  return (
    <>
      {modals}

      <div className="spec-panel flex flex-col h-full">
        {/* Header row */}
        <div className="p-4 spec-border-b bg-[var(--paper)] flex justify-between items-start">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-display text-2xl text-[var(--ink)] leading-none mb-2 truncate">
              {vehicle.make} {vehicle.model}
            </h3>
            <span className="spec-tag">{vehicle.category}</span>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-mono text-xl font-medium text-[var(--ink)] tracking-tight flex justify-end items-center">
              <IndianRupee className="h-4 w-4 mr-0.5" />
              {vehicle.price.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col bg-[var(--panel)]">
          {/* Stock status */}
          <div className="flex items-center justify-between mb-3">
            {isOutOfStock ? (
              <span className="stamp-badge stamp-out-of-stock">OUT OF STOCK</span>
            ) : (
              <span className="stamp-badge stamp-in-stock">IN STOCK</span>
            )}
            <div className="font-mono text-xs text-[var(--text-secondary)]">
              QTY: <span className="font-bold text-[var(--ink)]">{vehicle.quantity}</span>
            </div>
          </div>

          {/* Fuel gauge stock bar */}
          <div className="flex gap-[2px] mb-6 h-2">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="flex-1 transition-colors duration-300"
                style={{
                  background: i < Math.min(10, vehicle.quantity)
                    ? (isOutOfStock ? 'var(--out-of-stock)' : 'var(--in-stock)')
                    : 'var(--line)'
                }}
              />
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Purchase button */}
          <button
            onClick={handlePurchase}
            disabled={isOutOfStock || loading || purchased}
            className={`w-full py-2.5 text-sm flex items-center justify-center ${
              purchased
                ? 'btn-outline border-[var(--in-stock)] text-[var(--in-stock)] hover:bg-[var(--in-stock)] hover:text-white'
                : isOutOfStock
                ? 'btn-outline opacity-50'
                : 'btn-signal'
            }`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : purchased ? (
              'PURCHASED'
            ) : isOutOfStock ? (
              'UNAVAILABLE'
            ) : (
              'PURCHASE'
            )}
          </button>

          {/* Admin buttons */}
          {isAdmin && (
            <div className="mt-3 pt-3 spec-border-t grid grid-cols-3 gap-2">
              <button
                onClick={onEdit}
                disabled={loading}
                className="btn-outline py-1.5 text-xs text-[var(--text-secondary)]"
              >
                EDIT
              </button>
              <button
                onClick={() => setShowRestockModal(true)}
                disabled={loading}
                className="btn-outline py-1.5 text-xs text-[var(--text-secondary)]"
              >
                RESTOCK
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={loading}
                className="btn-outline border-[var(--out-of-stock)] text-[var(--out-of-stock)] hover:bg-[var(--out-of-stock)] hover:text-white py-1.5 text-xs"
              >
                DELETE
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VehicleCard;
