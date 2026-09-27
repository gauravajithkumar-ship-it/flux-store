require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const generateInvoiceHtml = (orderDetails) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  const orderDate = new Date(orderDetails.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  let itemsHtml = orderDetails.items.map(item => {
    const discountedPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    const tax = discountedPrice * 0.18;
    const itemTotal = discountedPrice + tax;

    return `
      <div class="flex justify-between items-center py-4 text-gray-600">
        <div class="w-1/2 pr-4">${item.name}</div>
        <div class="w-1/6 text-center">${item.quantity}</div>
        <div class="w-1/6 text-right">${formatPrice(itemTotal)}</div>
        <div class="w-1/6 text-right">${formatPrice(itemTotal * item.quantity)}</div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; }
      </style>
    </head>
    <body class="bg-white">
      <div class="bg-white text-black mx-auto max-w-4xl overflow-hidden" style="min-height: 800px; display: flex; flex-direction: column;">
        <!-- Header Section -->
        <div class="bg-blue-100/60 p-10 md:p-14 flex justify-between items-start">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold tracking-widest text-gray-800 mb-8 uppercase">INVOICE</h1>
            <div class="mb-6">
              <p class="text-gray-500 text-sm mb-1">Invoice Number</p>
              <p class="text-gray-800">${orderDetails.orderId}</p>
            </div>
            <div>
              <p class="text-gray-500 text-sm mb-1">Date</p>
              <p class="text-gray-800">${orderDate}</p>
            </div>
          </div>
          <div class="text-right flex flex-col items-end">
            <div class="w-12 h-12 rounded-full border-4 border-gray-700 flex items-center justify-center mb-4 text-gray-700 relative overflow-hidden">
              <div class="w-6 h-6 border-[3px] border-gray-700 rounded-full"></div>
              <div class="absolute w-full h-full border-[3px] border-transparent border-t-gray-700 rounded-full rotate-45 transform origin-center scale-110"></div>
            </div>
            <p class="text-gray-600 text-sm tracking-wide">Flux Store</p>
          </div>
        </div>

        <!-- Addresses Section -->
        <div class="px-10 md:px-14 py-12 flex justify-between bg-white">
          <div class="w-1/2 pr-4">
            <h3 class="text-gray-800 font-bold uppercase tracking-wider mb-4">PAYABLE TO</h3>
            <p class="text-gray-600 mb-1">${orderDetails.customer.name}</p>
            <p class="text-gray-600 mb-1">${orderDetails.customer.address}</p>
            <p class="text-gray-600 mb-1">${orderDetails.customer.city}, ${orderDetails.customer.state} - ${orderDetails.customer.pin}</p>
            <p class="text-gray-600">Ph: ${orderDetails.customer.mobile}</p>
          </div>
          <div class="w-1/2 pl-4">
            <h3 class="text-gray-800 font-bold uppercase tracking-wider mb-4">BILL FROM</h3>
            <p class="text-gray-600 mb-1">Flux Store</p>
            <p class="text-gray-600 mb-1">123 lilleria peramount</p>
            <p class="text-gray-600">Vadodara, Gujarat 390001</p>
          </div>
        </div>

        <!-- Table Section -->
        <div class="flex-grow">
          <div class="bg-blue-100/60 px-10 md:px-14 py-3 flex justify-between items-center text-sm font-bold text-gray-800 uppercase tracking-wider">
            <div class="w-1/2">ITEM DESCRIPTION</div>
            <div class="w-1/6 text-center">QTY</div>
            <div class="w-1/6 text-right">PRICE</div>
            <div class="w-1/6 text-right">TOTAL</div>
          </div>
          <div class="px-10 md:px-14 py-6">
            ${itemsHtml}
          </div>
        </div>

        <!-- Totals & Bank Details Section -->
        <div class="px-10 md:px-14 flex justify-between items-start mb-16">
          <div class="w-1/2 pr-4">
            <h3 class="text-gray-800 font-bold uppercase tracking-wider mb-4">BANK DETAILS</h3>
            <p class="text-gray-600 mb-1">Account title: Flux Store</p>
            <p class="text-gray-600">+123-456-7890</p>
          </div>
          <div class="w-1/2 pl-10 border-t border-gray-300 pt-6">
            <div class="flex justify-between mb-4">
              <span class="text-gray-600">Sub Total</span>
              <span class="text-gray-800">${formatPrice(orderDetails.subtotal)}</span>
            </div>
            <div class="flex justify-between mb-4">
              <span class="text-gray-600">Shipping</span>
              <span class="text-gray-800">${orderDetails.shipping === 0 ? 'Free' : formatPrice(orderDetails.shipping)}</span>
            </div>
            ${orderDetails.discount > 0 ? `
              <div class="flex justify-between mb-4 text-emerald-600">
                <span>Discount</span>
                <span>-${formatPrice(orderDetails.discount)}</span>
              </div>
            ` : ''}
            <div class="flex justify-between mt-2 pt-2 text-lg">
              <span class="text-gray-600">Grand Total</span>
              <span class="text-gray-800">${formatPrice(orderDetails.total)}</span>
            </div>
          </div>
        </div>

        <!-- Footer Contacts -->
        <div class="px-10 md:px-14 pb-8 flex justify-between items-start">
          <div class="w-1/2 space-y-3">
            <div class="flex items-center gap-3 text-gray-500 text-sm">
              <span class="text-lg">☎</span> <span>+123-456-7890</span>
            </div>
            <div class="flex items-center gap-3 text-gray-500 text-sm">
              <span class="text-lg">✉</span> <span>business@fluxstore.com</span>
            </div>
            <div class="flex items-center gap-3 text-gray-500 text-sm">
              <span class="text-lg">📍</span> <span>Vadodara, Gujarat</span>
            </div>
            <div class="flex items-center gap-3 text-gray-500 text-sm">
              <span class="text-lg">🌐</span> <span>fluxstore.com</span>
            </div>
          </div>
          <div class="w-1/2">
            <h3 class="text-gray-800 font-bold uppercase tracking-wider mb-2">NOTES</h3>
            <p class="text-gray-500 text-sm">Thank you for your business! Have a great day.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

app.post('/api/send-email', async (req, res) => {
  const { to, orderDetails, pdfBase64, pdfFilename } = req.body;

  if (!to || !orderDetails) {
    return res.status(400).json({ error: 'Missing to email or orderDetails' });
  }

  let browser;
  try {
    // 1. Get the PDF: prefer the client-generated PDF, else fall back to Puppeteer
    let pdfBuffer;
    let attachmentFilename = pdfFilename || `Invoice-${orderDetails.orderId}.pdf`;

    if (pdfBase64) {
      const base64 = pdfBase64.split(',').pop();
      pdfBuffer = Buffer.from(base64, 'base64');
    } else {
      // Generate HTML and use Puppeteer as fallback
      const htmlContent = generateInvoiceHtml(orderDetails);
      browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' }
      });
    }

    // 2. Prepare simple email body
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #06b6d4;">Thank you for your order!</h2>
        <p>Hi ${orderDetails.customer.name},</p>
        <p>We have successfully received your order <strong>${orderDetails.orderId}</strong>.</p>
        <p>Please find your official invoice attached as a PDF to this email.</p>
        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
          If you have any questions, simply reply to this email.
        </p>
      </div>
    `;

    // 3. Send email with PDF attachment
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: to,
      bcc: process.env.ADMIN_EMAIL || 'fluxstores29@gmail.com',
      subject: `Your Order Invoice - ${orderDetails.orderId}`,
      html: emailBody,
      attachments: [
        {
          filename: attachmentFilename,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email with PDF sent successfully' });
  } catch (error) {
    console.error('Error generating PDF or sending email:', error);
    res.status(500).json({ error: 'Failed to generate PDF or send email' });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
