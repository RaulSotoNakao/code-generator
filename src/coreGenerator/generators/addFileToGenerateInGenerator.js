import { startGenerator, questionsToMake, transformData, create } from '../../core/useCase/generatorUseCase';
import {
    updateGeneratorWithNewFiles,
    updateServiceWithNewFiles,
    selectServiceOfGeneratorQuestion,
    selectUseCaseOfGeneratorQuestion,
} from '../useCase/addFileToGenerateInGeneratorUseCase';
import { selectGeneratorDataQuestion } from '../../core/useCase/generatorUseCase';
import { numberAndNameOfFilesToCreateQuestion } from '../useCase/baseGeneratorUseCase';
import { preparefilesNamesData } from '../service/baseGeneratorService';
import { prepareDefaultNameData } from '../../core/service/prepareDataService';
import { createTemplate } from '../useCase/baseGeneratorUseCase';
export default startGenerator(
    questionsToMake(
        () => selectGeneratorDataQuestion(),
        (answers) => selectServiceOfGeneratorQuestion(answers),
        (answers) => selectUseCaseOfGeneratorQuestion(answers),
        () => numberAndNameOfFilesToCreateQuestion(),
    ),
    transformData(
        (answers) => preparefilesNamesData(answers),
        (answers) => prepareDefaultNameData({ baseName: answers.selectedGenerator }),
    ),
    create(
        (preparedData) => updateGeneratorWithNewFiles(preparedData),
        (preparedData) => updateServiceWithNewFiles(preparedData),
        (preparedData) => createTemplate(preparedData, preparedData.filesToGenerate),
    ),
);
