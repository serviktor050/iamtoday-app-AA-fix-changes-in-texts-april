export function timer(state = { minutes: 1, seconds: 5 }, action) {
  switch (action.type) {
    case 'START_TIMER':
      return {
        minutes: action.timer.minutes,
        seconds: action.timer.seconds
      }
    default:
      return state
  }
}
