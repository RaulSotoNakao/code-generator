import {
    camelCase,
    capitalCase,
    constantCase,
    dotCase,
    headerCase,
    noCase,
    paramCase,
    pascalCase,
    pathCase,
    sentenceCase,
    snakeCase,
} from 'change-case';
import { singular } from 'pluralize';

const prepareCrudData = ({ crud }) => {
    return {
        get: crud.includes('get'),
        getByUuid: crud.includes('getByUuid'),
        post: crud.includes('post'),
        put: crud.includes('put'),
        deleted: crud.includes('deleted'),
    };
};

const prepareDefaultNameData = ({ baseName = 'TABLE_NAME_NOT_DEFINED' }) => {
    return {
        pascalName: pascalCase(baseName),
        camelName: camelCase(baseName),
        titleName: capitalCase(baseName)
    };
};

const getEndpointName = ({ baseName = 'TABLE_NAME_NOT_DEFINED' }) => {
    return {
        endpoint: snakeCase(baseName)
            .split('_')
            .map((word) => singular(word))
            .join('-'),
    };
};

export { prepareCrudData, prepareDefaultNameData, getEndpointName };
