import React from 'react';
import Icon from '../../../components/Icon';

export default {
  options: [
    'inline',
    'blockType',
    'fontSize',
    'link',
    'list',
    'textAlign',
    'fontFamily',
    'remove',
    'history',
    'image',
    'youtube',
    'embedded',
    'task',
    'colorPicker',
    'emoji'
  ],

  inline: {
    inDropdown: false,
    className: undefined,
    options: {
      'bold': 'Жирный',
      'italic': 'Курсив',
      'underline': 'Подчёркнутый',
      'strikethrough': 'Зачёркнутый',
      'uppercase': 'Верхний регистр',
      'monospace': 'Моноширинный',
      'superscript': 'Надстрочный',
      'subscript': 'Подстрочный'
    },
    bold: {icon: <Icon kind={'bold'} />, className: undefined},
    italic: {icon: <Icon kind={'italic'} />, className: undefined},
    underline: {icon: <Icon kind={'underline'} />, className: undefined},
    strikethrough: {icon: <Icon kind={'strikethrough'} />, className: undefined},
    monospace: {icon: <Icon kind={'monospace'} />, className: undefined},
    superscript: {icon: <Icon kind={'superscript'} />, className: undefined},
    subscript: {icon: <Icon kind={'subscript'} />, className: undefined},
    uppercase: {icon: <Icon kind={'uppercase'} />, className: undefined},
  },
  task: {
    icon: <Icon kind={'task'} />,
    className: undefined,
  },
  blockType: {
    inDropdown: true,
    options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
    className: undefined,
    dropdownClassName: undefined,
  },
  fontSize: {
    icon: <Icon kind={'font-size'} />,
    options: [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96],
    className: undefined,
    dropdownClassName: undefined,
  },
  fontFamily: {
    options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
    className: undefined,
    dropdownClassName: undefined,
  },
  list: {
    inDropdown: false,
    className: undefined,
    options: ['unordered', 'ordered', 'indent', 'outdent'],
    unordered: {icon: <Icon kind={'unordered'} />, className: undefined},
    ordered: {icon: <Icon kind={'ordered'} />, className: undefined},
    indent: {icon: <Icon kind={'indent'} />, className: undefined},
    outdent: {icon: <Icon kind={'outdent'} />, className: undefined},
  },
  textAlign: {
    inDropdown: false,
    className: undefined,
    options: ['left', 'center', 'right', 'justify'],
    left: {icon: <Icon kind={'align-left'} />, className: undefined},
    center: {icon: <Icon kind={'align-center'} />, className: undefined},
    right: {icon: <Icon kind={'align-right'} />, className: undefined},
    justify: {icon: <Icon kind={'align-justify'} />, className: undefined},
  },
  colorPicker: {
    icon: <Icon kind={'color'} />,
    className: undefined,
    popupClassName: undefined,
    colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
      'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
      'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
      'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
      'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
      'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)']
  },
  link: {
    inDropdown: false,
    className: undefined,
    popupClassName: undefined,
    showOpenOptionOnHover: true,
    options: ['link', 'unlink'],
    link: {icon: <Icon kind={'link'} />, className: undefined},
    unlink: {icon: <Icon kind={'unlink'} />, className: undefined},
  },
  emoji: {
    icon: <Icon kind={'emoji'} />,
    className: undefined,
    popupClassName: undefined,
    emojis: ['😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌',
      '🤓', '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈', '🙉', '🙊',
      '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
      '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕', '👇',
      '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶',
      '🐇', '🐥', '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
      '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈', '🎉',
      '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷',
      '💰', '🖊', '📅', '✅', '❎', '💯'],
  },
  embedded: {
    icon: <Icon kind={'embedded'} />,
    className: undefined,
    popupClassName: undefined,
  },
  youtube: {
    icon: <Icon kind={'youtube'} />,
    className: undefined,
    popupClassName: undefined,
  },
  image: {
    icon: <Icon kind={'image'} />,
    className: undefined,
    popupClassName: undefined,
    urlEnabled: true,
    uploadEnabled: true,
    alignmentEnabled: true,
    uploadCallback: undefined,
  },
  remove: {icon: <Icon kind={'eraser'} />, className: undefined},
  history: {
    inDropdown: false,
    className: undefined,
    options: ['undo', 'redo'],
    undo: {icon: <Icon kind={'undo'} />, className: undefined},
    redo: {icon: <Icon kind={'redo'} />, className: undefined},
  },
};
