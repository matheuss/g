const {readdirSync, readFileSync, mkdirSync, createWriteStream, writeFileSync} = require('fs');

const gifFrames = require('gif-frames');

async function main() {
  try {
    mkdirSync('dist');
  } catch (err) {
    if (err.code !== 'EEXIST') {
      // we want to throw if anythig but "dir already exists"
      // happens
      throw err;
    }
  }

  const files = readdirSync('gifs');
  let body = ''

  for (const file of files) {
    const dataArray = await gifFrames({url: `gifs/${file}`, frames: 0});
    const [data] = dataArray;

    const basename = file.replace('.gif', '');
    const jpgName = basename + '.jpg';
    data.getImage().pipe(createWriteStream(`dist/${jpgName}`));
    
    body += `\n<a href="${basename}"><img src="/${jpgName}"></a>`
  }

  writeFileSync('dist/index.html', readFileSync('index.html', 'utf8').replace('BODY', body))
}

main().catch(console.error);
