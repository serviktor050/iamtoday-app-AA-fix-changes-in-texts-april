'use strict';

var _react = require('react');

var _propTypes = require('prop-types');

var _createReactClass = require('create-react-class');

var _react2 = _interopRequireDefault(_react);

var _emojione = require('emojione');

var _emojione2 = _interopRequireDefault(_emojione);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Emoji = _createReactClass({
  displayName: 'Emoji',

  propTypes: {
    onKeyUp: _propTypes.func,
    onClick: _propTypes.func,
    ariaLabel: _propTypes.string,
    name: _propTypes.string,
    shortname: _propTypes.string,
    title: _propTypes.string,
    role: _propTypes.string
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    // avoid rerendering the Emoji component if the shortname hasn't changed
    return nextProps.shortname !== this.props.shortname;
  },

  createMarkup: function createMarkup() {
    return { __html: _emojione2.default.shortnameToImage(this.props.shortname) };
  },

  render: function render() {
    return _react2.default.createElement('div', {
      onKeyUp: this.props.onKeyUp,
      onClick: this.props.onClick,
      tabIndex: '0',
      className: 'emoji',
      'aria-label': this.props.ariaLabel,
      title: this.props.name,
      role: this.props.role,
      dangerouslySetInnerHTML: this.createMarkup()
    });
  }
});

module.exports = Emoji;