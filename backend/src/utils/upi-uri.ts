export const generateUpiUri = (params: { vpa: string; name: string; amount: number; txnRef: string; note: string }) => {
  const { vpa, name, amount, txnRef, note } = params;
  return `upi://pay?pa=${vpa}&pn=${name}&am=${amount}&cu=INR&tr=${txnRef}&tn=${note}`;
};
