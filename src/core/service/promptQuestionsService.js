import inquirer from 'inquirer';

const promptListQuestion =
    (name, message, defaultSelected = '') =>
    (listToSelect) =>
        inquirer.prompt([
            {
                name: name,
                type: 'list',
                choices: listToSelect,
                message,
                default: defaultSelected,
            },
        ]);

const promptCheckQuestion =
    (name, message, isSelectedAll = false) =>
    (listToSelect) =>
        inquirer.prompt([
            {
                name: name,
                type: 'checkbox',
                choices: listToSelect,
                message,
                default: isSelectedAll ? listToSelect : [],
            },
        ]);

const promptInputQuestion = (name, message) => () =>
    inquirer.prompt([
        {
            name: name,
            type: 'input',
            message,
        },
    ]);

const promptConfirmQuestion = (name, message) => () =>
    inquirer.prompt([
        {
            name: name,
            type: 'confirm',
            message,
        },
    ]);

export { promptListQuestion, promptCheckQuestion, promptInputQuestion, promptConfirmQuestion };
