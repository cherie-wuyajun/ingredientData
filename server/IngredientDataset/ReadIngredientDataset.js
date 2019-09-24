'use strict';
const rax = require('retry-axios');
const axios = require('axios');

const fs = require('fs');
let rawdata = fs.readFileSync('database.json');
let ingredients = JSON.parse(rawdata);

async function makeRequest(data) {
    let config ={
        url: 'http://localhost:3000/add-ingredients',
        method: 'put',
        raxConfig:{
            retry:3,
            retryDelay:300
        }
    };
    config['data']=data

    let res = await axios(config);
    console.log(res.status)
    console.log(res.data.message)
}

for (const ingredient in ingredients) {
    const text = ingredients[ingredient]["text"];
    const tags = ingredients[ingredient]["tags"];

    let ingre = {};
    let ingreBody={
        ingredient:{
            text: text,
            tags: tags
        },
    };
    ingre[ingredient]=ingreBody['ingredient'];
    makeRequest(ingre).catch(function (error) {
        console.log('oh no',error)
    });
}
