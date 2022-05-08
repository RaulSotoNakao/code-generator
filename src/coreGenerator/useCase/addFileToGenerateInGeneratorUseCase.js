import { logPromise, logError, startPromise } from '../../core/utils/utils.js';
import { generateFile } from '../../core/useCase/generatorUseCase';
import { getFilesNamesOfDirectory, readFile, writeFile } from '../../core/service/fileSystemService.js';
import { promptListQuestion } from '../../core/service/promptQuestionsService';
import { addDataAfterOf, addDataBeforeOf } from '../../core/useCase/fileSystemUseCase.js';
import {
    templateFileGenerator,
    templateImportFileDefinitions,
    templateServiceDefinitions,
} from '../service/addFileToGenerateInGeneratorService.js';
import { updateFileWith } from '../../core/useCase/generatorUseCase';

const selectServiceOfGeneratorQuestion = (answers) =>
    startPromise()
        .then(() => getFilesNamesOfDirectory(`./src/${answers.baseDirName}/service`))
        .then(promptListQuestion('selectedService', 'select service to add files'));

const selectUseCaseOfGeneratorQuestion = (answers) =>
    startPromise()
        .then(() => getFilesNamesOfDirectory(`./src/${answers.baseDirName}/useCase`))
        .then(promptListQuestion('selectedUseCase', 'select useCase to add files'));

const updateGeneratorWithNewFiles = (preparedData) =>
    updateFileWith(
        `./src/${preparedData.baseDirName}/generators/${preparedData.selectedGenerator}.js`,
        preparedData,
        (fileData, dataUsed) => {
            const dataToAdd = dataUsed.filesToGenerate.map(templateImportFileDefinitions).join('');
            const key = `(, \w* )*\} from '../service/${dataUsed.selectedService}'`;
            return addDataBeforeOf(fileData, dataToAdd, key);
        },
        (fileData, dataUsed) => {
            const dataToAdd = dataUsed.filesToGenerate.map(templateFileGenerator).join('');
            const key = /create\([^]*\(preparedData\).*\=\>.*\r\n/;
            return addDataAfterOf(fileData, key, dataToAdd);
        },
    );

const updateServiceWithNewFiles = (preparedData) =>
    updateFileWith(
        `./src/${preparedData.baseDirName}/service/${preparedData.selectedService}.js`,
        preparedData,
        (fileData, dataUsed) => {
            const dataToAdd = dataUsed.filesToGenerate.map(templateServiceDefinitions(dataUsed)).join('');
            const key = /export.*\{/;
            return addDataBeforeOf(fileData, dataToAdd, key);
        },
        (fileData, dataUsed) => {
            const dataToAdd = dataUsed.filesToGenerate.map((file) => `${file.fileCamelName}Definitions,\n`).join('');
            const key = /export.*\{/;
            return addDataAfterOf(fileData, key, dataToAdd);
        },
    );

export {
    updateGeneratorWithNewFiles,
    updateServiceWithNewFiles,
    selectServiceOfGeneratorQuestion,
    selectUseCaseOfGeneratorQuestion,
};
