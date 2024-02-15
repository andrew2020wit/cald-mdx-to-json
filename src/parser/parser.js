import {parse} from "node-html-parser";

// return array of examples
export function parser(rawTermObj) {
    const articles = [];
    const parsedHtml = parse(rawTermObj.text);

    parsedHtml
        .querySelectorAll(".di-body > .entry > .pv-block, .di-body > .idiom-block > .idiom-block")
        .forEach((entry) => {
            const article = {};

            article.partOfSpeech = entry.querySelector(".anc-info-head > .dpos, .di-info > .dpos")?.text.trim() || "";

            const definitions = [];

            const headword = entry
                .querySelector(".headword")
                .text.trim();

            entry
                .querySelectorAll(".pv-body .def-block, .idiom-body .def-block")
                .forEach((defBlock) => {
                    const definition = {};

                    definition.definition = defBlock.querySelector(".ddef_h > .ddef_d").text.trim();

                    if (headword !== rawTermObj.term) {
                        definition.lexicalUnit = headword;
                    }

                    if (!definition.definition) {
                        throw "!def";
                    }

                    const level = defBlock.querySelector(".ddef_h > .dxref")?.text.trim() || "";

                    if (level) {
                        definition.level = level;
                    }

                    const examples = [];

                    defBlock
                        .querySelectorAll(".def-body > .examp > .deg")
                        .forEach((example) => {
                            examples.push({
                                original: example.text.trim().replaceAll('"', "'"),
                            });
                        });

                    if (examples.length) {
                        definition.examples = examples;
                    }

                    definitions.push(definition);
                });

            article.definitions = definitions;

            const existArticle = articles.find(art => art.partOfSpeech === article.partOfSpeech);

            if (existArticle) {
                existArticle.definitions.push(...definitions);
                existArticle.definitions.sort(sortDefinitions);
            } else if(article.definitions.length) {
                article.definitions.sort(sortDefinitions);
                articles.push(article);
            }
        });


    parsedHtml
        .querySelectorAll(".di-body > .entry > .entry-body__el")
        .forEach((entry) => {
            const article = {};

            article.partOfSpeech = entry.querySelector(".pos-header > .dpos")?.text.trim() || "";

            const ukPron =
                entry
                    .querySelector(".pos-header > .uk.dpron-i > .dpron")
                    ?.text.trim() || "";

            const usPron =
                entry
                    .querySelector(".pos-header > .us.dpron-i > .dpron")
                    ?.text.trim() || "";

           let transcription = ukPron;

            if (usPron) {
               transcription += ' $' + usPron;
            }

            if (transcription) {
                article.transcription = transcription;
            }

            const definitions = [];

            entry
                .querySelectorAll(".pos-body > .dsense .ddef_block")
                .forEach((defBlock) => {
                    const definition = {};

                    definition.definition = defBlock.querySelector(".ddef_h > .ddef_d").text.trim();

                    if (!definition.definition) {
                        throw "!def";
                    }

                    const level = defBlock.querySelector(".ddef_h > .dxref")?.text.trim() || "";

                    if (level) {
                        definition.level = level;
                    }

                    const examples = [];

                    defBlock
                        .querySelectorAll(".def-body > .examp > .deg")
                        .forEach((example) => {
                            examples.push({
                                   original: example.text.trim().replaceAll('"', "'"),
                            });
                        });

                    if (examples.length) {
                        definition.examples = examples;
                    }

                    definitions.push(definition);
                });

            article.definitions = definitions;

            const existArticle = articles.find(art => art.partOfSpeech === article.partOfSpeech);

            if (existArticle) {
                existArticle.definitions.push(...definitions);
                existArticle.definitions.sort(sortDefinitions);
            } else if(article.definitions.length) {
                article.definitions.sort(sortDefinitions);
                articles.push(article);
            }
        });

    return articles;
}

const sortDefinitions = (a, b) => {
    const aLevel = a.level ? a.level : 'ZZ';
    const bLevel = b.level ? b.level : 'ZZ';

    if (aLevel === bLevel) return 0;

    if (aLevel > bLevel) return 1;

    return -1;
}
