const fs = require('fs');
const path = require('path');
const {readdir, mkdir, copyFile, rm, opendir, writeFile} = require('fs/promises');
//const pathToCopy = path.join(__dirname,'assets');
const [stylesPath,dist] = [path.join(__dirname,'styles'),path.join(__dirname,'project-dist')];
const output = path.join(dist,'style.css');
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

function readFile(input){
  const inputStream = fs.createReadStream(input);
  return new Promise(resolve => {
    inputStream.on('data',data=>fs.appendFile(output,data,()=>{}));
    inputStream.on('end',()=>{
      resolve();
    });
  });
}

function cacheTamplate(input){
  const inputStream = fs.createReadStream(input);
  let cache = '';
  return new Promise(resolve => {
    inputStream.on('data',data=>cache+=data);
    inputStream.on('end',()=>{
      resolve(cache);
    });
  });
}
async function replaceTags(cacheToReplace){
  const component = [...cacheToReplace.matchAll(/\{\{[a-zA-Z]*\}\}/g)].reverse();
  for (const replaceTag of component){
    cacheToReplace = await new Promise((resolve)=>{
      let modifiedCache = cacheToReplace.slice(0,replaceTag.index);
      const inputStream = fs.createReadStream(path.join(__dirname,'components',replaceTag[0].slice(2,-2)+'.html'));
      inputStream.on('data',(data)=>modifiedCache+=data);
      inputStream.on('end',()=>{
        cacheToReplace = modifiedCache + cacheToReplace.slice(replaceTag.index+replaceTag[0].length);
        resolve(cacheToReplace);});
    });
  }
  return cacheToReplace;
}


async function bundle(){
  await writeFile(output,'');
  const fileList = await readdir(stylesPath,{withFileTypes:true});
  const pathList = fileList.filter(file=>path.parse(path.join(stylesPath,file.name)).ext==='.css'&&file.isFile());
  
  for (const file of pathList) {
    await readFile(path.join(stylesPath,file.name));
  }
}

async function buildPage() {
  await opendir(path.join(__dirname,'project-dist')).then(data=>rm(data.path,{recursive:true})).catch(()=>{});
  await mkdir(path.join(__dirname,'project-dist'));
  await recursiveDirCopy(path.join(__dirname,'assets'),path.join(__dirname,'project-dist','assets'));
  await bundle();
  let cache = await cacheTamplate(path.join(__dirname,'template.html'));
  cache = await replaceTags(cache);
  fs.writeFile(path.join(__dirname,'project-dist','index.html'),cache,()=>{}); 
}
buildPage();
