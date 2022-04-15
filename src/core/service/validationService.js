const isValidNumberOrExecute = (number, funcToExecuteOnError) => {
    return Promise.resolve(number)
        .then((number) => {
            const numberConversion = parseInt(number);
            const isNotNumber = Object.is(NaN, numberConversion);
            isNotNumber && logRed(`CAUTION ${number} IS NOT A NUMBER PLEASE WRITE AGAIN`);
            return isNotNumber ? funcToExecuteOnError() : numberConversion;
        })
        .catch((err) => {
            return funcToExecuteOnError();
        });
};

export { isValidNumberOrExecute };
