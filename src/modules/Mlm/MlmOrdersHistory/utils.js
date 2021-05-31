export const ITEMS_PER_PAGE = 10;
export const ONE_POINT_IN_RUB = 85;
export const DEBOUNCE_INTERVAL = 500;

const round = (value, decimals) => {
  return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
};

const beautifyInt = (value) => new Intl.NumberFormat('ru-RU').format(value);

export const beautifyPrice = (value, currency) => {
  const price = currency === 'EUR' ? value : value / ONE_POINT_IN_RUB;
  return beautifyInt(round(price, 2));
};

export const beautifyPriceInRub = (value, currency) => {
  const price = currency === 'RUB' ? value : value * ONE_POINT_IN_RUB;
  return beautifyInt(round(price, 2))
};

export const toDate = (date) => date.local().format('YYYY-MM-DD');

export const formatDate = (rowDate) => {
  return new Date(rowDate).toLocaleString('ru', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};

export const getFioInitials = (fio) => {
  if (fio) {
    return fio.split(/\s+/).map((word, index) => index ? `${word.substring(0, 1).toUpperCase()}.` : `${word} `);
  }

  return '';
};
