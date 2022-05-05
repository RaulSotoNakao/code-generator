import {
    startPromise,
    createListFromNumber,
    mergeData,
    executeEveryAndPushResultFromObject,
    logError,
    logPromise,
    deleteFirstOfList,
} from '../../core/utils/utils';
import { createDirInSrc } from '../../core/service/fileSystemService';
import { generateFile, generateFileUsing } from '../../core/useCase/generatorUseCase';
import {
    getTemplateDefinitions,
    getUseCaseDefinitions,
    getServiceDefinitions,
    getGeneratorsDefinitions,
    fillListWithQuestion,
    addExportDefault,
    addImportStatement,
    getDefinitions,
} from '../service/baseGeneratorService';
import { isValidNumberOrExecute } from '../../core/service/validationService';

import { promptInputQuestion, promptListQuestion } from '../../core/service/promptQuestionsService';
import { getGeneratorsDirNameList } from '../../core/service/generatorService';

const createBaseDirectoryEstructure = ({ baseDirName }) =>
    startPromise(baseDirName)
        .then(() => createDirInSrc(baseDirName))
        .then(() => createDirInSrc(`${baseDirName}/generators`))
        .then(() => createDirInSrc(`${baseDirName}/service`))
        .then(() => createDirInSrc(`${baseDirName}/templates`))
        .then(() => createDirInSrc(`${baseDirName}/useCase`));

const createFilesInBaseDirectory = (answers) =>
    startPromise()
        .then(() => generateFileUsing(getGeneratorsDefinitions, answers, 'generator file completed'))
        .then(() => generateFileUsing(getServiceDefinitions, answers, 'service file completed'))
        .then(() => generateFileUsing(getUseCaseDefinitions, answers, 'useCase file completed'))
        .then(() => createTemplate(answers, answers.filesToGenerate));

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

const updateGeneratorDefinitions = (preparedData) =>
    preparedData.hide
        ? Promise.resolve()
        : startPromise()
              .then(() => getDefinitions())
              .then(generateFile(preparedData, 'Update Generator Definitions completed'));

const selectOneGeneratorFolders = () =>
    startPromise()
        .then(() => getGeneratorsDirNameList())
        .then((generatorDirList) =>
            promptListQuestion(
                'baseDirName',
                'Select directory where the generators will be located',
            )(generatorDirList),
        );

export {
    createBaseDirectoryEstructure,
    createFilesInBaseDirectory,
    numberAndNameOfFilesToCreateQuestion,
    updateGeneratorDefinitions,
    selectOneGeneratorFolders,
    createTemplate,
};
