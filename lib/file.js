const fs = require('fs/promises');
const path = require('path');

const file = {};

file.fullPath = (dir, fileName) => {
    return path.join(__dirname, `../${dir}/${fileName}`);
}

file.create = (dir, fileName, content) => {
    console.log('Creating file...');
}

file.read = async (dir, fileName) => {
    try {
        const filePath = file.fullPath(dir, fileName);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent;
    } catch (error) {
        return false;
    }
}

file.readBinary = async (dir, fileName) => {
    try {
        const filePath = file.fullPath(dir, fileName);
        const fileContent = await fs.readFile(filePath);
        return fileContent;
    } catch (error) {
        return false;
    }
}

file.update = (dir, fileName, content) => {
    console.log('Updating file...');
}

file.delete = (dir, fileName) => {
    console.log('Deleting file...');
}

module.exports = file;