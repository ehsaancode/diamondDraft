import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, ExternalLink, Sparkles } from 'lucide-react';

export default function WebARModal({ isOpen, onClose, productName, usdzUrl, glbUrl }) {
  if (!isOpen) return null;

  const currentUrl = window.location.href;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl text-gray-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-gray-100 border border-gray-200 rounded-2xl text-gray-800">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-gray-700" /> WebAR Mobile View
            </div>
            <h3 className="text-lg font-bold text-gray-900">{productName || '3D Model View'}</h3>
          </div>
        </div>

        {/* AR Information & QR Code */}
        <div className="flex flex-col items-center bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-5">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-200 mb-4">
            <QRCodeSVG value={currentUrl} size={180} level="H" includeMargin={false} />
          </div>
          <p className="text-xs text-center text-gray-500 max-w-xs leading-relaxed">
            Scan this QR code with your mobile camera to view this 3D model in augmented reality via <span className="text-gray-900 font-semibold">iOS Quick Look (USDZ)</span> or <span className="text-gray-900 font-semibold">Android Scene Viewer (GLB)</span>.
          </p>
        </div>

        {/* Quick File Launch Links */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <a
            href={usdzUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium border border-gray-200 transition-all"
          >
            <span>iOS USDZ</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </a>
          <a
            href={glbUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium border border-gray-200 transition-all"
          >
            <span>Android GLB</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </a>
        </div>
      </div>
    </div>
  );
}
