export function menuMobLeft(state = 'HIDE', action) {
  switch (action.type) {
    case 'SHOW':
      return {
        visible: true
      }
    case 'HIDE':
      return {
        visible: false
      }
    default:
      return state
  }
}
