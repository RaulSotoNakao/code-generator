import {
    startPromise,
    createListFromNumber,
    mergeData,
    executeEveryAndPushResultFromObject,
    logError,
    logPromise,
    deleteFirstOfList,
} from '../../core/utils/utils';
import { createDir } from '../../core/service/fileSystemService';
import { generateFile } from '../../core/useCase/generatorUseCase';
import {
    getTemplateDefinitions,
    getUseCaseDefinitions,
    getServiceDefinitions,
    getGeneratorsDefinitions,
    fillListWithQuestion,
} from '../service/baseGeneratorService';
import { isValidNumberOrExecute } from '../../core/service/validationService';

import { promptInputQuestion } from '../../core/service/promptQuestionsService';

const createBaseDirectoryEstructure = ({ baseDirName }) =>
    startPromise(baseDirName)
        .then(() => logPromise('baseDirName'))
        .then(() => createDir(baseDirName))
        .then(() => createDir(`${baseDirName}/generators`))
        .then(() => createDir(`${baseDirName}/service`))
        .then(() => createDir(`${baseDirName}/templates`))
        .then(() => createDir(`${baseDirName}/useCase`));

const createFilesInBaseDirectory = (answers) =>
    startPromise()
        .then(() => getGeneratorsDefinitions(answers))
        .then(generateFile(answers, 'generator File completed'))
        .then(() => getServiceDefinitions(answers))
        .then(generateFile(answers, 'Service File completed'))
        .then(() => createTemplate(answers, answers.filesToGenerate))
        .then(() => getUseCaseDefinitions(answers))
        .then(generateFile(answers, 'UseCase File completed'));

const createTemplate = (answers, filesToGenerate) =>
    filesToGenerate.length
        ? startPromise()
              .then(() => filesToGenerate[0])
              .then((selectedFile) => ({ ...answers, ...selectedFile }))
              .then(getTemplateDefinitions)
              .then(generateFile(answers, `${filesToGenerate[0].filePascalName} Template completed`))
              .then(() => createTemplate(answers, deleteFirstOfList(filesToGenerate)))
              .catch(logError(`error in ${filesToGenerate[0].filePascalName} createTemplate`))
        : Promise.resolve();

const numberAndNameOfFilesToCreateQuestion = () =>
    startPromise()
        .then(() => numberOfFilesToCreateQuestion())
        .then((number) => createListFromNumber(number))
        .then((listToExecute) =>
            fillListWithQuestion(listToExecute, (fileNumber) =>
                promptInputQuestion(`file${fileNumber}`, `Write name of file ${fileNumber}`),
            ),
        )
        .then((listWithQuestion) => executeEveryAndPushResultFromObject(listWithQuestion))
        .then((filesNames) => ({ filesNames }))
        .catch(logError('error in numberAndNameOfFilesToCreateQuestion'));

const numberOfFilesToCreateQuestion = () =>
    startPromise()
        .then(() => promptInputQuestion('number', 'Write number of files to create')())
        .then(({ number }) => isValidNumberOrExecute(number, numberOfFilesToCreateQuestion));

export { createBaseDirectoryEstructure, createFilesInBaseDirectory, numberAndNameOfFilesToCreateQuestion };
