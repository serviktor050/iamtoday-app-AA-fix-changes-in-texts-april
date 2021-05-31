import React from "react";
import { connect } from 'react-redux';
import { dict } from "dict";

import styles from "./style.css";

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = ({ lang }) => ({ lang });

export const Modal = connect(mapStateToProps, mapDispatchToProps)(({ onAdd, onCancel, children, ...props }) => {
  const i18n = dict[props.lang];

  return (
    <div className={styles.newCategoryModal}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
            <p>{i18n["faq.modal.newCategory"]}</p>
            <button className={styles.crossButton} onClick={onCancel}>
                <div className={styles.mdiv}>
                    <div className={styles.mdiv2}>
                        <div className={styles.md}></div>
                    </div>
                </div>
            </button>
        </div>

        <div className={styles.QuestionModal}>
          <div className={styles.QuestionModalText}>{children}</div>

          
            <div className={styles.buttonsBlock}>
              <button className={styles.buttonOk} onClick={onAdd}>
                {i18n["faq.modal.addCategory"]}
              </button>
              <button className={styles.buttonCancel} onClick={onCancel}>
                {i18n["faq.modal.cancel"]}
              </button>
            </div>
          

        </div>
      </div>
    </div>
  );
});