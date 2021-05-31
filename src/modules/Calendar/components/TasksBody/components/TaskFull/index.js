import React, { useState } from 'react';
import classNames from 'classnames/bind';
import moment from 'moment';
import { connect } from 'react-redux';
import { dict } from 'dict';

import * as ducks from '../../../../ducks';
import * as selectors from '../../../../selectors';
import { CalendarTaskWindow } from '../../../CalendarTaskWindow';
import styles from './styles.css';
import { Modal } from '../../../../../Mlm/MlmStructure/components/MentorRequestCard/components/Modal';
import { isAdmin as checkAdmin } from 'modules/utils';

const cx = classNames.bind(styles);

const mapStateToProps = state => ({ currentPeriod: selectors.selectCurrentPeriod(state) , lang: state.lang, userInfo: state.userInfo });
const mapDispatchToProps = dispatch => ({ dispatch })

export const TaskFull = connect(mapStateToProps, mapDispatchToProps)(
  function TaskFull({ task, currentPeriod, userInfo, lang, dispatch }) {
    const i18n = dict[lang];

    const isAdmin = checkAdmin(userInfo);

    const [ isEditTaskWindow, setEditTaskWindow ] = useState(false);
    function toggleTaskWindow() {
      setEditTaskWindow(!isEditTaskWindow)
    }

    
    async function toggleTaskCompletion() {
      await dispatch(ducks.calendarUpdateTask({ ...task, isDone: !task.isDone }, () => {}, () => {}))
      await dispatch(ducks.calendarGetTasks(currentPeriod));
    }
    
    const [ isDeleteModalVisible, setDeleteModalVisibility ] = useState(false);
    function toggleDeleteModal() {
      setDeleteModalVisibility(!isDeleteModalVisible)
    }
    
    async function deleteTask() {
      if (isAdmin) {
        const payload = task.groupId ? { groupId: task.groupId } : { id: task.id }
        await dispatch(ducks.calendarDeleteTask(
          payload, 
          () => {}, 
          () => {}
        ));
        setDeleteModalVisibility(false);
        return;
      }
      await dispatch(ducks.calendarDeleteTask({id: task.id}, () => {}, () => {}));
      await dispatch(ducks.calendarGetTasks(currentPeriod));
      setDeleteModalVisibility(false)
    }

    const { isAllDay, name, description, dateStart, color, id, isDone, parentUserInfo } = task;

    const isAdminTaskParent = parentUserInfo ? parentUserInfo.role === 2 : false;

    return (
      <React.Fragment>
        <div className={cx('taskFull', { 'taskFull__done': isDone })} style={{ borderColor: color, backgroundColor: `${color}4C` }} >
          <div className={cx('taskFull__checkbox_wrapper')}>
            <input onChange={toggleTaskCompletion} id={`task-${id}`} type='checkbox' className={cx('taskFull__checkbox_input')} checked={isDone} />
            <label htmlFor={`task-${id}`} className={cx('taskFull__checkbox_label')}></label> 
          </div>
          <div className={cx('taskFull__info', { 'taskFull__info_center': !description }, { 'taskFull__info_column': isAllDay })}>
            {!isAllDay && <span className={cx('taskFull__time')} style={{ color: color }}>{moment(dateStart).format('HH:mm')}</span>}
            <span className={cx('taskFull__info_title')} style={{ color: color }}>{name}</span>
            <span className={cx('taskFull__info_description')}>{description}</span>
          </div>
          {!isDone && !isAdminTaskParent && <div className={cx('taskFull__actions')}>
            <button className={cx('taskFull__btn')} onClick={toggleTaskWindow}>
              <svg className={cx('taskFull__btn_edit')}>
                <use xlinkHref='#ico-edit-pen'></use>
              </svg>
            </button>
            <button className={cx('taskFull__btn')} onClick={toggleDeleteModal} >
              <svg className={cx('taskFull__btn_delete')}>
                <use xlinkHref='#ico-trash'></use>
              </svg>
            </button>
          </div>}
        </div>
        {isDeleteModalVisible && (
          <Modal
            onOk={() => {}}
            onCancel={() => toggleDeleteModal()}
            isButtons={false}
          >
            <div className={cx('modal__wrapper')}>
              <div className={cx('modal__description')}>
                <p className={cx('modal__title')}>{i18n['calendar.task.delete.title']}</p>
                <p className={cx('modal__text')}>{task.name}</p>
              </div>
              <div className={cx('modal__actions')}>
                <button onClick={() => deleteTask()} className={cx('modal__btn', 'modal__btn_delete')}>{i18n['calendar.task.delete.accept']}</button>
                <button onClick={() => setDeleteModalVisibility(false)} className={cx('modal__btn', 'modal__btn_cancel')}>{i18n['calendar.task.delete.cancel']}</button>
              </div>
            </div>
          </Modal>
        )}
        {isEditTaskWindow && <CalendarTaskWindow toggleTaskWindow={toggleTaskWindow} taskInfo={task} />}
      </React.Fragment>
    )
  }
)
