const STORE = {
  name: 'FLUX',
  legalName: 'FLUX Electricals & Electronics',
  tagline: 'Powering Your World',
  logo: '/android-chrome-192x192.png',
  address: ['123 lilleria peramount', 'Vadodara, Gujarat 390001'],
  // Fill these in before issuing real tax invoices.
  gstin: '',
  phone: '+123-456-7890',
  email: 'fluxstores29@gmail.com',
  website: 'https://flux-store.onrender.com',
  signatory: 'Gaurav',
};

const HSN_BY_CATEGORY = {
  Mobile: '8517',
  TV: '8528',
  Audio: '8518',
  'Washing Machine': '8450',
};

const GST_RATE = 18;

const number = (value) =>
  new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return `${formatDate(value)} | ${date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const twoDigits = (n) => (n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ''}`);

const threeDigits = (n) => {
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  const parts = [];
  if (hundred) parts.push(`${ONES[hundred]} Hundred`);
  if (rest) parts.push(twoDigits(rest));
  return parts.join(' ');
};

const amountInWords = (value) => {
  const amount = Math.round(Number(value) || 0);
  if (amount === 0) return 'Zero Rupees Only';

  const crore = Math.floor(amount / 10000000);
  const lakh = Math.floor((amount % 10000000) / 100000);
  const thousand = Math.floor((amount % 100000) / 1000);
  const hundred = amount % 1000;

  const parts = [];
  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);
  if (hundred) parts.push(threeDigits(hundred));

  return `${parts.join(' ')} Rupees Only`;
};

