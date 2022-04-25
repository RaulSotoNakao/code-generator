import { logPromise, logError, startPromise } from '../../core/utils/utils.js';
import { generateFile } from '../../core/useCase/generatorUseCase';
import {
    getDirectoryControllerDefinitions,
    getDirectoryServiceDefinitions,
    getDirectoryModuleDefinitions,
    getDirectoryEntityDefinitions,
    getDirectoryCreatedDtoDefinitions,
    getDirectoryUpdatedDtoDefinitions,
} from '../service/nestServerService';
import { createDirInRoot } from '../../core/service/fileSystemService';

const createController = (data) =>
    startPromise(data)
        .then(getDirectoryControllerDefinitions)
        .then(generateFile(data, 'Controller completed'))
        .catch(logError('error in Controller'));

const createService = (data) =>
    startPromise(data)
        .then(getDirectoryServiceDefinitions)
        .then(generateFile(data, 'Service completed'))
        .catch(logError('error in Service'));

const createModule = (data) =>
    startPromise(data)
        .then(getDirectoryModuleDefinitions)
        .then(generateFile(data, 'Module completed'))
        .catch(logError('error in Module'));

const createEntity = (data) =>
    startPromise(data)
        .then(getDirectoryEntityDefinitions)
        .then(generateFile(data, 'Entity completed'))
        .catch(logError('error in Entity'));

const createCreatedDto = (data) =>
    startPromise(data)
        .then(getDirectoryCreatedDtoDefinitions)
        .then(generateFile(data, 'CreatedDto completed'))
        .catch(logError('error in CreatedDto'));

const createUpdatedDto = (data) =>
    startPromise(data)
        .then(getDirectoryUpdatedDtoDefinitions)
        .then(generateFile(data, 'UpdatedDto completed'))
        .catch(logError('error in UpdatedDto'));

const createDirectoryEstructure = (data) => {
    startPromise()
    .then(() => createDirInRoot(`generatedFiles`))
    .then(() => createDirInRoot(`generatedFiles/${data.camelName}`))
    .then(() => createDirInRoot(`generatedFiles/${data.camelName}/entities`))
    .then(() => createDirInRoot(`generatedFiles/${data.camelName}/dto`))

}

export {
    createDirectoryEstructure,
    createController,
    createService,
    createModule,
    createEntity,
    createCreatedDto,
    createUpdatedDto,
};
