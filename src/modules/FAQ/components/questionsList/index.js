import React, { Component } from "react";
import { connect } from "react-redux";
import { dict } from "dict";
import styles from "./style.css";
import { AddQuestionBlock } from "./components/AddQuestionBlock";

const mapDispatchToProps = (dispatch) => ({ dispatch });
const mapStateToProps = ({ lang, userInfo }) => ({ lang, userInfo });

const renderEditButton = (func) => {
  <span className={styles.questionText_edit} onClick={func}>
    <svg className={styles.svgIconFile}>
      <use xlinkHref="#ico-pencil" />
    </svg>
  </span>;
};
class QuestionsBlock extends Component {
  constructor() {
    super();
    this.state = {
      expandedQuestionId: null,
      isExpanded: false,
      editQuestionId: null,
      isAddBlockOn: false,
      newQuestions: [],
    };
  }

  expandBlock = (id) => {
    const { isExpanded } = this.state;
    this.setState({ expandedQuestionId: id, isExpanded: !isExpanded });
  };

  openAddQuestionBlock = () => {
    this.setState({ isAddBlockOn: true });
  };

  closeAddQuestionBlock = () => {
    this.setState({ isAddBlockOn: false });
  };
  openEditQuestionBlock = (id) => {
    this.setState({ editQuestionId: id });
  };

  closeEditQuestionBlock = () => {
    this.setState({ editQuestionId: null });
  };

  handleAddQuestion = (data) => {
    const { newQuestions } = this.state;
    this.setState({
      newQuestions: [...newQuestions, data],
    });
  };

  render() {
    const { questions, tags } = this.props;
    const { editQuestionId, newQuestions } = this.state;
    const allQuestions = questions.concat(newQuestions);

    const filteredQuestions = allQuestions.filter((q) => {
      if (tags.length !== 0 && q.tags !== null) {
        return q.tags.find((element) => {
          return element.name === tags[0].name;
        });
      } else {
        return;
      }
    });

    return (
      <div className={styles.questionsList}>
        {this.renderHeader()}
        <ul>
          {filteredQuestions.length !== 0 &&
            filteredQuestions.map((item) => {
              if (item.id === editQuestionId) {
                return this.renderEditableQuestionItem(item);
              } else {
                return this.renderQuestionItem(item);
              }
            })}
          {Boolean(allQuestions.length) &&
            filteredQuestions.length === 0 &&
            allQuestions.map((item) => {
              if (item.id === editQuestionId) {
                return this.renderEditableQuestionItem(item);
              } else {
                return this.renderQuestionItem(item);
              }
            })}
        </ul>
      </div>
    );
  }

  renderHeader() {
    const { category, questionsNumber, userInfo } = this.props;
    const { isAddBlockOn } = this.state;
    const isAdmin = userInfo.data.role === 2;

    return (
      <div>
        <div className={styles.questionsList_title}>
          <div className={styles.questionsList_category}>
            <h3>{category.name}</h3>
            <span className={styles.badge}>{questionsNumber}</span>
          </div>
          {isAdmin && (
            <button
              className={styles.questionsList_titleButton}
              onClick={this.openAddQuestionBlock}
            >
              +
            </button>
          )}
        </div>
        {isAddBlockOn && (
          <AddQuestionBlock
            closeForm={this.closeAddQuestionBlock}
            categoryId={category.id}
            addQuestion={this.handleAddQuestion}
          />
        )}
      </div>
    );
  }

  renderQuestionItem(item) {
    const { expandedQuestionId, isExpanded } = this.state;
    const { userInfo } = this.props;
    const isAdmin = userInfo.data.role === 2;

    return (
      <li className={styles.questionItem} key={item.id} value={item.id}>
        <div>
          <div className={styles.questionItem_header}>
            {Boolean(item.tags) &&
              Boolean(item.tags.length) &&
              this.renderTagsList(item.tags)}
            <button
              className={styles.questionItem_arrow}
              //arrow button rotate 180deg when question is expanded
              style={{
                transform:
                  expandedQuestionId === item.id &&
                  isExpanded &&
                  "rotate(180deg)",
              }}
              onClick={() => this.expandBlock(item.id)}
            ></button>
          </div>
        </div>
        <div className={styles.questionText}>
          {item.question}
          {isAdmin && (
            <span
              className={styles.questionText_edit}
              onClick={() => this.openEditQuestionBlock(item.id)}
            >
              <svg className={styles.svgIconFile}>
                <use xlinkHref="#ico-pencil" />
              </svg>
            </span>
          )}
        </div>
        {expandedQuestionId === item.id && isExpanded ? (
          <div className={styles.questionAnswer}>{item.answer}</div>
        ) : null}
      </li>
    );
  }

  renderEditableQuestionItem(item) {
    const { category } = this.props;
    return (
      <li className={styles.questionItem} key={item.id} value={item.id}>
        <AddQuestionBlock
          prevQuestion={item.question}
          prevAnswer={item.answer}
          prevTags={Boolean(item.tags) ? item.tags : []}
          closeForm={this.closeEditQuestionBlock}
          categoryId={category.id}
        />
      </li>
    );
  }

  renderTagsList(props) {
    return props.map((i) => {
      return <span className={styles.tag} key={i.id}>{`#${i.name}`}</span>;
    });
  }
}

export const QuestionsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionsBlock);
