'use strict';

var postcss = require('postcss');
var objectAssign = require('object-assign');

// excluding regex trick: http://www.rexegg.com/regex-best-trick.html
// Not anything inside double quotes
// Not anything inside single quotes
// Not anything inside url()
// Any digit followed by px
// !singlequotes|!doublequotes|!url()|pixelunit
var pxRegex = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)px/ig;

var defaults = {
  viewportWidth: 320,
  viewportHeight: 568, // not now used; TODO: need for different units and math for different properties
  unitPrecision: 5,
  viewportUnit: 'vw',
  selectorBlackList: [],
  propertyBlacklist: [],
  minPixelValue: 1,
  mediaQuery: false,
  keepRuleComment: 'no',
  keepFileComment: 'px2viewport-disable'
};

module.exports = postcss.plugin('postcss-px-to-viewport-mod', function (options) {

  var opts = objectAssign({}, defaults, options);
  var pxReplace = createPxReplace(opts.viewportWidth, opts.minPixelValue, opts.unitPrecision, opts.viewportUnit);

  return function (css, result) {

    if (opts.exclude) {
      if (Object.prototype.toString.call(opts.exclude) !== '[object RegExp]') {
        throw new Error('options.exclude should be RegExp!')
      }
      if (css.source.input.file.match(opts.exclude) !== null) {
        return result.root = css
      }
    }

    let isDisabled = false

    // 忽略整个文件
    css.walkComments(function (comment, i) {
      if (comment.text === opts.keepFileComment) isDisabled = true
    })

    if (isDisabled) return result.root = css

    css.walkDecls(function (decl, i) {
      const next = decl.next();
      const commentText = next && next.type == 'comment' && next.text;
      if (decl.value.indexOf('px') === -1 || commentText === opts.keepRuleComment) {
        commentText === opts.keepRuleComment && next.remove();
        return;
      }
      if (blacklistedSelector(opts.selectorBlackList, decl.parent.selector) || blacklistedProperty(opts.propertyBlacklist, decl.prop)) return;

      decl.value = decl.value.replace(pxRegex, pxReplace);
    });

    if (opts.mediaQuery) {
      css.walkAtRules('media', function (rule) {
        if (rule.params.indexOf('px') === -1) return;
        rule.params = rule.params.replace(pxRegex, pxReplace);
      });
    }

  };
});

function createPxReplace(viewportSize, minPixelValue, unitPrecision, viewportUnit) {
  return function (m, $1) {
    if (!$1) return m;
    var pixels = parseFloat($1);
    if (pixels <= minPixelValue) return m;
    return toFixed((pixels / viewportSize * 100), unitPrecision) + viewportUnit;
  };
}

function toFixed(number, precision) {
  var multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier);
  return Math.round(wholeNumber / 10) * 10 / multiplier;
}

function blacklistedSelector(blacklist, selector) {
  if (typeof selector !== 'string') return;
  return blacklist.some(function (regex) {
    if (typeof regex === 'string') return selector.indexOf(regex) !== -1;
    return selector.match(regex);
  });
}

function blacklistedProperty(blacklist, property) {
  if (typeof property !== 'string') return;
  return blacklist.some(function (regex) {
    if (typeof regex === 'string') return property.indexOf(regex) !== -1;
    return property.match(regex);
  });
}
