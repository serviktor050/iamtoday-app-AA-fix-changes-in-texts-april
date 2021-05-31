import React from "react";
import { Button } from "../Button";
import classNames from "classnames/bind";
import style from "./style.css";
const cx = classNames.bind(style);

export default ({ mainText, isButton=true, buttonClick, buttonText, linkText, linkHref, infoText }) => (
  <div className={cx("informing-block__container")}>
    <div className={cx('informing-block__container-main')}>
      <div className={cx("informing-block__main-content-wrapper")}>
        <div className={cx("informing-block__error-ico")}></div>

        <div className={cx("informing-block__main-content-text-container")}>
          <p className={cx("informing-block__main-content-text")}>{mainText}</p>
          {linkText ? <a className={cx('informing-block__main-content-text-link')} href={linkHref || '#'}>{linkText}</a> : null}
        </div>
      </div>
      {isButton && <div className={cx("informing-block__btn-wrapper")}>
        <Button className={cx("informing-block__btn")} onClick={buttonClick}>
          {buttonText}
        </Button>
      </div>}
    </div>
    {infoText ? <span className={cx('informing-block__main-info')}>{infoText}</span> : null}
  </div>
);
