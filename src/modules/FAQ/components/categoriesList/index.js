import React, { Component } from "react";
import { connect } from 'react-redux';
import { dict } from "dict";
import styles from "./style.css";
import { Modal } from "../modal";
import InputProfile from "components/componentKit/InputProfile";
import { createFaqCategory } from "../../../../utils/api";

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = ({ lang, userInfo }) => ({ lang, userInfo });

class CategoriesListBlock extends Component {

    state = {
        isModalOn: false,
        categoryName: "",
        newCategories: []
    }

    createCategoryName = (e) => {
        this.setState({ categoryName: e })
    }

    handleAddCategory = () => {
        const { categoryName, newCategories } = this.state;
        this.setState({ isModalOn: false });
        createFaqCategory({ name: categoryName })
            .then((res)=> this.setState({newCategories: [...newCategories, res.data.data]}))            
    }

    handleOpenModal = () => {
        this.setState({ isModalOn: true })
    }

    handleCloseModal = () => {
        this.setState({ isModalOn: false, categoryName: "" })
    }

    render() { 
        const { categories, onCategoryClick, userInfo } = this.props;
        const { isModalOn, categoryName, newCategories } = this.state;
        const i18n = dict[this.props.lang];
       
        const updatedCategories = categories.concat(newCategories);
        const isAdmin = userInfo.data.role === 2

            return (
                <div className={styles.categoriesList}>
                    <div className={styles.categoriesList_title}>
                        <h3>Категория</h3>
                            {isAdmin && <button className={styles.categoriesList_titleButton} onClick={this.handleOpenModal}>+</button>}
                        </div>
                    <ul>
                        {Boolean(updatedCategories.length) && updatedCategories.map((item) => {
                            return <li className={styles.categoriesList_item} key={item.id} onClick={() => onCategoryClick(item)}>
                                <button className={styles.categoriesList_button} >{item.name} </button>
                            </li>
                        })}
                    </ul>


                    {isModalOn && <Modal onCancel={this.handleCloseModal} onAdd={this.handleAddCategory}>
                        <div className={styles.inputWrapper}>
                            <InputProfile
                                meta={{}}
                                input={{
                                    name: "categoryName",
                                    onChange: this.createCategoryName,
                                }}
                                val={categoryName}
                                remote={true}
                                placeholder={i18n["faq.modal.name"]}
                                cls={styles.faq_input} />
                        </div>
                    </Modal>}
                </div>)
}}

export const CategoriesList = connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoriesListBlock);