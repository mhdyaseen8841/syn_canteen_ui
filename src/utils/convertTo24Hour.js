export const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');

    if (modifier === 'PM' && hours !== '12') {
        hours = String(parseInt(hours, 10) + 12);
    } else if (modifier === 'AM' && hours === '12') {
        hours = '00';
    }

    return `${hours.padStart(2, '0')}:${minutes}`;
};
