import { LayoutDashboard, AlertCircle, CheckCircle2, BarChart3, Camera, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, collapsed, setCollapsed }) {
  const links = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'issues', label: 'Issues', icon: AlertCircle },
    { key: 'potholes', label: 'Pothole Detection', icon: Camera },
    { key: 'verified', label: 'Verified Work', icon: CheckCircle2 },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className={`fixed left-0 top-16 bottom-0 bg-navy-900 border-r border-white/10 z-40 transition-all duration-300 ${
      collapsed ? 'w-[68px]' : 'w-[240px]'
    }`}>
      <div className="flex flex-col h-full py-4">
        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {links.map(link => (
            <button
              key={link.key}
              onClick={() => setActiveView(link.key)}
              className={`w-full ${activeView === link.key ? 'sidebar-link-active' : 'sidebar-link'}`}
              title={collapsed ? link.label : undefined}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{link.label}</span>}
            </button>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="px-3 mt-auto">
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
