import { startMysqlConnection, endMysqlConnection, executeMysqlQuerie } from '../service/mysqlService';
import { startPromise, mergeData, mapBy, logAndStartPromise } from '../utils/utils';
import config from '../../config/development';
import {
    getSchemasExcludingInternalSchemasQuery,
    getTablesBySchemaQuery,
    getReferencesQuery,
    getForeignKeysQuery,
    getDataTableQuery,
} from '../service/metaDataDBQuery';
import { promptListQuestion, promptCheckQuestion } from '../service/promptQuestionsService';

const selectSchemaQuestion = (answers = {}) => {
    const conn = startMysqlConnection(config);

    return startPromise()
        .then(getSchemasExcludingInternalSchemasQuery)
        .then(executeMysqlQuerie(conn))
        .then(mapBy('schemaName'))
        .then(promptListQuestion('schema', 'select schema to find tables'))
        .then(mergeData(answers))
        .catch((err) => {
            console.log(err);
        })
        .finally(() => endMysqlConnection(conn));
};

const selectTableOfSchemaQuestion = (answers = {}) => {
    const conn = startMysqlConnection(config);
    const { schema } = answers;

    return startPromise(schema)
        .then(getTablesBySchemaQuery)
        .then(executeMysqlQuerie(conn))
        .then(mapBy('TABLE_NAME'))
        .then(promptListQuestion('table', 'Select table to get data'))
        .then(mergeData(answers))
        .catch((err) => {
            console.error(err);
        })
        .finally(() => endMysqlConnection(conn));
};

const selectReferencesOfTableQuestion = (answers = {}) => {
    const conn = startMysqlConnection(config);
    const { schema, table } = answers;
    return startPromise({ schema, table })
        .then(getReferencesQuery)
        .then(executeMysqlQuerie(conn))
        .then(mapBy('foreignTable'))
        .then(promptCheckQuestion('references', 'Select references to use (May not have)'))
        .then(mergeData(answers))
        .catch((err) => {
            console.log(err);
        })
        .finally(() => endMysqlConnection(conn));
};

const selectForeignKeysOfTableQuestion = (answers = {}) => {
    const conn = startMysqlConnection(config);
    const { schema, table } = answers;
    return startPromise({ schema, table })
        .then(getForeignKeysQuery)
        .then(executeMysqlQuerie(conn))
        .then(mapBy('referencedTableName'))
        .then(promptCheckQuestion('relations', 'Select relations to use (May not have)'))
        .then(mergeData(answers))
        .catch((err) => {
            console.log(err);
        })
        .finally(() => endMysqlConnection(conn));
};

const getTableData = (answers = {}) => {
    const conn = startMysqlConnection(config);
    const { table, schema } = answers;
    return startPromise({ table, schema })
        .then(getDataTableQuery)
        .then(executeMysqlQuerie(conn))
        .then((result) => {
            return { tableData: result.map((r) => ({ ...r })) };
        })
        .then(mergeData(answers))
        .catch((err) => {
            console.error(err);
        });
};

export {
    getTableData,
    selectSchemaQuestion,
    selectTableOfSchemaQuestion,
    selectReferencesOfTableQuestion,
    selectForeignKeysOfTableQuestion,
};
