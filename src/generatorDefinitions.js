const generators = [
    {
        baseDirName: 'generatorNestServer',
        generators: ['nestServer',]
    },
    {
        baseDirName: 'coreGenerator',
        generators: ['baseGeneratorEstructure','addGeneratorInEstructure','addFileToGenerateInGenerator',]
    },
    {
        baseDirName: 'generatorTest',
        generators: ['tableData',]
    },
]
export default generators
