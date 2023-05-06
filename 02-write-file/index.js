const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const {stdin, stdout} = process;
const rl = readline.createInterface({input:stdin,output:stdout});
fs.writeFile(path.join(__dirname,'input-data.txt'),'',()=>stdout.write('hello\nInput data:\n'));
rl.on('line', line =>{
  if (line === 'exit') {
    rl.emit('SIGINT');
  }
  else {
    fs.appendFile(path.join(__dirname,'input-data.txt'),line+'\n', ()=>{});
  }
} );
rl.on('SIGINT',()=>{
  console.log('see ya');
  rl.close();
});