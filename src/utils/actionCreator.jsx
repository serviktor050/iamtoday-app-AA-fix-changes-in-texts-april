export default function makeActionCreator(type, ...argNames) {
  return (...args) => {
    const action = { type: type };
    argNames.forEach((arg, index) => {
      if (arg === 'actionType') {
        const addType = args[index];
        const addTypeArr = addType.split('/');
        if (addType) {
          action.type = type + addTypeArr[addTypeArr.length - 1]
        }
      }
      action[argNames[index]] = args[index];
    });
    return action;
  }
}
