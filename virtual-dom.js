'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // @flow

var _preact = require('preact');

var _preact2 = _interopRequireDefault(_preact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const V = (component, props, ...children) => ({
  component,
  props: _extends({}, props, children)
});

const example = {
  component: 'Name',
  props: {
    key: 'value'
  }
};

const e = V(
  'ul',
  { className: 'list' },
  V(
    'li',
    null,
    'Item 1'
  ),
  V(
    'li',
    null,
    'Item 2'
  )
);

console.log(e);

exports.default = e;

// const V = require('./virtual-dom')
//
// module.exports = V.default ? V.default : V
