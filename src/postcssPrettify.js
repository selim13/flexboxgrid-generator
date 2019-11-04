import postcss from "postcss";

function getIndent(node, char, width) {
  let level = 0;
  let parent = node.parent;

  while (parent.type !== "root") {
    parent = parent.parent;
    level++;
  }

  return char.repeat(width * level);
}

/**
 * Prettifies generated css a little bit.
 *
 * @param {object} opts Plugins options.
 * @param {string} opts.indentChar Indentation character i.e "\t" or " ".
 * @param {number} opts.indentWidth Indentation width.
 */
function postcssPrettify(opts) {
  opts = opts || {};
  const { indentChar = " ", indentWidth = 2 } = opts;

  return (root, result) => {
    root.walk(node => {
      const { type } = node;
      const indent = getIndent(node, indentChar, indentWidth);

      node.raws.before = "\n" + indent;

      if (node === root.first) {
        node.raws.before = "";
      }

      if (type === "rule") {
        node.selector = node.selector.replace(/,/g, `,\n${indent}`);
      }

      if (type === "rule" || type === "atrule") {
        node.raws.semicolon = true;

        if (node.prev()) {
          node.raws.before = "\n\n" + indent;
        }

        node.raws.after = "\n" + indent;
      }
    });
  };
}

export default postcss.plugin("postcss-prettify", postcssPrettify);
