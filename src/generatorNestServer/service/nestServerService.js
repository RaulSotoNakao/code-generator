
const getDirectoryControllerDefinitions = ({ camelName = 'CAMEL_NAME_NOT_DEFINED' }) => {
    return {
        templateNameDir: 'generatorNestServer/templates/controllerTemplate.mustache',
        dirToWrite: `./generatedFiles/${camelName}/${camelName}Controller.ts`,
    };
};

const getDirectoryServiceDefinitions = ({ camelName = 'CAMEL_NAME_NOT_DEFINED' }) => {
    return {
        templateNameDir: 'generatorNestServer/templates/serviceTemplate.mustache',
        dirToWrite: `./generatedFiles/${camelName}/${camelName}Service.ts`,
    };
};

const getDirectoryModuleDefinitions = ({ camelName = 'CAMEL_NAME_NOT_DEFINED' }) => {
    return {
        templateNameDir: 'generatorNestServer/templates/moduleTemplate.mustache',
        dirToWrite: `./generatedFiles/${camelName}/${camelName}Module.ts`,
    };
};

const getDirectoryEntityDefinitions = ({ camelName = 'CAMEL_NAME_NOT_DEFINED' }) => {
    return {
        templateNameDir: 'generatorNestServer/templates/entityTemplate.mustache',
        dirToWrite: `./generatedFiles/${camelName}/entities/${camelName}Entity.ts`,
    };
};

const getDirectoryCreatedDtoDefinitions = ({ camelName = 'CAMEL_NAME_NOT_DEFINED' }) => {
    return {
        templateNameDir: 'generatorNestServer/templates/createdDtoTemplate.mustache',
        dirToWrite: `./generatedFiles/${camelName}/dto/${camelName}CreatedDto.ts`,
    };
};

const getDirectoryUpdatedDtoDefinitions = ({ camelName = 'CAMEL_NAME_NOT_DEFINED' }) => {
    return {
        templateNameDir: 'generatorNestServer/templates/updatedDtoTemplate.mustache',
        dirToWrite: `./generatedFiles/${camelName}/dto/${camelName}UpdatedDto.ts`,
    };
};



export {
    getDirectoryControllerDefinitions,
    getDirectoryServiceDefinitions,
    getDirectoryModuleDefinitions,
    getDirectoryEntityDefinitions,
    getDirectoryCreatedDtoDefinitions,
    getDirectoryUpdatedDtoDefinitions,
};
