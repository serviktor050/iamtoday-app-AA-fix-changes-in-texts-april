import React from "react";
import MlmSummaryCard from "../MlmSummaryCard/MlmSummaryCard";
import styles from './pointsPlank.css';
import { pluralize } from "utils/helpers";
import classNames from "classnames/bind";
import { dict } from "dict";
import { browserHistory } from "react-router";

const cx = classNames.bind(styles);

function PointsPlank({ summary, lang }) {
  const { data } = summary;
  const { mlmUserInfo } = data;
  const i18n = dict[lang];
  return (
    <div className={cx(styles.contentItem, styles.contentItem100)}>
      <MlmSummaryCard>
        <div>
          <div className={styles.creditWrapper}>
            <div className={styles.currentPointsWrapper}>
              <div className={styles.currentPointsContent}>
                <span className={styles.currentPoints}>
                  {i18n["mlm.points.title"]}
                </span>
                <span
                  className={styles.currentPointsNumber}
                >{`${mlmUserInfo.pointsSum} `}</span>
              </div>
            </div>
            {/* <div
              className={cx(
                false && styles.infoCreditWrapper,
                true && styles.infoCreditWrapperDenied,
                false && styles.infoCreditWrapperGet
              )}
            >
              {false && (
                <span className={styles.infoCredit}>
                  {i18n["mlm.points.creditAvailable"]}
                  <span className={styles.infoCreditBold}>{`500 `}</span>
                  <span className={styles.infoCreditPoints}>{`${pluralize(500, [
                    i18n["scores.text.1"],
                    i18n["scores.text.2"],
                    i18n["scores.text.3"],
                  ])}`}</span>
                </span>
              )}
              {true && (
                <span className={styles.infoCreditDenied}>
                  {i18n["mlm.points.creditDenied"]}
                  <span
                    className={styles.infoCreditDeniedGreen}
                  >{`1000 ${pluralize(1000, [
                    i18n["scores.text.1"],
                    i18n["scores.text.2"],
                    i18n["scores.text.3"],
                  ])}`}</span>
                </span>
              )}
              {false && (
                <span className={styles.infoCredit}>
                  {i18n["mlm.points.creditGet"]}
                  <span className={styles.infoCreditBold}>{`500 `}</span>
                  <span className={styles.infoCreditPoints}>{`${pluralize(500, [
                    i18n["scores.text.1"],
                    i18n["scores.text.2"],
                    i18n["scores.text.3"],
                  ])}`}</span>
                </span>
              )}
            </div> */}
            <div className={styles.creditButtons}>
              <button
                className={styles.creditButtonGreen}
                onClick={() => browserHistory.push("/mlm/points-purchase")}
              >
                Купить баллы
              </button>
              <button
                className={styles.creditButton}
                onClick={() => browserHistory.push("/mlm/points-withdrawal")}
              >
                Вывести баллы
              </button>
            </div>
          </div>
        </div>
      </MlmSummaryCard>
    </div>
  );
}

export default PointsPlank