import fs from 'fs';
import util from 'util';

const createDirInSrc = (dirName) => {
    return util.promisify(fs.mkdir)(`./src/${dirName}`);
};

const createDirInRoot = (dirName) => {
    return util.promisify(fs.mkdir)(`./${dirName}`)
        .then(() => {
            console.log(`Dir ${dirName} Created`)

        }).catch(err => {
            const message = err.code = 'EEXIST' ? `Dir ${dirName} already exist` : err
            console.log(message)
        });
};


export { createDirInSrc, createDirInRoot };
