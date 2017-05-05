class DomNodeCollection {
  constructor(nodes) {
    this.nodes = nodes;
  }

  each(cb) {
    this.nodes.forEach(cb);
  }

  html(html) {
    if (typeof html === "string") {
      this.each( node => node.innerHTML = html);
    } else {
      if (this.nodes.length > 0) {
        return this.nodes[0].innerHTML;
      }
    }
  }

  empty() {
    this.html('');
  }

  append(children) {
    if (this.nodes.length === 0) return;

    if (typeof children === 'object' &&
    !(children instanceof DomNodeCollection)) {
      children = $l(children);
    }

    if (typeof children === "string") {
      this.each( node => node.innerHTML += children);
    } else if (children instanceof DomNodeCollection) {
      this.each(node => {
        children.each(childNode => {
          node.appendChild(childNode.cloneNode(true));
        });
      });
    }
  }

  attr(key, val) {
    if (typeof val === "string") {
      this.each( (node) => node.setAttribute(key, val));
    } else {
      return this.nodes[0].getAttribute(key);
    }
  }

  addClass(addedClass) {
    this.each( node => node.classList.add(addedClass));
  }

  removeClass(removedClass) {
    this.each( node => node.classList.remove(removedClass));
  }

  children() {
    let allChildren = [];
    this.each( node => {
      let currentChildren = node.children;
      allChildren = allChildren.concat(Array.from(currentChildren));
    });
    return new DomNodeCollection(allChildren);
  }

  parent() {
    let firstParentNode = this.nodes[0].parentNode;
    return new DomNodeCollection(firstParentNode);
  }

  find(selector) {
    let selectedNodes = [];
    this.each( node => {
      let selectedI = node.querySelectorAll(selector);
      selectedNodes = selectedNodes.concat(Array.from(selectedI));
    });
    return new DomNodeCollection(selectedNodes);
  }

  remove() {
    let toSplice = [];
    this.each( node => {
      node.parentNode.removeChild(node);
      toSplice.push(node);
    });
    this.nodes.splice(toSplice, toSplice.length);
  }

  on(eventTitle, cb) {
    this.each(node => {
      node.addEventListener(eventTitle, cb);
      let eventKey = `${eventTitle}`;
      if (typeof node[eventKey] === "undefined") {
        node[eventKey] = [];
      }
      node[eventKey].push(cb);
    });
  }

  off(eventTitle) {
    this.each(node => {
      let eventKey = `${eventTitle}`;
      if (node[eventKey]) {
        node[eventKey].forEach(cb => {
          node.removeEventListener(eventTitle, cb);
        });
      }
      node[eventKey] = [];
    });
  }

}


module.exports = DomNodeCollection;
