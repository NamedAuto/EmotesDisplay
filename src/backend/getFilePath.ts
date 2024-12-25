import path from "path";
//
// function getFilePath(fileName) {
//     if (process.env.NODE_ENV === 'production') {
//         // Use execPath to get the path of the running executable, or adjust based on your deployment structure
//         return path.join(path.dirname(process.execPath), fileName);
//     } else {
//         // In development, use the current working directory (where you run the script)
//         return path.join(process.cwd(), fileName);
//     }
// }
//
// // Example usage
// const filePath = getFilePath('somefile.txt');
// console.log('Resolved file path:', filePath);
export let emotePath: string;
export let yamlPath: string;
export let backgroundPath: string;
export let frontendPath:string;

// if (process.env.NODE_ENV == "production") {
    const execPath = process.execPath;
    emotePath = path.join(path.dirname(execPath), 'emotes');
    yamlPath = path.join(path.dirname(execPath), 'config');
    backgroundPath = path.join(path.dirname(execPath), 'background');
    // frontendPath = path.join(path.dirname(execPath), 'frontend');
// } else {
//     console.log("HELLO FROM IN HERE")
//     emotePath = path.join(process.cwd(), 'public', 'emotes');
//     yamlPath = path.join(process.cwd(), 'src', 'config');
//     backgroundPath = path.join(process.cwd(), 'public', 'background');
// }