import React, { useState } from "react";
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Download, 
  Activity, 
  Cpu,
  RefreshCw,
  SearchCode
} from "lucide-react";
import { DocumentType, VerificationStatus } from "../types";

interface DocumentVerificationProps {
  application: any;
  onVerifyDoc: (docType: DocumentType, fileName: string, base64: string) => Promise<any>;
}

export default function DocumentVerification({ application, onVerifyDoc }: DocumentVerificationProps) {
  const [activeDocType, setActiveDocType] = useState<DocumentType>(DocumentType.Intermediate);
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const docs = application?.documents || {};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(activeDocType);

    // Read file as base64 simulation or short string to pass to our API
    const reader = new FileReader();
    reader.onload = async () => {
      // Clean base64 output
      const base64String = (reader.result as string).split(',')[1] || "";
      try {
        await onVerifyDoc(activeDocType, selectedFile.name, base64String);
        setSelectedFile(null);
      } catch (err) {
        console.error("Document verify post failed:", err);
      } finally {
        setLoading(null);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.Valid:
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case VerificationStatus.Blurred:
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case VerificationStatus.Rejected:
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.Valid: return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case VerificationStatus.Blurred: return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default: return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">AI Document Verification</h1>
        <p className="text-xs text-gray-500 dark:text-slate-400">Our machine learning pipeline reads student transcripts, audits seal signatures, and extracts enrollment metadata automatically.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Column (5 cols): Upload Box and Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-100 p-6 rounded-3xl dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Submit Document</h3>

            {/* Document Type Selector */}
            <div className="space-y-1 text-xs">
              <label className="block font-semibold text-gray-600 dark:text-slate-400">Target File Classification</label>
              <select
                value={activeDocType}
                onChange={(e) => setActiveDocType(e.target.value as DocumentType)}
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
              >
                {Object.values(DocumentType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Drag and Drop Box */}
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 hover:border-indigo-400 dark:border-slate-800 dark:hover:border-indigo-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-slate-50/50 dark:bg-slate-950/25">
                <input
                  type="file"
                  id="doc-uploader-input"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="flex flex-col items-center space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-full shadow-sm dark:bg-slate-900">
                    <Upload className="h-5 w-5 text-indigo-500 animate-pulse" />
                  </div>
                  {selectedFile ? (
                    <div className="text-center">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{selectedFile.name}</p>
                      <p className="text-[10px] text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-slate-700 dark:text-slate-300">Click to upload file</p>
                      <p className="text-[10px] text-gray-400 mt-1">Supports PNG, JPG, PDF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                id="verify-doc-submit-btn"
                disabled={!selectedFile || !!loading}
                className="flex w-full items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-md disabled:opacity-40 transition-all text-xs"
              >
                {loading === activeDocType ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Neural Model Analyzing Signature...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="h-4 w-4" />
                    <span>Verify with Computer Vision</span>
                  </>
                )}
              </button>
            </form>

          </div>
        </div>

        {/* Right Column (7 cols): Verification Status List & Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active File Audit Log</h3>
            
            <div className="space-y-3">
              {Object.entries(docs).map(([key, doc]: [string, any]) => (
                <div 
                  key={key} 
                  className="p-4 border border-gray-100 rounded-2xl dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-950/25 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-50 dark:border-slate-800/50">
                    <div className="flex items-center space-x-2.5">
                      <FileText className="h-5 w-5 text-indigo-500 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-none mb-1">{key}</h4>
                        <p className="text-[10px] font-mono text-gray-400 leading-none">{doc.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 text-[10px] font-bold border rounded-full ${getStatusBadge(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        <span>{doc.status}</span>
                      </span>
                      
                      <button 
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1.5 rounded-lg border border-gray-100 hover:bg-white dark:border-slate-800 text-gray-500 hover:text-indigo-600 transition-all shrink-0"
                        title="View extracted metadata"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {doc.remarks && (
                    <div className="pt-3 text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">
                      <span className="font-bold text-slate-700 dark:text-slate-300">AI Remarks:</span> {doc.remarks}
                    </div>
                  )}

                  {doc.confidence > 0 && (
                    <div className="flex items-center justify-between pt-2 text-[10px] text-gray-400 font-mono">
                      <span>Neural confidence rate:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{doc.confidence}% certainty</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Expanded extracted JSON metadata panel */}
            {previewDoc && (
              <div className="mt-4 p-4 rounded-2xl border border-indigo-100 bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-950/40 space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2 dark:border-slate-800">
                  <span className="font-bold text-indigo-900 dark:text-indigo-400 flex items-center space-x-1">
                    <SearchCode className="h-4 w-4" />
                    <span>OCR Extracted Metadata Payload</span>
                  </span>
                  <button 
                    onClick={() => setPreviewDoc(null)}
                    className="text-gray-400 hover:text-gray-600 text-[10px] font-bold"
                  >
                    Close payload
                  </button>
                </div>
                <pre className="font-mono text-[10px] text-indigo-800 dark:text-indigo-300 whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(previewDoc.extractedData || { error: "No payload extracted for this category status" }, null, 2)}
                </pre>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
