import fs from 'fs';
import path from 'path';

const storesDir = 'stores';
const salesTotalsDir = 'salesTotals';
const totalFile = 'totals.txt';

// lecture du fichier 
function readJSONFiles(directory, totals) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const filePath = path.join(directory, file);
        
        if (fs.statSync(filePath).isDirectory()) {
            readJSONFiles(filePath, totals);
        } else if (path.extname(file) === '.json') {
            const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (jsonData &&  jsonData.total !== 'undefined') {
                totals.push(jsonData.total);
            } else {
                console.error('Erreur de lecture ');
            }
        }
    });
}


function somme(directory) {
    const totals = [];
    readJSONFiles(directory, totals);
    return totals.reduce((acc, curr) => acc + curr, 0);
}


function writeTotalToFile(total) {
    const date = new Date().toLocaleDateString();
    const source = process.argv[2] || 'stores';
    const content = `Total at ${date} from ${source}: ${total}€\n`;
    fs.appendFileSync(path.join(salesTotalsDir, totalFile), content);
}


function main() {
    const total = somme(process.argv[2] || storesDir);
    writeTotalToFile(total);
}

main();
