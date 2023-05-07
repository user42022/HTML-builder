const path = require('path');
const fs = require('fs');
const { readdir, writeFile } = require('fs/promises');
const [stylesPath,dist] = [path.join(__dirname,'styles'),path.join(__dirname,'project-dist')];
const output = path.join(dist,'bundle.css');

function readFile(input){
  const inputStream = fs.createReadStream(input);
  return new Promise(resolve => {
    inputStream.on('data',data=>fs.appendFile(output,data,()=>{}));
    inputStream.on('end',()=>{
      resolve();
    });
  });
}

async function bundle(){
  await writeFile(output,'');
  const fileList = await readdir(stylesPath,{withFileTypes:true});
  const pathList = fileList.filter(file=>path.parse(path.join(stylesPath,file.name)).ext==='.css'&&file.isFile());

  for (const file of pathList) {
    await readFile(path.join(stylesPath,file.name));
  }
}
bundle();
