const DomNodeCollection = require('./dom_node_collection.js');

window.$l = (arg) => {
  if (typeof(arg) === "string") {
    const nodelist = document.querySelectorAll(arg);
    const nodelistArray = Array.from(nodelist);
    return new DomNodeCollection(nodelistArray);
  } else if (typeof(arg) === "object") {
    if (arg instanceof HTMLElement) {
      return new DomNodeCollection([arg]);
    }
  }

};
