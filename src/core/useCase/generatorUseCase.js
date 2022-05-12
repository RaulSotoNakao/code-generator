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
import { readFile, writeFile } from '../service/fileSystemService.js';

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

const startGenerator =
    (...functionsToExecute) =>
    () => {
        const getFunction = getFunctionOfList(functionsToExecute);
        const questionsToMakeFunction = getFunction('questionsToMake');
        const transformDataFunction = getFunction('transformData');
        const createFunction = getFunction('create');
        return startPromise()
            .then(questionsToMakeFunction)
            .then(transformDataFunction)
            .then(createFunction)
            .then(() => {
                logGreen(`finish`);
                return {};
            })
            .catch(logError('error in Generator'));
    };

const getFunctionOfList = (list) => (name) => list.find((f) => f.name === name) || ((data) => Promise.resolve(data));

const questionsToMake = (...listOfQuestions) =>
    function questionsToMake() {
        return executeEveryAndGetResult(listOfQuestions);
    };

const transformData = (...listMethodsToTransform) =>
    function transformData(data) {
        return executeEveryWithDataAndPreviousResults(data, listMethodsToTransform);
    };

const create = (...fileDefinitions) =>
    function create(preparedData) {
        return Promise.resolve(preparedData.errorCatch)
            .then(rejectOnError)
            .then(() => executeEvery(preparedData, fileDefinitions))
            .catch((err) => console.log('Please solve Errors, create will no execute with errors'));
    };
const rejectOnError = (error) =>
    new Promise((resolve, reject) =>
        !error ? resolve() : reject('Please solve Errors, create will no execute with errors'),
    );

const getListOfGeneratorsAndExecuteSelected = () =>
    startPromise()
        .then(() => getGeneratorsListNames())
        .then((listOfGenerators) => promptListQuestion('name', 'select a generator :P')(listOfGenerators))
        .then((selectedGenerator) => getGeneratorData(selectedGenerator.name))
        .then((defToExecute) => getGeneratorToExecute(defToExecute))
        .then((execute) => execute.default())
        .then(() => console.log("You're welcome!"));

const selectGeneratorDataQuestion = () =>
    startPromise()
        .then(() => getGeneratorsListNames())
        .then((listOfGenerators) => promptListQuestion('name', 'select a generator :P')(listOfGenerators))
        .then((selectedGenerator) => getGeneratorData(selectedGenerator.name));

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
        .then((listOfGenerators) => promptListQuestion('name', 'select a generator to execute :P')(listOfGenerators))
        .then((selectedGenerator) => getGeneratorData(selectedGenerator.name))
        .then((defToExecute) => getGeneratorToExecute(defToExecute))
        .then((execute) => execute.default())
        .then(() => console.log("You're welcome!"));
};

const updateFileWith = (fileDir, dataUsed, ...funcToMoDifyFile) =>
    startPromise()
        .then(() => readFile(fileDir))
        .then((fileData) => fileData.toString())
        .then((fileData) =>
            funcToMoDifyFile.reduce(
                (currentFileDataPromise, previousFunc) =>
                    currentFileDataPromise.then((currentFileData) =>
                        Promise.resolve(previousFunc(currentFileData, dataUsed)),
                    ),
                Promise.resolve(fileData),
            ),
        )
        .then((fileDataUpdated) => writeFile(fileDir, fileDataUpdated))
        .catch((err) => {
            console.log('Error updating file');
            console.log(err);
        });

export {
    generateFile,
    generateFileUsing,
    startGenerator,
    questionsToMake,
    transformData,
    create,
    getListOfGeneratorsAndExecuteSelected,
    generatorMenu,
    selectGeneratorDataQuestion,
    updateFileWith,
};
