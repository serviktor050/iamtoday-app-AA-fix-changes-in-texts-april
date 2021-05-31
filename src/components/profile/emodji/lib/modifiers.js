'use strict';

var _react = require('react');

var _propTypes = require('prop-types');

var _createReactClass = require('create-react-class');

var _react2 = _interopRequireDefault(_react);

var _modifier = require('./modifier');

var _modifier2 = _interopRequireDefault(_modifier);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Modifiers = _createReactClass({
  displayName: 'Modifiers',

  propTypes: {
    onChange: _propTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      active: 0,
      modifiers: {
        0: '#FFDE5C',
        1: '#FFE1BB',
        2: '#FFD0A9',
        3: '#D7A579',
        4: '#B57D52',
        5: '#8B6858'
      }
    };
  },

  render: function render() {
    var _this = this;

    var list = [];
    var onChange = this.props.onChange;

    (0, _each2.default)(this.props.modifiers, function (hex, index) {
      list.push(_react2.default.createElement(
        'li',
        { key: index },
        _react2.default.createElement(_modifier2.default, { hex: hex, active: _this.props.active === index, onClick: function onClick() {
            onChange(index);
          } })
      ));
    });

    return _react2.default.createElement(
      'ol',
      { className: 'modifiers' },
      list
    );
  }
});

module.exports = Modifiers;