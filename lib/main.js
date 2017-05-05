const DomNodeCollection = require('./dom_node_collection.js');

let isDocReady = false;
let docReadyCbs = [];

window.$l = (arg) => {
  if (typeof(arg) === "string") {
    const nodelist = document.querySelectorAll(arg);
    const nodelistArray = Array.from(nodelist);
    return new DomNodeCollection(nodelistArray);
  } else if (typeof(arg) === "object") {
    if (arg instanceof HTMLElement) {
      return new DomNodeCollection([arg]);
    }
  } else if (typeof(arg) === "function") {
    if (isDocReady) {
      arg();
    } else {
      docReadyCbs.push(arg);
    }
  }

};

window.$l.extend = (firstObj, ...nextObjs) => {
  nextObjs.forEach( obj => {
    for(let key in obj){
      firstObj[key] = obj[key];
    }
  });
  return firstObj;
};

window.$l.ajax = (options) => {
  let request = new XMLHttpRequest();
  let defaults = {
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    method: "GET",
    url: "",
    data: {},
    success: () => { console.log("default"); },
    error: () => { console.log("default erorr"); }
  };
  options = window.$l.extend(defaults, options);

  if (options.method === "GET") {
    options.ulr += "?" + toQueryString(options.data);
  }
  request.open
};

let toQueryString = (obj) => {
  let result = "";
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result += key + "=" + obj[key] + "&";
    }
  }
  return result.substring(0, result.length - 1);
};

document.addEventListener("DOMContentLoaded", () => {
  isDocReady = true;
  docReadyCbs.forEach( func => {
    func();
  });
});
