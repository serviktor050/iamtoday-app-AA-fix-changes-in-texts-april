import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {Entity} from 'draft-js';
import { Field, FieldArray } from 'redux-form'
import classNames from 'classnames';
import Option from '../../../components/Option';
import InputProfile from '../../../../componentKit/InputProfile'
import RadioProfile from '../../../../componentKit/RadioProfile'
import TaskItem from '../../../../todayTask/TaskItem'
import styles from './styles.css'; // eslint-disable-line no-unused-vars

const renderExercises = ({ fields, meta: { touched, error } }) => (
  <ul>
    <h4>Упражнения:</h4>
    {fields.map((exercise, index) => (
      <li key={index}>
        <br/>
        <div className="gender">
          <div className="low">{index + 1}-е упражение </div>
          <span className="base-table__btn-del">
            <svg className="svg-icon ico-trash" onClick={() => fields.remove(index)}>
              <use xlinkHref="#ico-trash"></use>
            </svg>
          </span>
        </div>
        <br/>
        <Field name={`${exercise}.count`} placeholder="Количество раз" component={InputProfile} />
        <Field name={`${exercise}.description`} placeholder="Описание упражения" component={InputProfile} />
        <Field name={`${exercise}.video`} placeholder="https://youtube/video" component={InputProfile} />
      </li>
    ))}
    <li>
      <a href='#' onClick={e => {
        e.preventDefault()
        fields.push({})
      }}>Добавить</a>
    </li>
  </ul>
)

const getTaskComponent = ({decorator}) => {

  class Task extends Component {

    constructor(props) {
      super(props);

      this.state = {
        exercises: [],
      }
    }

    setFocus = () => {
      const {blockProps} = this.props;
      const {isFocused, setFocusToBlock} = blockProps;

      if (!isFocused) {
        setFocusToBlock();
      }
    }

    addExercise() {
      const {exercises} = this.state;

      this.setState({
        exercises: exercises.concat({number: exercises.length + 1})
      });
    }

    removeExercise(itemNumber) {
      const {exercises} = this.state;

      this.setState({
        exercises: exercises
          .filter(({number}) => number !== itemNumber)
          .map((exercise, key) => ({...exercise, number: key + 1}))
      });
    }

    renderPresentationTasks () {
      const {blockProps} = this.props;
      const {entityData, getProps, removeBlock} = blockProps;
      const {isPresentation} = getProps();
      const {number} = entityData;

      return <TaskItem index={number} />;
    }

    renderEditableTasks () {
      // const {block, contentState, blockProps} = this.props;
      const {exercises} = this.state;

      const {blockProps} = this.props;
      const {entityData, getProps, removeBlock} = blockProps;
      const {isPresentation} = getProps();
      const {number} = entityData;

      return (
        <div
          onClick={e => {
            e.stopPropagation();

            this.setFocus();
          }}
          className="itd-task-wrapper"
          contentEditable={false}
          suppressContentEditableWarning={true}>
          <div className="gender">
            <h4 className="low">Задание - {number}:</h4>
            <span className="base-table__btn-del">
            <svg className="svg-icon ico-trash" onClick={removeBlock}>
              <use xlinkHref="#ico-trash"></use>
            </svg>
          </span>
          </div>
          <br/>
          <div className="gender">
            <p className="gender__title">Пол</p>
            <Field name={`tasks[${number}].gender`} value="male" type='radio' title="Мужчина" id={`genfer${number}[1]`} component={RadioProfile} />
            <Field name={`tasks[${number}].gender`} value="female" type='radio' title="Женщина" id={`genfer${number}[2]`} component={RadioProfile} />
          </div>
          <br/>
          <Field name={`tasks[${number}].name`} placeholder="Название" component={InputProfile} />
          <Field name={`tasks[${number}].description`} placeholder="Описание" component={InputProfile} />
          <FieldArray name={`tasks[${number}].exercises`} component={renderExercises} />
        </div>
      );
    }

    render() {
      const {blockProps} = this.props;
      const {getProps} = blockProps;
      const {isPresentation} = getProps();

      return isPresentation ? this.renderPresentationTasks() : this.renderEditableTasks();
    }
  }

  Task.propTypes = {
    block: PropTypes.object,
    contentState: PropTypes.object,
  };

  return decorator ? decorator(Task) : Task;
};

export default getTaskComponent;
