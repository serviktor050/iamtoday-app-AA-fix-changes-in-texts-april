import React from "react";
import { dict } from "dict";
import { connect } from 'react-redux';
import styles from "./styles.css";

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = ({ lang }) => ({ lang });

export const ShowLessButton = connect(mapStateToProps, mapDispatchToProps)(({ onLessButton, ...props }) => {
    const i18n = dict[props.lang];
    
    return ( 
                <div className={styles.lessButtonContainer}>                    
                    <button className={styles.lessButton} onClick={onLessButton}>
                        {i18n['mlm.mlmStructure.showLess']}
                    </button>
                    <span className={styles.chevronDown}/>
                </div>         
    )
})
