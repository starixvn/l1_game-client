const shortenName = (name: string) => {
    name = name.toLowerCase();
    var prefix = name.slice(0, 1);
    var suffix = name.slice(-3);
    return `${prefix}***${suffix}`;
};

export { shortenName };
