//const levenshtein = require('fast-levenshtein');

//const distance = levenshtein.get('hello', 'hallo');
//console.log('Levenshtein distance:', distance);
import levenshtein from 'fast-levenshtein';

const distance = levenshtein.get('hello', 'hello');
console.log('Levenshtein distance:', distance);
window.levenshtein = levenshtein;


