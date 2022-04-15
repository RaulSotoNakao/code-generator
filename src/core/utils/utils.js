import fs from 'fs';
import util from 'util';

const logAndStartPromise = (data) => {
    console.log('Result: ');
    console.log(data);
    return startPromise(data);
};

const logPromise = (location) => (result) => {
    location && console.log(location);
    result && console.log(result);
    return result;
};

const mapBy = (propertyToSelect) => (list) => list.map((obj) => obj[propertyToSelect]);

const logError = (location) => (err) => {
    location && console.error(location);
    console.error(err);
    return err;
};
const startPromise = (data) => Promise.resolve(data);
const executeConditions = (arrListToExecute) =>
    Promise.allSettled(arrListToExecute).then((resultList) =>
        resultList.map((result) => (result.status === 'fulfilled' ? result.value : '')),
    );
const includesConditionOrReject = (condition, value) => (condition ? Promise.resolve(value) : Promise.reject(''));

const executeEveryAndGetResult = (data, promiseListToExecute = [], result = {}) =>
    promiseListToExecute.length
        ? Promise.resolve(data)
              .then(executeFirst(promiseListToExecute))
              .then(mergeData(result))
              .then((resultMerge) => {
                  const listToExecuteWithoutFirst = deleteFirstOfList(promiseListToExecute);
                  return executeEveryAndGetResult(data, listToExecuteWithoutFirst, resultMerge);
              })
              .catch((err) =>
                  Promise.resolve(err)
                      .then(defineError(promiseListToExecute[0]))
                      .then(mergeData(result))
                      .then((resultMerge) => {
                          const listToExecuteWithoutFirst = deleteFirstOfList(promiseListToExecute);
                          return executeEveryAndGetResult(data, listToExecuteWithoutFirst, resultMerge);
                      }),
              )
        : Promise.resolve(result);

const executeEveryAndPushResultFromObject = (listToExecute = [], result = [], data) =>
    listToExecute.length
        ? Promise.resolve(data)
              .then(executeFirst(listToExecute))
              .then(pushDataFromObject(result))
              .then((resultMerge) => {
                  const listToExecuteWithoutFirst = deleteFirstOfList(listToExecute);
                  return executeEveryAndPushResultFromObject(listToExecuteWithoutFirst, resultMerge, data);
              })
              .catch((err) =>
                  Promise.resolve(err)
                      .then(defineError(listToExecute[0]))
                      .then(pushDataFromObject(result))
                      .then((resultMerge) => {
                          const listToExecuteWithoutFirst = deleteFirstOfList(listToExecute);
                          return executeEveryAndPushResultFromObject(listToExecuteWithoutFirst, resultMerge, data);
                      }),
              )
        : Promise.resolve(result);

const defineError = (description) => (err) => {
    const errorCatch = {
        message: `Something went wrong executing ${description}`,
        error: err,
    };
    return { errorCatch };
};

const executeFirst =
    (functionlistToExecute) =>
    (data = {}) =>
        data ? functionlistToExecute[0](data) : functionlistToExecute[0]();

const deleteFirstOfList = (list = []) => list.slice(1, list.length + 1);

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mergeData = (data) => (allData) => ({ ...data, ...allData });
const pushDataFromObject =
    (list = []) =>
    (data = {}) => {
        return [...list, ...Object.values(data)];
    };
const createListFromNumber = (number) => Array(parseInt(number)).fill(0);

export {
    mapBy,
    logAndStartPromise,
    mergeData,
    readFile,
    writeFile,
    logPromise,
    logError,
    startPromise,
    executeConditions,
    includesConditionOrReject,
    executeEveryAndGetResult,
    createListFromNumber,
    executeEveryAndPushResultFromObject,
    deleteFirstOfList,
};
