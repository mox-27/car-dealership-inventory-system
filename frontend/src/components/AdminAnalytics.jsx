import { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Activity, LayoutGrid, PieChart as PieChartIcon, BarChart2, IndianRupee } from 'lucide-react';

const AdminAnalytics = ({ vehicles }) => {
  const [activeTab, setActiveTab] = useState('overview');

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

  // Aggregate data for Price Chart
  const priceData = useMemo(() => {
    const buckets = {
      '< ₹10L': 0,
      '₹10L-₹20L': 0,
      '₹20L-₹50L': 0,
      '> ₹50L': 0
    };
    vehicles.forEach(v => {
      const p = v.price;
      const q = v.quantity;
      if (p < 1000000) buckets['< ₹10L'] += q;
      else if (p < 2000000) buckets['₹10L-₹20L'] += q;
      else if (p < 5000000) buckets['₹20L-₹50L'] += q;
      else buckets['> ₹50L'] += q;
    });
    return Object.entries(buckets).map(([range, stock]) => ({ range, stock }));
  }, [vehicles]);

  const COLORS = ['var(--ink)', 'var(--signal)', 'var(--in-stock)', 'var(--out-of-stock)', 'var(--text-muted)'];

  if (vehicles.length === 0) return null;

  const renderCategoryChart = (height = "h-[280px]") => (
    <div className={`spec-panel p-4 flex flex-col ${height}`}>
      <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-2">Stock by Category</h3>
      <div className="flex-1 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={height === "h-[280px]" ? 60 : 100}
              outerRadius={height === "h-[280px]" ? 80 : 140}
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
  );

  const renderMakeChart = (height = "h-[280px]") => (
    <div className={`spec-panel p-4 flex flex-col ${height}`}>
      <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-2">Stock by Make</h3>
      <div className="flex-1 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={makeData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
            <XAxis dataKey="make" tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" />
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
  );

  const renderPriceChart = (height = "h-[280px]") => (
    <div className={`spec-panel p-4 flex flex-col ${height}`}>
      <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-2">Stock by Price Range</h3>
      <div className="flex-1 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={priceData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
            <XAxis dataKey="range" tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} interval={0} angle={-25} textAnchor="end" />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: 'var(--paper)' }}
              contentStyle={{ backgroundColor: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '0' }}
              itemStyle={{ color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 'bold' }}
              labelStyle={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' }}
            />
            <Bar dataKey="stock" fill="var(--signal)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="flex-shrink-0 flex flex-col gap-4 mt-6 mb-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[var(--ink)]" />
          <h2 className="font-display text-lg text-[var(--ink)]">Inventory Analytics</h2>
        </div>
        
        <div className="flex items-center border spec-border bg-[var(--panel)]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`p-1.5 transition-colors ${activeTab === 'overview' ? 'bg-[var(--ink)] text-[var(--paper)]' : 'text-[var(--text-muted)] hover:text-[var(--ink)]'}`}
            title="Overview"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={`p-1.5 transition-colors border-l spec-border ${activeTab === 'category' ? 'bg-[var(--ink)] text-[var(--paper)]' : 'text-[var(--text-muted)] hover:text-[var(--ink)]'}`}
            title="Category Distribution"
          >
            <PieChartIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setActiveTab('make')}
            className={`p-1.5 transition-colors border-l spec-border ${activeTab === 'make' ? 'bg-[var(--ink)] text-[var(--paper)]' : 'text-[var(--text-muted)] hover:text-[var(--ink)]'}`}
            title="Stock by Make"
          >
            <BarChart2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setActiveTab('price')}
            className={`p-1.5 transition-colors border-l spec-border ${activeTab === 'price' ? 'bg-[var(--ink)] text-[var(--paper)]' : 'text-[var(--text-muted)] hover:text-[var(--ink)]'}`}
            title="Price Distribution"
          >
            <IndianRupee className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderCategoryChart()}
          {renderMakeChart()}
        </div>
      )}

      {activeTab === 'category' && (
        <div className="grid grid-cols-1 gap-6">
          {renderCategoryChart("h-[380px]")}
        </div>
      )}

      {activeTab === 'make' && (
        <div className="grid grid-cols-1 gap-6">
          {renderMakeChart("h-[380px]")}
        </div>
      )}

      {activeTab === 'price' && (
        <div className="grid grid-cols-1 gap-6">
          {renderPriceChart("h-[380px]")}
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
