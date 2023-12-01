"use strict";
const path = require("path");
const fs = require("fs");
console.log("Here we go!");
const clearSmallerTxtPath = process.env.PWD + path.sep + "clear_smaller.txt";
const readTxtFile = (path) => {
    return fs.readFileSync(path).toString();
};
const sumNumbersInText = (text) => {
    let sum = 0;
    [...text].forEach((e) => {
        let number = parseInt(e);
        if (!isNaN(number)) {
            sum += number;
        }
    });
    return sum;
};
const text = readTxtFile(clearSmallerTxtPath);
let sumOfAllNumbers = sumNumbersInText(text);
// let vocalValence: number = addVocalValenceToSum(sumOfAllNumbers, text)
// let biggestSumsInSentence = findThreeBiggestSumsOfSentencesInTextSortedByThierOccuenceAndSubtractedIndex(text);
// let asciiConverterResult = convertIntToCharByAscii(biggestSumsInSentence);
console.log("Task 2");
console.log("Result: " + sumOfAllNumbers);
console.log("_________________________________________________________\n");
