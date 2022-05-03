import { getTemplate, renderTemplate, writeTemplate } from '..//service/templateService.js';
import {
    executeEveryAndGetResult,
    executeEveryWithDataAndPreviousResults,
    executeEvery,
    startPromise,
    logPromise,
    logError,
} from '../utils/utils.js';
import { logGreen, logRed } from '../service/logService.js';
import { promptListQuestion } from '../service/promptQuestionsService.js';
import {
    getGeneratorsListNames,
    getGeneratorData,
    getGeneratorToExecute,
    getGeneratorsDirNameList,
    getGeneratorsListNamesInDirectory,
} from '../service/generatorService';

const generateFile =
    (data, log) =>
    ({ templateNameDir, dirToWrite }) =>
        getTemplate(templateNameDir)
            .then((template) => renderTemplate(template, data))
            .then((renderedTemplate) => writeTemplate(dirToWrite, renderedTemplate))
            .then(logPromise(`${log}`));

const generateFileUsing = (definitionsToGet, data, log = `${definitionsToGet.name} completed`) =>
    startPromise()
        .then(() => definitionsToGet(data))
        .then((definitions) => generateFile(data, log)(definitions));

const startGenerator = (questionsToMakeWrapper, transformDataWrapper, createWrapper) => () => {
    return startPromise()
        .then(questionsToMakeWrapper)
        .then(transformDataWrapper)
        .then(createWrapper)
        .then((finishData = {}) => {
            logGreen(`finish`);
            Object.values(finishData).length && console.log(finishData);
            return {};
        })
        .catch(logError('error in Generator'));
};

const questionsToMake =
    (...listOfQuestions) =>
    () =>
        Promise.resolve().then(() => executeEveryAndGetResult(listOfQuestions));

const transformData =
    (...listMethodsToTransform) =>
    (data) =>
        Promise.resolve()
            .then(() => executeEveryWithDataAndPreviousResults(data, listMethodsToTransform))
            .then((answers) => {
                console.log(answers);
                return answers;
            });

const create =
    (...fileDefinitions) =>
    (preparedData) =>
        Promise.resolve().then(() => executeEvery(preparedData, fileDefinitions));

const getListOfGeneratorsAndExecuteSelected = () =>
    startPromise()
        .then(() => getGeneratorsListNames())
        .then((listOfGenerators) => promptListQuestion('name', 'select a generator :P')(listOfGenerators))
        .then((selectedGenerator) => getGeneratorData(selectedGenerator.name))
        .then((defToExecute) => getGeneratorToExecute(defToExecute))
        .then((execute) => execute.default())
        .then(() => console.log("You're welcome!"));

const generatorMenu = () => {
    startPromise()
        .then(() => getGeneratorsDirNameList())
        .then((listOfGemeratorsDir) =>
            promptListQuestion(
                'selectedDir',
                'select the directory where the generator you need to use is located  :P',
            )(listOfGemeratorsDir),
        )
        .then(({ selectedDir }) => getGeneratorsListNamesInDirectory(selectedDir))
        .then((listOfGenerators) => promptListQuestion('name', 'select a generator :P')(listOfGenerators))
        .then((selectedGenerator) => getGeneratorData(selectedGenerator.name))
        .then((defToExecute) => getGeneratorToExecute(defToExecute))
        .then((execute) => execute.default())
        .then(() => console.log("You're welcome!"));
};

export {
    generateFile,
    generateFileUsing,
    startGenerator,
    questionsToMake,
    transformData,
    create,
    getListOfGeneratorsAndExecuteSelected,
    generatorMenu,
};
