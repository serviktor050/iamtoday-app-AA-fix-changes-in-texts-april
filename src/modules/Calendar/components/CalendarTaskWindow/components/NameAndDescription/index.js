import React from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { dict } from 'dict';
import { Controller } from "react-hook-form";

import styles from './styles.css';
import InputProfile from 'components/componentKit/InputProfile';

const cx = classNames.bind(styles);

const mapStateToProps = state => ({ lang: state.lang })
const mapDispatchToProps = dispatch => ({ dispatch })

export const NameAndDescription = connect(mapStateToProps, mapDispatchToProps)(
  function NameAndDescription({ taskInfo, register, control, errors, lang }) {
    const i18n = dict[lang];
    return (
      <React.Fragment>
        <div className={cx('newTask__input_wrapper')}>
            {errors && <span className={cx('newTask__validationError')}>{i18n['required-field']}</span>}
            <Controller
              name="name"
              control={control}
              rules={{ required: true, validate: text => !!text.trim() }}
              defaultValue={taskInfo ? taskInfo.name : ''}
              render={({ field: { onChange, value } }) => (
                <InputProfile  meta={{}} 
                  val={value}
                  remote={true}
                  required={true}
                  cls={cx('newTask__title_input', 'newTask__input', {'newTask__input-error': errors})}
                  placeholder={i18n["calendar.new-task.input-title"]}
                  input={{ name: "name", onChange, }}
                />
              )}
            />
          </div>

          <textarea 
            rows='10' 
            placeholder={i18n['calendar.new-task.description.placeholder']} 
            defaultValue={taskInfo ? taskInfo.description : ''} 
            className={cx('newTask__textarea')} 
            {...register('description')}
          />
      </React.Fragment>
    )
  }
)
