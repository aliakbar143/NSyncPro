
import React, { useState } from 'react';
import { X, Clipboard, CheckCircle, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: Product[]) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        throw new Error("Invalid data format: Expected an array of products.");
      }
      onImport(parsed);
      onClose();
      setJsonInput('');
      setError(null);
    } catch (e) {
      setError("Invalid JSON. Please ensure you copied the data correctly from the extension.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Clipboard className="w-5 h-5 mr-2 text-indigo-600" />
            Import from Chrome Extension
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
            <p className="font-bold mb-1">How to use:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open your Noon Store page in a new tab.</li>
              <li>Click the <b>NoonSync Helper</b> extension icon.</li>
              <li>Click <b>Extract & Copy Data</b>.</li>
              <li>Come back here and paste the data below.</li>
            </ol>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste the copied JSON data here..."
            className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs"
          />

          {error && (
            <div className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleImport}
            disabled={!jsonInput}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Import Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
