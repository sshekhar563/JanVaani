import { useState, useRef, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle2, ShieldAlert, Camera,
  Target, TrendingUp, X
} from 'lucide-react';

const PRIORITY_CONFIG = {
  HIGH: { color: 'red', bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400', label: '🔴 HIGH' },
  MEDIUM: { color: 'amber', bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400', label: '🟡 MEDIUM' },
  LOW: { color: 'emerald', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400', label: '🟢 LOW' },
};

export default function PotholeDetectionCard({ result, imageUrl, onClose }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const priority = PRIORITY_CONFIG[result?.priority] || PRIORITY_CONFIG.LOW;
  const confidence = Math.round((result?.confidence || 0) * 100);

  // Draw bounding boxes on the canvas overlay
  useEffect(() => {
    if (!imageLoaded || !canvasRef.current || !imgRef.current) return;

    const canvas = canvasRef.current;
    const img = imgRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const boxes = result?.bounding_boxes || [];
    const scaleX = canvas.width / (result?.image_width || canvas.width);
    const scaleY = canvas.height / (result?.image_height || canvas.height);

    boxes.forEach((box) => {
      const [xmin, ymin, xmax, ymax] = box;
      const x = xmin * scaleX;
      const y = ymin * scaleY;
      const w = (xmax - xmin) * scaleX;
      const h = (ymax - ymin) * scaleY;

      // Draw box
      ctx.strokeStyle = result?.priority === 'HIGH' ? '#ef4444' : result?.priority === 'MEDIUM' ? '#f59e0b' : '#10b981';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);

      // Draw label background
      ctx.fillStyle = result?.priority === 'HIGH' ? 'rgba(239,68,68,0.85)' : result?.priority === 'MEDIUM' ? 'rgba(245,158,11,0.85)' : 'rgba(16,185,129,0.85)';
      const labelText = result?.label || 'Pothole';
      ctx.font = 'bold 14px Inter, sans-serif';
      const textWidth = ctx.measureText(labelText).width;
      ctx.fillRect(x, y - 24, textWidth + 12, 24);

      // Draw label text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(labelText, x + 6, y - 7);
    });
  }, [imageLoaded, result]);

  if (!result) return null;

  return (
    <div className={`${priority.bg} ${priority.border} border rounded-2xl p-5 animate-fade-in relative overflow-hidden`}>
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${priority.color}-500/5 to-transparent pointer-events-none`} />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${priority.bg} ${priority.border} border flex items-center justify-center`}>
            {result.detected ? (
              <AlertTriangle className={`w-5 h-5 ${priority.text}`} />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <div>
            <p className={`text-sm font-bold ${priority.text}`}>AI Detection Result</p>
            <p className="text-xs text-gray-500">{result.original_filename || 'Uploaded Image'}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Detection Result Label */}
      <div className={`text-center py-3 mb-4 rounded-xl ${priority.bg} ${priority.border} border`}>
        <p className={`text-lg font-bold ${priority.text}`}>
          {result.label || 'Unknown'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Confidence */}
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] uppercase tracking-wider text-gray-500">Confidence</span>
          </div>
          <p className="text-xl font-bold text-white">{confidence}%</p>
          {/* Mini progress bar */}
          <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                confidence >= 70 ? 'bg-red-500' : confidence >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* Priority */}
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-saffron-400" />
            <span className="text-[10px] uppercase tracking-wider text-gray-500">Priority</span>
          </div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${priority.bg} ${priority.border} border ${priority.text}`}>
            {priority.label}
          </span>
        </div>

        {/* Detections */}
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Camera className="w-3.5 h-3.5 text-trust-400" />
            <span className="text-[10px] uppercase tracking-wider text-gray-500">Regions</span>
          </div>
          <p className="text-xl font-bold text-white">{(result.bounding_boxes || []).length}</p>
        </div>
      </div>

      {/* Image with bounding box overlay */}
      {imageUrl && (
        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-navy-900/50">
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Detection result"
            className="w-full h-auto block"
            onLoad={() => setImageLoaded(true)}
            crossOrigin="anonymous"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ imageRendering: 'auto' }}
          />
        </div>
      )}
    </div>
  );
}
