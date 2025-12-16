const sanitizeString = (value) => {
    if (typeof value === 'string') {
        return value.replace(/[<>$;]/g, '');
    }
    return value;
};

module.exports = { sanitizeString };
