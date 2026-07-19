import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrders, clearOrders } from '../utils/orderStorage';
import { Package, IndianRupee, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.email) {
      setOrders(getOrders(user.email));
    }
  }, [user]);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your order history?')) {
      clearOrders(user.email);
      setOrders([]);
      toast.success('Order history cleared');
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Page header */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-1 text-[var(--text-muted)]">
            AutoVerse User Portal
          </p>
          <h1 className="text-4xl font-display text-[var(--ink)]">
            Order History
          </h1>
        </div>
        {orders.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="btn-outline border-[var(--out-of-stock)] text-[var(--out-of-stock)] hover:bg-[var(--out-of-stock)] hover:text-white flex items-center gap-2 px-4 py-2.5 text-xs self-start sm:self-end"
          >
            <Trash2 className="h-4 w-4" />
            CLEAR HISTORY
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {orders.length === 0 ? (
          <div className="spec-panel text-center py-20 animate-fade-in-up">
            <Package className="h-12 w-12 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-sm font-mono uppercase tracking-widest text-[var(--ink)]">No orders found</p>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mt-2">Purchase vehicles from the dashboard to see them here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order, i) => (
              <div 
                key={order.orderId}
                className="spec-panel flex flex-col sm:flex-row sm:items-center gap-4 p-5 animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-xs text-[var(--text-secondary)]">ORDER: {order.orderId}</span>
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {new Date(order.orderDate).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-[var(--ink)] leading-none truncate mt-2">
                    {order.make} {order.model}
                  </h3>
                  <span className="spec-tag mt-2 inline-block">{order.category}</span>
                </div>
                
                <div className="font-mono text-xl font-bold text-[var(--ink)] tracking-tight flex items-center flex-shrink-0">
                  <IndianRupee className="h-4 w-4 mr-0.5" />
                  {order.price.toLocaleString('en-IN')}
                </div>
                
                <div className="flex-shrink-0 mt-3 sm:mt-0">
                  <span className="stamp-badge stamp-in-stock text-[var(--in-stock)] border-[var(--in-stock)]">
                    COMPLETED
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
