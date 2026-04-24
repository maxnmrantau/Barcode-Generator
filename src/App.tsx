/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { 
  Barcode as BarcodeIcon, 
  Trash2, 
  Download, 
  LayoutGrid, 
  List, 
  ChevronLeft, 
  ChevronRight,
  Info,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants ---
const ITEMS_PER_PAGE = 100;
const MAX_BARCODES = 1000;

// --- Types ---
interface BarcodeItem {
  id: string;
  data: string;
}

interface BarcodeConfig {
  type: string;
  width: number;
  height: number;
  unit: 'inch' | 'cm' | 'mm';
  showText: boolean;
  fontName: string;
  fontSize: number;
}

// --- Barcode Component ---
const Barcode = ({ data, config }: { data: string; config: BarcodeConfig }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (svgRef.current) {
      try {
        // Convert unit to pixels (approximate 96 DPI for web)
        let heightPx = config.height || 1;
        let widthPx = config.width || 3;
        
        if (config.unit === 'inch') {
          heightPx *= 96;
          widthPx *= 96;
        } else if (config.unit === 'cm') {
          heightPx = (config.height / 2.54) * 96;
          widthPx = (config.width / 2.54) * 96;
        } else if (config.unit === 'mm') {
          heightPx = (config.height / 25.4) * 96;
          widthPx = (config.width / 25.4) * 96;
        }

        JsBarcode(svgRef.current, data, {
          format: config.type,
          width: 2, // Default bar width
          height: 100, // Internal height baseline
          displayValue: false,
          margin: 10,
          background: '#ffffff',
          lineColor: '#000000'
        });

        // Apply physical dimensions to SVG to ensure it respects the config
        // Using setAttribute to override JsBarcode's defaults
        svgRef.current.setAttribute('width', widthPx.toString());
        svgRef.current.setAttribute('height', heightPx.toString());
        svgRef.current.setAttribute('preserveAspectRatio', 'none');
        
        // Also apply to style for CSS layout consistency
        svgRef.current.style.width = `${widthPx}px`;
        svgRef.current.style.height = `${heightPx}px`;

        setError(false);
      } catch (err) {
        console.error('Barcode generation error:', err);
        setError(true);
      }
    }
  }, [data, config]);

  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-emerald-200 overflow-hidden">
      <div className="flex items-center justify-center bg-white rounded-lg p-2 overflow-auto">
        {error ? (
          <div className="flex flex-col items-center gap-1 text-red-500 font-mono text-xs text-center p-4">
            <AlertCircle size={20} />
            <span>Invalid Data</span>
          </div>
        ) : (
          <svg ref={svgRef} className="shrink-0" />
        )}
      </div>
      {config.showText && (
        <div 
          className="text-center py-2 px-3 bg-gray-50 rounded-lg text-gray-700 font-mono text-xs break-all border border-gray-100"
          style={{ fontFamily: config.fontName, fontSize: `${config.fontSize}px` }}
        >
          {data}
        </div>
      )}
    </div>
  );
};

