import React, { useState, useCallback } from "react";

import { connect } from 'react-redux';
import { dict } from "dict";

import styles from "./style.css";

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = ({ lang }) => ({ lang });

export const Modal = connect(mapStateToProps, mapDispatchToProps)(({ onOk, onCancel, isButtons = true, isStyles = true, customClass, children, ...props }) => {
  const [modalHeight, setModalHeight] = useState(0);

  const measuredModal = useCallback(node => {
    if (node !== null) {
      setModalHeight(node.getBoundingClientRect().height);
    }
  }, []);

  const i18n = dict[props.lang];

  const isFitInWindow = () => {
    return modalHeight >= (document.documentElement.clientHeight - 78) ? true : false
  }

  return (
    <div className={styles.AcceptModal}>
      <div ref={measuredModal} style={ isFitInWindow() ? { top: '78px' } : {} } className={`${styles.modalContainer} ${customClass || ''}`}>

        <button className={styles.crossButton} onClick={onCancel}>
          <div className={styles.mdiv}>
            <div className={styles.mdiv2}>
              <div className={styles.md}></div>
            </div>
          </div>
        </button>

        <div className={isStyles ? styles.QuestionModal : undefined}>
          <div className={isStyles ? styles.QuestionModalText : undefined}>{children}</div>

          {isButtons && (
            <div className={styles.buttonsBlock}>
              <button className={styles.buttonOk} onClick={onOk}>
                {props.acceptButtonText || i18n["admin.mentoring.modal.default-accept"]}
              </button>
              <button className={styles.buttonCancel} onClick={onCancel}>
                {props.closeButtonText || i18n["cancel"]}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
});
