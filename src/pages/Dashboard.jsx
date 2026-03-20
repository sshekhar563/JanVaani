import { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import StatsCards from '../components/dashboard/StatsCards';
import PriorityInbox from '../components/dashboard/PriorityInbox';
import TrustIndex from '../components/dashboard/TrustIndex';
import ProofOfWork from '../components/dashboard/ProofOfWork';
import { 
  Bell, Search, User, Calendar, Shield, ChevronDown,
  BarChart3, TrendingUp, Activity, Camera, MapPin, Clock,
  AlertTriangle, Eye
} from 'lucide-react';
import { trustIndexData } from '../data/mockData';
import { useTranslation } from 'react-i18next';

function DashboardHeader() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t('dashboard.warRoom')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('dashboard.welcomeBack')}</p>
      </div>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder={t('dashboard.searchPlaceholder')}
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500/50 w-64"
          />
        </div>
        
        {/* Notifications */}
        <button className="relative p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">3</span>
        </button>
        
        {/* Profile */}
        <button className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron-500 to-trust-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-gray-300 hidden sm:block">{t('dashboard.admin')}</span>
          <ChevronDown className="w-3 h-3 text-gray-500 hidden sm:block" />
        </button>
      </div>
    </div>
  );
}

function OverviewView() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <StatsCards />
      <div className="grid lg:grid-cols-2 gap-6">
        <TrustIndex />
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-saffron-400" />
                {t('dashboard.quickInsights')}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{t('dashboard.aiSummary')}</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: t('dashboard.criticalAlert'), desc: t('dashboard.criticalDesc'), type: 'critical' },
              { label: t('dashboard.misinformation'), desc: t('dashboard.misinfoDesc'), type: 'warning' },
              { label: t('dashboard.trending'), desc: t('dashboard.trendingDesc'), type: 'info' },
              { label: t('dashboard.positive'), desc: t('dashboard.positiveDesc'), type: 'success' },
            ].map((insight, i) => (
              <div key={i} className={`p-4 rounded-xl border ${
                insight.type === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                insight.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20' :
                insight.type === 'info' ? 'bg-blue-500/5 border-blue-500/20' :
                'bg-trust-500/5 border-trust-500/20'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-xs font-bold ${
                    insight.type === 'critical' ? 'text-red-400' :
                    insight.type === 'warning' ? 'text-amber-400' :
                    insight.type === 'info' ? 'text-blue-400' : 'text-trust-400'
                  }`}>{insight.label}</span>
                </div>
                <p className="text-sm text-gray-300">{insight.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <PriorityInbox />
    </div>
  );
}

function PotholeReportsView() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0, detected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/pothole-reports').then(r => r.json()).catch(() => []),
      fetch('/api/pothole-stats').then(r => r.json()).catch(() => ({ total: 0, high: 0, medium: 0, low: 0, detected: 0 }))
    ]).then(([reportsData, statsData]) => {
      setReports(Array.isArray(reportsData) ? reportsData : []);
      setStats(statsData);
      setLoading(false);
    });
  }, []);

  const priorityConfig = {
    HIGH: { bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-500' },
    MEDIUM: { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-500' },
    LOW: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Scans', value: stats.total, color: 'blue' },
          { label: 'High Priority', value: stats.high, color: 'red' },
          { label: 'Medium Priority', value: stats.medium, color: 'amber' },
          { label: 'Low / Clear', value: stats.low, color: 'emerald' },
        ].map((s, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold text-${s.color}-400`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Reports List */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-saffron-400" />
              Pothole Detection Reports
            </h3>
            <p className="text-xs text-gray-500 mt-1">AI-analyzed road images with detection results</p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center">
            <Camera className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No pothole detection reports yet</p>
            <p className="text-xs text-gray-600 mt-1">Reports will appear here when citizens upload road images</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {reports.map((report, i) => {
              const pc = priorityConfig[report.priority] || priorityConfig.LOW;
              return (
                <div key={report._id || i} className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-all">
                  {/* Image Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                    {report.image_url ? (
                      <img src={report.image_url} alt="Road" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-white truncate">{report.label || 'Detection Result'}</h4>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${pc.bg} ${pc.border} border ${pc.text}`}>
                        {report.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {Math.round((report.confidence || 0) * 100)}% confidence
                      </span>
                      {report.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {report.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Tracking ID */}
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-xs font-mono text-gray-500">{report.tracking_id}</p>
                    <p className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                      report.status === 'Pending' ? 'bg-saffron-500/15 text-saffron-400' : 'bg-trust-500/15 text-trust-400'
                    }`}>{report.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AnalyticsView() {
  const { t } = useTranslation();
  const { trend, trendLabels } = trustIndexData;
  const maxTrend = Math.max(...trend);

  return (
    <div className="space-y-6">
      <StatsCards />
      <div className="grid lg:grid-cols-2 gap-6">
        <TrustIndex />
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-trust-400" />
                {t('dashboard.trustScoreTrend')}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{t('dashboard.last6Months')}</p>
            </div>
          </div>
          {/* Simple bar chart */}
          <div className="flex items-end gap-3 h-48 px-4">
            {trend.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">{val}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-trust-600 to-trust-400 transition-all duration-1000"
                  style={{ height: `${(val / maxTrend) * 100}%` }}
                />
                <span className="text-[10px] text-gray-500">{trendLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-saffron-400" />
          {t('dashboard.categoryDistribution')}
        </h3>
        <div className="space-y-3">
          {[
            { label: t('dashboard.cat1'), count: 342, pct: 27 },
            { label: t('dashboard.cat2'), count: 287, pct: 23 },
            { label: t('dashboard.cat3'), count: 198, pct: 16 },
            { label: t('dashboard.cat4'), count: 156, pct: 13 },
            { label: t('dashboard.cat5'), count: 124, pct: 10 },
            { label: t('dashboard.cat6'), count: 89, pct: 7 },
            { label: t('dashboard.cat7'), count: 51, pct: 4 },
          ].map(cat => (
            <div key={cat.label} className="flex items-center gap-4">
              <span className="text-sm text-gray-300 w-48 flex-shrink-0 truncate">{cat.label}</span>
              <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-saffron-500 to-trust-500 transition-all duration-1000"
                  style={{ width: `${cat.pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-16 text-right">{cat.count} ({cat.pct}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'overview': return <OverviewView />;
      case 'issues': return <PriorityInbox />;
      case 'potholes': return <PotholeReportsView />;
      case 'verified': return <ProofOfWork />;
      case 'analytics': return <AnalyticsView />;
      default: return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white pt-16">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-[68px]' : 'ml-[240px]'} p-6`}>
        <DashboardHeader />
        {renderContent()}
      </main>
    </div>
  );
}
