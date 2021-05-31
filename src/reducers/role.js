export function role(state = 'RETURN_ERROR', action) {
  switch (action.type) {
    case 'SET_ROLE':
      return {
        role: action.role
      }
    default:
      return state
  }
}
