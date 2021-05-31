import React, { Component } from "react";
import styles from "./styles.css";
import { connect } from "react-redux";
import { dict } from "dict";
import * as ducks from "../../../../ducks";
import { Modal } from "../../../../../Mlm/MlmStructure/components/MentorRequestCard/components/Modal";

const mapDispatchToProps = (dispatch) => ({ dispatch });
const mapStateToProps = (state) => ({ lang: state.lang });

class WriteToTutor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      modal: {
        isVisible: false,
        success: false,
        error: false,
      },
    };

    this.handleText = this.handleText.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
  }

  handleText(e) {
    this.setState({ text: e.target.value });
  }

  onSuccess = () => {
    this.setState({
      modal: { ...this.state.modal, success: true, isVisible: true },
    });
  };

  onError = () => {
    this.setState({
      modal: { ...this.state.modal, error: true, isVisible: true },
    });
  };

  closeModal = () => {
    this.setState({
      modal: {
        isVisible: false,
        success: false,
        error: false,
      },
    });
  };

  handleSuccess(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    const data = {
      recipient: this.props.tutorId,
      text: this.state.text,
    };
    dispatch(
      ducks.sendEmail(data, {
        onSuccess: this.onSuccess,
        onError: this.onError,
      })
    );
  }

  render() {
    const { name, email, tutorId, closeWindow } = this.props;
    const i18n = dict[this.props.lang];
    return (
      <div className={styles.writeToTutor}>
        <form name="writeToTutor">
          <div className={styles.disabledField}>
            <label htmlFor={`${tutorId}-name`}>
              {i18n["admin.mentoring.answer.name"]}&nbsp;
            </label>
            <input id={`${tutorId}-name`} name="name" value={name} disabled style={{ fontWeight: "bold" }} />
          </div>
          <div className={styles.disabledField}>
            <label htmlFor={`${tutorId}-email`}>
              {i18n["admin.mentoring.answer.email"]}&nbsp;
            </label>
            <input
              id={`${tutorId}-email`}
              name="email"
              value={email}
              disabled
            />
          </div>
          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              rows="12"
              name="text"
              value={this.state.text}
              onChange={this.handleText}
              placeholder={i18n["admin.mentoring.write-to-tutor.placeholder"]}
            />

            <div className={styles.action}>
              <button className={styles.okButton} onClick={this.handleSuccess}>
                {i18n["admin.mentoring.send-answer-to-student"]}
              </button>
              <button className={styles.cancelButton} onClick={closeWindow}>
                {i18n["cancel"]}
              </button>
            </div>

          </div>
        </form>
        {this.state.modal.success && this.state.modal.isVisible && (
          <Modal isButtons={false} onCancel={this.closeModal} >
            <p>{i18n["admin.mentoring.write-to-tutor.success"]}</p>
          </Modal>
        )}
        {this.state.modal.error && this.state.modal.isVisible && (
          <Modal isButtons={false} onCancel={this.closeModal} >
            <p>{i18n["admin.mentoring.write-to-tutor.error"]}</p>
          </Modal>
        )}
      </div>
    );
  }
}

export default WriteToTutor = connect(
  mapStateToProps,
  mapDispatchToProps
)(WriteToTutor);
