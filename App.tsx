
import React, { useState } from 'react';
import { InvoicePaper } from './components/InvoicePaper';
import { InvoiceData, INITIAL_INVOICE } from './types';
import { Printer, Wand2, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { generateInvoiceData } from './services/geminiService';

const App: React.FC = () => {
  const [data, setData] = useState<InvoiceData>(INITIAL_INVOICE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateData = (field: keyof InvoiceData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    // Set the document title to influence the default filename in the print/PDF dialog
    document.title = `Proposta-${data.invoiceNumber || 'Nova'}`;
    window.print();
    document.title = originalTitle;
  };

  const handleReset = () => {
    if (window.confirm("Restaurar padrões da fatura?")) {
        setData(INITIAL_INVOICE);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const generatedData = await generateInvoiceData(aiPrompt);
      setData(prev => ({
        ...prev,
        ...generatedData,
        // Ensure items from AI replace current items completely
        items: generatedData.items || prev.items
      }));
      setShowAiModal(false);
      setAiPrompt('');
    } catch (err) {
      setError("Falha ao gerar fatura. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      
      {/* Top Toolbar (No Print) */}
      <div className="no-print sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm px-6 py-4 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="bg-orange-500 p-2 rounded-lg text-white font-bold">FQ</div>
                <h1 className="font-bold text-slate-800 text-lg">Gerador de Faturas</h1>
            </div>

            <div className="flex items-center gap-3">
                <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <RotateCcw size={16} /> Limpar
                </button>
                <button 
                    onClick={() => setShowAiModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-full transition-colors shadow-md"
                >
                    <Wand2 size={16} /> Preencher com IA
                </button>
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-full transition-colors shadow-md shadow-orange-200"
                >
                    <Printer size={16} /> Imprimir / PDF
                </button>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-center px-4">
        <InvoicePaper data={data} updateData={updateData} />
      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                        <Wand2 className="text-purple-600" /> Preenchimento com IA
                    </div>
                    <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600">
                        ✕
                    </button>
                </div>
                
                <p className="text-slate-600 text-sm mb-4">
                    Descreva a fatura que deseja criar. A IA irá gerar clientes realistas, itens e preços.
                </p>

                <textarea
                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none min-h-[100px] mb-4"
                    placeholder="Ex: Crie uma fatura para um serviço de fotografia freelance incluindo casamento e edição..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    autoFocus
                />

                {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-lg">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => setShowAiModal(false)}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleAiGenerate}
                        disabled={isGenerating || !aiPrompt.trim()}
                        className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isGenerating ? (
                            <>Gerando...</>
                        ) : (
                            <>Gerar <Wand2 size={14} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;
