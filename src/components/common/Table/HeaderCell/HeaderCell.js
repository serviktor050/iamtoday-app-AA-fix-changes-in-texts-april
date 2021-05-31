import React from "react";
import styles from "./styles.css";

export const HeaderCell = (props) => {

    const svgSort = (direction) => <svg className={styles.sortIcon}>
        <use xlinkHref={`#ico-sort-${direction}`}/>
    </svg>;

    const {orderByField, className, orderByDirection, fieldName, label} = props;
    return <div className={className} onClick={(e) =>
        props.onClick(e, fieldName, orderByField === fieldName ? (orderByDirection === 'asc' ? 'desc' : 'asc') : 'asc')}>
        {label}
        {orderByField === fieldName && svgSort(orderByDirection)}
    </div>
}