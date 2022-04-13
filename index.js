const http = require('http');
const url = require('url');
const fs = require('fs');

const tempCards = fs.readFileSync(`${__dirname}/templates/temp-card.html`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/temp-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/temp-product.html`, 'utf-8');

const product = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const fruits = JSON.parse(product);

const server = http.createServer((req,res) => {
    
    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    console.log(pathName)
    if(pathName === '/' || pathName === '/overview'){
        res.writeHead(200, {'Content-type': 'text/html'});
        let overView = tempOverview;
        const cardsOutput = fruits.map(el => replaceTemplate(tempCards, el)).join('');
        overView = overView.replace('{%CARDS%}', cardsOutput);
        res.end(overView);
    }
    else if(pathName === '/product' && id < fruits.length){
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = replaceTemplate(tempProduct, fruits[id]);
        res.end(product);
    }
    else if((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {

        fs.readFile(`${__dirname}/image${pathName}`, (err, data) => {
                res.writeHead(200, {'Content-type': 'image/png'});
                res.end(data)
        });
    }
    else{
        res.writeHead(404, {'Content-type': 'text/html'});
        res.end('URL not found on the server!')
    }
});

server.listen(8080, '127.0.0.1', () => {
    console.log('Waiting for a request...');
});

function replaceTemplate(OriginalHtml, fruitData){
    let output = OriginalHtml.replace(/{%FRUITNAME%}/g, fruitData.productName);
        output = output.replace(/{%FROM%}/g, fruitData.from);
        output = output.replace(/{%NUTRIENTS%}/g, fruitData.nutrients);
        output = output.replace(/{%AMOUNT%}/g, fruitData.quantity);
        output = output.replace(/{%PRICE%}/g, fruitData.price);
        output = output.replace(/{%DESCRIPTION%}/g, fruitData.description);
        output = output.replace(/{%IMAGE%}/g, fruitData.image);
        output = output.replace(/{%ID%}/g, fruitData.id);
        if(fruitData.organic === false){
                output = output.replace(/{%ORGANIC%}/g, "notVisible");    
        }
        return output;
}