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
            for (const task of tasks)
                console.log(task);
            break;
        case command === 'important':
            for (const task of tasks) {
                if (task.includes('!'))
                    console.log(task);
            }
            break;
        case command.startsWith('user'):
            const userName = command.split(' ')[1].toLowerCase();
            for (const task of tasks) {
                if (task.includes(';')) {
                    const user = task.split(';')[0].slice(8).toLowerCase();
                    if (user === userName) {
                        console.log(task);
                    }
                }
            }
            break;
            case command.startsWith('sort'):
                arg = command.split(' ')[1];
                if (arg === 'importance') {
                    let sortedTasks = [...tasks];
                    const countExclamations = (str) => str.split("!").length - 1;
                    sortedTasks.sort((a, b) => countExclamations(b) - countExclamations(a));
                    for (task of sortedTasks) {
                        console.log(task);
                    }
                }
                if (arg === 'user') {
                    const todoOffset = 8;
                    let sortedTasks = {};
                    for (const task of tasks) {
                        if (task.includes(';')) {
                            let user = task.split(';')[0].slice(todoOffset).toLowerCase();
                            let comment = task.split(';')[2];
                            if (user in sortedTasks)
                                sortedTasks[user].push(comment);
                            else {
                                sortedTasks[user] = [comment];
                            }
                        }
                        else{
                            let comment = task.slice(todoOffset);
                            if (-1 in sortedTasks)
                                sortedTasks[-1].push(comment);
                            else {
                                sortedTasks[-1] = [comment];
                            }
                        }
    
                    }
                    for (const user of Object.keys(sortedTasks)){
                        for (const comment of sortedTasks[user]){
                            if (user == -1){
                                console.log(`${comment}`);
                            }
                            else{
                                console.log(`${user}: ${comment}`);
                            }
                        }
                    }
                }else if (arg == "date") {
                    const taskWithDate = []
                    const otherTasks = []
                    for (const task of tasks) {
                        if (task.includes(';')) {
                            let splitedTask = task.split(';')
                            const date = splitedTask[1].trim();
                            taskWithDate.push({date: new Date(date), task: task});
                        }else{
                            otherTasks.push(task);
                        }
                    }
                    taskWithDate.sort((a, b) => b.date - a.date);
                    for (taskDate of taskWithDate){
                        console.log(taskDate.task)
                    }
                    for (task of otherTasks){
                        console.log(task)
                    }
                }
                break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
