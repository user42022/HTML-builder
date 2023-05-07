const path = require('path');
const {readdir, mkdir, copyFile, rm, opendir} = require('fs/promises');
const pathToCopy = path.join(__dirname,'files');
async function recursiveDirCopy(srcPath,destPath) {
  await mkdir(destPath)
    .then(()=>{
      readdir(srcPath,{withFileTypes:true})
        .then(list=>{
          list.forEach(element=>{
            element.isFile() ?
              copyFile(path.join(srcPath,element.name),path.join(destPath,element.name)) :
              recursiveDirCopy(path.join(srcPath,element.name),path.join(destPath,element.name));
          });
        });
    });
}
async function copyDir(){
  await opendir(pathToCopy+'-copy').then(data=>rm(data.path,{recursive:true})).catch(()=>{});
  await recursiveDirCopy(pathToCopy,pathToCopy+'-copy');
}
copyDir();
