import cookie from 'react-cookie'
import { dict } from 'dict';

const langInit = cookie.load('AA.lang') || dict.default;
export function lang(state = langInit, action) {
  switch (action.type) {
    case 'SET_LANG':
      return action.data;
    default:
      return state
  }
}
