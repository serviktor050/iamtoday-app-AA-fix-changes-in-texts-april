export { default as makeActionCreator } from './actionCreator';
export { default as makeAsyncActionCreator } from './asyncActionCreator';



export function closest(el, cls) {
  while (el) {
    if (el.classList.contains(cls)) return el
    else el = el.parentElement
  }
}

export function findMeorAncestor(el, cls) {
  while (!el.classList.contains(cls) && (el = el.parentElement)) {
    return el
  }
}

export function groupByWithKeys(list, keyGetter) {
  const data = {};
  const keys = [];
  list.forEach((item) => {
    const key = keyGetter(item);
    if (!keys.includes(key)) {
      keys.push(key);
    }
    const items = data[key];
    if (!items) {
      data[key] = [item];
    } else {
      items.push(item);
    }
  });
  return {data, keys};
}