// --- Main Application ---
export default function App() {
  const [barcodeData, setBarcodeData] = useState<string>('SAMPLE001\nSAMPLE002\nSAMPLE003\nSAMPLE004');
  const [items, setItems] = useState<BarcodeItem[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [config, setConfig] = useState<BarcodeConfig>({
    type: 'CODE128',
    width: 3.5,
    height: 1.2,
    unit: 'inch',
    showText: true,
    fontName: 'Arial',
    fontSize: 15
  });

  const handleGenerate = () => {
    setErrorMessage(null);
    const rawLines = barcodeData.split(/\r?\n/);
    const lines = rawLines.map(line => line.trim()).filter(line => line !== '');
    
    if (lines.length > MAX_BARCODES) {
      setErrorMessage(`Batas maksimum adalah ${MAX_BARCODES} barcode. Data Anda memiliki ${lines.length} baris. Mohon kurangi data Anda.`);
      alert(`Batas maksimum adalah ${MAX_BARCODES} barcode. Data Anda memiliki ${lines.length} baris. Mohon kurangi data Anda.`);
      return;
    }

    if (lines.length === 0) {
      setErrorMessage('Silakan masukkan data barcode!');
      alert('Silakan masukkan data barcode!');
      return;
    }

    const newItems = lines.map((line, idx) => ({
      id: `${Date.now()}-${idx}`,
      data: line
    }));

    setItems(newItems);
    setIsGenerated(true);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setBarcodeData('');
    setItems([]);
    setIsGenerated(false);
    setErrorMessage(null);
  };

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const currentItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <BarcodeIcon size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Bulk Barcode Pro</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Enterprise Suite</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Print button removed per user request */}
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden lg:flex-row flex-col">
        {/* Sidebar */}
        <aside className="w-full lg:w-96 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto print:hidden">
          <div className="p-6 space-y-6">
            {/* Input Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Input Data</label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                    {barcodeData.split('\n').filter(l => l.trim()).length} / {MAX_BARCODES}
                  </span>
                </div>
              </div>
              
              <div className="relative group">
                <textarea
                  value={barcodeData}
                  onChange={(e) => {
                    setBarcodeData(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Enter data (one per line)..."
                  className={`w-full h-48 bg-gray-50 border ${errorMessage ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl p-4 text-sm font-mono focus:ring-2 ${errorMessage ? 'focus:ring-red-500' : 'focus:ring-emerald-500'} focus:border-transparent outline-none transition-all resize-none`}
                />
              </div>

              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-100 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              <div className="flex gap-2">
                <button 
                  onClick={handleClear}
                  className="w-full px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2 font-medium text-sm"
                >
                  <Trash2 size={18} />
                  Clear Data
                </button>
              </div>
            </div>

            {/* Config Section */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Barcode Type</label>
                  <select 
                    value={config.type}
                    onChange={(e) => setConfig({...config, type: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="CODE128">Code 128 (Auto)</option>
                    <option value="CODE39">Code 39</option>
                    <option value="EAN13">EAN-13</option>
                    <option value="UPC">UPC</option>
                    <option value="ITF14">ITF-14</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unit</label>
                  <select 
                    value={config.unit}
                    onChange={(e) => setConfig({...config, unit: e.target.value as any})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none"
                  >
                    <option value="inch">Inch</option>
                    <option value="cm">CM</option>
                    <option value="mm">MM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Width ({config.unit})</label>
                  <input 
                    type="number"
                    value={config.width}
                    onChange={(e) => setConfig({...config, width: parseFloat(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Height ({config.unit})</label>
                  <input 
                    type="number"
                    value={config.height}
                    onChange={(e) => setConfig({...config, height: parseFloat(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-sm font-medium text-gray-600">Show Label Text</span>
                <button 
                  onClick={() => setConfig({...config, showText: !config.showText})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${config.showText ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.showText ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <button 
                onClick={handleGenerate}
                className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold uppercase tracking-wider shadow-lg shadow-emerald-100 hover:bg-emerald-600 hover:-translate-y-0.5 transition-all active:translate-y-0"
              >
                Generate Barcodes
              </button>
            </div>

            {/* Info */}
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3 text-blue-700">
              <Info size={20} className="shrink-0" />
              <p className="text-xs leading-relaxed">
                <span className="font-bold">Pro Tip:</span> For best scanning results, keep the width ratio consistent and ensure high ink contrast.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 flex flex-col bg-gray-50/50 p-6 overflow-y-auto">
          {!isGenerated ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-emerald-500 shadow-xl border border-gray-100">
                <BarcodeIcon size={48} />
              </div>
              <div className="max-w-xs">
                <h3 className="font-bold text-gray-900">Preview Area Empty</h3>
                <p className="text-sm text-gray-500 mt-1">Configure your settings and click Generate to see the results here.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-7xl mx-auto w-full">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm print:hidden">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Results</span>
                    <span className="text-sm font-bold">{items.length} Barcodes</span>
                  </div>
                  <div className="h-8 w-px bg-gray-100" />
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setLayout('grid')}
                      className={`p-2 rounded-lg transition-all ${layout === 'grid' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                      <LayoutGrid size={20} />
                    </button>
                    <button 
                      onClick={() => setLayout('list')}
                      className={`p-2 rounded-lg transition-all ${layout === 'list' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                      <List size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 mr-2">Page {currentPage} of {totalPages}</span>
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Logic to show pages around current page
                      let pageNum = i + 1;
                      if (totalPages > 5 && currentPage > 3) {
                        pageNum = Math.min(currentPage - 2 + i, totalPages - 4 + i);
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === pageNum ? 'bg-emerald-500 text-white shadow-sm' : 'hover:bg-gray-100 text-gray-500'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Barcode Display */}
              <motion.div 
                layout
                className={`grid gap-4 ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 max-w-3xl mx-auto'}`}
              >
                <AnimatePresence mode="popLayout">
                  {currentItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Barcode data={item.data} config={config} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Bottom Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center pt-8 pb-12 print:hidden">
                  <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-1">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-xl disabled:opacity-30 transition-all"
                    >
                      Previous
                    </button>
                    <div className="h-6 w-px bg-gray-100 mx-2" />
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-xl disabled:opacity-30 transition-all"
                    >
                      Next Page
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Print Overlay - Hidden in regular UI */}
      <div className="hidden print:block fixed inset-0 bg-white p-8">
        <div className="grid grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="break-inside-avoid">
              <Barcode data={item.data} config={config} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
