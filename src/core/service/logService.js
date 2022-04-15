const logRed = (log) => {
    console.log('\x1b[31m%s\x1b[0m', log);
};

const logGreen = (log) => {
    console.log('\x1b[32m%s\x1b[0m', log);
};

export { logGreen, logRed };
