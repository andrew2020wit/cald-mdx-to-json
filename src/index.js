import {parser} from "./parser/parser.js";
import * as fs from 'node:fs/promises';

const isTest = true;
const baseDir = isTest ? './test-files/' : './dict/';
const outputFile = isTest ? 'result.json' : './output/cald-dictionary.json'

const resultTerms = [];

async function main() {
    console.log(' ========== start ==============');
    const filesNames = [];

    try {
        const dir = await fs.opendir(baseDir);
        for await (const dirent of dir) {
            filesNames.push(dirent.name);
        }
    } catch (err) {
        console.error(err);
    }

    console.log(filesNames)

    for await (const fileName of filesNames) {
        await computeFile(baseDir + fileName);
    }

    await fs.writeFile(outputFile, JSON.stringify({
        dictionaryName: 'Cambridge Advanced Learner\'s Dictionary 4th',
        dictionaryTermLanguage: 'en',
        dictionaryLicense: 'Unlicensed',
        formatDescriptor: 'JSONDictionary',
        updateDate: new Date().toISOString(),
        terms: resultTerms
    }, null, 2));
}

main().then(() => console.log(' ========== end =============='));

async function computeFile(fileName) {
    const data = await fs.readFile(fileName, {encoding: 'utf8'});
    const dataArr = data.split('\n');
    let lastObj = {};

    for (let i = 0; i < dataArr.length; i++) {
        if (i % 3 === 0) {
            lastObj.term = dataArr[i].trim();
            console.log(lastObj.term);
        }

        if ((i - 1) % 3 === 0) {
            lastObj.text = dataArr[i];

            const articles = parser(lastObj);

            if (articles.length) {
                resultTerms.push({
                    term: lastObj.term,
                    articles
                });
            }

            lastObj = {};
        }
    }
}
