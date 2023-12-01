const path = require("path");
const fs = require("fs");

console.log("Here we go!");

const clearSmallerTxtPath: string =
  process.env.PWD + path.sep + "clear_smaller.txt";

const readTxtFile = (path): string => {
  return fs.readFileSync(path).toString();
};

const sumNumbersInText = (text: string): number => {
  let sum: number = 0;
  [...text].forEach((e) => {
    let number = parseInt(e);
    if (!isNaN(number)) {
      sum += number;
    }
  });
  return sum;
};

const text: string = readTxtFile(clearSmallerTxtPath);
let sumAllNumbers: number = sumNumbersInText(text);
console.log("Task 2");
console.log("Result: " + sumAllNumbers);
console.log("_________________________________________________________\n");
