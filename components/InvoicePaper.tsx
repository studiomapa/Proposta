
import React, { ChangeEvent, useCallback } from 'react';
import { InvoiceData, LineItem } from '../types';
import { Plus, Trash2, MapPin, Globe, Mail, Phone } from 'lucide-react';

interface InvoicePaperProps {
  data: InvoiceData;
  updateData: (field: keyof InvoiceData, value: any) => void;
}

export const InvoicePaper: React.FC<InvoicePaperProps> = ({ data, updateData }) => {

  const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    const newItems = data.items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateData('items', newItems);
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Novo Produto",
      description: "Descrição do serviço ou produto",
      price: 0,
      quantity: 1
    };
    updateData('items', [...data.items, newItem]);
  };

  const removeItem = (id: string) => {
    updateData('items', data.items.filter(i => i.id !== id));
  };

  const calculateSubtotal = useCallback(() => {
    return data.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [data.items]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const subtotal = calculateSubtotal();
  const taxAmount = subtotal * (data.taxRate / 100);
  const discountAmount = subtotal * (data.discountRate / 100);
  const total = subtotal + taxAmount - discountAmount;

  return (
    <div className="print-container bg-white w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-2xl relative flex flex-col text-slate-800 overflow-hidden">
      
      {/* Header Graphics */}
      <div className="absolute top-0 left-0 w-full h-40 overflow-hidden pointer-events-none z-0">
         {/* Dark Navy Shape */}
         <div className="absolute top-[-80px] left-[-50px] w-[60%] h-60 bg-slate-900 transform -skew-x-12 z-10"></div>
         {/* Orange Accent Shape */}
         <div className="absolute top-[-90px] left-[10%] w-[100px] h-64 bg-orange-500 transform -skew-x-12 z-0 opacity-90"></div>
         {/* Right Side Navy Bar */}
         <div className="absolute top-0 right-0 w-[60%] h-24 bg-slate-900 z-10 flex items-center justify-end pr-12">
         </div>
      </div>

      {/* Header Content */}
      <div className="relative z-20 px-12 pt-10 pb-8 flex justify-between items-start">
        <div className="w-1/2 pt-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full border-4 border-orange-500 flex items-center justify-center text-orange-500 font-bold text-2xl bg-white">
                    Q
                </div>
                <div className="flex flex-col">
                     <input 
                        className="font-bold text-xl bg-transparent border-b border-transparent hover:border-orange-300 focus:border-orange-500 focus:outline-none uppercase tracking-wider text-slate-900 w-full placeholder-slate-400"
                        value={data.senderName}
                        onChange={(e) => updateData('senderName', e.target.value)}
                        placeholder="NOME DA EMPRESA"
                     />
                     <span className="text-[10px] tracking-[0.2em] text-slate-500 uppercase font-medium">O Auge da Criatividade</span>
                </div>
            </div>
        </div>

        {/* Contact Info - Absolute positioned in the right header bar for strict visual match */}
        <div className="absolute top-0 right-0 w-[60%] h-24 flex items-center justify-end pr-12 gap-6 text-white text-[10px] font-medium">
             <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                    <Phone size={12} className="text-orange-500" />
                    <input 
                        value={data.senderPhone} 
                        onChange={(e) => updateData('senderPhone', e.target.value)}
                        className="bg-transparent border-none text-white focus:outline-none focus:ring-1 focus:ring-orange-500 w-28"
                    />
                </div>
                <div className="flex items-center gap-2 opacity-70">
                    <Phone size={12} className="text-orange-500" />
                    <span>+55 00 0000 0000</span>
                </div>
             </div>

             <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                     <Mail size={12} className="text-orange-500" />
                     <input 
                        value={data.senderEmail} 
                        onChange={(e) => updateData('senderEmail', e.target.value)}
                        className="bg-transparent border-none text-white focus:outline-none focus:ring-1 focus:ring-orange-500 w-32"
                    />
                </div>
                <div className="flex items-center gap-2">
                     <Globe size={12} className="text-orange-500" />
                     <input 
                        value={data.senderWebsite} 
                        onChange={(e) => updateData('senderWebsite', e.target.value)}
                        className="bg-transparent border-none text-white focus:outline-none focus:ring-1 focus:ring-orange-500 w-32"
                    />
                </div>
             </div>

             <div className="flex flex-col items-start gap-1 w-32">
                <div className="flex items-start gap-2">
                     <MapPin size={12} className="text-orange-500 mt-0.5" />
                     <textarea 
                        value={data.senderAddress} 
                        onChange={(e) => updateData('senderAddress', e.target.value)}
                        className="bg-transparent border-none text-white focus:outline-none focus:ring-1 focus:ring-orange-500 w-full resize-none h-8 leading-tight"
                    />
                </div>
             </div>
        </div>
      </div>

      {/* Title & Client Info */}
      <div className="px-12 mt-8 flex justify-between items-start">
        <div>
            <p className="text-xs text-slate-500 font-medium mb-1">Proposta para</p>
            <input 
                className="text-2xl font-bold text-slate-900 mb-1 bg-transparent border-b border-transparent hover:border-orange-300 focus:outline-none w-full"
                value={data.clientName}
                onChange={(e) => updateData('clientName', e.target.value)}
            />
            <div className="text-xs text-slate-600 space-y-1">
                <p>T: <input value={data.senderPhone} readOnly className="bg-transparent outline-none text-slate-500 w-32"/></p>
                <p>E: <input value={data.clientEmail} onChange={e => updateData('clientEmail', e.target.value)} className="bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none w-48" /></p>
                <p>E: <input value={data.clientAddress} onChange={e => updateData('clientAddress', e.target.value)} className="bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none w-64" /></p>
            </div>
        </div>

        <div className="flex flex-col items-end">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">PROPOSTA</h1>
            <div className="grid grid-cols-[80px_1fr] gap-y-1 text-sm text-right">
                <span className="font-bold text-slate-800">Data</span>
                <input 
                    type="date"
                    value={data.date} 
                    onChange={e => updateData('date', e.target.value)}
                    className="text-right bg-transparent border-b border-transparent hover:border-orange-300 focus:outline-none"
                />
                <span className="font-bold text-slate-800">Vencimento</span>
                <input 
                    type="date"
                    value={data.dueDate} 
                    onChange={e => updateData('dueDate', e.target.value)}
                    className="text-right bg-transparent border-b border-transparent hover:border-orange-300 focus:outline-none"
                />
            </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-12 mt-12 flex-grow">
        <div className="w-full">
            {/* Header Row */}
            <div className="flex w-full bg-orange-500 text-white py-3 px-4 font-bold text-sm uppercase tracking-wide">
                <div className="w-[45%] pl-4">Descrição do Produto</div>
                <div className="w-[15%] text-center">Preço</div>
                <div className="w-[15%] text-center">Qtd</div>
                <div className="w-[20%] text-right pr-4">Total</div>
                <div className="w-[5%] no-print"></div>
            </div>

            {/* Items */}
            {data.items.map((item) => (
                <div key={item.id} className="group flex w-full py-4 px-4 border-b border-slate-100 even:bg-slate-50 hover:bg-blue-50 transition-colors items-start">
                    <div className="w-[45%] pl-4 pr-2">
                        <input 
                            className="w-full font-bold text-slate-800 bg-transparent focus:outline-none mb-1"
                            value={item.name}
                            onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                            placeholder="Nome do Item"
                        />
                        <textarea 
                            className="w-full text-xs text-slate-500 bg-transparent focus:outline-none resize-none h-auto leading-relaxed"
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            placeholder="Descrição..."
                            rows={2}
                        />
                    </div>
                    <div className="w-[15%] text-center">
                        <span className="text-slate-400 text-sm mr-1">R$</span>
                        <input 
                            type="number"
                            className="w-20 text-center font-medium text-slate-700 bg-transparent focus:outline-none"
                            value={item.price}
                            onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                        />
                    </div>
                    <div className="w-[15%] text-center">
                         <input 
                            type="number"
                            className="w-12 text-center font-medium text-slate-700 bg-transparent focus:outline-none"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        />
                    </div>
                    <div className="w-[20%] text-right font-bold text-slate-800 pr-4">
                        {formatCurrency(item.price * item.quantity)}
                    </div>
                    <div className="w-[5%] flex justify-center items-center no-print opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => removeItem(item.id)}
                            className="text-red-400 hover:text-red-600 p-1"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}

            {/* Add Item Button */}
            <button 
                onClick={addItem}
                className="no-print mt-4 flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-orange-600 px-4"
            >
                <Plus size={16} /> Adicionar Item
            </button>
        </div>
      </div>

      {/* Summary & Footer */}
      <div className="px-12 pb-12 mt-8">
         <div className="flex justify-end mb-8">
             <div className="w-[40%]">
                 <div className="flex justify-between py-2 text-sm text-slate-800 font-bold">
                     <span>Subtotal</span>
                     <span>: {formatCurrency(subtotal)}</span>
                 </div>
                 <div className="flex justify-between py-2 text-sm text-slate-600">
                     <span className="flex items-center gap-2">
                        Imposto 
                        <input 
                            type="number" 
                            value={data.taxRate} 
                            onChange={e => updateData('taxRate', parseFloat(e.target.value) || 0)}
                            className="w-8 border-b border-slate-300 text-center bg-transparent focus:outline-none text-xs"
                        />
                        %
                     </span>
                     <span>: {formatCurrency(taxAmount)}</span>
                 </div>
                 <div className="flex justify-between py-2 text-sm text-slate-600 mb-2">
                     <span className="flex items-center gap-2">
                        Desconto 
                        <input 
                            type="number" 
                            value={data.discountRate} 
                            onChange={e => updateData('discountRate', parseFloat(e.target.value) || 0)}
                            className="w-8 border-b border-slate-300 text-center bg-transparent focus:outline-none text-xs"
                        />
                        %
                     </span>
                     <span>: {discountAmount > 0 ? '-' : ''}{formatCurrency(discountAmount)}</span>
                 </div>
                 
                 <div className="flex justify-between items-center bg-slate-900 text-white py-2 px-0 mt-2">
                      <div className="pl-4 font-bold uppercase text-sm tracking-wider">Total Geral</div>
                      <div className="relative bg-orange-500 h-10 flex items-center px-6 font-bold text-lg shadow-[-10px_0_0_0_#f97316]">
                        {formatCurrency(total)}
                        {/* Decorative triangle for the grand total bar */}
                        <div className="absolute left-0 top-0 h-full w-4 bg-slate-900 transform -skew-x-12 origin-bottom -translate-x-2"></div>
                      </div>
                 </div>
             </div>
         </div>

         <div className="flex justify-between items-end mt-12">
             <div>
                 <h3 className="font-bold text-slate-800 mb-2">Opção de Pagamento</h3>
                 <div className="text-xs text-slate-500 space-y-1">
                     <p>Método 1: <input value={data.paymentMethod1} onChange={e => updateData('paymentMethod1', e.target.value)} className="bg-transparent outline-none hover:text-slate-800"/></p>
                     <p>Método 2: <input value={data.paymentMethod2} onChange={e => updateData('paymentMethod2', e.target.value)} className="bg-transparent outline-none hover:text-slate-800"/></p>
                     <p>Aceitamos PIX / Transferência</p>
                 </div>
             </div>
             
             <div className="text-right">
                 <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-wide text-sm">OBRIGADO<br/>PELA PREFERÊNCIA</h3>
                 <div className="text-xs text-slate-500 max-w-[250px] mb-8 leading-relaxed">
                    Agradecemos a confiança em nossos serviços. Estamos à disposição para qualquer dúvida.
                 </div>

                 <div className="mt-8">
                     <input 
                        value={data.clientName} 
                        readOnly
                        className="font-bold text-slate-900 text-right bg-transparent outline-none block w-full mb-1"
                     />
                     <input 
                        value={data.clientRole}
                        onChange={e => updateData('clientRole', e.target.value)}
                        className="text-xs text-slate-500 text-right bg-transparent outline-none block w-full"
                     />
                     <div className="mt-4 font-handwriting text-2xl text-slate-600 pr-2" style={{ fontFamily: 'cursive' }}>
                        {data.clientName.split(' ')[0]} {data.clientName.split(' ').pop()?.toLowerCase()}
                     </div>
                 </div>
             </div>
         </div>
      </div>
      
      {/* Footer Decorative Bar */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-slate-900 overflow-hidden">
          {/* Orange triangle */}
          <div className="absolute bottom-0 right-0 w-[60%] h-full bg-orange-500 transform -skew-x-[30deg] origin-bottom-right"></div>
      </div>
    </div>
  );
};
