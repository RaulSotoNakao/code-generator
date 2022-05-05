import fs from 'fs';
import util from 'util';
import path from 'path';

const createDirInSrc = (dirName) => {
    return util.promisify(fs.mkdir)(`./src/${dirName}`);
};

const createDirInRoot = (dirName) => {
    return util
        .promisify(fs.mkdir)(`./${dirName}`)
        .then(() => {
            console.log(`Dir ${dirName} Created`);
        })
        .catch((err) => {
            const message = (err.code = 'EEXIST' ? `Dir ${dirName} already exist` : err);
            console.log(message);
        });
};

const createDir = (dirName) => {
    return util
        .promisify(fs.mkdir)(dirName)
        .then(() => {
            console.log(`Dir ${dirName} Created`);
        })
        .catch((err) => {
            const message = (err.code = 'EEXIST' ? `Dir ${dirName} already exist` : err);
            console.log(message);
        });
};

const getFilesNamesOfDirectory = (dirName) => {
    return util
        .promisify(fs.readdir)(dirName)
        .then((filesNameList) => filesNameList.map((file) => path.parse(file).name));
};
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

export { createDir, createDirInSrc, createDirInRoot, getFilesNamesOfDirectory, readFile, writeFile };
