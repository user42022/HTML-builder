const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const {stdin, stdout} = process;
const output = fs.createWriteStream(path.join(__dirname,'input-data.txt'));
const rl = readline.createInterface({input:stdin,output});
stdout.write('----hello----\n--Input data:\n');
rl.on('line', line =>{
  if (line === 'exit') {
    process.emit('SIGINT');
  }
  else {
    output.write(line+'\n');
  }
} );
rl.on('close',()=>{
  stdout.write('----see ya----');
});
process.on('SIGINT',()=>{
  rl.close();
});