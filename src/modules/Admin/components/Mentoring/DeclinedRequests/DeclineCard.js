import React, { Component } from "react";
import classNames from "classnames/bind";
import styles from "./styles.css";
import { createUserName } from "../../../utils";
import TableMentor from "../../../../ChoseMentor/components/table";
import { Button } from "../../../../../components/common/Button";
import cookie from "react-cookie";
import api from "../../../../../utils/api";
import RecommendedTutorCard from "./RecommendedTutorCard";
import WriteToTutor from "../MentorRequests/WriteToTutor/WriteToTutor";
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

const cx = classNames.bind(styles);

const AVATAR_PLACEHOLDER = "../../../../../../assets/img/png/ava-big-main.png";

export function renderCardContent(props) {
  const { item, id, answerWindow, buttons } = props;
  return (
    <div className={cx("card__content")}>
      <div className={cx("card__header")}>
        <img
          src={item.photo || AVATAR_PLACEHOLDER}
          alt="avatar"
          className={cx("card__avatar")}
        />
        <span className={cx("card__userName")}>
          {createUserName({
            lastName: item.lastName,
            firstName: item.firstName,
            middleName: item.middleName,
          })}
        </span>
      </div>
      <div className={cx("card__body")}>
        <div>
          <span
            className={cx("card__specialities")}
          >{`Косметолог, гинеколог`}</span>
          <div className={cx("card__location")}>
            <svg className={cx("svg-icon")}>
              <use xlinkHref="#russia" />
            </svg>
            <span>{`${item.city}, GTM +${+item.timezone}:00`}</span>
          </div>
          <div className={cx("card__phone")}>
            <div className={cx("card__svgIco", "phone-ico")}></div>
            <div className={cx("card__svgIco", "whatsapp-ico")}></div>
            <span className={cx("card__phoneNumber")}>{`${item.phone}`}</span>
          </div>
        </div>
        {!(id && answerWindow && answerWindow.show[`${id}`]) && buttons()}
      </div>
    </div>
  );
}

export function renderAnswer(props) {
  const { descr, title } = props;
  return (
    <div className={cx("card__answer")}>
      <div className={cx("card__reason-titleWrapper")}>
        <span className={cx("card__reason-title")}>{title}</span>
      </div>
      <span className={cx("card__reason-description")}>{descr}</span>
    </div>
  );
}

