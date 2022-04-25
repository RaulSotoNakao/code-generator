import { pascalCase, camelCase } from 'change-case';
import { prepareDefaultNameData } from '../../core/service/prepareDataService';
import { logRed } from '../../core/service/logService';

const prepareGeneralNameData = ({ baseName }) => {
    return {
        ...prepareDefaultNameData({ baseName }),
        baseDirName: `generator${pascalCase(baseName)}`,
    };
};

const getGeneratorsDefinitions = ({ baseDirName, camelName }) => {
    return {
        templateNameDir: 'coreGenerator/templates/generatorsTemplate.mustache',
        dirToWrite: `./src/${baseDirName}/generators/${camelName}.js`,
    };
};

const getServiceDefinitions = ({ baseDirName, camelName }) => {
    return {
        templateNameDir: 'coreGenerator/templates/serviceTemplate.mustache',
        dirToWrite: `./src/${baseDirName}/service/${camelName}Service.js`,
    };
};

const getTemplateDefinitions = ({ baseDirName, fileCamelName }) => {
    return {
        templateNameDir: 'coreGenerator/templates/templatesTemplate.mustache',
        dirToWrite: `./src/${baseDirName}/templates/${fileCamelName}Template.mustache`,
    };
};

const getUseCaseDefinitions = ({ baseDirName, camelName }) => {
    return {
        templateNameDir: 'coreGenerator/templates/useCaseTemplate.mustache',
        dirToWrite: `./src/${baseDirName}/useCase/${camelName}UseCase.js`,
    };
};

const preparefilesNamesData = ({ filesNames = [] }) => {
    return {
        filesToGenerate: filesNames.map((fileName) => ({
            fileCamelName: camelCase(fileName),
            filePascalName: pascalCase(fileName),
        })),
    };
};

const fillListWithQuestion = (list, questionToAdd) => {
    return list.map((a, index) => questionToAdd(index + 1));
};

export {
    fillListWithQuestion,
    getTemplateDefinitions,
    getUseCaseDefinitions,
    getServiceDefinitions,
    getGeneratorsDefinitions,
    prepareGeneralNameData,
    preparefilesNamesData,
};
