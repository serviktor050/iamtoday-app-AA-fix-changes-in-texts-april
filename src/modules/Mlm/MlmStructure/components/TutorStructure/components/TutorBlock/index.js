import React from "react";
import styles from "./style.css";
import classNames from "classnames/bind";
import { getFlag } from "../../../../../utils";

const cx = classNames.bind(styles);

export const TutorBlock = ({level, title, avatar, firstName, lastName, country, city }) => {
    return (
       
        <div className={cx("tutorItem", level === 1 ? "tutorItem1Level" : "tutorItem2Level")}>
            <p className={cx("title", level === 1 ? "title1Level" : "title2Level")}>{title}</p>
            <div className={styles.tutorInfo}>
                <div className={styles.tutorAvatarWrapper}>
                    <img className={styles.tutorAvatar} src={avatar} alt="avatar" />
                </div>
                <div>
                    <p className={styles.tutorName}>{`${firstName} ${lastName}`}</p>
                    <p><span>{getFlag(country, styles.flagIcon)}</span>{city}</p>
                </div>
            </div>
        </div>        
        
    )
}