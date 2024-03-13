import {writeFileSync, readFileSync} from 'node:fs';

let resultExamples = [];
const dictionaryTag = 'phv-A1'
const outputPath = './output/cald-examples-' + dictionaryTag + '.json';
const dictionaryPath = './output/cald-dictionary.json';

function definitionFilter(def) {
    return def.level === 'A1';
}

function partOfSpeechFilter(article) {
    return article.partOfSpeech === 'phrasal verb';
}

const mixIt = true;

// Example result item:
// {
//     "definition": "having to do something, because you are forced to or feel it is necessary:",
//     "original": "He felt compelled to report the incident.",
//     "translation": "",
//     "synonym": "",
//     "antonym": "",
//     "level": "C1",
//     "partOfSpeech": "adjective",
//     "term": "compelled",
//     "transcription": "/kəmˈpeld/ $/kəmˈpeld/",
//     "timestamp": 1710270954016,
//     "showDetails": false
// },

const dictionary = JSON.parse(readFileSync(dictionaryPath, 'utf-8'));

dictionary.terms.forEach(term => computeTerm(term));

if (mixIt) {
    const length1 = resultExamples.length;

    const oldArr = [...resultExamples];
    resultExamples = [];

    while (oldArr.length) {
        const index = Math.round(Math.random() * (oldArr.length -1));
        const item = oldArr.splice(index, 1)[0];
        if (!item) {
            throw '!item';
        }
        resultExamples.push(item);
    }

    const length2 = resultExamples.length;

    if (length1 !== length2) {
        throw 'length1 !== length2';
    }
}

console.log('Examples: ', resultExamples.length);

writeFileSync(outputPath, JSON.stringify({favoriteExamples: resultExamples}, null, 2));

console.log('======== Done! ============');

function computeTerm(term) {
    term.articles.forEach(article => computeArticle(article, term));
}

function computeArticle(article, term) {
    if (partOfSpeechFilter(article)) {
        article.definitions.forEach(def => computeDef(term, def, article.partOfSpeech, article.transcription))
    }
}

function computeDef(term, def, partOfSpeech, transcription) {
    if (definitionFilter(def)) {
        def.examples.forEach(ex => {
            resultExamples.push({
                definition: def.definition,
                original: ex.original,
                level: def.level || '',
                partOfSpeech,
                term: term.term,
                transcription,
            })
        })
    }
}
