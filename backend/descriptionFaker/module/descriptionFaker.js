const fs = require('fs');
const helpers = require('../../helpers/helpers');
let text = fs.readFileSync('./descriptionFaker/input/text.txt', 'utf8');

const descriptionFaker = function () {
    let numberOf = helpers.getRandomArbitrary(4, 8);

    let textArr = text.replace(/[^Ёёa-zA-ZА-Яа-я\s]/gi, ""); //удаляем символы и цифры, и всю другую чушь
    textArr = textArr.split(" "); //делаем массив из слов
    const max = textArr.length; //максимальное значение

    let wordsToReturn;
    let randomWordsArray = [];

    function word(text) { //вернуть 1 слово
        const RandElement = Math.floor(Math.random() * max); //сделать рандомный элемент
        text = text[RandElement];
        return text;
    }

    while (numberOf > 0) {
        randomWordsArray.push(word(textArr));
        wordsToReturn = randomWordsArray.join(" ").toLowerCase();
        numberOf--;
    }

    wordsToReturn = wordsToReturn[0].toUpperCase() + wordsToReturn.slice(1);
    return wordsToReturn.trim();
};

module.exports = descriptionFaker;

// console.log(descriptionFaker(7));
// console.log(getRandomArbitrary(3, 7));