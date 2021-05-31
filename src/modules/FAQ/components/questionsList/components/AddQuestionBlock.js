import React, { Component } from "react";
import { connect } from 'react-redux';
import { dict } from "dict";
import styles from "./style.css";
import InputProfile from "components/componentKit/InputProfile";
import { createFaqQuestion } from "../../../../../utils/api";

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = ({ lang }) => ({ lang });

class AddBlock extends Component {

    state = {
        isExpanded: false,
        isAddBlockOn: false,
        question: "",
        answer: "",
        tag: "",
        tagList: [],
        loadedFileName: "",
        loadedFile: "",
    }

    componentDidMount() {
        this.props.prevTags && this.setState({ tagList: this.props.prevTags })
    }

    createQuestion = (e) => {
        this.setState({ question: e })
    }

    createAnswer = (e) => {
        this.setState({ answer: e.target.value })
    }

    addFile = (e) => {
        this.setState({ loadedFileName: e.target.files[0].name });

        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => { this.setState({ loadedFile: reader.result }) }
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    handleTagOnChange = (e) => {
        this.setState({ tag: e.target.value })
    }

    handleTagOnEnter = (e) => {
        const { tag, tagList } = this.state;
        e.key === "Enter" && this.setState({ tagList: [...tagList, { id: tag, name: tag }], tag: "" })
    }

    handleDeleteTag = (id) => {
        const { tagList } = this.state;
        const filteredList = tagList.filter(i => i.id != id)
        this.setState({ tagList: filteredList })
    }

    handleSubmitForm = () => {
        const { closeForm, categoryId, addQuestion } = this.props;
        const { question, answer, tagList } = this.state;
        const editedTagList = tagList.map(i=> { return {name: i.name} })

        createFaqQuestion({
            categoryId: categoryId,
            question: question,
            answer: answer,
            tags: editedTagList
        }).then((res)=>addQuestion(res.data.data)).then(closeForm())
    }


    render() {
        const { question, answer, tag, tagList, loadedFileName } = this.state;
        const { closeForm, prevQuestion, prevAnswer } = this.props;
        const i18n = dict[this.props.lang];

        return (
            <div className={styles.addBlock}>
                <div className={styles.inputWrapper}>
                    <InputProfile
                        meta={{}}
                        input={{
                            name: "question",
                            onChange: this.createQuestion,
                        }}
                        val={question ? question : prevQuestion}
                        remote={true}
                        placeholder={i18n["faq.question.placeholder"]}
                        cls={styles.addBlock_input} />
                </div>
                <div className={styles.textareaWrapper}>

                    <textarea
                        id="answer"
                        type="text"
                        ref="answerTextarea"
                        rows="4"
                        value={answer ? answer : prevAnswer}
                        onChange={this.createAnswer}
                        placeholder={i18n["faq.answer.placeholder"]}
                        className={styles.answerTextarea}
                    />
                    <label className={styles.uploadFileLabel}>
                        <input
                            id="fileInput"
                            type="file"
                            ref="fileInput"
                            accept="image/*, video/*"
                            onChange={(input) => this.addFile(input)}
                            className={styles.uploadFileInput}
                        />
                    </label>
                    <span> {loadedFileName} </span>
                </div>

                <h4 className={styles.tagsHeading}>{i18n["faq.tags"]}</h4>
                <div className={styles.tagsWrapper}>
                    {Boolean(tagList.length) && tagList.map(i => {
                        return (
                            <button className={styles.tag} onClick={() => this.handleDeleteTag(i.id)}>
                                #{i.name}
                                <div>+</div>
                            </button>)
                    })}
                    <input
                        name="tag"
                        onChange={this.handleTagOnChange}
                        onKeyDown={this.handleTagOnEnter}
                        value={tag}
                        placeholder={i18n["faq.tag.placeholder"]}
                        className={styles.addBlock_tagInput} />
                </div>
                <div className={styles.buttonBlock}>
                    <button className={styles.buttonOk} onClick={this.handleSubmitForm}>{i18n["faq.save"]}</button>
                    <button className={styles.buttonCancel} onClick={closeForm}>{i18n["faq.cancel"]}</button>
                </div>
            </div>
        )
    }
}

export const AddQuestionBlock = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddBlock);