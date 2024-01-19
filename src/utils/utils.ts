export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) {
    return 'N/A'; 
  }

  return amount.toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
  });
};
export const formatDate = (date: string | undefined): string => {
  if (!date) return ''; // Handle null, undefined, or empty string values

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));

  return formattedDate;
};