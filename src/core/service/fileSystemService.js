import fs from 'fs';
import util from 'util';

const createDir = (dirName) => {
    return util.promisify(fs.mkdir)(`./src/${dirName}`);
};

export { createDir };
