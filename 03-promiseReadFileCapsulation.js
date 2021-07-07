const mineReadFile = (path) => {
  return new Promise((resolve, reject) => {
    require('fs').readFile(path, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

mineReadFile('./test.txt').then((value) => {
  console.log(value.toString());
}, reason => {
  console.warn(reason);
});