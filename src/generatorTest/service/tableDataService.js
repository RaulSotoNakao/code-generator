
const tableDataDefinitions = ({ camelName = 'CAMEL_NAME_NOT_DEFINED' }) => {
    return {
        templateNameDir: 'generatorTest/templates/tableDataTableDataTemplate.mustache',
        dirToWrite: `./generatedFiles/${camelName}/${camelName}TableData.js`,
    };
};



export {
    tableDataDefinitions, 
};
