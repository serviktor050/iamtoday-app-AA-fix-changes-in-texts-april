import React from 'react';
import { dict } from "dict";
import styles from './style.css';
import { connect } from "react-redux";
import { browserHistory } from 'react-router'
import { Button } from 'components/common/Button';

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = state => ({ lang: state.lang });

export const AcceptDeclineButtons = connect(mapStateToProps, mapDispatchToProps)(({ handleAccept, cardId, ...props }) => {
  const handleDecline = _ => browserHistory.push(`/mlm/decline-mentorship-request/${cardId}`);
  const i18n = dict[props.lang];

  return (
    <div className={styles.AcceptDeclineButtons}>
        <Button onClick={handleAccept} className={styles.ADbutton}>{i18n["mlm.mentorship.confirmButton"]}</Button>
        <Button onClick={handleDecline} className={styles.ADbutton}>{i18n["mlm.mentorship.declineButton2"]}</Button>
        {props.recommended && <div className={styles.label}>{i18n['mlm.mentoring.recommendedTutor']}</div>}
    </div>
  );
});
