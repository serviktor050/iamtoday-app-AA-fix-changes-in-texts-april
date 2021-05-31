import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { dict } from 'dict';
import { useForm } from "react-hook-form";
import moment from 'moment';
import * as R from 'ramda';

import { Modal } from 'modules/Mlm/MlmStructure/components/MentorRequestCard/components/Modal';
import { COLORS, TYPE_ALL, TYPE_CHILDREN, TYPE_GROUP } from '../../constants';
import { ColorInput } from './components/ColorInput';
import * as ducks from '../../ducks';
import * as selectors from '../../selectors';
import styles from './styles.css';
import { TaskTimePicker } from './components/TaskTimePicker';
import { NameAndDescription } from './components/NameAndDescription';
import { ChooseRecipients } from './components/ChooseRecipients';
import { isAdmin, useSubscribeRedux } from 'modules/utils';

const cx = classNames.bind(styles);

const mapStateToProps = state => ({
  taskDescription: selectors.selectTaskDescription(state),
  recipientsType: selectors.selectRecipientsType(state),
  currentPeriod: selectors.selectCurrentPeriod(state),
  contractors: selectors.selectContractors(state),
  userInfo: state.userInfo,
  lang: state.lang,
});
const mapDispatchToProps = dispatch => ({ dispatch });

export const CalendarTaskWindow = connect(mapStateToProps, mapDispatchToProps)(
  function CalendarTaskWindow ({ 
    toggleTaskWindow, 
    taskDescription, 
    recipientsType, 
    currentPeriod, 
    contractors,
    dateStart,
    userInfo,
    taskInfo, 
    dispatch, 
    lang,
  }) {

    const [ task, setTask ] = useState({});

    useEffect(() => {
      if (taskInfo) {
        dispatch(ducks.getTaskDescription({ id: taskInfo.id }));
        return () => {
          dispatch(ducks.clearTaskDescription())
        }
      }
    }, []);

    useEffect(() => {
      if (taskInfo) {
        setTask(R.path(['data'], taskDescription) || {})
      }
    }, [taskDescription]);

    const innerRef = useRef();
    useSubscribeRedux(
      innerRef,
      () => dispatch(ducks.addRefToOutSideClick(innerRef)),
      () => dispatch(ducks.deleteRefFromOutsideClick(innerRef)),
    )

    const { register, control, handleSubmit, watch, formState, reset } = useForm(taskInfo && {
      defaultValues: {
        dateStart: moment(taskInfo.dateStart),
        dateEnd: moment(taskInfo.dateEnd),
        description: taskInfo.description,
        isAllDay: taskInfo.isAllDay,
        color: taskInfo.color,
        name: taskInfo.name,
      }
    });

    useEffect(async () => {
      if (taskInfo && task) {
        reset({
          dateStart: moment(task.dateStart),
          dateEnd: moment(task.dateEnd),
          description: task.description,
          isAllDay: task.isAllDay,
          color: task.color,
          name: task.name,
        })
        if (task.groupType) {
          await dispatch(ducks.setRecipientsType(task.groupType));
        }
        if (task.recipientInfos) {
          dispatch(ducks.addToContractorsList(task.recipientInfos));
        }
      }
    }, [task])

    const contractorsInputState = useState('');

    function getGroup() {
      if (contractors.length > 0) {
        switch (recipientsType) {
          case TYPE_CHILDREN: 
            return { groupType: TYPE_CHILDREN, recipients: contractors.map(contractor => contractor.email) }
          case TYPE_GROUP: 
            return { groupType: TYPE_GROUP, recipients: contractors.map(contractor => contractor.email) }
          default:
            return { groupType: TYPE_GROUP, recipients: contractors.map(contractor => contractor.email) }
        }
      }
      if (recipientsType === TYPE_ALL) {
        return { groupType: TYPE_ALL }
      }
      return { groupType: 'personal' }
    }

    const onSubmit = async ({dateStart, dateEnd, isAllDay, contractor, ...data}) => {
      const date = { isAllDay, dateStart: dateStart.startOf('minute').format(), dateEnd: dateEnd.startOf('minute').format() };
      const group = getGroup();

      if (taskInfo && isAdmin(userInfo)) {
        const response = { ...data, ...date, ...group, isDone: false };
        await dispatch(ducks.calendarCreateTask(
            response,
            () => dispatch(ducks.calendarDeleteTask(taskInfo.groupId ? { groupId: taskInfo.groupId } : { id: taskInfo.id })),
            () => {},
          ));
        dispatch(ducks.calendarGetTasks(currentPeriod));
        toggleTaskWindow();
        return
      }

      if (taskInfo) {
        const response = { ...data, ...date, ...group, id: taskInfo.id, isDone: false, }
        await dispatch(ducks.calendarUpdateTask(response, () => {}, () => {}));
        dispatch(ducks.calendarGetTasks(currentPeriod));
        toggleTaskWindow();
        return
      }
      
      const response = { ...data, ...date, ...group, isDone: false, }
      await dispatch(ducks.calendarCreateTask(response, () => {}, () => {}))
      dispatch(ducks.calendarGetTasks(currentPeriod));
      toggleTaskWindow();
    }

    const isAllDay = watch('isAllDay');
    const timeStart = watch('dateStart');
    const i18n = dict[lang];
    return (
      <Modal 
        onOk={_ => {}} 
        isStyles={false}
        isButtons={false} 
        onCancel={toggleTaskWindow} 
        closeButtonText={i18n['calendar.new-task.cancel']} 
        acceptButtonText={i18n['calendar.new-task.create']}
        ref={innerRef}
      >
        <form className={cx('newTask__form')} onSubmit={handleSubmit(onSubmit)}>
          <h3 className={cx('newTask__title')}>{taskInfo ? i18n['calendar.edit-task.title'] : i18n['calendar.new-task.title']}</h3>
          <NameAndDescription taskInfo={task || taskInfo} register={register} control={control} errors={formState.errors.name} /> 

          <TaskTimePicker dateStart={dateStart} timeStart={timeStart} taskInfo={!R.isEmpty(task) || taskInfo ? task || taskInfo : null} control={control} formState={formState} isAllDay={isAllDay} />

          <ChooseRecipients taskInfo={task} contractorsInputState={contractorsInputState} /> 

          <div className={cx('newTask__colors_container')}>
            <span className={cx('newTask__colors_label')}>{i18n['calendar.new-task.colors.title']}</span>
            {formState.errors.color && <span style={{ top: '5px' }} className={cx('newTask__validationError')}>{i18n['required-field']}</span>}
            <div className={cx('newTask__colors_wrapper', { 'newTask__input-error': formState.errors.color })}>
              {COLORS.map((color => <ColorInput key={color} defaultValue={taskInfo ? task.color : null} name='color' color={color} innerRef={register} />))}
            </div>
          </div>

          <div className={cx('newTask__actions')}>
            <button type='submit' className={cx('newTask__button', 'newTask__button_blue')}>
              {taskInfo ? i18n['calendar.task.change'] : i18n['calendar.new-task.create']}
            </button>
            <button onClick={e => toggleTaskWindow(e)} className={cx('newTask__button', 'newTask__button_blueOutlined')}>
              {i18n['calendar.new-task.cancel']}
            </button>
          </div>

        </form>
      </Modal>
    )
  }
)
