import { toast } from "sonner";

export function handleTablePrint(tableId: string = "data-table") {
  const printableContent = document.querySelector(`#${tableId}`)?.innerHTML;

  if (!printableContent) {
    toast.error("No table content to print.");
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    toast.error("Failed to open print window.");
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Table</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap');
          * {
            box-sizing: border-box;
            font-family: "Urbanist", sans-serif;
          }
          
          body {
            padding: 40px;
            background: #ffffff;
            color: #1f2937;
            line-height: 1.6;
            margin: 0;
          }
          
          table {
            border-collapse: separate;
            border-spacing: 0;
            width: 100%;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #e5e7eb;
          }
          
          th {
            background: linear-gradient(135deg, #001526 0%, #1d4ed8 100%);
            color: #ffffff;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: 0.025em;
            text-transform: uppercase;
            padding: 16px 20px;
            text-align: left;
            border: none;
            position: relative;
          }
          
          th:first-child {
            border-top-left-radius: 12px;
          }
          
          th:last-child {
            border-top-right-radius: 12px;
          }
          
          td {
            padding: 16px 20px;
            border-bottom: 1px solid #f3f4f6;
            border-right: 1px solid #f3f4f6;
            font-size: 12px;
            color: #374151;
            background: #ffffff;
            transition: background-color 0.2s ease;
          }
          
          td:last-child {
            border-right: none;
          }
          
          tr:nth-child(even) td {
            background: #f9fafb;
          }
          
          tr:hover td {
            background: #f3f4f6;
          }
          
          tr:last-child td {
            border-bottom: none;
          }
          
          tr:last-child td:first-child {
            border-bottom-left-radius: 12px;
          }
          
          tr:last-child td:last-child {
            border-bottom-right-radius: 12px;
          }
          
          /* Typography improvements */
          th {
            font-feature-settings: 'kern' 1, 'liga' 1;
          }
          
          td {
            font-feature-settings: 'kern' 1, 'liga' 1, 'tnum' 1;
          }
          
          /* Number alignment */
          td[data-type="number"] {
            text-align: right;
            font-variant-numeric: tabular-nums;
          }
          
          /* Status indicators */
          .status-active {
            color: #059669;
            font-weight: 500;
          }
          
          .status-inactive {
            color: #dc2626;
            font-weight: 500;
          }
          
          .status-pending {
            color: #d97706;
            font-weight: 500;
          }
          
          /* Print-specific styles */
          @media print {
            body {
              padding: 20px;
              background: white;
            }
            
            table {
              box-shadow: none;
              border: 2px solid #374151;
            }
            
            th {
              background: #374151 !important;
              color: white !important;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            
            tr:nth-child(even) td {
              background: #f9fafb !important;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
          }
          
          /* Responsive adjustments for smaller prints */
          @page {
            margin: 0.5in;
            size: auto;
          }
          
          /* Header styling */
          .table-header {
            margin-bottom: 24px;
            text-align: center;
          }
          
          .table-title {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 8px 0;
          }
          
          .table-subtitle {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
          }
          
          /* Footer styling */
          .table-footer {
            margin-top: 24px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
          }
        </style>
      </head>
      <body>
        <div class="table-header">
          <h1 class="table-title">Data Report</h1>
          <p class="table-subtitle">Generated on ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
        
        ${printableContent}
        
        <div class="table-footer">
          <p>This report was generated automatically. Please verify data accuracy before making decisions.</p>
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  
  // Add a small delay to ensure styles are loaded before printing
  setTimeout(() => {
    printWindow.print();
  }, 100);
}