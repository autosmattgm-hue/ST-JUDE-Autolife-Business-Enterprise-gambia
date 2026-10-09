/**
 * Creates an element. Attributes are set with setAttribute, `on*` keys with a
 * function become event listeners, and children are inserted as text nodes
 * unless they are already DOM nodes. Untrusted strings therefore can never
 * inject markup (no innerHTML anywhere in the app).
 *
 * @param {string} tag
 * @param {Record<string, any>} attrs
 * @param {...(Node|string|number|Array|null|false|undefined)} children
 * @returns {HTMLElement}
 */
export function h(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;

    if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2), value);
    } else if (value === true) {
      node.setAttribute(key, '');
    } else {
      node.setAttribute(key, String(value));
    }
  }

  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }

  return node;
}

/** Removes all children from a node. */
export function clear(node) {
  node.replaceChildren();
}
