import { startGenerator, questionsToMake, transformData, create } from '../../core/useCase/generatorUseCase';
import { promptInputQuestion, promptConfirmQuestion } from '../../core/service/promptQuestionsService';
import {
    prepareGeneralNameData,
    preparefilesNamesData,
    prepareGeneratorDefinitions,
} from '../service/baseGeneratorService';
import {
    createBaseDirectoryEstructure,
    createFilesInBaseDirectory,
    numberAndNameOfFilesToCreateQuestion,
    updateGeneratorDefinitions,
} from '../useCase/baseGeneratorUseCase';

export default startGenerator(
    questionsToMake(
        () => promptInputQuestion('baseDirName', 'Write name of the directory where the generators will be located')(),
        () =>
            promptConfirmQuestion(
                'hide',
                'generator will be hidden from git? (if yes, you will need import manualy in src/.index.js)',
            )(),
        () => promptInputQuestion('baseName', 'Write the name of the generator you are going to create')(),
        () => numberAndNameOfFilesToCreateQuestion(),
    ),
    transformData(
        (answers) => prepareGeneralNameData(answers),
        (answers) => preparefilesNamesData(answers),
        (answers) => prepareGeneratorDefinitions(answers),
    ),
    create(
        (preparedData) => createBaseDirectoryEstructure(preparedData),
        (preparedData) => createFilesInBaseDirectory(preparedData),
        (preparedData) => updateGeneratorDefinitions(preparedData),
    ),
);
