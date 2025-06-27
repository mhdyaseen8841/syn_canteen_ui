export const formatDate = (isoDateString) => {
  if (!isoDateString) return '';

  const date = new Date(isoDateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const deformatDate = (formattedDate) => {
  if (!formattedDate) return '';

  const [day, month, year] = formattedDate.split('-');
  if (!day || !month || !year) return '';

  const isoString = `${year}-${month}-${day}`;
  return isoString;
};
