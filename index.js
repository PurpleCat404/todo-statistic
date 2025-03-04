const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllTasks() {
    let tasks = [];
    for (const file of files) {
        for (const line of file.split('\n')) {
            if (line.trim().startsWith('// TODO'))
                tasks.push(line.trim());
        }
    }

    return tasks;
}

function processCommand(command) {
    let tasks = getAllTasks();
    switch (true) {
        case command === 'exit':
            process.exit(0);
            break;
        case command === 'show':
            printTable(tasks);
            break;
        case command === 'important':
            printTable(tasks.filter(task => task.includes('!')));
            break;
        case command.startsWith('user'):
            const userName = command.split(' ')[1].toLowerCase();
            printTable(tasks.filter(task => {
                if (task.includes(';')) {
                    const user = task.split(';')[0].slice(8).toLowerCase();
                    return user === userName;
                }
                return false;
            }));
            break;
        case command.startsWith('sort'):
            let arg = command.split(' ')[1];
            if (arg === 'importance') {
                let sortedTasks = [...tasks];
                const countExclamations = (str) => str.split("!").length - 1;
                sortedTasks.sort((a, b) => countExclamations(b) - countExclamations(a));
                printTable(sortedTasks);
            } else if (arg === 'user') {
                let sortedTasks = tasks.filter(task => task.includes(';')).sort((a, b) => {
                    let userA = a.split(';')[0].slice(8).toLowerCase();
                    let userB = b.split(';')[0].slice(8).toLowerCase();
                    return userA.localeCompare(userB);
                });
                printTable(sortedTasks);
            } else if (arg === "date") {
                let taskWithDate = tasks.filter(task => task.includes(';')).sort((a, b) => {
                    let dateA = new Date(a.split(';')[1].trim());
                    let dateB = new Date(b.split(';')[1].trim());
                    return dateB - dateA;
                });
                printTable(taskWithDate);
            }
            break;
        case command.startsWith('date'):
            const date = parseDate(command.split(' ')[1]);
            printTable(tasks.filter(task => {
                if (task.includes(';')) {
                    let taskDate = new Date(task.split(';')[1].trim());
                    return taskDate >= date;
                }
                return false;
            }));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function formatColumn(text, width) {
    text = text.trim();
    if (text.length > width) {
        return text.slice(0, width - 3) + "...";
    }
    return text.padEnd(width, " ");
}

function printTable(tasks) {
    const maxColWidths = [1, 10, 10, 50];

    let colWidths = [0, 0, 0, 0];

    let formattedTasks = tasks.map(task => {
        let importance = task.includes('!') ? '!' : '';
        let user = "-";
        let date = "-";
        let comment = task.slice(8).trim();

        if (task.includes(';')) {
            let parts = task.split(';');
            user = parts[0].slice(8).trim();
            date = parts[1].trim();
            comment = parts[2].trim();
        }

        return { importance, user, date, comment };
    });

    for (const { importance, user, date, comment } of formattedTasks) {
        colWidths[0] = Math.min(Math.max(colWidths[0], importance.length), maxColWidths[0]);
        colWidths[1] = Math.min(Math.max(colWidths[1], user.length), maxColWidths[1]);
        colWidths[2] = Math.min(Math.max(colWidths[2], date.length), maxColWidths[2]);
        colWidths[3] = Math.min(Math.max(colWidths[3], comment.length), maxColWidths[3]);
    }

    for (const { importance, user, date, comment } of formattedTasks) {
        console.log(
            formatColumn(importance, colWidths[0]) + " | " +
            formatColumn(user, colWidths[1]) + " | " +
            formatColumn(date, colWidths[2]) + " | " +
            formatColumn(comment, colWidths[3])
        );
    }
}


function parseDate(dateString) {
    let parts = dateString.split('-').map(Number);
    if (parts.length === 1) {
        return new Date(parts[0], 0, 1);
    } else if (parts.length === 2) {
        return new Date(parts[0], parts[1] - 1, 1);
    } else if (parts.length === 3) {
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return null;
}

// TODO you can do it!
