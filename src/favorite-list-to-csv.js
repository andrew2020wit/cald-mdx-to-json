import {readFileSync, writeFileSync} from 'node:fs';

let resultText = '';
const shortPath = './output/cald-examples-phv-idioms-A1-B2'
const outputPath = shortPath + '.csv';
const jsonPath = shortPath + '.json';
const separator = '\t';

const jsonObjs = JSON.parse(readFileSync(jsonPath, 'utf-8'));

jsonObjs.favoriteExamples.forEach(element => {
    let line = '';
    line += element.timestamp || '';
    line += separator;
    line += element.updateTimestamp || '';
    line += separator;
    line += element.toDoTimestamp || '';
    line += separator;
    line += element.term || '';
    line += separator;
    line += element.transcription || '';
    line += separator;
    line += element.partOfSpeech || '';
    line += separator;
    line += element.level || '';
    line += separator;
    line += element.synonym || '';
    line += separator;
    line += element.antonym || '';
    line += separator;
    line += element.definition || '';
    line += separator;
    line += element.original || '';
    line += separator;
    line += element.translation || '';

    resultText += line + '\n';
});

writeFileSync(outputPath, resultText);

console.log('======== Done! ============');


