import { startPromise, conditionIsTrueOrError } from '../utils/utils';

const addDataBeforeOf = (fileData, data, regExp) =>
    startPromise()
        .then(() => fileData.match(regExp))
        .then((matched) => conditionIsTrueOrError(matched, fileData.match(regExp)))
        .then((match) => fileData.split(match[0]))
        .then((fileDataSplited) => [fileDataSplited[0], data, fileData.match(regExp)[0], fileDataSplited[1]])
        .then((fileDataListMerged) => fileDataListMerged.join(''))
        .catch((err) => {
            console.log('somethin went wrong', err);
            return fileData;
        });

const addDataAfterOf = (fileData, regExp, data) =>
    startPromise()
    .then(() => fileData.match(regExp))
    .then(() => {
        console.log('______________________________________________')
        console.log(fileData.match(regExp))
        console.log(regExp)
        console.log(fileData)
        console.log('______________________________________________')
        return fileData.match(regExp)
    })
    .then((matched) => conditionIsTrueOrError(matched, fileData.match(regExp)))
        .then((match) => fileData.split(match[0]))
        .then((fileDataSplited) => [fileDataSplited[0], fileData.match(regExp)[0], data, fileDataSplited[1]])
        .then((fileDataListMerged) => fileDataListMerged.join(''))
        .catch((err) => {
            console.log('somethin went wrong', err);
            return fileData;
        });

export { addDataAfterOf, addDataBeforeOf };
