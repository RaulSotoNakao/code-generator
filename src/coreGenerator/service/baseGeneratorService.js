import { pascalCase, camelCase } from 'change-case';
import { prepareDefaultNameData } from '../../core/service/prepareDataService';
import { logRed } from '../../core/service/logService';
import generatorDefinitions from "../../generatorDefinitions"

const prepareGeneralNameData = ({ baseName, baseDirName }) => {
    return {
        ...prepareDefaultNameData({ baseName }),
        baseDirName: `generator${pascalCase(baseDirName)}`,
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

const getDefinitions = () => {
    return {
        templateNameDir: 'coreGenerator/templates/generatorDefinitionTemplate.mustache',
        dirToWrite: `./src/generatorDefinitions.js`,
    };
}

const prepareGeneratorDefinitions = (answers) => {
    const generatorsDefinition = generatorDefinitions.map(def => {
        const generators = def.generators.map(d => ({ generatorName: d }))
        const defParsed = {
            baseDirName: def.baseDirName,
            generators
        }
        return defParsed
    })
    return { generatorsDefinition: [...generatorsDefinition, { baseDirName: answers.baseDirName, generators: [{ generatorName: answers.camelName }] }] }
}

const prepareGeneratorDefinitionsToAdd = (preparedData) => {
    const generatorsDefinition = generatorDefinitions.map(def => {
        const generators = def.generators.map(d => ({ generatorName: d }));
        const generatorsNameToAdd = preparedData.baseDirName === def.baseDirName ? [...generators, { generatorName: preparedData.camelName }] : generators

        const defParsed = {
            baseDirName: def.baseDirName,
            generators: generatorsNameToAdd
        }
        return defParsed
    })
    return { generatorsDefinition: [...generatorsDefinition] }
}

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

const addExportDefault = (fileLinesList, preparedData) => {
    const lineWithExportDefault = fileLinesList.findIndex(line => line.includes('export default {'))
    const part1 = fileLinesList.slice(0, lineWithExportDefault + 1);
    const part2 = fileLinesList.slice(lineWithExportDefault + 1, fileLinesList.length + 1);
    const exportStatement = `    ${preparedData.camelName},\r`
    return [
        ...part1, exportStatement, ...part2
    ]
}
const addImportStatement = (fileLinesList, preparedData) => {
    const importStatement = `import ${preparedData.camelName} from "./${preparedData.baseDirName}/generators/${preparedData.camelName}";\r`
    return [
        importStatement, ...fileLinesList
    ]

}

export {
    fillListWithQuestion,
    getTemplateDefinitions,
    getUseCaseDefinitions,
    getServiceDefinitions,
    getGeneratorsDefinitions,
    prepareGeneralNameData,
    preparefilesNamesData,
    addExportDefault,
    addImportStatement,
    getDefinitions,
    prepareGeneratorDefinitions,
    prepareGeneratorDefinitionsToAdd
};
