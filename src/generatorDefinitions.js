const generators = [
    {
        baseDirName: 'generatorNestServer',
        generators: ['nestServer'],
    },
    {
        baseDirName: 'coreGenerator',
        generators: ['baseGeneratorEstructure', 'addGeneratorInEstructure', 'addFileToGenerateInGenerator'],
    },
];
export default generators;