const QrBlock = ({ size = 78 }) => {
  const modules =
    'linear-gradient(90deg, #102a43 8%, transparent 8% 17%, #102a43 17% 25%, transparent 25% 34%, #102a43 34% 43%, transparent 43% 53%, #102a43 53% 61%, transparent 61% 70%, #102a43 70% 80%, transparent 80%),' +
    'linear-gradient(#102a43 8%, transparent 8% 17%, #102a43 17% 25%, transparent 25% 34%, #102a43 34% 43%, transparent 43% 53%, #102a43 53% 61%, transparent 61% 70%, #102a43 70% 80%, transparent 80%)';
  const eye = {
    position: 'absolute',
    width: '26%',
    height: '26%',
    border: '4px solid #102a43',
    boxSizing: 'border-box',
  };

  return (
    <div
      className="relative"
      style={{ width: size, height: size, background: modules, border: '5px solid #fff', outline: '1px solid #cbdce9' }}
    >
      <span style={{ ...eye, top: '0', left: '0' }} />
      <span style={{ ...eye, top: '0', right: '0' }} />
      <span style={{ ...eye, bottom: '0', left: '0' }} />
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="grid" style={{ gridTemplateColumns: '75px 12px 1fr', fontSize: '10px', lineHeight: 1.8, color: '#526f8a' }}>
    <span>{label}</span>
    <span>:</span>
    <strong style={{ color: '#173b60', wordBreak: 'break-word' }}>{value || '—'}</strong>
  </div>
);

const TotalRow = ({ label, value, accent = false }) => (
  <div className="flex justify-between" style={{ fontSize: '10px', marginBottom: '9px', color: accent ? '#1685ff' : '#4c6a84' }}>
    <span>{label}</span>
    <strong style={{ color: accent ? '#1685ff' : '#173b60' }}>{value}</strong>
  </div>
);

const unitPrice = (item) => {
  if (item.item_type === 'gift_card') return Number(item.custom_amount) || 0;
  return item.discount ? Number(item.price) * (1 - item.discount / 100) : Number(item.price) || 0;
};

const hsnFor = (item) => item.hsn || HSN_BY_CATEGORY[item.category] || '8517';

const describe = (item) => {
  if (item.item_type === 'gift_card') return 'E-Gift Card';
  return [item.brand, Array.isArray(item.specs) ? item.specs.join(' • ') : item.specs]
    .filter(Boolean)
    .join(' | ');
};

const Invoice = ({ order, ref, className = '' }) => {
  if (!order) return null;

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = Number(order.subtotal) || 0;
  const discount = Number(order.discount) || 0;
  const shipping = Number(order.shipping) || 0;
  const gst = Number(order.gst) || 0;
  const total = Number(order.total) || 0;

  const cgst = gst / 2;
  const sgst = gst - cgst;
  const customer = order.customer || {};
  const invoiceNo = order.invoiceId || order.orderId;

  return (
    <div
      ref={ref}
      className={`bg-white text-[#102a43] font-sans mx-auto ${className}`}
      style={{
        width: '794px',
        minHeight: '1123px',
        display: 'flex',
        flexDirection: 'column',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      }}
    >
      {/* HEADER */}
      <div className="px-[60px] pt-[46px] pb-[18px] flex justify-between items-start" style={{ borderBottom: '2px solid #1685ff' }}>
        <div className="flex items-center" style={{ gap: '16px' }}>
          <img
            src={STORE.logo}
            alt="FLUX"
            style={{ width: '78px', height: '78px', objectFit: 'contain', borderRadius: '14px' }}
          />
          <div>
            <div className="font-black leading-[0.85] tracking-[-2.5px]" style={{ fontSize: '38px', color: '#0d1f35' }}>
              FLUX
            </div>
            <div className="mt-[8px] font-bold" style={{ fontSize: '12px', letterSpacing: '4px', color: '#173b60' }}>
              ELECTRICALS &amp; ELECTRONICS
            </div>
            <div className="mt-[8px]" style={{ fontSize: '11px', letterSpacing: '3px', color: '#1685ff' }}>
              {STORE.tagline}
            </div>
          </div>
        </div>

        <div className="text-right">
          <h1 className="font-bold tracking-tight" style={{ fontSize: '32px', color: '#102a43' }}>
            TAX <span style={{ color: '#1685ff' }}>INVOICE</span>
          </h1>
          <div className="mt-[12px] grid gap-[7px] justify-items-end" style={{ gridTemplateColumns: '100px auto', fontSize: '11px' }}>
            <span style={{ color: '#66829d' }}>Invoice No</span>
            <strong style={{ color: '#102a43' }}>{invoiceNo}</strong>

            <span style={{ color: '#66829d' }}>Invoice Date</span>
            <strong style={{ color: '#102a43' }}>{formatDate(order.date)}</strong>

            <span style={{ color: '#66829d' }}>Order No</span>
            <strong style={{ color: '#102a43' }}>{order.orderId}</strong>

            <span style={{ color: '#66829d' }}>Payment Status</span>
            <strong>
              <span className="inline-block font-extrabold" style={{ padding: '4px 12px', borderRadius: '20px', background: '#dcfce7', color: '#087443', fontSize: '10px' }}>
                ● {order.paymentMethod === 'COD' ? 'PENDING' : 'PAID'}
              </span>
            </strong>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div
        className="relative mt-[15px] mx-[60px] flex items-center overflow-hidden"
        style={{ minHeight: '110px', padding: '20px', background: 'linear-gradient(110deg, #f1f8ff 0%, #e6f3ff 70%, #d3eaff 100%)' }}
      >
        <span
          aria-hidden="true"
          className="absolute select-none"
          style={{ right: '35px', bottom: '-40px', fontSize: '150px', fontWeight: 900, color: 'rgba(22,133,255,0.07)', transform: 'rotate(-10deg)', lineHeight: 1 }}
        >
          ⚡
        </span>
        <div className="relative" style={{ maxWidth: '65%' }}>
          <div className="font-bold" style={{ fontSize: '9px', letterSpacing: '4px', color: '#3475ae' }}>
            POWERING YOUR
          </div>
          <h2 className="mt-[4px] font-bold" style={{ fontSize: '22px', color: '#102a43', letterSpacing: '-0.5px' }}>
            EVERYDAY LIFE
          </h2>
          <p className="mt-[7px] leading-relaxed" style={{ fontSize: '10px', color: '#55718c', maxWidth: '430px' }}>
            From home essentials to advanced electronics, {STORE.name} brings you trusted brands,
            genuine products and unmatched service.
          </p>
          <div className="mt-[14px] flex" style={{ gap: '22px' }}>
            {[
              { icon: '✓', label: 'Genuine Products' },
              { icon: '▣', label: 'Fast & Safe Delivery' },
              { icon: '♧', label: 'Expert Support' },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center font-semibold" style={{ fontSize: '9px', color: '#244c70', gap: '7px' }}>
                <span
                  className="flex items-center justify-center"
                  style={{ width: '24px', height: '24px', border: '1px solid #1685ff', borderRadius: '50%', color: '#1685ff', fontSize: '12px' }}
                >
                  {feature.icon}
                </span>
                {feature.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BILL TO / FROM */}
      <div className="px-[60px] mt-[15px] flex" style={{ gap: '15px' }}>
        <div className="flex-1" style={{ border: '1px solid #d7e6f3', padding: '16px', borderRadius: '6px' }}>
          <div className="flex items-center font-extrabold" style={{ fontSize: '10px', letterSpacing: '2px', color: '#102a43', gap: '8px', marginBottom: '12px' }}>
            <span className="flex items-center justify-center" style={{ width: '25px', height: '25px', background: '#e6f3ff', borderRadius: '50%', color: '#1685ff' }}>♙</span>
            BILL TO
          </div>
          <div className="font-extrabold" style={{ fontSize: '14px', marginBottom: '8px' }}>
            {customer.name || '—'}
          </div>
          <InfoRow label="Phone" value={customer.mobile} />
          <InfoRow label="Email" value={customer.email} />
          <InfoRow
            label="Address"
            value={[customer.address, [customer.city, customer.state].filter(Boolean).join(', '), customer.pin].filter(Boolean).join(', ')}
          />
        </div>

        <div className="flex-1" style={{ border: '1px solid #d7e6f3', padding: '16px', borderRadius: '6px' }}>
          <div className="flex items-center font-extrabold" style={{ fontSize: '10px', letterSpacing: '2px', color: '#102a43', gap: '8px', marginBottom: '12px' }}>
            <span className="flex items-center justify-center" style={{ width: '25px', height: '25px', background: '#e6f3ff', borderRadius: '50%', color: '#1685ff' }}>▣</span>
            FROM
          </div>
          <div className="font-extrabold" style={{ fontSize: '13px', marginBottom: '8px' }}>
            {STORE.legalName}
          </div>
          <InfoRow label="Address" value={STORE.address.join(', ')} />
          {STORE.gstin ? <InfoRow label="GSTIN" value={STORE.gstin} /> : null}
          <InfoRow label="Phone" value={STORE.phone} />
          <InfoRow label="Email" value={STORE.email} />
          <InfoRow label="Website" value={STORE.website} />
        </div>
      </div>

      {/* LINE ITEMS */}
      <div className="px-[60px] mt-[18px]" style={{ border: '1px solid #d4e5f3', borderRadius: '6px', overflow: 'hidden' }}>
        <table className="w-full border-collapse">
          <thead style={{ background: '#12395e', color: '#fff' }}>
            <tr>
              <th className="font-semibold" style={{ padding: '11px 8px', fontSize: '9px', letterSpacing: '0.5px', textAlign: 'center' }}>#</th>
              <th className="font-semibold text-left" style={{ padding: '11px 8px', fontSize: '9px', letterSpacing: '0.5px' }}>PRODUCT / DESCRIPTION</th>
              <th className="font-semibold" style={{ padding: '11px 8px', fontSize: '9px', letterSpacing: '0.5px', textAlign: 'center' }}>HSN</th>
              <th className="font-semibold" style={{ padding: '11px 8px', fontSize: '9px', letterSpacing: '0.5px', textAlign: 'center' }}>QTY</th>
              <th className="font-semibold" style={{ padding: '11px 8px', fontSize: '9px', letterSpacing: '0.5px', textAlign: 'center' }}>UNIT PRICE<br />(₹)</th>
              <th className="font-semibold" style={{ padding: '11px 8px', fontSize: '9px', letterSpacing: '0.5px', textAlign: 'center' }}>GST<br />(%)</th>
              <th className="font-semibold" style={{ padding: '11px 8px', fontSize: '9px', letterSpacing: '0.5px', textAlign: 'center' }}>AMOUNT<br />(₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} style={{ background: index % 2 === 1 ? '#f3f9fe' : '#fff' }}>
                <td style={{ padding: '12px 8px', fontSize: '9.5px', textAlign: 'center', color: '#193b5b', borderBottom: '1px solid #dbe8f3' }}>
                  {String(index + 1).padStart(2, '0')}
                </td>
                <td className="text-left" style={{ padding: '12px 8px', borderBottom: '1px solid #dbe8f3' }}>
                  <div className="flex items-center" style={{ gap: '10px' }}>
                    {item.img ? (
                      <span className="flex items-center justify-center shrink-0 overflow-hidden" style={{ width: '42px', height: '42px', borderRadius: '5px', background: '#edf6fd' }}>
                        <img src={item.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </span>
                    ) : null}
                    <div style={{ minWidth: 0 }}>
                      <div className="font-extrabold truncate" style={{ fontSize: '9.5px', color: '#102a43', marginBottom: '4px' }}>
                        {item.name}
                      </div>
                      <div className="truncate" style={{ fontSize: '8px', color: '#7290aa' }}>
                        {describe(item)}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 8px', fontSize: '9.5px', textAlign: 'center', color: '#193b5b', borderBottom: '1px solid #dbe8f3' }}>
                  {hsnFor(item)}
                </td>
                <td style={{ padding: '12px 8px', fontSize: '9.5px', textAlign: 'center', color: '#193b5b', borderBottom: '1px solid #dbe8f3' }}>
                  {item.quantity}
                </td>
                <td style={{ padding: '12px 8px', fontSize: '9.5px', textAlign: 'center', color: '#193b5b', borderBottom: '1px solid #dbe8f3' }}>
                  {number(unitPrice(item))}
                </td>
                <td style={{ padding: '12px 8px', fontSize: '9.5px', textAlign: 'center', color: '#193b5b', borderBottom: '1px solid #dbe8f3' }}>
                  {GST_RATE}%
                </td>
                <td className="font-extrabold" style={{ padding: '12px 8px', fontSize: '9.5px', textAlign: 'center', color: '#12395e', borderBottom: '1px solid #dbe8f3' }}>
                  {number(unitPrice(item) * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAYMENT + TOTALS */}
      <div className="px-[60px] mt-[15px] flex" style={{ gap: '15px' }}>
        <div className="flex-1" style={{ background: '#f1f8ff', border: '1px solid #dcecf8', borderRadius: '7px', padding: '15px' }}>
          <div className="font-extrabold" style={{ fontSize: '10px', letterSpacing: '2px', color: '#12395e', marginBottom: '12px' }}>
            ▣ &nbsp;PAYMENT INFORMATION
          </div>
          <div className="grid" style={{ gridTemplateColumns: '100px 15px 1fr', fontSize: '10px', lineHeight: 1.9, color: '#52718e' }}>
            <span>Payment Method</span><span>:</span>
            <strong style={{ color: '#173b60' }}>{order.paymentMethod || '—'}</strong>

            <span>Reference</span><span>:</span>
            <strong style={{ color: '#173b60' }}>{order.appliedCoupon ? `Coupon ${order.appliedCoupon}` : order.orderId}</strong>

            <span>Paid On</span><span>:</span>
            <strong style={{ color: '#173b60' }}>{formatDateTime(order.date)}</strong>
          </div>

          <div className="flex justify-center" style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #d5e6f3' }}>
            <QrBlock />
          </div>
        </div>

        <div className="flex-1" style={{ border: '1px solid #d9e7f2', borderRadius: '7px', padding: '15px' }}>
          <TotalRow label="Subtotal" value={number(subtotal)} />
          {discount > 0 && <TotalRow label="Discount" value={`- ${number(discount)}`} accent />}
          <TotalRow label="Shipping" value={shipping === 0 ? 'Free' : number(shipping)} />
          <TotalRow label={`CGST (${GST_RATE / 2}%)`} value={number(cgst)} />
          <TotalRow label={`SGST (${GST_RATE / 2}%)`} value={number(sgst)} />

          <div style={{ borderTop: '1px solid #1685ff', margin: '10px 0' }} />

          <div className="flex justify-between items-center font-black" style={{ fontSize: '15px', color: '#102a43' }}>
            <span>TOTAL</span>
            <span>₹ {number(total)}</span>
          </div>

          <div
            className="flex justify-between items-center"
            style={{ marginTop: '10px', padding: '11px 14px', background: 'linear-gradient(90deg, #1685ff, #49a3ff)', borderRadius: '5px', color: '#fff' }}
          >
            <span className="font-bold" style={{ fontSize: '8px', letterSpacing: '1.5px' }}>AMOUNT PAYABLE</span>
            <strong style={{ fontSize: '17px' }}>₹ {number(total)} ✓</strong>
          </div>

          <div style={{ marginTop: '9px', padding: '9px', background: '#edf7ff', borderRadius: '5px', fontSize: '8.5px', lineHeight: 1.5, color: '#244c70' }}>
            <strong className="block" style={{ marginBottom: '3px', color: '#102a43' }}>Amount in words:</strong>
            {amountInWords(total)}
          </div>
        </div>
      </div>

      {/* THANK YOU */}
      <div className="px-[65px] mt-[15px] mb-[15px] flex justify-between items-center" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <div>
          <h3 className="font-bold" style={{ fontSize: '17px', color: '#1685ff' }}>Thank You!</h3>
          <p style={{ marginTop: '3px', fontSize: '9px', color: '#607d96' }}>Your trust keeps us powered.</p>
          <p style={{ fontSize: '9px', color: '#607d96' }}>We look forward to serving you again.</p>
        </div>
        <div className="text-right" style={{ fontSize: '9px', color: '#5d7890' }}>
          <div style={{ width: '120px', borderBottom: '1px solid #7891a6', marginLeft: 'auto', marginBottom: '5px' }} />
          <span style={{ fontStyle: 'italic', fontFamily: 'cursive', fontSize: '14px', color: '#102a43' }}>
            {STORE.signatory}
          </span>
          <br />
          Authorized Signatory
          <br />
          <strong>For {STORE.legalName}</strong>
        </div>
      </div>

      {/* FOOTER */}
      <div
        className="relative mt-auto flex-col justify-center overflow-hidden"
        style={{ minHeight: '78px', background: '#102a43', color: '#fff', padding: '15px 60px' }}
      >
        <span aria-hidden="true" className="absolute" style={{ right: '110px', top: '-50px', width: '150px', height: '150px', border: '2px solid rgba(22,133,255,0.5)', transform: 'rotate(45deg)' }} />

        <div className="relative flex justify-between items-center">
          <div className="flex items-center" style={{ gap: '12px' }}>
            <img
              src={STORE.logo}
              alt="FLUX"
              style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '9px' }}
            />
            <div>
              <div className="font-black" style={{ fontSize: '22px', letterSpacing: '-2px' }}>FLUX</div>
              <div style={{ fontSize: '7px', letterSpacing: '2px', marginTop: '2px', color: '#b9d5ec' }}>ELECTRICALS &amp; ELECTRONICS</div>
            </div>
          </div>

          <div className="text-right" style={{ fontSize: '8px', lineHeight: 1.5, letterSpacing: '1px', color: '#c8def0' }}>
            Better Energy.
            <br />
            Brighter Future.
          </div>
        </div>

        <div className="relative flex flex-wrap mt-[9px]" style={{ gap: '6px 20px', fontSize: '8px', color: '#d6e6f4' }}>
          <span>☎ {STORE.phone}</span>
          <span>✉ {STORE.email}</span>
          <span>◉ {STORE.website}</span>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
