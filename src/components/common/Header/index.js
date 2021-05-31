import React from "react";
import styles from "./styles.css";
import { Breadcrumb } from "../Breadcrumb";
import classNames from "classnames/bind";
import { browserHistory } from "react-router";

const cx = classNames.bind(styles);

export const Header = (props) => {
  const { title, items, links, returnUrl, isHr = true } = props;

  const toMain = () => {
    browserHistory.push(`${returnUrl}`);
  };

  return (
    <div>
      <div className={cx('title__conttainer')}>
        {returnUrl && (
          <div className={cx("goBack__btn")} onClick={toMain}>
            Назад
          </div>
        )}
        <h2 className={cx("title")}>{title}</h2>
      </div>
      {items.length ? <Breadcrumb items={items} links={links} /> : null}
      {isHr && <hr className={cx("hr")} />}
    </div>
  );
};
