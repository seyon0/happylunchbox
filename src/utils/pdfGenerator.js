import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export const generateTaxInvoicePDF = (payout, shop) => {
  const doc = new jsPDF();
  
  const formattedStart = format(new Date(payout.periodStart), 'dd MMM yyyy');
  const formattedEnd = format(new Date(payout.periodEnd), 'dd MMM yyyy');
  const invoiceNumber = `INV-${payout.id.split('-')[0].toUpperCase()}`;
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(33, 43, 54);
  doc.text('TAX INVOICE', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(99, 115, 129);
  doc.text('Healthy Lunchbox Platform Ltd.', 14, 30);
  doc.text('123 Delivery Street, London, EC1A 1BB', 14, 35);
  doc.text('VAT Reg No: GB123456789', 14, 40);

  // Invoice Details Right
  doc.text(`Invoice No: ${invoiceNumber}`, 140, 22);
  doc.text(`Date: ${format(new Date(), 'dd MMM yyyy')}`, 140, 27);
  doc.text(`Period: ${formattedStart} - ${formattedEnd}`, 140, 32);

  // Bill To
  doc.setFontSize(12);
  doc.setTextColor(33, 43, 54);
  doc.text('Bill To:', 14, 55);
  doc.setFontSize(10);
  doc.text(shop.name, 14, 62);
  doc.text(`VAT Number: ${shop.vatNumber || 'Not Registered'}`, 14, 67);

  // Table
  const tableColumn = ["Description", "Gross Amount", "VAT (20%)", "Net Amount"];
  const tableRows = [
    [
      `Platform Commission for ${formattedStart} to ${formattedEnd}`,
      `£${payout.commission.toFixed(2)}`,
      `£${(payout.commission * 0.20).toFixed(2)}`, // Assuming 20% VAT on commission
      `£${(payout.commission * 1.20).toFixed(2)}`
    ]
  ];

  doc.autoTable({
    startY: 80,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129], textColor: 255 }, // brand color
    styles: { fontSize: 10, cellPadding: 5 },
  });

  // Summary
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(10);
  doc.text('Summary:', 140, finalY);
  
  doc.text('Gross Sales:', 140, finalY + 8);
  doc.text(`£${payout.grossAmount.toFixed(2)}`, 180, finalY + 8, { align: 'right' });
  
  doc.text('Less Commission:', 140, finalY + 16);
  doc.text(`-£${payout.commission.toFixed(2)}`, 180, finalY + 16, { align: 'right' });
  
  doc.setFont(undefined, 'bold');
  doc.text('Net Payout:', 140, finalY + 24);
  doc.text(`£${payout.netAmount.toFixed(2)}`, 180, finalY + 24, { align: 'right' });

  // Footer
  doc.setFont(undefined, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(145, 158, 171);
  doc.text('This is a computer generated invoice and does not require a signature.', 14, 280);

  doc.save(`${invoiceNumber}_${shop.name.replace(/\s+/g, '_')}.pdf`);
};
