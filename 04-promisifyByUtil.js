const util = require('util');
const fs = require('fs');

const mineFileReader = util.promisify(fs.readFile);

mineFileReader('./test.txt').then((value) => {
  console.log(value.toString());
})