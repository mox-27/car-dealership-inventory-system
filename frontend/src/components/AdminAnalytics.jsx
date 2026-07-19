import { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Activity } from 'lucide-react';

const AdminAnalytics = ({ vehicles }) => {
  // Aggregate data for Pie Chart: Inventory by Category
  const categoryData = useMemo(() => {
    const counts = {};
    vehicles.forEach(v => {
      counts[v.category] = (counts[v.category] || 0) + v.quantity;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [vehicles]);

  // Aggregate data for Bar Chart: Total Stock by Make
  const makeData = useMemo(() => {
    const counts = {};
    vehicles.forEach(v => {
      counts[v.make] = (counts[v.make] || 0) + v.quantity;
    });
    return Object.entries(counts)
      .map(([make, stock]) => ({ make, stock }))
      .sort((a, b) => b.stock - a.stock); // Sort by highest stock first
  }, [vehicles]);

  const COLORS = ['var(--ink)', 'var(--signal)', 'var(--in-stock)', 'var(--out-of-stock)', 'var(--text-muted)'];

  if (vehicles.length === 0) return null;

  return (
    <div className="flex-shrink-0 flex flex-col gap-4 mt-6 mb-2">
      <div className="flex items-center gap-2 px-1">
        <Activity className="h-4 w-4 text-[var(--ink)]" />
        <h2 className="font-display text-lg text-[var(--ink)]">Inventory Analytics</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution (Pie) */}
        <div className="spec-panel p-4 flex flex-col h-[280px]">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-2">Stock by Category</h3>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '0' }}
                  itemStyle={{ color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock by Make (Bar) */}
        <div className="spec-panel p-4 flex flex-col h-[280px]">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-2">Stock by Make</h3>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={makeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                <XAxis dataKey="make" tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--paper)' }}
                  contentStyle={{ backgroundColor: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '0' }}
                  itemStyle={{ color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' }}
                />
                <Bar dataKey="stock" fill="var(--ink)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
