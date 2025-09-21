export const formatDateTime = (isoDateString) => {
  if (!isoDateString) return '';

  const date = new Date(isoDateString);

  // UTC date parts
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  // Determine AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12; // handle midnight & noon
  const hoursStr = hours.toString().padStart(2, '0');

  return `${day}-${month}-${year} ${hoursStr}:${minutes}:${seconds} ${ampm}`;
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
