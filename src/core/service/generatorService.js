import generatorDefinitions from '../../generatorDefinitions';

const getGeneratorsListNames = () => generatorDefinitions.map((def) => def.generators).flat();

const getGeneratorsListNamesInDirectory = (selectedDirName) =>
    generatorDefinitions
        .filter((def) => def.baseDirName === selectedDirName)
        .map((def) => def.generators)
        .flat();

const getGeneratorsDirNameList = () => generatorDefinitions.map((def) => def.baseDirName);

const getGeneratorData = (selectedGenerator) => ({
    baseDirName: generatorDefinitions.find((def) => def.generators.includes(selectedGenerator)).baseDirName,
    selectedGenerator,
});

const getGeneratorToExecute = (generatorData) =>
    import(`../../${generatorData.baseDirName}/generators/${generatorData.selectedGenerator}`);

export {
    getGeneratorsListNames,
    getGeneratorData,
    getGeneratorToExecute,
    getGeneratorsDirNameList,
    getGeneratorsListNamesInDirectory,
};
