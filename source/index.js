"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const https = require("https");
const path = require("path");
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
const addVocalSumToSum = (sum, text) => {
    [...text].forEach((e) => {
        switch (e) {
            case "a":
                sum += 2;
            case "e":
                sum += 4;
            case "i":
                sum += 8;
            case "o":
                sum += 16;
            case "u":
                sum += 32;
        }
    });
    return sum;
};
const sumOfEachSentence = (text) => {
    //   let sentences: string[] = text.split(".");
    let sentences = text.split(/[.!?]/);
    let numbers = [];
    sentences.forEach((e) => {
        let sumOfSentence = sumNumbersInText(e);
        numbers.push(sumOfSentence);
    });
    return numbers;
};
const distinctSortAndReturnTenBiggestValues = (numbers) => {
    const unique = new Set(numbers);
    const sorted = [...unique].sort((a, b) => a - b);
    return sorted.slice(-10);
};
const sortTenBiggestValuesByOccurrences = (numbers, tenBiggest) => {
    let result = new Map();
    tenBiggest.forEach((e) => {
        result.set(e, numbers.filter((number) => number === e).length);
    });
    const sortedByOccurrence = new Map([...result.entries()].sort((a, b) => b[1] - a[1])).keys();
    return [...sortedByOccurrence];
};
const sortAndSubtractTop10Occurrences = (text) => {
    const numbers = sumOfEachSentence(text);
    const tenBiggestValues = distinctSortAndReturnTenBiggestValues(numbers);
    const sortedByOccurrences = sortTenBiggestValuesByOccurrences(numbers, tenBiggestValues);
    return subtractIndexFromNumberInArray(sortedByOccurrences);
};
const subtractIndexFromNumberInArray = (numbers) => {
    return numbers.map((value, index) => value - index);
};
const numbersToAscii = (numbers) => {
    let asciiString = "";
    for (const num of numbers) {
        asciiString += String.fromCharCode(num);
    }
    return asciiString;
};
const text = readTxtFile(clearSmallerTxtPath);
const sumAllNumbers = sumNumbersInText(text);
console.log("Task 2");
console.log("Result: " + sumAllNumbers);
console.log("_________________________________________________________\n");
const sumVocals = addVocalSumToSum(sumAllNumbers, text);
console.log("Task 3");
console.log("Result: " + sumVocals);
console.log("_________________________________________________________\n");
const biggestSumsInSentence = sortAndSubtractTop10Occurrences(text);
console.log("Task 4");
console.log("a)");
console.log("Result: " + biggestSumsInSentence);
const asciiConverterResult = numbersToAscii(biggestSumsInSentence);
console.log("b)");
console.log("Result: " + asciiConverterResult);
console.log("c)");
const serverOptions = {
    key: fs.readFileSync(process.env.PWD + path.sep + "localhost.key"),
    cert: fs.readFileSync(process.env.PWD + path.sep + "localhost.crt"),
};
const server = https.createServer(serverOptions, (req, res) => {
    const solution = numbersToAscii(biggestSumsInSentence);
    res.writeHead(200, {
        "Content-Type": "text/plain",
        "Content-Disposition": "inline; filename='asciiText.txt'",
    });
    res.end(solution);
});
const port = 3000;
server.listen(port, () => {
    console.log(`Server läuft auf https://localhost:${port}/`);
});
