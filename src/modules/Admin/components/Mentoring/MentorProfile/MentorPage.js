import React, {Component} from "react";
import classNames from "classnames/bind";
import styles from "./styles.css";
import { createUserName } from "../../../utils";
import { Modal } from "../../../../Mlm/MlmStructure/components/MentorRequestCard/components/Modal";
import {
  Entity,
  Editor,
  EditorState,
  convertFromRaw,
  CompositeDecorator,
} from "draft-js";
import { getCustomStyleMap } from "draftjs-utils";
import { startPrivateChat } from '../../../../utils';

const cx = classNames.bind(styles);

const ICONS = {
  '3': '../../../../../assets/img/fb.png',
  '5': '../../../../../assets/img/in.png',
}

export function renderHeader({ item, i18n, acceptModal, rows, isButtons }) {
  const { toggleAcceptModal, acceptButtonText } = acceptModal;
  const { userInfo } = item;
  return (
    <div className={cx("mentorsPage__header")}>
      <div className={cx("mentorsPage__avatarButtonsWrapper")}>
        <img
          src={userInfo.photo}
          alt="user_ava"
          className={cx("mentorsPage__ava")}
        />
        {isButtons && <div className={cx("mentorsPage__actions")}>
          {toggleAcceptModal ? <button
            className={cx("mentorsPage__button", "mentorsPage__btn-recommend")}
            onClick={() => toggleAcceptModal()}
          >
            {acceptButtonText ||
              i18n["admin.mentoring.mentor-actions.recommend-mentor"]}
          </button> : null}
          <button
            className={cx(
              "mentorsPage__button",
              "mentorsPage__btn-writeToMentor"
            )}
            onClick={() => startPrivateChat(userInfo.id)}
          >
            {i18n["admin.mentoring.mentor-actions.write-to-mentor"]}
          </button>
        </div>}
      </div>
      <div className={cx("mentorsPage__mainInfo")}>
        <h3 className={cx("mentorsPage__name")}>
          {createUserName({
            lastName: userInfo.lastName,
            firstName: userInfo.firstName,
            middleName: userInfo.middleName,
          })}
        </h3>
        <p className={cx("mentorsPage__specialisation")}>{item.specialties}</p>
        <table className={cx("mentorsPage__table")}>
          {rows.map((row, index) => (
            <tr className={cx("mentorsPage__table-row")} key={index}>
              <td className={cx("mentorsPage__table-cell")}>
                <span>{`${i18n[`admin.mentoring.mentor-info.${row}`]}`}</span>
              </td>
              <td className={cx("mentorsPage__table-cell")}>
                <span>
                  {row === "diplomaFr"
                    ? row
                      ? i18n["mentoring.tutors-list.has-diploma"]
                      : i18n["mentoring.tutors-list.no-diploma"]
                    : item[`${row}`]}
                </span>
              </td>
            </tr>
          ))}
          <tr className={cx("mentorsPage__table-row")}>
            <td className={cx("mentorsPage__table-cell")}>Соцсети</td>
            <td className={cx("mentorsPage__table-cell")}>
              <div className={cx('mentorsPage__socials')}>
                {item.userInfo.socialNetUrls.length > 0 ? item.userInfo.socialNetUrls.map((social) => {
                  return (
                    <a href={social.url} target='_blank' className={cx('mentorsPage__social_icoLink')}>
                      <img src={ICONS[social.socialNetType]} alt='social-ico' className={cx('mentorsPage__social_icon')} />
                    </a>)
                }) : <p>Не указаны</p>}
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}

const decorator = new CompositeDecorator([
  {
      strategy: (contentBlock, callback) => {
          contentBlock.findEntityRanges(
              (character) => {
                  const entityKey = character.getEntity()
                  return (
                      entityKey !== null &&
                      Entity.get(entityKey).getType() === 'LINK'
                  )
              },
              callback
          )
      },
      component: (props) => {
          const {url} = Entity.get(props.entityKey).getData()
          return (
              <a href='#' onClick={() => {
                  window.open(url, '_blank')
                  return false
              }}>
                  {props.children}
              </a>
          )
      }
  }
])

const customStyleMap = getCustomStyleMap();

const Image = (props) => {
  return <img src={props.src} style={{
      maxWidth: '100%',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto' }}/>
}

const Atomic = (props) => {
  const entity = Entity.get(props.block.getEntityAt(0))
  const {src} = entity.getData()
  const type = entity.getType()

  let media
  if (type === 'IMAGE') {
      media = <Image src={src} />
  }

  return media
}

function mediaBlockRenderer(block) {
  if (block.getType() === 'atomic') {
      return {
          component: Atomic,
          editable: false
      }
  }

  return null
}


function renderBody(props) {
  const { item } = props;
  const { description } = item;
  const { userInfo } = item;
  let editorState;
  try {
    editorState =
      description
        ? EditorState.createWithContent(convertFromRaw(JSON.parse(description)), decorator)
        : EditorState.createEmpty();
  } catch (_) {
    editorState = EditorState.createEmpty();
  }
  return (
    <div className={cx("mentorsPage__body")}>
      <div className={cx("mentorsPage__quote")}>
        <p className={cx("mentorsPage__quote-text")}>
          {item.quote ||
            `Я квалифицированный врач с опытом в области AntiAge ${item.workSeniorityAA} лет. Становитесь моими учениками`}
        </p>
        <p className={cx("mentorsPage__quote-author")}>
          {createUserName({
            lastName: userInfo.lastName,
            firstName: userInfo.firstName,
            middleName: userInfo.middleName,
          })}
        </p>
      </div>
      <Editor
        readOnly={true}
        customStyleMap={customStyleMap}
        editorState={editorState}
        blockRendererFn={mediaBlockRenderer}
      />
    </div>
  );
}

export function MentorPage(props) {
  const { item, i18n, acceptModal, isButtons=true } = props;
  const rows = [
    `location`,
    "workSeniorityAA",
    "modularSchool",
    "expertSchool",
    "diplomaFr",
  ];
  return (
    <div className={cx("mentorsPage")}>
      {renderHeader({
        item: { ...item, location: item.userInfo.city },
        i18n,
        acceptModal,
        rows,
        isButtons
      })} 
      {renderBody({ item, i18n })}
      {acceptModal.show &&
        (!(acceptModal.success || acceptModal.isError) ? (
          <Modal
            onCancel={acceptModal.toggleAcceptModal}
            onOk={acceptModal.successModal}
            closeButtonText={i18n["cancel"]}
            acceptButtonText={i18n["admin.mentoring.modal.default-accept"]}
            i18n={i18n}
          >
            {acceptModal.renderModalContent(item)}
          </Modal>
        ) : acceptModal.success ? (
          <Modal
            onCancel={acceptModal.toggleAcceptModal}
            onOk={acceptModal.successModal}
            closeButtonText={i18n["cancel"]}
            acceptButtonText={i18n["admin.mentoring.modal.default-accept"]}
            i18n={i18n}
            isButtons={false}
          >
            {acceptModal.renderModalContent(item)}
          </Modal>
        ) : (
          <Modal
            onCancel={acceptModal.toggleAcceptModal}
            onOk={acceptModal.successModal}
            closeButtonText={i18n["cancel"]}
            acceptButtonText={i18n["admin.mentoring.modal.default-accept"]}
            i18n={i18n}
            isButtons={false}
          >
            {i18n["server.error.unexpectedError"]}
          </Modal>
        ))}
    </div>
  );
}
