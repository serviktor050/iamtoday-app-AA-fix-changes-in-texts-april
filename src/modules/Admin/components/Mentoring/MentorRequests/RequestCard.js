import React, { Component } from "react";
import styles from "./styles.css";
import { MentorData } from "../../../../Mlm/MlmStructure/components/MentorRequestCard/components/MentorData";
import classNames from "classnames/bind";
import { createUserName } from "../../../utils";
import { UserContactButtons } from "../../../../Mlm/MlmStructure/components/MentorRequestCard/components/UserContactButtons";
import { connect } from "react-redux";
import { dict } from "dict";
import { CountDownTimer } from "../../../../Mlm/MlmStructure/components/MentorRequestCard/components/CountDownTimer";
import WriteToTutor from "./WriteToTutor/WriteToTutor";

const cx = classNames.bind(styles);

const mapDispatchToProps = (dispatch) => ({ dispatch });
const mapStateToProps = (state) => ({ lang: state.lang });

class RequestCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      writeToTutor: {
        isVisible: false,
      },
    };

    this.toggleWriteToTutorWindow = this.toggleWriteToTutorWindow.bind(this);
  }

  toggleWriteToTutorWindow() {
    this.setState({
      writeToTutor: {
        ...this.state.writeToTutor,
        isVisible: !this.state.writeToTutor.isVisible,
      },
    });
  }

  render() {
    const { item } = this.props;
    const { userInfo, tutorInfo } = item;
    const i18n = dict[this.props.lang];
    const tutorName = createUserName({
      firstName: tutorInfo.userInfo.firstName,
      lastName: tutorInfo.userInfo.lastName,
      middleName: tutorInfo.userInfo.middleName,
    });
    return (
      <li>
        <div className={cx("card")}>
          <div className={cx("card__student")}>
            <MentorData
              pictureUrl={userInfo.photo}
              name={createUserName({
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                middleName: userInfo.middleName,
              })}
              occupation={userInfo.specialties}
              city={userInfo.city}
              time={userInfo.timezone}
              flag="mentor-requests"
              //   experience={userInfo}
            />
            <UserContactButtons id={userInfo.id}/>
            <div className={cx("card__timeLeft")}>
              <span>{i18n["admin.mentoring.time-to-accept-request"]}</span>
              <CountDownTimer eventDate={item.createTs} tooltip={false} />
            </div>
          </div>

          <div className={cx("card__separator-container")}>
            <div className={cx("card__separator-wrapper")}>
              <div className={cx("card__separator")}></div>
            </div>
          </div>

          <div className={cx("card__tutor")}>
            <MentorData
              pictureUrl={tutorInfo.userInfo.photo}
              name={tutorName}
              occupation={tutorInfo.specialties}
              city={tutorInfo.userInfo.city}
              time={tutorInfo.userInfo.timezone}
              flag="mentor-requests"
              experience={tutorInfo.workSeniorityAA}
            />
            <UserContactButtons id={tutorInfo.userInfo.id} flag="background-color-white" />
            <div className={cx("card__actions")}>
              {!this.state.writeToTutor.isVisible ? (
                <button
                  className={cx("card__btn-writeToTutor")}
                  onClick={this.toggleWriteToTutorWindow}
                >
                  {i18n["admin.mentoring.write-to-tutor"]}
                </button>
              ) : (
                <button className={cx("card__btn-writeToTutor-hidden")}>
                  {i18n["admin.mentoring.write-to-tutor"]}
                </button>
              )}
            </div>
          </div>
        </div>
        {this.state.writeToTutor.isVisible && (
          <WriteToTutor
            name={tutorName}
            email={tutorInfo.userInfo.email}
            tutorId={tutorInfo.userInfo.id}
            closeWindow={this.toggleWriteToTutorWindow}
          />
        )}
      </li>
    );
  }
}

export default RequestCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestCard);
