const fs = require('fs');

const p = new Promise((resolve, reject) => {
  fs.readFile('./test.tx', (err, data) => {
    if (err) reject(err);
    resolve(data);
  })
});

p.then((value) => {
  console.log(value.toString())
},
  (reason) => {
    console.log(reason)
  })