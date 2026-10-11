import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;

export const generateInvoicePdf = async (element) => {
  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const pdf = new jsPDF('p', 'mm', 'a4');

  // Height of a single A4 page expressed in canvas pixels.
  const pageHeightPx = Math.round((canvas.width * PAGE_HEIGHT_MM) / PAGE_WIDTH_MM);

  // Preferred break points (e.g. so PAYMENT INFORMATION + TOTAL start a new
  // page) marked in the invoice markup, converted to canvas pixels.
  const breakpoints = [0];
  const rootRect = element.getBoundingClientRect();
  const scaleY = rootRect.height ? canvas.height / rootRect.height : 1;

  element.querySelectorAll('[data-invoice-page-break]').forEach((marker) => {
    const markerRect = marker.getBoundingClientRect();
    const offsetY = Math.round((markerRect.top - rootRect.top) * scaleY);
    if (offsetY > 0 && offsetY < canvas.height) breakpoints.push(offsetY);
  });

  breakpoints.push(canvas.height);
  breakpoints.sort((a, b) => a - b);

  let pageIndex = 0;

  // For each marked section, slice it into page-sized pieces so the whole
  // invoice is laid out top-to-bottom across the pages in order.
  for (let i = 0; i < breakpoints.length - 1; i += 1) {
    const sectionStart = breakpoints[i];
    const sectionEnd = breakpoints[i + 1];

    for (let offsetY = sectionStart; offsetY < sectionEnd; offsetY += pageHeightPx) {
      const sliceHeight = Math.min(pageHeightPx, sectionEnd - offsetY);

      const slice = document.createElement('canvas');
      slice.width = canvas.width;
      slice.height = sliceHeight;

      const context = slice.getContext('2d');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, slice.width, slice.height);
      context.drawImage(canvas, 0, offsetY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

      const sliceData = slice.toDataURL('image/png');
      const sliceHeightMm = (sliceHeight * PAGE_WIDTH_MM) / canvas.width;

      if (pageIndex > 0) pdf.addPage();
      pdf.addImage(sliceData, 'PNG', 0, 0, PAGE_WIDTH_MM, sliceHeightMm);

      pageIndex += 1;
    }
  }

  return pdf;
};