import { getTemplate, renderTemplate, writeTemplate } from '..//service/templateService.js';
import { executeEveryAndGetResult, startPromise, logPromise, logError } from '../utils/utils.js';
import { logGreen, logRed } from '../service/logService.js';

const generateFile =
    (data, log) =>
        ({ templateNameDir, dirToWrite }) =>
            getTemplate(templateNameDir)
                .then((template) => renderTemplate(template, data))
                .then((renderedTemplate) => writeTemplate(dirToWrite, renderedTemplate))
                .then(logPromise(`${log}`));

const startGenerator = (questionsToMakeWrapper, transformDataWrapper, createWrapper) => () => {
    return startPromise()
        .then(questionsToMakeWrapper)
        .then(transformDataWrapper)
        .then(createWrapper)
        .then((finishData = {}) => {
            logGreen(`finish`);
            Object.values(finishData).length && console.log(finishData)
            return {};
        })
        .catch(logError('error in Generator'));
};

const questionsToMake =
    (...listOfQuestions) =>
        () =>
            Promise.resolve().then(() => executeEveryAndGetResult(undefined, listOfQuestions));

const transformData =
    (...listMethodsToTransform) =>
        (data) =>
            Promise.resolve()
                .then(() => executeEveryAndGetResult(data, listMethodsToTransform))
                .then((answers) => {
                    console.log(answers);
                    return answers;
                });

const create =
    (...fileDefinitions) =>
        (preparedData) =>
            Promise.resolve().then(() => executeEveryAndGetResult(preparedData, fileDefinitions));

export { generateFile, startGenerator, questionsToMake, transformData, create };
