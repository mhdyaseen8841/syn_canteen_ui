export const formatDateTime = (isoDateString) => {
  if (!isoDateString) return '';

  const date = new Date(isoDateString);

  // Add 4 hours
  date.setHours(date.getHours() + 4);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const deformatDate = (formattedDate) => {
  if (!formattedDate) return '';

  const [datePart, timePart] = formattedDate.split(' ');
  if (!datePart || !timePart) return '';

  const [day, month, year] = datePart.split('-');
  const [hours, minutes, seconds] = timePart.split(':');

  if (!day || !month || !year || !hours || !minutes) return '';

  const isoString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds || '00'}`;
  return isoString;
};
