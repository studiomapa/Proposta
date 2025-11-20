
export interface LineItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  senderAddress: string;
  senderWebsite: string;

  clientName: string;
  clientRole: string; // e.g. "Accounting Manager" shown in footer
  clientEmail: string;
  clientAddress: string;

  items: LineItem[];
  
  taxRate: number;
  discountRate: number;
  
  paymentMethod1: string;
  paymentMethod2: string;
}

export const INITIAL_INVOICE: InvoiceData = {
  invoiceNumber: "PROP-001",
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  
  senderName: "QUANTAM ART",
  senderPhone: "+55 11 91234 5575",
  senderEmail: "ola@quantam.art",
  senderAddress: "Rua Criativa 123, Cidade Design",
  senderWebsite: "www.quantam.art",

  clientName: "João Silva",
  clientRole: "Gerente Financeiro",
  clientEmail: "joao.silva@email.com",
  clientAddress: "Av. Empresarial 456, Centro Tecnológico",

  items: [
    {
      id: "1",
      name: "Identidade Visual",
      description: "Pacote completo de identidade visual incluindo logo, paleta de cores e tipografia.",
      price: 1000.00,
      quantity: 2
    },
    {
      id: "2",
      name: "Desenvolvimento Web",
      description: "Implementação Frontend da landing page usando React e Tailwind CSS.",
      price: 1000.00,
      quantity: 1
    },
    {
      id: "3",
      name: "Otimização SEO",
      description: "Configuração básica de SEO, meta tags e geração de sitemap.",
      price: 500.00,
      quantity: 2
    },
    {
      id: "4",
      name: "Assets Redes Sociais",
      description: "Conjunto de 10 templates para Instagram e LinkedIn.",
      price: 1000.00,
      quantity: 3
    }
  ],
  
  taxRate: 0,
  discountRate: 0,
  
  paymentMethod1: "banco@quantam.art",
  paymentMethod2: "pix@quantam.art"
};
