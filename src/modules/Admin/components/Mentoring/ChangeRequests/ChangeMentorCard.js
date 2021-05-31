import React, { Component } from "react";
import {
  renderAnswer,
  renderCardContent,
} from "../DeclinedRequests/DeclineCard";
import classNames from "classnames/bind";
import styles from "./styles.css";
import { Modal } from "../../../../Mlm/MlmStructure/components/MentorRequestCard/components/Modal";
import petrovich from "petrovich";
import { browserHistory } from "react-router";
import { CountDownTimer } from "../../../../Mlm/MlmStructure/components/MentorRequestCard/components/CountDownTimer";
import WriteToTutor from "../MentorRequests/WriteToTutor/WriteToTutor";
import { createUserName } from "../../../utils";
import { connect } from "react-redux";

import * as ducks from '../../../ducks';
import * as selectors from '../../../selectors';

const cx = classNames.bind(styles);

export const renderAcceptModal = ({
  closeModal,
  acceptModal,
  i18n,
  item,
  accepted,
}) => {
  const { firstName, lastName, middleName } = item.userInfo;
  const fioDative = `${
    petrovich(
      {
        gender: item.userInfo.gender,
        last: lastName,
      },
      "dative"
    ).last
  }
  ${firstName && firstName.slice(0, 1)}.
  ${middleName && middleName.slice(0, 1)}.`;
  if (accepted) {
    return (
      <Modal onCancel={() => closeModal()} i18n={i18n} isButtons={false}>
        <div className={cx("modal__container")}>
          <div className={cx("modal__ico-accept")}></div>
          <p className={cx("modal__title-accepted")}>
            {i18n["admin.mentoring.request-accepted"]}
          </p>
          <p>{`${
            i18n["cancel"].toLowerCase() === "отмена" ? "у " : ""
          }${fioDative} ${
            i18n["admin.mentoring.change-tutor.has-no-tutor"]
          }.`}</p>
          <p>{i18n["admin.mentoring.change-tutor.set-new-tutor-to-student"]}</p>
          <button
            onClick={() =>
              browserHistory.push(
                `/admin/changeRequests/${item.id}/${item.userId}`
              )
            }
            className={cx("modal__btn-accepted")}
          >
            {
              i18n[
                "admin.mentoring.change-tutor.set-new-tutor-to-student-button"
              ]
            }
          </button>
        </div>
      </Modal>
    );
  }
  return (
    <Modal
      onCancel={() => closeModal()}
      onOk={() => acceptModal(true)}
      closeButtonText={i18n["cancel"]}
      acceptButtonText={i18n["admin.mentoring.modal.accept-accept"]}
      i18n={i18n}
    >
      <p>
        {i18n["admin.mentoring.change-tutor.accept-request.first-part"]}
        <span style={{ fontWeight: "bold" }}>
          &nbsp;
          {fioDative}
        </span>
        {` ${i18n["admin.mentoring.change-tutor.accept-request.second-part"]}?`}
      </p>
      <p
        className={cx("modal__subtext")}
      >{`${i18n["admin.mentoring.change-tutor.accept-request.descr"]} ${fioDative}`}</p>
    </Modal>
  );
};

export const renderRejectModal = ({
  closeModal,
  acceptModal,
  handleModalText,
  i18n,
  item,
  accepted,
}) => {
  const { firstName, lastName, middleName } = item.userInfo;
  const fioDative = `${
    petrovich(
      {
        gender: item.userInfo.gender,
        last: lastName,
      },
      "dative"
    ).last
  }
  ${firstName && firstName.slice(0, 1)}.
  ${middleName && middleName.slice(0, 1)}.`;
  if (accepted) {
    return (
      <Modal onCancel={() => closeModal()} i18n={i18n} isButtons={false}>
        <div className={cx("modal__container")}>
          <div className={cx("modal__ico-rejected")}></div>
          <p className={cx("modal__title-accepted")}>
            {i18n["admin.mentoring.request-rejected"]}
          </p>
          <p>{`${i18n["admin.mentoring.change-tutor.tutor"]} ${fioDative}`}</p>
          <p style={{ fontWeight: "bold" }}>
            {`${item.tutorInfo.userInfo.lastName}
            ${item.tutorInfo.userInfo.firstName.slice(0, 1)}.
            ${item.tutorInfo.userInfo.middleName.slice(0, 1)}.`}
          </p>
        </div>
      </Modal>
    );
  }
  return (
    <Modal
      onCancel={() => closeModal()}
      onOk={() => acceptModal(true)}
      closeButtonText={i18n["cancel"]}
      acceptButtonText={i18n["admin.mentoring.modal.decline-accept"]}
      i18n={i18n}
    >
      <p>
        {i18n["admin.mentoring.change-tutor.reject-request.first-part"]}
        <span style={{ fontWeight: "bold" }}>
          &nbsp;
          {fioDative}
        </span>
        {` ${i18n["admin.mentoring.change-tutor.reject-request.second-part"]}?`}
      </p>
      {/* <textarea
        onChange={handleModalText}
        value={modal.text}
        rows="6"
        cols="35"
        placeholder="Напишите причину, можно оставить пустым"
        className={cx("modal__textarea")}
      /> */}
    </Modal>
  );
};

