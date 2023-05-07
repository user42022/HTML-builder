const fs = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');
const secretFolderPath = path.join(__dirname,'secret-folder');
const getFilePath = (file)=> path.join(secretFolderPath,file);
readdir(secretFolderPath,{withFileTypes:true})
  .then(fileList=>fileList.filter(e=>e.isFile()))
  .then(fileList=>{
    fileList.forEach(file=>{
      const filePath = getFilePath(file.name);
      fs.stat(filePath,(err,stats)=>{
        console.log( !err ? 'file -- '+[path.parse(file.name).name,path.parse(file.name).ext,stats.size/1024+' kb'].join(' - ') : err);
      });
    });
  });
