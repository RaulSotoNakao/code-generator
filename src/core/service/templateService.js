import Mustache from 'mustache';
import { readFile, writeFile } from '../service/fileSystemService';

const getTemplate = (templateNameDir, type = 'utf8') => {
    return readFile(`./src/${templateNameDir}`, type);
};

const renderTemplate = (template, data) => {
    return Promise.resolve(Mustache.render(template, data));
};

const writeTemplate = (dirToWrite, template) => {
    return writeFile(dirToWrite, template);
};

export { getTemplate, renderTemplate, writeTemplate };
