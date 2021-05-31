import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { dict } from 'dict';
import moment from 'moment';

import * as ducks from '../../../../ducks';
import * as selectors from '../../../../selectors';
import styles from './styles.css';
import { createUserName, isAdmin as checkAdmin } from 'modules/utils';
import { ListOfRecipients } from './components/ListOfRecipients';
import { useOutsideClick } from 'modules/utils';
import { Modal } from '../../../../../Mlm/MlmStructure/components/MentorRequestCard/components/Modal';

const cx = classNames.bind(styles);

const mapStateToProps = state => ({
  currentPeriod: selectors.selectCurrentPeriod(state),
  outsideClickRefs: selectors.selectOutsideClickRefs(state),
  lang: state.lang,
  userInfo: state.userInfo,
});
const mapDispatchToProps = dispatch => ({ dispatch });

export const TaskTooltip = connect(mapStateToProps, mapDispatchToProps)(
  function TaskTooltip({ taskInfo, closeTooltip, toggleTaskWindow, lang, userInfo, currentPeriod, outsideClickRefs, dispatch }) {
    const i18n = dict[lang];

    const { dateStart, dateEnd } = currentPeriod;
    const isDay = moment(dateEnd).diff(moment(dateStart), 'days') === 1;

    const isAdmin = checkAdmin(userInfo);

    
    function getUserName (userInfo) {
      const { firstName, lastName, middleName } = userInfo;
      return createUserName({ firstName, lastName, middleName })
    }
    
    const ref = useRef();
    
    useOutsideClick(ref, (e) => {
      closeTooltip(e);
    }, outsideClickRefs)
    
    useEffect(() => {
      dispatch(ducks.setTooltipStatus(true))
      return () => {
        dispatch(ducks.setTooltipStatus(false))
      }
    }, []);
    
    const [ isDeleteModalVisible, setDeleteModalVisibility ] = useState(false);
    function toggleDeleteModal() {
      setDeleteModalVisibility(!isDeleteModalVisible)
    }
    
    async function deleteTask() {
      if (isAdmin) {
        const payload = taskInfo.groupId ? { groupId: taskInfo.groupId } : { id: taskInfo.id }
        await dispatch(ducks.calendarDeleteTask(
          payload, 
          () => {}, 
          () => {}
        ));
        setDeleteModalVisibility(false);
        return;
      }
      await dispatch(ducks.calendarDeleteTask({id: taskInfo.id}, () => {}, () => {}));
      await dispatch(ducks.calendarGetTasks(currentPeriod));
      setDeleteModalVisibility(false);
      closeTooltip();
    }

    const isEditable = taskInfo.parentUserInfo ? taskInfo.parentUserInfo.role !== 2 : true

    return (
      <React.Fragment>
        <div className={cx('taskTooltip', { 'taskTooltip__day': isDay })} ref={ref} >
          <p className={cx('taskTooltip__title')}>{taskInfo.name}</p>
          <p className={cx('taskTooltip__description')}>{taskInfo.description}</p>

          {!isAdmin && taskInfo.parentUserInfo && <React.Fragment>
            <hr className={cx('taskTooltip__hr')} />
            <div className={cx('taskTooltip__taskCreator')}>
              <span className={cx('taskTooltip__taskCreator_title')}>{i18n['calendar.task.creator.title']}</span>
              <span className={cx('taskTooltip__taskCreator_name')}>{getUserName(taskInfo.parentUserInfo)}</span>
              <div className={cx('taskTooltip__taskCreator_info')}>
                <img src={taskInfo.parentUserInfo.photo} alt='ava' className={cx('taskTooltip__taskCreator_photo')} />
                <span className={cx('taskTooltip__taskCreator_specialties')}>{taskInfo.parentUserInfo.specialties || 'У пользователя не указана специальность'}</span>
              </div>
            </div>
          </React.Fragment>}

          {/* TODO: переписать под менеджера */}
          {isAdmin && (
            <React.Fragment>
              <hr className={cx('taskTooltip__hr')} />
              <div className={cx('taskTooltip__taskCreator')}>
                <span className={cx('taskTooltip__taskCreator_title')}>{i18n['calendar.task.reciever.title']}</span>
                <span className={cx('taskTooltip__taskCreator_name')}>
                  <ListOfRecipients taskInfo={taskInfo} />
                </span>
              </div>
            </React.Fragment>
          )}

          {(isEditable || isAdmin) && 
            <React.Fragment>
              <hr className={cx('taskTooltip__hr')} />
              <div className={cx('taskTooltip__actions')}>
                <button className={cx('taskTooltip__btn', 'taskTooltip__btn_change')} onClick={toggleTaskWindow}>
                  <svg className={cx('taskTooltip__svg')}>
                    <use xlinkHref='#ico-edit-pen'></use>
                  </svg>
                  <span>{i18n['calendar.task.change']}</span>
                </button>
                <button className={cx('taskTooltip__btn', 'taskTooltip__btn_delete')} onClick={() => toggleDeleteModal()}>
                  <svg className={cx('taskTooltip__ico-trash')}>
                    <use xlinkHref='#ico-trash'></use>
                  </svg>
                </button>
                {isDeleteModalVisible && (
                  <Modal
                    onOk={() => {}}
                    onCancel={() => toggleDeleteModal()}
                    isButtons={false}
                  >
                    <div className={cx('modal__wrapper')}>
                      <div className={cx('modal__description')}>
                        <p className={cx('modal__title')}>{i18n['calendar.task.delete.title']}</p>
                        <p className={cx('modal__text')}>{taskInfo.name}</p>
                      </div>
                      <div className={cx('modal__actions')}>
                        <button onClick={() => deleteTask()} className={cx('modal__btn', 'modal__btn_delete')}>{i18n['calendar.task.delete.accept']}</button>
                        <button onClick={() => setDeleteModalVisibility(false)} className={cx('modal__btn', 'modal__btn_cancel')}>{i18n['calendar.task.delete.cancel']}</button>
                      </div>
                    </div>
                  </Modal>
                )}
              </div>
            </React.Fragment>
          }
        </div>
      </React.Fragment>
    )
  }
)
