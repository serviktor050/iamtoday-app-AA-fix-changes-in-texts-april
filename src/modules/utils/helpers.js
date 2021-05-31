export const capitalize = (str) => {
    return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
};

export const createUserName = (item) => {
    return `${item.lastName ? capitalize(item.lastName) : ""} ${
        item.firstName ? capitalize(item.firstName) : ""
    } ${item.middleName ? capitalize(item.middleName) : ""}`;
};

export const isDataNotFetched = (prop) => {
    return !prop || prop.isFetching || !prop.isLoad || !prop.data;
}

export const pluralizeMonthes = (month) => {
    const lastSymbol = month.slice(-1);
    let result = month;
    switch (lastSymbol) {
        case 'ь':
            result = month.slice(0, month.length - 1) + 'я';
            break
        case 'й': 
            result = month.slice(0, month.length - 1) + 'я';
            break
        case 'т':
            result = month + 'а';
            break
        default:
            break
    }

    return result
}