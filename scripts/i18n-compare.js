
const en = require('../src/i18n/en.js');
const ru = require('../src/i18n/ru.js');

const enKeys = Object.keys(en);
const ruKeys = Object.keys(ru);

const  missingKeys =  ruKeys.filter(x => enKeys.indexOf(x) === -1);
const  extraKeys =  enKeys.filter(x => ruKeys.indexOf(x) === -1);

if(missingKeys.length  > 0) {
    console.log("\x1b[31m", "В EN словаре отсутствуют следующие ключи:");
    console.log("");
    missingKeys.forEach((key)=>{
        console.log("\x1b[31m", `'${key}': '${ru[key]}',`);
    })
    console.log("");
}

if(extraKeys.length  > 0) {
    console.log("\x1b[33m", "В EN словаре найдены ключи, которые не используются:");
    console.log("");
    extraKeys.forEach((key)=>{
        console.log("\x1b[33m", `'${key}'`);
    })
    console.log("");
}