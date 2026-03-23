import { 
  LayoutDashboard, AlertCircle, CheckCircle2, BarChart3, Camera, 
  ChevronLeft, ChevronRight, Globe, UserPlus, Shield, Brain, 
  Building2, TrendingUp, AlertTriangle
} from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, collapsed, setCollapsed, showGovernance }) {
  const mainLinks = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'issues', label: 'Issues', icon: AlertCircle },
    { key: 'potholes', label: 'Pothole Detection', icon: Camera },
    { key: 'verified', label: 'Verified Work', icon: CheckCircle2 },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'assign', label: 'Assign Officers', icon: UserPlus },
  ];

  const govLinks = [
    { key: 'geo', label: 'Heatmaps', icon: Globe },
    { key: 'fraud', label: 'Fraud Detection', icon: AlertTriangle },
    { key: 'officer_perf', label: 'Officer Perf.', icon: TrendingUp },
    { key: 'trust', label: 'Trust Score', icon: Shield },
    { key: 'digital_twin', label: 'Digital Twin', icon: Building2 },
    { key: 'predictions', label: 'Predictions', icon: Brain },
  ];

  const renderLink = (link) => (
    <button
      key={link.key}
      onClick={() => setActiveView(link.key)}
      className={`w-full ${activeView === link.key ? 'sidebar-link-active' : 'sidebar-link'}`}
      title={collapsed ? link.label : undefined}
    >
      <link.icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span className="text-sm">{link.label}</span>}
    </button>
  );

  return (
    <aside className={`fixed left-0 top-16 bottom-0 bg-ink-900 border-r border-white/10 z-40 transition-all duration-300 ${
      collapsed ? 'w-[68px]' : 'w-[240px]'
    }`}>
      <div className="flex flex-col h-full py-4 overflow-y-auto">
        {/* Main Navigation */}
        <nav className="px-3 space-y-1">
          {mainLinks.map(renderLink)}
        </nav>

        {/* Governance Section */}
        {showGovernance && (
          <>
            {!collapsed && (
              <div className="px-5 mt-5 mb-2">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Governance AI</p>
              </div>
            )}
            {collapsed && <div className="border-t border-white/5 mx-3 my-3" />}
            <nav className="px-3 space-y-1">
              {govLinks.map(renderLink)}
            </nav>
          </>
        )}

        {/* Collapse Toggle */}
        <div className="px-3 mt-auto pt-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
