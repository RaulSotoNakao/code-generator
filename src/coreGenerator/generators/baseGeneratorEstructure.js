import { startGenerator, questionsToMake, transformData, create } from '../../core/useCase/generatorUseCase';
import { promptInputQuestion } from '../../core/service/promptQuestionsService';
import { prepareGeneralNameData, preparefilesNamesData } from '../service/baseGeneratorService';
import {
    createBaseDirectoryEstructure,
    createFilesInBaseDirectory,
    numberAndNameOfFilesToCreateQuestion,
} from '../useCase/baseGeneratorUseCase';

startGenerator(
    questionsToMake(
        () => promptInputQuestion('baseName', 'Write baseName generate files')(),
        () => numberAndNameOfFilesToCreateQuestion(),
    ),
    transformData(
        (answers) => prepareGeneralNameData(answers),
        (answers) => preparefilesNamesData(answers),
    ),
    create(
        (preparedData) => createBaseDirectoryEstructure(preparedData),
        (preparedData) => createFilesInBaseDirectory(preparedData),
    ),
);
