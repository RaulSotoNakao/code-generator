import { startGenerator, questionsToMake, transformData, create } from '../../core/useCase/generatorUseCase';
import { promptInputQuestion } from '../../core/service/promptQuestionsService';
import { prepareGeneratorDefinitionsToAdd, preparefilesNamesData } from '../service/baseGeneratorService';
import {
    updateGeneratorDefinitions,
    createFilesInBaseDirectory,
    numberAndNameOfFilesToCreateQuestion,
    selectOneGeneratorFolders,
} from '../useCase/baseGeneratorUseCase';
import { prepareDefaultNameData } from '../../core/service/prepareDataService';
export default startGenerator(
    questionsToMake(
        () => selectOneGeneratorFolders(),
        () => promptInputQuestion('baseName', 'Write baseName generate files')(),
        () => numberAndNameOfFilesToCreateQuestion(),
    ),
    transformData(
        (answers) => prepareDefaultNameData(answers),
        (answers) => preparefilesNamesData(answers),
        (answers) => prepareGeneratorDefinitionsToAdd(answers)
    ),
    create(
        (preparedData) => createFilesInBaseDirectory(preparedData),
        (preparedData) => updateGeneratorDefinitions(preparedData),
    ),
);
