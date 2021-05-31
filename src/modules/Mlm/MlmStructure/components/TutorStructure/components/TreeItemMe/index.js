import React from "react";
import { dict } from "dict";
import styles from "./styles.css";
import { connect } from 'react-redux';
import classNames from "classnames/bind";
import { getFIO } from "../../../../../utils";

const cx = classNames.bind(styles);

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = ({ lang, userInfo }) => ({ lang, userInfo  });

export const TreeItemMe = connect(mapStateToProps, mapDispatchToProps)(({ level, ...props })  => {
 
  const i18n = dict[props.lang];  
  const user = props.userInfo.data;

  return (
       
        <div className={cx("treeItem")}>
            <div className={cx(level === 1 ? "treeItem1Level" : "treeItem2Level")}>
                <div className={styles.userAvatarWrapper}>
                    <img className={styles.userAvatar} alt='avatar' src={user.photo} />
                </div>
                <div>               
                    <p>{i18n['mlm.mlmStructure.you']}</p>
                    <p className={cx("userName", level === 1 ? "userName1Level" : "userName2Level")}>{getFIO(user.lastName, user.firstName, user.middleName)}</p>
                </div>
            </div>
        </div>        
        
    )
}
)