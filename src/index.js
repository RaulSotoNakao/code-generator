import generatoDefinitions from './generatorDefinitions'
import { promptListQuestion } from './core/service/promptQuestionsService'
import { startPromise } from './core/utils/utils'

const executeGenerator = (name) => generatoDefinitions[name]()

const getListOfGeneratorsAndExecuteSelected = () =>
    startPromise()
        .then(() => Object.getOwnPropertyNames(generatoDefinitions))
        .then((listOfGenerators) => promptListQuestion('name', 'select a generator :P')(listOfGenerators))
        .then((selectedGenerator) => executeGenerator(selectedGenerator.name))
        .then(() => console.log('You\'re welcome!'))


getListOfGeneratorsAndExecuteSelected();