export async function renderRecommendedTutorCard(props) {
  const { item, removeTutor, index } = props;
  const tutorInfo = await api.getTutorInfo({
    AuthToken: cookie.load("token"),
    data: { id: item },
  });
  const user = tutorInfo.data[0];
  return (
    <article className={cx("recommendedTutors__card")} key={index}>
      <div className={cx("card__close-container")}>
        <div
          className={cx("card__close-btn")}
          onClick={() => removeTutor(item)}
        ></div>
      </div>
      <div className={cx("tutorCard")}>
        <div className={cx("tutorCard__header")}>
          <img
            src={user.userInfo.photo}
            alt="avatar"
            className={cx("card__avatar")}
          />
          <h4 className={cx("tutorCard__name")}>
            {createUserName({
              lastName: user.userInfo.lastName,
              firstName: user.userInfo.firstName,
              middleName: user.userInfo.middleName,
            })}
          </h4>
        </div>
        <div>
          <span className={cx("card__specialities")}>{user.specialties}</span>
          <div className={cx("card__location")}>
            <svg className={cx("svg-icon")}>
              <use xlinkHref="#russia" />
            </svg>
            <span>{`${user.userInfo.city}, GTM +${
              user.userInfo.timezone || 3
            }:00`}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function renderAnswerToStudentWindow(props) {
  const {
    i18n,
    item,
    tutorsIds,
    form,
    removeTutor,
    sendAnswer,
    mentorTable,
    mentorsTableHud,
    toggleAnswerWindow,
  } = props;
  const { tutorsList } = mentorTable;
  return (
    <div>
      <form
        name="answerToStudent"
        className={cx("answerToStudent__form")}
        onSubmit={(e) => sendAnswer(e)}
      >
        <h3 className={cx("answerToStudent__form-title")}>
          {i18n["admin.mentoring.answer.to-whom"]}
        </h3>
        <div className={cx("answerToStudent__inputWrapper")}>
          <label htmlFor={`${item.id}-name`}>
            {i18n["admin.mentoring.answer.name"]}&nbsp;
          </label>
          <input
            id={`${item.id}-name`}
            name="name"
            value={createUserName({
              lastName: form.currentUser.lastName,
              firstName: form.currentUser.firstName,
              middleName: form.currentUser.middleName,
            })}
            disabled
          />
        </div>
        <div className={cx("answerToStudent__inputWrapper")}>
          <label htmlFor={`${item.id}-email`}>
            {i18n["admin.mentoring.answer.email"]}&nbsp;
          </label>
          <input
            id={`${item.id}-email`}
            name="email"
            value={form.currentUser.email}
            disabled
          />
        </div>
        <div className={cx("answerToStudent__textarea-wrapper")}>
          <textarea
            className={cx("answerToStudent__textarea")}
            rows="12"
            name="text"
            value={form.text}
            onChange={form.changeFormField}
            placeholder={i18n["admin.mentoring.answer.textarea-placeholded"]}
          />
        </div>
        {!!tutorsIds.length && (
          <section className={cx("recommendedTutors")}>
            <h3 className={cx("recommendedTutors__title")}>
              {i18n["admin.mentoring.recommended-tutors"]}
            </h3>
            <div className={cx("recommendedTutors__list")}>
              {tutorsIds.map((tutor) => (
                <RecommendedTutorCard
                  item={tutor}
                  removeTutor={removeTutor}
                  key={tutor}
                />
              ))}
              {!!tutorsIds.length && tutorsIds.length < 3 && <RecommendedTutorCard placeholder={true} i18n={i18n} />}
            </div>
            <Button type="submit" className={styles.recommendedTutorsBtn}>
              {i18n["admin.mentoring.send-answer-to-student"]}
            </Button>
          </section>
        )}
      </form>
      {tutorsIds.length < 3 && <Element name='tutorsTable'>
        <h2 className={cx('mentorsTable__title')}>{i18n['admin.mentoring.mentorsTable-title']}</h2>
        <div
          className={cx({
            "answerToStudent__mentorsTable-hud": !mentorsTableHud.hud,
          })}
        >
          <TableMentor handleClick={mentorTable.handleClick} />
        </div>
        <div className={cx("answerToStudent__actions")}>
          <button
            onClick={() => mentorsTableHud.toggleHud()}
            className={cx("answerToStudent__btn", "answerToStudent__btn-show")}
          >
            {mentorsTableHud.hud
              ? i18n["admin.mentoring.collapse"]
              : i18n["admin.mentoring.expand"]}
          </button>
          <button
            onClick={() => toggleAnswerWindow(item.id)}
            className={cx("answerToStudent__btn", "answerToStudent__btn-back")}
          >
            {i18n["admin.mentoring.back"]}
          </button>
        </div>
      </Element>}
    </div>
  );
}

export class DeclineCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      writeToTutor: {
        isVisible: false,
      },
    };
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
    const {
      i18n,
      item,
      answerWindow,
      form,
      toggleAnswerWindow,
      tutorsIds,
      removeTutor,
      sendAnswer,
      mentorsTableHud,
      mentorTable,
    } = this.props;
    const { userInfo, tutorInfo } = item;
    return (
      <li>
        <div className={cx("card")}>
          <div className={cx("card__student")}>
            {renderCardContent({
              i18n,
              item: userInfo,
              toggleAnswerWindow,
              id: item.id,
              answerWindow,
              buttons: () => (
                <button
                  className={cx("card__action", "card__action-student")}
                  onClick={() => toggleAnswerWindow(item.id)}
                >
                  {i18n["admin.mentoring.write-to-student"]}
                </button>
              ),
            })}
          </div>
          <div className={cx("card__separator-container")}>
            <div className={cx("card__separator-wrapper")}>
              <div className={cx("card__separator")}></div>
            </div>
          </div>
          <div className={cx("card__tutor")}>
            <div className={cx("card__tutor-cardWrapper")}>
              {renderCardContent({
                i18n,
                item: tutorInfo.userInfo,
                isTutor: true,
                toggleAnswerWindow,
                buttons: () => (
                  <button
                    className={cx(
                      "card__action",
                      this.state.writeToTutor.isVisible
                        ? "card__action-tutor-hidden"
                        : "card__action-tutor"
                    )}
                    onClick={
                      this.state.writeToTutor.isVisible
                        ? () => {}
                        : this.toggleWriteToTutor
                    }
                  >
                    {i18n["admin.mentoring.write-to-tutor"]}
                  </button>
                ),
              })}
            </div>
            {renderAnswer({
              i18n,
              item,
              title: i18n["admin.mentoring.tutors-answer"],
              descr: item.tutorResponse,
            })}
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
        {answerWindow.show[`${item.id}`] && (
          <div>
            {renderAnswerToStudentWindow({
              i18n,
              item,
              tutorsIds,
              form,
              removeTutor,
              sendAnswer,
              mentorsTableHud,
              mentorTable,
              toggleAnswerWindow,
            })}
          </div>
        )}
      </li>
    );
  }
}
