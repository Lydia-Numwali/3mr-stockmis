import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ExportColumn {
  key: string;
  label: string;
  format?: (value: any) => string;
}

export interface ExportOptions {
  filename: string;
  title: string;
  columns: ExportColumn[];
  data: any[];
}

export const exportToExcel = ({ filename, title, columns, data }: ExportOptions) => {
  // Prepare data for Excel
  const excelData = data.map(row => {
    const excelRow: any = {};
    columns.forEach(col => {
      const value = getNestedValue(row, col.key);
      excelRow[col.label] = col.format ? col.format(value) : value;
    });
    return excelRow;
  });

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Add title row
  XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: 'A1' });
  
  // Adjust column widths
  const colWidths = columns.map(col => ({ wch: Math.max(col.label.length, 15) }));
  ws['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Data');

  // Save file
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPDF = ({ filename, title, columns, data }: ExportOptions) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 20);

  // Prepare table data
  const headers = columns.map(col => col.label);
  const rows = data.map(row => 
    columns.map(col => {
      const value = getNestedValue(row, col.key);
      return col.format ? col.format(value) : String(value || '');
    })
  );

  // Add table
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 30,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [0, 21, 38], // #001526 in RGB
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [242, 245, 249], // #f2f5f9 in RGB
    },
  });

  // Save PDF
  doc.save(`${filename}.pdf`);
};

export const printTable = ({ title, columns, data }: ExportOptions) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  // Prepare table HTML
  const headers = columns.map(col => `<th style="padding: 8px; border: 1px solid #ddd; background-color: #001526; color: white;">${col.label}</th>`).join('');
  
  const rows = data.map((row, index) => {
    const cells = columns.map(col => {
      const value = getNestedValue(row, col.key);
      const formattedValue = col.format ? col.format(value) : String(value || '');
      return `<td style="padding: 8px; border: 1px solid #ddd;">${formattedValue}</td>`;
    }).join('');
    
    const bgColor = index % 2 === 0 ? 'white' : '#f2f5f9';
    return `<tr style="background-color: ${bgColor};">${cells}</tr>`;
  }).join('');

  // Create HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #001526; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <table>
        <thead>
          <tr>${headers}</tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `;

  // Write content and print
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

// Helper function to get nested object values
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value || 0);
};

// Format date
export const formatDate = (value: string | Date): string => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date and time
export const formatDateTime = (value: string | Date): string => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};