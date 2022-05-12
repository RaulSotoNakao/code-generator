import { startMysqlConnection, endMysqlConnection, executeMysqlQuerie } from '../service/mysqlService';
import { startPromise, mapBy } from '../utils/utils';
import config from '../../config/development';
import {
    getSchemasExcludingInternalSchemasQuery,
    getTablesBySchemaQuery,
    getReferencesQuery,
    getForeignKeysQuery,
    getDataTableQuery,
} from '../service/metaDataDBQuery';
import { promptListQuestion, promptCheckQuestion } from '../service/promptQuestionsService';

const selectSchemaQuestion = () => {
    const conn = startMysqlConnection(config);

    return startPromise()
        .then(getSchemasExcludingInternalSchemasQuery)
        .then(executeMysqlQuerie(conn))
        .then(mapBy('schemaName'))
        .then(promptListQuestion('schema', 'select schema to find tables'))
        .finally(() => endMysqlConnection(conn));
};

const selectTableOfSchemaQuestion = (schema) => {
    const conn = startMysqlConnection(config);

    return startPromise(schema)
        .then(getTablesBySchemaQuery)
        .then(executeMysqlQuerie(conn))
        .then(mapBy('table_name'))
        .then(promptListQuestion('table', 'Select table to get data'))
        .finally(() => endMysqlConnection(conn));
};

const selectReferencesOfTableQuestion = (schema, table) => {
    const conn = startMysqlConnection(config);
    return startPromise({ schema, table })
        .then(getReferencesQuery)
        .then(executeMysqlQuerie(conn))
        .then(mapBy('foreignTable'))
        .then(promptCheckQuestion('references', 'Select references to use (May not have)'))
        .finally(() => endMysqlConnection(conn));
};

const selectForeignKeysOfTableQuestion = (schema, table) => {
    const conn = startMysqlConnection(config);
    return startPromise({ schema, table })
        .then(getForeignKeysQuery)
        .then(executeMysqlQuerie(conn))
        .then(mapBy('referencedTableName'))
        .then(promptCheckQuestion('relations', 'Select relations to use (May not have)'))
        .finally(() => endMysqlConnection(conn));
};

const getTableData = (schema, table) => {
    const conn = startMysqlConnection(config);
    return startPromise({ table, schema })
        .then(getDataTableQuery)
        .then(executeMysqlQuerie(conn))
        .then((result) => {
            return { tableData: result.map((r) => ({ ...r })) };
        })
        .finally(() => endMysqlConnection(conn));
};

export {
    getTableData,
    selectSchemaQuestion,
    selectTableOfSchemaQuestion,
    selectReferencesOfTableQuestion,
    selectForeignKeysOfTableQuestion,
};
