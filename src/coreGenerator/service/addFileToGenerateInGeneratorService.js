const templateFileGenerator = (file) =>
    `(preparedData) => generateFileUsing(${file.fileCamelName}Definitions, preparedData, '${file.filePascalName} completed'),\n`;

const templateImportFileDefinitions = (file) => `${file.fileCamelName}Definitions,\r\n`;

const templateServiceDefinitions = (preparedData) => (file) =>
    `const ${file.fileCamelName}Definitions = ({ camelName = 'CAMEL_NAME_NOT_DEFINED' }) => {
    return {
        templateNameDir: '${preparedData.baseDirName}/templates/${preparedData.camelName}${file.filePascalName}Template.mustache',
        dirToWrite: \`./generatedFiles/\${camelName}/\${camelName}${file.filePascalName}.js\`,
    };
};\r\n\r\n`;

export { templateFileGenerator, templateImportFileDefinitions, templateServiceDefinitions };
