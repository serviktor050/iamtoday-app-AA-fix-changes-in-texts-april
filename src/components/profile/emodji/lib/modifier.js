"use strict";

var _react = require("react");

var _propTypes = require('prop-types');

var _createReactClass = require('create-react-class');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Modifier = _createReactClass({
  displayName: "Modifier",

  propTypes: {
    onKeyUp: _propTypes.func,
    onClick: _propTypes.func,
    active: _propTypes.bool,
    hex: _propTypes.string
  },

  render: function render() {

    return _react2.default.createElement("a", {
      onKeyUp: this.props.onKeyUp,
      onClick: this.props.onClick,
      className: this.props.active ? "modifier active" : "modifier",
      style: { background: this.props.hex }
    });
  }
});

module.exports = Modifier;