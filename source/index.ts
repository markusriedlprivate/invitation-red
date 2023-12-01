const path = require('path')
const fs = require("fs")

console.log("Here we go!");

function readTxtFile (filename): string {
    return fs.readFileSync(filename, 'utf8', function(err, data) {
        if (err) throw err;
        console.log('OK: ' + filename);
        console.log(data)
        return data
});
}

function sumNumbersInText(text: string):number {
    let sum: number = 0
    [text].forEach(e => {
        let number = parseInt(e)
        if(!isNaN(number)) {
            sum += number
        }
    })
    console.log(sum);
    
    return sum
}

const sumOfAllNumbers: number = sumNumbersInText(readTxtFile('clear_smaller.txt'))
console.log("Task 2")
console.log("Result: " + sumOfAllNumbers)
console.log("---------------------------------------------------------\n")