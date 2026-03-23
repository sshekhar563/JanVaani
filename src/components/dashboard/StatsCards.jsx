import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock, Users, AlertTriangle } from 'lucide-react';

export default function StatsCards() {
  const [stats, setStats] = useState({
    total: 0, resolved: 0, pending: 0, assigned: 0, satisfaction: 78
  });
  const [potholeStats, setPotholeStats] = useState({ total: 0, high: 0 });

  useEffect(() => {
    // Fetch real complaint stats
    fetch('/api/workflow/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {});

    // Fetch pothole stats
    fetch('/api/pothole-stats')
      .then(res => res.json())
      .then(data => setPotholeStats(data))
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: 'Total Issues',
      value: stats.total.toLocaleString(),
      change: stats.total > 0 ? `${stats.total} filed` : 'New',
      trend: 'up',
      icon: AlertCircle,
      color: 'blue',
    },
    {
      label: 'Resolved',
      value: stats.resolved.toLocaleString(),
      change: stats.total > 0 ? `${Math.round(stats.resolved / stats.total * 100)}%` : '0%',
      trend: 'up',
      icon: CheckCircle2,
      color: 'teal',
    },
    {
      label: 'Pending',
      value: stats.pending.toLocaleString(),
      change: stats.total > 0 ? `${Math.round(stats.pending / stats.total * 100)}%` : '0%',
      trend: 'down',
      icon: Clock,
      color: 'amber',
    },
    {
      label: 'Pothole Alerts',
      value: potholeStats.high.toString(),
      change: potholeStats.total > 0 ? `${potholeStats.total} total` : 'New',
      trend: 'up',
      icon: AlertTriangle,
      color: 'red',
    },
    {
      label: 'Citizen Satisfaction',
      value: `${stats.satisfaction}%`,
      change: stats.satisfaction >= 70 ? 'Good' : 'Needs work',
      trend: stats.satisfaction >= 70 ? 'up' : 'down',
      icon: Users,
      color: 'teal',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              card.color === 'teal' ? 'bg-teal-500/15' :
              card.color === 'amber' ? 'bg-amber-500/15' :
              card.color === 'red' ? 'bg-red-500/15' : 'bg-blue-500/15'
            }`}>
              <card.icon className={`w-5 h-5 ${
                card.color === 'teal' ? 'text-teal-400' :
                card.color === 'amber' ? 'text-amber-400' :
                card.color === 'red' ? 'text-red-400' : 'text-blue-400'
              }`} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              card.trend === 'up' 
                ? card.color === 'red' ? 'text-red-400 bg-red-500/10' : 'text-teal-400 bg-teal-500/10'
                : 'text-amber-400 bg-amber-500/10'
            }`}>
              {card.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {card.change}
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{card.value}</p>
          <p className="text-sm text-gray-400 mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
