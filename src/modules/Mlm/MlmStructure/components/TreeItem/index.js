import React from "react";
import styles from "./style.css";
import { getFIO, getFlag } from "../../../utils";

export const TreeItem = ({ avatar, lastName, firstName, middleName, country, city }) => {
    return (
       
        <div className={styles.treeItem}>
            <div className={styles.userAvatarWrapper}>
                <img className={styles.userAvatar} src={avatar} />
            </div>
            <div>
                <p className={styles.userName}>{getFIO(lastName, firstName, middleName)}</p>
                <p><span>{getFlag(country, styles.icon)}</span>{city}</p>
            </div>
        </div>        
        
    )
}