import * as fs from "fs";
import * as https from "https";
import * as path from "path";

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

const addVocalSumToSum = (sum: number, text: string): number => {
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

const sumOfEachSentence = (text: string): number[] => {
  //   let sentences: string[] = text.split(".");
  let sentences: string[] = text.split(/[.!?]/);
  let numbers: number[] = [];

  sentences.forEach((e) => {
    let sumOfSentence = sumNumbersInText(e);
    numbers.push(sumOfSentence);
  });

  return numbers;
};

const distinctSortAndReturnTenBiggestValues = (numbers: number[]) => {
  const unique = new Set<number>(numbers);
  const sorted = [...unique].sort((a, b) => a - b);
  return sorted.slice(-10);
};

const sortTenBiggestValuesByOccurrences = (
  numbers: number[],
  tenBiggest: number[]
): number[] => {
  let result = new Map<number, number>();

  tenBiggest.forEach((e) => {
    result.set(e, numbers.filter((number) => number === e).length);
  });
  const sortedByOccurrence = new Map(
    [...result.entries()].sort((a, b) => b[1] - a[1])
  ).keys();
  return [...sortedByOccurrence];
};

const sortAndSubtractTop10Occurrences = (text: string): number[] => {
  const numbers = sumOfEachSentence(text);
  const tenBiggestValues = distinctSortAndReturnTenBiggestValues(numbers);
  const sortedByOccurrences = sortTenBiggestValuesByOccurrences(
    numbers,
    tenBiggestValues
  );
  return subtractIndexFromNumberInArray(sortedByOccurrences);
};

const subtractIndexFromNumberInArray = (numbers: number[]): number[] => {
  return numbers.map((value, index) => value - index);
};

const numbersToAscii = (numbers: number[]): string => {
  let asciiString = "";

  for (const num of numbers) {
    asciiString += String.fromCharCode(num);
  }

  return asciiString;
};

const text: string = readTxtFile(clearSmallerTxtPath);
const sumAllNumbers: number = sumNumbersInText(text);

console.log("Task 2");
console.log("Result: " + sumAllNumbers);
console.log("_________________________________________________________\n");

const sumVocals: number = addVocalSumToSum(sumAllNumbers, text);

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
  key: fs.readFileSync(process.env.PWD + path.sep + "localhost.key"), // Pfad zu deinem privaten Schlüssel
  cert: fs.readFileSync(process.env.PWD + path.sep + "localhost.crt"), // Pfad zu deinem Zertifikat
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
