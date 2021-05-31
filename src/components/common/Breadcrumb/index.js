import React from 'react';
import {Link} from "react-router";
import classNames from 'classnames/bind';
import styles from './styles.css';

const cx = classNames.bind(styles);

export const Breadcrumb = (props) => {

    const {items, links} = props;

    function renderItem(index, x, links, link) {
        let items = x;
        if (link && links.length > index) {
            items = <Link onlyActiveOnIndex={true} to={links[index]}>{x}</Link>;
        }
        return <div key={`breadItem${index}`} className={cx('bread__item', { 'bread__item--link': link})}>{items}</div>;
    }

    return (
        items.length > 0 && <div className={cx('breadcrumb')}>
            <div className={cx('bread', { 'big' : links.length > 2})}>
                {items.map((x, index) => index < items.length - 1 && renderItem(index, x, links, true))}
                {items.length > 1  && renderItem(items.length - 1, items[items.length - 1], links, false)}
            </div>
        </div>
    )
};

Breadcrumb.defaultProps = {
    className: '',
    items: [],
    links:[]
};