import {
    startGenerator,
    questionsToMake,
    transformData,
    create,
    generateFileUsing,
} from '../../core/useCase/generatorUseCase';
import { promptInputQuestion } from '../../core/service/promptQuestionsService';
import { prepareDefaultNameData } from '../../core/service/prepareDataService';
import { tableDataDefinitions } from '../service/tableDataService';
import { createDirInRoot } from '../../core/service/fileSystemService';
import {
    getTableData,
    selectSchemaQuestion,
    selectTableOfSchemaQuestion,
    selectForeignKeysOfTableQuestion,
    selectReferencesOfTableQuestion,
} from '../../core/useCase/mysqlQuestionsUseCase';

export default startGenerator(
    questionsToMake(
        () => promptInputQuestion('baseName', 'write base_name data to use in templates :)')(),
        () => selectSchemaQuestion(),
        // ({ schema }) => selectTableOfSchemaQuestion(schema),
        // ({ schema, table }) => getTableData(schema, table),
        // ({ schema, table }) => selectForeignKeysOfTableQuestion(schema, table),
        // ({ schema, table }) => selectReferencesOfTableQuestion(schema, table),
    ),
    transformData(
        (answers) => prepareDefaultNameData(answers),
        ({ tableData }) => ({
            tableColumnText: tableData.map(({ colName }) => ({
                name: ` estos son los campitos chulos de la bdd ${colName}`,
            })),
        }),
    ),
    create(
        (preparedData) => createDirInRoot(`generatedFiles/${preparedData.camelName}`),
        (preparedData) => generateFileUsing(tableDataDefinitions, preparedData, 'TableData completed'),
    ),
);
