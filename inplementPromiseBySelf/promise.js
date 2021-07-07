// declear the constructor
function Promise(executor) {
  // add attribute
  this.PromiseState = 'pending';
  this.PromiseResult = null;
  // save the callback function of then If the asynchronized happen
  this.callBacks = [];

  // save the this of the instacne
  const self = this;



  // resolve function of promise
  function resolve(data) {
    // judge status
    if (self.PromiseState !== 'pending') return;
    // 1. change the promise state to the fulfilled
    self.PromiseState = 'fulfilled';
    // 2. change the promise result to data
    self.PromiseResult = data;

    setTimeout(() => {
      self.callBacks.forEach(callback => {
        callback.onResolved(data);
      });
    })
  };

  // reject function of promise
  function reject(data) {
    // judge status
    if (self.PromiseState !== 'pending') return;
    // 1. change the promise state to the rejected
    self.PromiseState = 'rejected';
    // 2. change the promise result to data
    self.PromiseResult = data;

    setTimeout(() => {
      self.callBacks.forEach(callback => {
        callback.onRejected(data);
      });
    })
  };


  try {
    // call executor function synchronized
    executor(resolve, reject);
  } catch (error) {
    // change the promise state to rejected and change the result value
    reject(error);
  }
};

// add then method
Promise.prototype.then = function (onResolved, onRejected) {

  return new Promise((resolve, reject) => {
    const self = this;

    // jugde the wether call back function
    if (typeof onRejected !== 'function') {
      onRejected = reason => {
        throw reason;
      }
    }

    if (typeof onResolved !== 'function') {
      onResolved = value => value;
    }

    function callBack(type) {
      try {
        let result = type(self.PromiseResult);
        if (result instanceof Promise) {
          result.then(value => {
            resolve(value);
          },
            reason => {
              reject(reason);
            })
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    }

    if (this.PromiseState === 'fulfilled') {
      setTimeout(() => {
        callBack(onResolved);
      })
    }

    if (this.PromiseState === 'rejected') {
      setTimeout(() => {
        callBack(onRejected);
      })
    }

    if (this.PromiseState === 'pending') {
      this.callBacks.push({
        onResolved: function () {
          callBack(onResolved);
        },
        onRejected: function () {
          callBack(onRejected);
        }
      });
    }
  })

}

Promise.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected);
}

Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    if (value instanceof Promise) {
      value.then(v => {
        resolve(v);
      }, reason => {
        reject(reason)
      })
    } else {
      resolve(value);
    }
  })
}

Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  })
}

Promise.all = function (promises) {

  let count = 0;
  let arr = 0;

  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(value => {
        count++;
        arr[i] = value;
        if (count === promises.length) {
          resolve(arr);
        }
      },
        reason => {
          reject(reason);
        })
    }
  })
}

Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(value => {
        resolve(value);
      },
        reason => {
          reject(reason);
        })
    }
  })
}