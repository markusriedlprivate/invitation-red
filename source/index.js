"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const fs = require("fs");
const https = require("https");
const path = require("path");
const zlib = require("zlib");
console.log("Here we go!");
const decryptFile = () => {
    // Datei- und Schlüsselpfade
    const encryptedFilePath = "secret.enc";
    const decryptedFilePath = "entschluesselte_datei.zip";
    const keyPath = "secret.key";
    const ivPath = "iv.txt";
    // Schlüssel und IV einlesen
    const keyFileContent = fs.readFileSync(keyPath, "utf8");
    // Entferne alle ungültigen Zeichen aus dem Schlüssel
    const validHexChars = /^[0-9a-fA-F]+$/;
    let cleanedKeyContent = "";
    for (const char of keyFileContent) {
        if (validHexChars.test(char)) {
            cleanedKeyContent += char;
        }
    }
    const key = cleanedKeyContent.slice(0, 32);
    // Überprüfe, ob der bereinigte Schlüssel die richtige Länge hat
    if (key.length !== 32) {
        console.error("Ungültige Schlüssellänge nach Bereinigung.");
        process.exit(1);
    }
    if (!validHexChars.test(key)) {
        console.error("Ungültige Zeichen im Schlüssel.");
        process.exit(1);
    }
    else
        console.log("all valid");
    const ivBuffer = Buffer.from(fs.readFileSync(ivPath));
    // AES256-GCM entschlüsseln
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, ivBuffer);
    const encryptedContent = fs.readFileSync(encryptedFilePath);
    const blockSize = 16; // Beispielblockgröße
    let decryptedContent = Buffer.alloc(0);
    for (let i = 0; i < encryptedContent.length; i += blockSize) {
        const chunk = encryptedContent.slice(i, i + blockSize);
        decryptedContent = Buffer.concat([
            decryptedContent,
            decipher.update(chunk),
        ]);
    }
    decryptedContent = Buffer.concat([decryptedContent, decipher.final()]);
    // Entpacken (dekomprimieren) des ZIP-Archivs
    const decompressedContent = zlib.unzipSync(decryptedContent);
    // Entschlüsselte und entpackte Daten in eine Datei schreiben
    fs.writeFileSync(decryptedFilePath, decompressedContent, "binary");
    console.log("Entschlüsselung und Entpackung abgeschlossen.");
};
decryptFile();
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
