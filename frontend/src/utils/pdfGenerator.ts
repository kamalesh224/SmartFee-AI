// agent-notes: { ctx: "PDF receipt generator styled for Vaigai College of Engineering (Anna University)", deps: ["jspdf", "src/types.ts"], state: active, last: "antigravity@2026-08-15" }
import jsPDF from 'jspdf';
import type { Transaction } from '../types';

export const generateReceiptPDF = (transaction: Transaction) => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(30, 58, 138); // Dark blue header
  doc.rect(0, 0, 210, 35, 'F');

  // Institution Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('VAIGAI COLLEGE OF ENGINEERING', 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Official Digital Payment Receipt | Anna University', 14, 28);

  // Status Badge
  doc.setFillColor(34, 197, 94); // Green
  doc.roundedRect(155, 12, 40, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PAID SUCCESS', 158, 20);

  // Metadata Table Box
  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 45, 182, 45, 3, 3, 'FD');

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');

  // Left Column Metadata
  doc.text('Receipt No:', 20, 56);
  doc.setFont('helvetica', 'normal');
  doc.text(transaction.receiptNo, 55, 56);

  doc.setFont('helvetica', 'bold');
  doc.text('Transaction ID:', 20, 66);
  doc.setFont('helvetica', 'normal');
  doc.text(transaction.id, 55, 66);

  doc.setFont('helvetica', 'bold');
  doc.text('Payment Gateway:', 20, 76);
  doc.setFont('helvetica', 'normal');
  doc.text(`${transaction.gateway} (${transaction.paymentMethod})`, 55, 76);

  // Right Column Metadata
  doc.setFont('helvetica', 'bold');
  doc.text('Date & Time:', 110, 56);
  doc.setFont('helvetica', 'normal');
  doc.text(transaction.transactionDate, 140, 56);

  doc.setFont('helvetica', 'bold');
  doc.text('Student Name:', 110, 66);
  doc.setFont('helvetica', 'normal');
  doc.text(transaction.studentName, 140, 66);

  doc.setFont('helvetica', 'bold');
  doc.text('Roll Number:', 110, 76);
  doc.setFont('helvetica', 'normal');
  doc.text(transaction.rollNo, 140, 76);

  // Fee Details Header
  doc.setFillColor(30, 41, 59);
  doc.rect(14, 100, 182, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('FEE DESCRIPTION', 20, 106.5);
  doc.text('CATEGORY', 110, 106.5);
  doc.text('AMOUNT PAID', 160, 106.5);

  // Item Row
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  doc.text(transaction.feeType, 20, 120);
  doc.text('Academic Fee', 110, 120);
  doc.setFont('helvetica', 'bold');
  doc.text(`INR ${transaction.amountPaid.toLocaleString('en-IN')}.00`, 160, 120);

  doc.setDrawColor(203, 213, 225);
  doc.line(14, 126, 196, 126);

  // Total Summary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL PAID:', 110, 140);
  doc.setTextColor(37, 99, 235);
  doc.text(`INR ${transaction.amountPaid.toLocaleString('en-IN')}.00`, 160, 140);

  // Verification Note & Footer
  doc.setLineWidth(0.3);
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 160, 196, 160);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('This is a computer-generated digital receipt authenticated by Vaigai College of Engineering (Anna University) fee ledger.', 14, 170);
  doc.text('No signature is required. Official digital receipt generated via SmartFee AI system.', 14, 176);

  // Download PDF file
  doc.save(`${transaction.receiptNo}_SmartFee.pdf`);
};
