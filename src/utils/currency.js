export const formatCurrency = (amount) => {
  if (!amount) return "0";
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
