import React, { Component } from 'react';
import { connect } from "react-redux";
import { dict } from "../../dict";
import styles from "./style.css";
import { withRouter } from 'react-router';
import Layout from "components/componentKit2/Layout";
import AdminLayout from '../Admin/components/AdminLayout';
import { Header } from "components/common/Header";
import { SearchInput } from "components/common/SearchInput";
import { CategoriesList } from "./components/categoriesList";
import { TagsList } from "./components/tagsList";
import { getFaqCategory, getFaqQuestions } from "../../utils/api";
import { QuestionsList } from './components/questionsList';

const page = "faq";

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = state => ({ lang: state.lang });

class FAQ extends Component {

    state = {
        searchFilter: "",
        isModalOn: false,
        categoryName: "",
        categoriesList: [],
        chosenCategory: {},
        questionsList: [],
        totalQuestions: 0,
    }


    componentDidMount() {
        getFaqCategory()
            .then((res) => {
                this.setState({ categoriesList: res.data.data, chosenCategory: res.data.data[0] });
                this.getCategoryQuestions(res.data.data[0].id)
            })
    }

    getCategoryQuestions = (id) => {
        getFaqQuestions({ categoryId: id })
            .then((res) =>
                this.setState({ questionsList: res.data.data, totalQuestions: res.data.itemsCounter }))
    }

    handleFilterChange = (e) => {
        const newSearchFilter = e.target.value;
        this.setState({ searchFilter: newSearchFilter });
        
        getFaqCategory({ question: newSearchFilter })
            .then((res) => {
                this.setState({ categoriesList: res.data.data});
                this.getCategoryQuestions(res.data.data[0].id)})
        //getFaqQuestions({ question: newSearchFilter }).then((res) => this.setState({ questionsList: res.data.data, totalQuestions: res.data.itemsCounter }))
    };

    handleTagFilter = (tag) => {
        getFaqCategory({ tags: [tag] })
            .then((res) => {
                this.setState({ categoriesList: res.data.data});
                this.getCategoryQuestions(res.data.data[0].id)})
        //getFaqQuestions({ tags: [tag] }).then((res) => this.setState({ questionsList: res.data.data, totalQuestions: res.data.itemsCounter }))
    }

    handleOnCategoryClick = (category) => {
        this.getCategoryQuestions(category.id)
        this.setState({ chosenCategory: category })
    }   
    

    render() {
        const {
            searchFilter,            
            categoriesList,
            chosenCategory,
            questionsList,
            totalQuestions,
        } = this.state;
        const { lang } = this.props;
        const i18n = dict[lang];
       

        return (
            <AdminLayout page={page} location={location} buy={true}>
                <div className={styles.faqComponent}>
                    <Header
                        title={i18n["breadcrumb.faq"]}
                        items={[i18n["breadcrumb.main"], i18n["breadcrumb.faq"]]}
                        links={["/", "/faq"]}
                        isHr={false} />
                    <SearchInput
                        value={searchFilter}
                        placeholder={i18n["fag.filter.placeholder"]}
                        onFilterChange={this.handleFilterChange} />
                    <h3> {i18n["faq.popularTags"]} </h3>
                    <div>
                        <TagsList onTagClick={this.handleTagFilter} />
                    </div>
                    <div className={styles.faqBlock}>
                        <CategoriesList                                
                                categories={categoriesList}
                                onCategoryClick={this.handleOnCategoryClick}
                            />
                        {Boolean(questionsList.length) && 
                        <QuestionsList
                            category={chosenCategory}
                            questions={questionsList}
                            questionsNumber={totalQuestions}
                        />}
                    </div>                    
                </div>
            </AdminLayout>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FAQ));