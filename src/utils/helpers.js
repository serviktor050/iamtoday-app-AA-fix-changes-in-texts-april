export function dateFormat(date, bool) {
  let newDate

  if (date) {
    let arr = date.split('-')
    let arrTime = date.split('T')
    let age
    if (bool) {
      newDate = arrTime[1].slice(0, 8) + ',' + ' ' + arr[2].slice(0, 2) + '-' + arr[1] + '-' + arr[0]
      return newDate
    }
    newDate = arr[2].slice(0, 2) + '-' + arr[1] + '-' + arr[0]

    age = Math.floor((new Date() - new Date(arr[0], arr[1] - 1, arr[2].slice(0, 2))) / 3600 / 1000 / 24 / 365.25)
    return { newDate, age }
  }
  return 'Нет данных'
}

export function reverseData(data) {
  if (data.indexOf('-') === 4) {
    data.split('-')
  }
  const newData = data.split('-').reverse().join('-')
  return newData
}
/**
 * Если остаток от деления на 100 равен от 10 до 20, то 'касс'
 * Если остаток от деления на 10 равен 1, то 'касса'
 * Если остаток от деления на 10 равен 2-4, то 'кассы'
 * Оставщиеся случаи 'касс'
 * @param number
 * @param titles ['касса', 'кассы', 'касс']
 * @returns {*}
 */
export function pluralize(number, titles) {
  const decl1 = 1;
  const decl2x4 = 4;
  const titleOther = 2;
  const ten = 10;
  if (number % (ten * ten) >= ten && number % (ten * ten) < (ten + ten)) return titles[titleOther];
  if (number % ten === decl1) return titles[0];
  if (number % ten > decl1 && number % ten <= decl2x4) return titles[1];
  return titles[titleOther];
}

export function getFIO(lastName, firstName, middleName) {
  let fio = lastName ? `${lastName} ` : "";
  if (firstName) {
    fio += firstName.slice(0, 1) + ".";
  }
  if (middleName) {
    fio += middleName.slice(0, 1) + ".";
  }
  return fio;
}

