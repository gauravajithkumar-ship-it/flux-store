export const ORDER_STATUSES = ['Order Received', 'Payment Verified', 'Packing & Quality Check', 'Successfully Delivered'];

export const LEGACY_STATUS_MAP = {
  Pending: 'Order Received',
  Confirmed: 'Payment Verified',
  Processing: 'Packing & Quality Check',
  Shipped: 'Packing & Quality Check',
  Delivered: 'Successfully Delivered',
};

export const normalizeStatus = (status) => LEGACY_STATUS_MAP[status] || status || ORDER_STATUSES[0];

export const getStepIndex = (status) => {
  const normalized = normalizeStatus(status);
  return ORDER_STATUSES.includes(normalized) ? ORDER_STATUSES.indexOf(normalized) : 0;
};
