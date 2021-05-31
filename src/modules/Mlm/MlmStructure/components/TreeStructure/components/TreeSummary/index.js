import React from "react";
import { connect } from 'react-redux';
import { dict } from "dict";
import { getFIO, pluralizePeople } from "../../../../../utils";

import styles from "./styles.css";

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = ({ lang }) => ({ lang });

export const TreeSummary = connect(mapStateToProps, mapDispatchToProps)(({ userInfo, ...props }) => {

    const i18n = dict[props.lang];
    const user = userInfo.data;

    return (
        <div className={styles.summary}>
            <div className={styles.meBlock}>
                <div className={styles.avatarWrapper}>
                    <img className={styles.avatar} src={user.photo} />
                </div>
                <div>
                    <p>{i18n['mlm.mlmStructure.you']}</p>
                    <p className={styles.meBlock_info}>{getFIO(user.lastName, user.firstName, user.middleName)}</p>
                </div>
            </div>
            <div className={styles.firstLevelBlock}>                
                    <p>{i18n['mlm.mlmStructure.total1Level']}</p>
                    <p className={styles.firstLevelBlock_info}>
                        <span>{user.mlmUserInfo.partnersLevel1All}</span>
                        {pluralizePeople(user.mlmUserInfo.partnersLevel1All, props.lang)}
                    </p>               
            </div>
            <div className={styles.secondLevelBlock}>               
                    <p>{i18n['mlm.mlmStructure.total2Level']}</p>
                    <p className={styles.secondLevelBlock_info}>
                        <span>{user.mlmUserInfo.partnersLevel2All}</span>
                        {pluralizePeople(user.mlmUserInfo.partnersLevel2All, props.lang)}
                    </p>                
            </div>
        </div>
    )

});