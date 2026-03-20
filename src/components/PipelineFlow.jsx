import { pipelineSteps } from '../data/pipelineSteps';

const colorMap = {
  amber: {
    active: 'bg-amber-500 shadow-lg shadow-amber-500/30',
    done: 'bg-amber-500/20 border border-amber-500/30',
    text: 'text-amber-400',
    line: 'bg-amber-500/40',
  },
  blue: {
    active: 'bg-blue-500 shadow-lg shadow-blue-500/30',
    done: 'bg-blue-500/20 border border-blue-500/30',
    text: 'text-blue-400',
    line: 'bg-blue-500/40',
  },
  purple: {
    active: 'bg-purple-500 shadow-lg shadow-purple-500/30',
    done: 'bg-purple-500/20 border border-purple-500/30',
    text: 'text-purple-400',
    line: 'bg-purple-500/40',
  },
  trust: {
    active: 'bg-teal-500 shadow-lg shadow-teal-500/30',
    done: 'bg-teal-500/20 border border-teal-500/30',
    text: 'text-teal-400',
    line: 'bg-teal-500/40',
  },
  navy: {
    active: 'bg-ink-500 shadow-lg shadow-ink-500/30',
    done: 'bg-ink-500/20 border border-ink-500/30',
    text: 'text-ink-300',
    line: 'bg-ink-500/40',
  },
};

export default function PipelineFlow({ activeIndex = -1, badgeText, title, subtitle, extra }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{title || 'AI Pipeline'}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {badgeText && (
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
            {badgeText}
          </span>
        )}
      </div>

      {/* Pipeline Steps */}
      <div className="space-y-0">
        {pipelineSteps.map((step, i) => {
          const isActive = i === activeIndex;
          const isDone = i < activeIndex;
          const colors = colorMap[step.color] || colorMap.amber;

          return (
            <div key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                    isActive
                      ? `${colors.active} animate-pulse`
                      : isDone
                      ? colors.done
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <step.icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : isDone ? colors.text : 'text-gray-600'
                    }`}
                  />
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div
                    className={`w-0.5 h-8 transition-all duration-500 ${
                      isDone ? colors.line : 'bg-white/5'
                    }`}
                  />
                )}
              </div>
              <div className="pb-4">
                <p
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isActive ? 'text-white' : isDone ? colors.text : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[11px] text-gray-600">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Extra info (transcript preview) */}
      {extra && (
        <div className="mt-4 bg-ink-900/40 border border-white/5 rounded-xl p-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-1">{extra.label}</p>
          <p className="text-xs text-gray-300 leading-relaxed break-words">{extra.value}</p>
          {extra.meta && (
            <p className="text-[10px] text-gray-600 mt-2 italic">{extra.meta}</p>
          )}
        </div>
      )}
    </div>
  );
}
