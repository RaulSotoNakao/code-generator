import { startGenerator, questionsToMake, transformData, create } from '../../core/useCase/generatorUseCase';
import { promptInputQuestion } from '../../core/service/promptQuestionsService';
import { prepareDefaultNameData } from '../../core/service/prepareDataService';
import {
    createController,
    createService,
    createModule,
    createEntity,
    createCreatedDto,
    createUpdatedDto,
    createDirectoryEstructure
} from '../useCase/nestServerUseCase';

startGenerator(
    questionsToMake(
        () => promptInputQuestion('baseName', 'write base_name data to use in templates :)')(),
    ),
    transformData((answers) => prepareDefaultNameData(answers)),
    create(
        (preparedData) => createDirectoryEstructure(preparedData),
        (preparedData) => createController(preparedData),
        (preparedData) => createService(preparedData),
        (preparedData) => createModule(preparedData),
        (preparedData) => createEntity(preparedData),
        (preparedData) => createCreatedDto(preparedData),
        (preparedData) => createUpdatedDto(preparedData),
    ),
);
