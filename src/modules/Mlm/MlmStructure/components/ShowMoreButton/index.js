import React from "react";
import { dict } from "dict";
import { connect } from 'react-redux';
import styles from "./styles.css";

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = ({ lang }) => ({ lang });

export const ShowMoreButton = connect(mapStateToProps, mapDispatchToProps)(({ users, onMoreButton, usersNumber, ...props }) => {
    const i18n = dict[props.lang];
    
    return ( 
                <div className={styles.moreButtonContainer}>
                    <div className={styles.avatarContainer}>
                        {users.map(user=>(
                            <span className={styles.avatarWrapper} key={user.id}>
                                <img className={styles.avatar} src={user.photo} />
                            </span>
                        ))}
                    </div>
                    <button className={styles.moreButton} onClick={onMoreButton}>
                        <p className={styles.moreButton_number}>{`+ ${usersNumber}`}</p>
                        <p className={styles.moreButton_link}>{i18n['mlm.mlmStructure.showAll']}</p>
                    </button>
                </div>     
        
    )
})