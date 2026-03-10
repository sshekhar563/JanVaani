import { MapPin, Clock, CheckCircle2, Eye, User, IndianRupee } from 'lucide-react';
import { proofOfWork } from '../../data/mockData';

export default function ProofOfWork() {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-white/10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-trust-400" />
          Visual Proof-of-Work Feed
        </h3>
        <p className="text-xs text-gray-500 mt-1">Geo-tagged verified completions</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 p-4">
        {proofOfWork.map(item => (
          <div key={item.id} className="group relative bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden card-hover">
            {/* Image Placeholder */}
            <div className="relative h-40 bg-gradient-to-br from-navy-700 to-navy-800 overflow-hidden">
              {/* Simulated before/after */}
              <div className="absolute inset-0 flex">
                <div className="flex-1 bg-red-900/30 flex items-center justify-center border-r border-white/10">
                  <div className="text-center">
                    <p className="text-[10px] text-red-400 font-medium">BEFORE</p>
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mt-1 mx-auto">
                      <Eye className="w-5 h-5 text-red-400" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-trust-900/30 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[10px] text-trust-400 font-medium">AFTER</p>
                    <div className="w-10 h-10 rounded-full bg-trust-500/20 flex items-center justify-center mt-1 mx-auto">
                      <CheckCircle2 className="w-5 h-5 text-trust-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Geo Tag Overlay */}
              <div className="absolute top-2 right-2 tag-geo flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{item.coordinates.lat.toFixed(4)}, {item.coordinates.lng.toFixed(4)}</span>
              </div>

              {/* Verified Badge */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-trust-500/90 text-white text-[10px] font-bold rounded-full">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-navy-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <p className="text-xs text-gray-300 text-center leading-relaxed">{item.description}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h4 className="text-sm font-semibold text-white mb-2 group-hover:text-trust-400 transition-colors">
                {item.title}
              </h4>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span>{new Date(item.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <User className="w-3 h-3 flex-shrink-0" />
                  <span>{item.verifiedBy}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-trust-400 font-medium">
                  <IndianRupee className="w-3 h-3 flex-shrink-0" />
                  <span>{item.cost}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
