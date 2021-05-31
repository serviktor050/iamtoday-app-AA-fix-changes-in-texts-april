import React from "react";

import { dict } from "dict";
import { connect } from "react-redux";
import { Modal } from "./components/Modal";
import { acceptMentorRequest } from "../../../ducks";
import { MentorData } from "./components/MentorData";
import { CountDownTimer } from "./components/CountDownTimer";
import { UserContactButtons } from "./components/UserContactButtons";
import { AcceptDeclineButtons } from "./components/AcceptDeclineButtons";
import * as ducks from '../../../ducks';

import styles from "./style.css";

const mapDispatchToProps = (dispatch) => ({ dispatch });
const mapStateToProps = ({ lang, userInfo }) => ({ lang, userInfo });

class RequestCard extends React.Component {
  constructor() {
    super();
    this.state = {
      isVisible: false,
      isAccepted: false,
      isError: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isAccepted && !this.state.isAccepted) {
      this.props.dispatch(ducks.getMentorshipRequests({take: 10, skip: 0, status: 'waiting_tutor'}))
      this.props.dispatch(ducks.getNewMentorshipRequests({take: 10, skip: 0, status: 'waiting_new'}))
    }
  }

  onCancel = (_) => {
    if (this.state.isAccepted) {
      this.props.dispatch(ducks.getMentorshipRequests({take: 10, skip: 0, status: 'waiting_tutor'}))
      this.props.dispatch(ducks.getNewMentorshipRequests({take: 10, skip: 0, status: 'waiting_new'}))
    }
    this.setState({ isVisible: false })
  }

  handleAccept = (_) => {
    this.props.dispatch(
    acceptMentorRequest({ id: this.props.cardId, status: "approved" }, (_) =>
      this.setState({ isAccepted: true }), (_) => this.setState({isError: true})
    ));
    // this.props.dispatch(ducks.getMentorshipRequests({take: 10, skip: 0, status: 'waiting_tutor'}))
    // this.props.dispatch(ducks.getNewMentorshipRequests({take: 10, skip: 0, status: 'waiting_new'}))
  }

  render() {
    const { cardId, createTs, userInfo, ...props } = this.props;
    const i18n = dict[this.props.lang];

    const acceptModal = (
      <div className={styles.modalContent}>
        <p className={styles.QuestionText}>
          {i18n["mlm.mentorship.doYouWantTo"]}&nbsp;
          <span className={styles.QuestionTextName}>{props.name}</span>&nbsp;
          {i18n["mlm.mentorship.becomeYourStudent"]}
        </p>
      </div>
    );

    const acceptedModal = (
      <div className={styles.modalContent}>
        <div className={styles.image}></div>
        <div className={styles.QuestionTextName}>{props.name}</div>
        <div className={styles.QuestionText}>теперь ваш новый ученик</div>
      </div>
    );

    if (userInfo && userInfo.data.id && props.userId && userInfo.data.id !== props.userId) {
      return (
        <div className={styles.MentorRequestCard}>
          <div className={styles.upperblock}>
            <MentorData {...props} />
            <div className={styles.countdownAndButtonsWrapper}>
              {!this.props.isStatic && (
                <CountDownTimer key={createTs} eventDate={createTs} />
              )}
              {!this.props.isStatic && (
                <AcceptDeclineButtons
                  handleAccept={(_) => this.setState({ isVisible: true })}
                  cardId={cardId}
                  recommended={props.recommended}
                />
              )}
            </div>
          </div>
          <UserContactButtons id={props.userId}/>
          {this.state.isVisible && (
            <Modal
              onCancel={this.onCancel}
              onOk={this.handleAccept}
              isButtons={!this.state.isAccepted}
            >
              {this.state.isAccepted ? acceptedModal : acceptModal}
            </Modal>
          )}
          {this.state.isError && (
            <Modal
              onCancel={(_) => this.setState({isError: false})}
              isButtons={false}
            >
              {i18n['server.error.unexpectedError']}
            </Modal>
          )}
        </div>
      );
    }

    return null
  }
}
export const MentorRequestCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestCard);
