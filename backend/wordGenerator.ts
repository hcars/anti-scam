import * as fs from 'fs';
interface WordGenerator {
    words: string[],
}

export function initWordGenerator(filePath: string): WordGenerator {
    const content: string = fs.readFileSync(filePath, 'utf-8');
    const lines: string[] = content.split(/\r?\n/);
    let words = [];
    for (const line of lines) {
        words.push(line.trim());
    }
    return { words: words};
}

export function generatePair(generator: WordGenerator): [string, string] { 
    const new_index = () => Math.floor(Math.random() * generator.words.length);
    const first = new_index();
    let second;
    do {
      second = new_index();
    } while (first === second);
    const firstWord = generator.words.at(first);
    if (firstWord === undefined) {
        throw Error("Unable to generate words");
    }
    const secondWord = generator.words.at(second);
    if (secondWord === undefined) {
        throw Error("Unable to generate words");
    }
    return [firstWord, secondWord];
}