export function renderInfoBlock({ i18n, item, accepted, dispatch }) {
  const { userInfo } = item.tutorInfo;
  const { firstName, lastName, middleName } = userInfo;
  if (accepted) {
    return (
      <div className={cx("infoBlock", "infoBlock-accepted")}>
        <p>{`${
          i18n["admin.mentoring.change-requests.processed.info-block.accepted"]
        } ${lastName}
              ${firstName && firstName.slice(0, 1) + "."}
              ${middleName && middleName.slice(0, 1) + "."}`}</p>
        {<button onClick={_ => {
          dispatch(ducks.deleteRequestForChange(item.id))
          dispatch(ducks.getAcceptedUserTutorsRequest({status: 'approved'}));
          }} className={cx('infoBlock__okBtn')}>OK</button>}
      </div>
    )
  }

  return (
    <div className={cx("infoBlock")}>
      <p>{`${
        i18n["admin.mentoring.change-requests.processed.info-block.first"]
      } ${lastName}
            ${firstName && firstName.slice(0, 1) + "."}
            ${middleName && middleName.slice(0, 1) + "."} ${
        i18n["admin.mentoring.change-requests.processed.info-block.second"]
      }`}</p>
      {<CountDownTimer eventDate={item.createTs} tooltip={false} />}
    </div>
  );
}

class ChangeMentorCardClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      writeToTutor: {
        isVisible: false,
      },
      isAcceptModal: false,
      isRejectModal: false,
      isAcceptModalAccepted: false,
      isRejectModalAccepted: false,
    };
  }

  toggleAcceptModal = () => {
    this.setState(state => ({ isAcceptModal: !state.isAcceptModal }))
  }

  toggleRejectModal = () => {
    const { item, dispatch } = this.props;
    if (this.state.isRejectModalAccepted) {
      dispatch(ducks.deleteRequestForChange(item.id))
      dispatch(ducks.getUserTutorsRequest({ take: 10, skip: 0, status: 'waiting_change' }))
    }
    this.setState(state => ({ isRejectModal: !state.isRejectModal }))
  }

  toggleWriteToTutor = () => {
    this.setState({
      writeToTutor: {
        ...this.state.writeToTutor,
        isVisible: !this.state.writeToTutor.isVisible,
      },
    });
  };

  render() {
    const { item, i18n, modals, processed, accepted, dispatch } = this.props;
    const { userInfo, tutorInfo } = item;
    return (
      <li>
        <div className={cx("card")}>
          <div className={cx("card__tutor")}>
            {renderCardContent({
              i18n,
              item: tutorInfo.userInfo,
              isTutor: true,
              id: item.id,
              buttons: () => (
                <button
                  onClick={
                    this.state.writeToTutor.isVisible
                      ? () => {}
                      : this.toggleWriteToTutor
                  }
                  className={cx(
                    this.state.writeToTutor.isVisible
                      ? "tutorCard__writeToTutor-hidden"
                      : "tutorCard__writeToTutor"
                  )}
                >
                  {i18n["admin.mentoring.mentor-actions.write-to-mentor"]}
                </button>
              ),
            })}
          </div>
          <div className={cx("card__separator-container")}>
            <div className={cx("card__separator-wrapper")}>
              <div className={cx("card__separator")}></div>
            </div>
          </div>
          <div className={cx("card__student")}>
            <div className={cx("card__student-cardWrapper")}>
              {renderCardContent({
                i18n,
                item: userInfo,
                buttons: () => {},
              })}
              {renderAnswer({
                i18n,
                item,
                title: i18n["admin.mentoring.reason-to-change-mentor"],
                descr: item.userResponse,
              })}
            </div>
            {modals && (
              <div className={cx("card__actions")}>
                <button
                  onClick={this.toggleAcceptModal}
                  className={cx("card__actions-btn", "card__actions-btn-green")}
                >
                  {i18n["admin.mentoring.accept-request"]}
                </button>
                <button
                  onClick={this.toggleRejectModal}
                  className={cx(
                    "card__actions-btn",
                    "card__actions-btn-green-outline"
                  )}
                >
                  {i18n["admin.mentoring.reject-request"]}
                </button>
              </div>
            )}
            {processed && renderInfoBlock({ i18n, item, accepted, dispatch })}
          </div>
        </div>
        {this.state.writeToTutor.isVisible && (
          <WriteToTutor
            name={createUserName({
              firstName: tutorInfo.userInfo.firstName,
              middleName: tutorInfo.userInfo.middleName,
              lastName: tutorInfo.userInfo.lastName,
            })}
            email={tutorInfo.userInfo.email}
            tutorId={tutorInfo.userInfo.id}
            closeWindow={this.toggleWriteToTutor}
          />
        )}
        {this.state.isAcceptModal &&
          renderAcceptModal({
            closeModal: this.toggleAcceptModal,
            acceptModal: () => this.setState({ isAcceptModalAccepted: true }),
            i18n,
            item,
            accepted: this.state.isAcceptModalAccepted,
          })}
        {this.state.isRejectModal &&
          renderRejectModal({
            closeModal: this.toggleRejectModal,
            acceptModal: () => this.setState({ isRejectModalAccepted: true }),
            i18n,
            item,
            accepted: this.state.isRejectModalAccepted,
            handleModalText: modals.handleModalText,
          })}
      </li>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.lang
})
const mapDispatchToProps = dispatch => ({ dispatch })

ChangeMentorCardClass = connect(mapStateToProps, mapDispatchToProps)(ChangeMentorCardClass)

export const ChangeMentorCard = ChangeMentorCardClass
