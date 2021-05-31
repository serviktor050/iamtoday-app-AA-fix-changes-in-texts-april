import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { dict } from 'dict';
import { Controller } from "react-hook-form";
import moment from 'moment';

import styles from './styles.css';
import { DateTimePicker } from '../DateTimePicker';
import { AllDayCheckbox } from '../AllDayCheckbox';

const cx = classNames.bind(styles);

const mapStateToProps = state => ({ lang: state.lang })
const mapDispatchToProps = dispatch => ({ dispatch })

export const TaskTimePicker = connect(mapStateToProps, mapDispatchToProps)(
  function TaskTimePicker({ taskInfo, dateStart, timeStart, control, formState, isAllDay, lang }) {
    const i18n = dict[lang];

    return (
      <React.Fragment>
        <div className={cx('newTask__dateInputs_wrapper')}>
            <div className={cx('newTask__dateInput')}>
              <label className={cx('newTask__dateInput_label')}>{i18n['calendar.new-task.startDate']}</label>
              <Controller
                name='dateStart'
                defaultValue={taskInfo ? moment(taskInfo.dateStart) : moment(dateStart).startOf('hour')}
                control={control}
                rules={{ required: !isAllDay }}
                render={ ({ field: { onChange, value } }) =>
                  <DateTimePicker 
                    onChange={onChange} 
                    value={value} 
                    isError={formState.errors.dateStart} 
                  />
                }
              />
            </div>

            <div className={cx('newTask__dateInput')}>
              <label className={cx('newTask__dateInput_label')}>{i18n['calendar.new-task.endDate']}</label>
              <Controller
                name='dateEnd'
                defaultValue={taskInfo ? moment(taskInfo.dateEnd) : moment(dateStart).startOf('hour').add(30, 'm')}
                control={control}
                rules={ { required: !isAllDay, validate: (time) => time.isAfter(timeStart) }}
                render={ ({ field: { onChange, value } }) =>
                  <DateTimePicker 
                    onChange={onChange} 
                    isError={formState.errors.dateEnd} 
                    value={value} 
                  />
                }
              />
              {formState.errors.dateEnd && <span className={cx('newTask__dateInput_error')}>{i18n['calendar.new-task.endDate-pastError']}</span>}
            </div>
          </div>

          <div className={cx('newTask__checkbox')}>
            <Controller
              name='isAllDay'
              defaultValue={taskInfo ? taskInfo.isAllDay : false}
              control={control}
              touched={true}
              render={({ field: { onChange, value } }) => 
                <AllDayCheckbox 
                  title={i18n['calendar.new-task.allDay']}
                  checked={value} onChange={(e) => onChange(e.target.checked)}
                />}
            />
          </div>
      </React.Fragment>
    )
  }
)
