const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllTasks(){
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
    let tasks;
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            tasks = getAllTasks()
            for (const task of tasks)
                console.log(task);
            break;
        case 'important':
            tasks = getAllTasks()
            for (const task of tasks){
                if (task.includes('!'))
                    console.log(task);
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
