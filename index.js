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
    for (const file of files) {
        for (const line of file.split('\n')) {
         if (line.trim().startsWith('// TODO'))
             console.log(line.trim());
        }
    }

}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            getAllTasks()
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
