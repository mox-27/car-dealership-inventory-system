import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, UploadCloud, FileJson, FileText, X } from 'lucide-react';

const BulkImportModal = ({ onSubmit, onClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row');
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const expectedHeaders = ['make', 'model', 'category', 'price', 'quantity'];
    
    // Validate headers
    for (const h of expectedHeaders) {
      if (!headers.includes(h)) {
        throw new Error(`Missing required CSV header: ${h}`);
      }
    }

    return lines.slice(1).map((line, rowIndex) => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((header, index) => {
        let val = values[index]?.trim() || '';
        if (header === 'price' || header === 'quantity') {
          val = Number(val);
          if (isNaN(val)) throw new Error(`Invalid number in column '${header}' at row ${rowIndex + 2}`);
        }
        obj[header] = val;
      });
      return obj;
    });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setError('');
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    setError('');
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      let parsedData;
      
      try {
        if (file.name.toLowerCase().endsWith('.csv')) {
          parsedData = parseCSV(content);
        } else if (file.name.toLowerCase().endsWith('.json')) {
          parsedData = JSON.parse(content);
          if (!Array.isArray(parsedData)) {
            throw new Error('JSON must be an array of vehicle objects.');
          }
        } else {
          throw new Error('Unsupported file format. Please upload .csv or .json');
        }
      } catch (err) {
        setError(err.message || 'Invalid file format. Please check your data.');
        return;
      }

      setLoading(true);
      try {
        await onSubmit(parsedData);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Import failed');
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read file');
    };
    
    reader.readAsText(file);
  };

  return createPortal(
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--ink)]/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div className="w-full max-w-md spec-panel animate-fade-in-up flex flex-col">
        {/* Header */}
        <div className="p-4 spec-border-b flex justify-between items-start bg-[var(--paper)] flex-shrink-0">
          <div>
            <h3 className="font-display text-xl text-[var(--ink)]">BULK IMPORT</h3>
            <p className="font-mono text-xs text-[var(--text-secondary)] mt-1">
              Upload a .csv or .json file to import vehicles
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--ink)] font-mono text-sm px-2"
          >
            [X]
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col bg-[var(--panel)]">
          {error && (
            <div className="mb-4 p-3 bg-[var(--out-of-stock)]/10 border border-[var(--out-of-stock)] text-[var(--out-of-stock)] font-mono text-xs">
              {error}
            </div>
          )}
          
          <div className="mt-2 mb-4">
            {!file ? (
              <div 
                className="border-2 border-dashed spec-border p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[var(--paper)] transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="h-8 w-8 text-[var(--text-muted)] mb-3" />
                <p className="font-mono text-sm text-[var(--ink)] font-medium">Click to upload file</p>
                <p className="font-mono text-xs text-[var(--text-secondary)] mt-1">Accepts .json or .csv</p>
              </div>
            ) : (
              <div className="spec-border p-4 bg-[var(--paper)] flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  {file.name.toLowerCase().endsWith('.csv') ? (
                    <FileText className="h-6 w-6 text-[var(--text-secondary)] flex-shrink-0" />
                  ) : (
                    <FileJson className="h-6 w-6 text-[var(--text-secondary)] flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-medium text-[var(--ink)] truncate">{file.name}</p>
                    <p className="font-mono text-xs text-[var(--text-secondary)]">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearFile}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--out-of-stock)] transition-colors flex-shrink-0"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,.json,application/json,text/csv"
              className="hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 spec-border-t bg-[var(--paper)] flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs btn-outline"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            className={`flex-1 py-2 text-xs flex items-center justify-center ${!file ? 'btn-outline opacity-50' : 'btn-signal'}`}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'IMPORT VEHICLES'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BulkImportModal;
