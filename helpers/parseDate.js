exports.parseDate = (value) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
    }
    return date;
};