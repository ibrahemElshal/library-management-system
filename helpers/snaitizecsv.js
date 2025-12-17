exports.sanitizeCSVValue = (value) => {
    if (typeof value === 'string' && /^[=+\-@]/.test(value)) {
        return `'${value}`;
    }
    return value;
};
