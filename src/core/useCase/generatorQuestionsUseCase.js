import { startPromise, mergeData, mapBy } from '../utils/utils';
import {
    promptListQuestion,
    promptCheckQuestion,
    promptInputQuestion,
    promptConfirmQuestion,
} from '../service/promptQuestionsService';

const inputBaseNameQuestion = (answers = {}) => {
    return startPromise()
        .then(promptInputQuestion('table', 'Write name in snake case to generate files'))
        .then(mergeData(answers));
};

export { inputBaseNameQuestion };
