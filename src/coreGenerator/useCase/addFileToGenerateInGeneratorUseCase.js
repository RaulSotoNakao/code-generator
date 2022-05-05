import { logPromise, logError, startPromise } from '../../core/utils/utils.js';
import { generateFile } from '../../core/useCase/generatorUseCase';
import { getFilesNamesOfDirectory, readFile, writeFile } from '../../core/service/fileSystemService.js';
import { promptListQuestion } from '../../core/service/promptQuestionsService';
import { addDataAfterOf, addDataBeforeOf } from '../../core/useCase/fileSystemUseCase.js';
const selectServiceOfGeneratorQuestion = (answers) =>
    startPromise()
        .then(() => getFilesNamesOfDirectory(`./src/${answers.baseDirName}/service`))
        .then(promptListQuestion('selectedService', 'select service to add files'));

const selectUseCaseOfGeneratorQuestion = (answers) =>
    startPromise()
        .then(() => getFilesNamesOfDirectory(`./src/${answers.baseDirName}/useCase`))
        .then(promptListQuestion('selectedUseCase', 'select useCase to add files'));

const updateGeneratorWithNewFiles = (preparedData) =>
    startPromise()
        .then(() => readFile(`./src/${preparedData.baseDirName}/generators/${preparedData.selectedGenerator}.js`))
        .then((fileData) => fileData.toString())
        .then((fileData) => {
            const dataToAdd = preparedData.filesToGenerate.map((file) => `${file.fileCamelName}Definitions,\r\n`).join('');
            const key = `} from '../service/${preparedData.selectedService}'`;
            return addDataBeforeOf(fileData, dataToAdd, key);
        })
        .then((fileData) => {
            const dataToAdd = preparedData.filesToGenerate
                .map(
                    (file) =>
                        `(preparedData) => generateFileUsing(${file.fileCamelName}Definitions, preparedData, '${file.filePascalName} completed'),\n`,
                )
                .join('');
            const key = /create\([^]*\(preparedData\).*\=\>.*\r\n/;
            return addDataAfterOf(fileData, key, dataToAdd);
        })
        .then((fileDataUpdated) =>
            writeFile(
                `./src/${preparedData.baseDirName}/generators/${preparedData.selectedGenerator}.js`,
                fileDataUpdated,
            ),
        );

const updateServiceWithNewFiles = (preparedData) =>
    startPromise()
        .then(() => readFile(`./src/${preparedData.baseDirName}/service/${preparedData.selectedService}.js`))
        .then((fileData) => fileData.toString())
        .then((fileData) => {
            const dataToAdd = preparedData.filesToGenerate
                .map(
                    (file) =>
                        `const ${file.fileCamelName}Definitions = ({ camelName = 'CAMEL_NAME_NOT_DEFINED' }) => {
    return {
        templateNameDir: '${preparedData.baseDirName}/templates/${preparedData.camelName}${file.filePascalName}Template.mustache',
        dirToWrite: \`./generatedFiles/\${camelName}/\${camelName}${file.filePascalName}.js\`,
    };
};\r\n\r\n`,
                )
                .join('');
            const key = /export.*\{/;
            return addDataBeforeOf(fileData, dataToAdd, key);
        })
        .then((fileData) => {
            const dataToAdd = preparedData.filesToGenerate
                .map((file) => `${file.fileCamelName}Definitions,\n`)
                .join('');
            const key = /export.*\{/;
            return addDataAfterOf(fileData, key, dataToAdd);
        })
        .then((fileDataUpdated) =>
            writeFile(`./src/${preparedData.baseDirName}/service/${preparedData.selectedService}.js`, fileDataUpdated),
        );

export {
    updateGeneratorWithNewFiles,
    updateServiceWithNewFiles,
    selectServiceOfGeneratorQuestion,
    selectUseCaseOfGeneratorQuestion,
};
