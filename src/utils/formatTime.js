export const formatTime = (isoTimeString) => {
    if (!isoTimeString) return '';
    
    // Extract hours and minutes from the UTC time
    const timeOnly = isoTimeString.split('T')[1];
    const hours = parseInt(timeOnly.substring(0, 2));
    const minutes = timeOnly.substring(3, 5);
    
    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours;
    // Handle midnight (00:00)
    const finalHours = displayHours === 0 ? 12 : displayHours;
    
    // Format with leading zeros for single-digit hours
    return `${finalHours.toString().padStart(2, '0')}:${minutes} ${period}`;
  };