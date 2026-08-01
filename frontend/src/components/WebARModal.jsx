import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, ExternalLink, Sparkles } from 'lucide-react';

export default function WebARModal({ isOpen, onClose, productName, usdzUrl, glbUrl }) {
  if (!isOpen) return null;

  const currentUrl = window.location.href;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> WebAR Mobile Trigger
            </div>
            <h3 className="text-lg font-bold text-white">{productName || '3D Model View'}</h3>
          </div>
        </div>

        {/* AR Information & QR Code */}
        <div className="flex flex-col items-center bg-slate-950 rounded-2xl p-6 border border-slate-800/80 mb-5">
          <div className="p-3 bg-white rounded-2xl shadow-inner mb-4">
            <QRCodeSVG value={currentUrl} size={180} level="H" includeMargin={false} />
          </div>
          <p className="text-xs text-center text-slate-400 max-w-xs">
            Scan this QR code with your mobile camera to view this 3D model in augmented reality via <span className="text-slate-200 font-semibold">iOS Quick Look (USDZ)</span> or <span className="text-slate-200 font-semibold">Android Scene Viewer (GLB)</span>.
          </p>
        </div>

        {/* Quick File Launch Links */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <a
            href={usdzUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition-all"
          >
            <span>iOS USDZ</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
          <a
            href={glbUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition-all"
          >
            <span>Android GLB</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
