const path = require('path');
const fs = require('fs');
const textStream = fs.createReadStream(path.join(__dirname,'text.txt'),'utf-8');
textStream.on('data',(chunk)=>console.log(chunk));