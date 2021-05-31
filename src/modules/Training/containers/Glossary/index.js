import React, { Component } from "react";
import { dict } from "dict"
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import Loader from '../../../../components/componentKit/Loader';
import { SearchInput } from "../../../../components/common/SearchInput";
import { getGlossaryByLetter, getGlossaryById, glossarySearch } from "../../../../utils/api";
import { russianAlphabet } from "../../../../utils/data";
import styles from "./style.css"

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = state => ({ lang: state.lang });


class Glossary extends Component {

    state = {
        filter: "",
        filterByLetter: "А",
        categoriesList: [], 
        categoryId: 14,       
        singleCategory: "",
        filteredCategories: [],
        isListLoaded: false,
        isSingleCategoryLoaded: false,
        isCategoriesFiltered: false,
    }

    componentDidMount() {
        const { filterByLetter, categoryId } = this.state;

        getGlossaryByLetter({ nameRu: filterByLetter })
        .then((res) => this.setState({ 
            categoriesList: res.data.data[0].glossaries, 
            isListLoaded: true }));

        getGlossaryById ({ id: categoryId })
        .then((res) => this.setState({ 
            singleCategory: res.data.data, 
            isSingleCategoryLoaded: true }));
    }


    handleFilterChange = (e) => {
        const newFilter = e.target.value;
        this.setState({ filter: newFilter })

        glossarySearch({ nameRu: newFilter })
        .then((res) => {
            this.setState({
                filteredCategories: res.data.data, 
                isCategoriesFiltered: true});
            this.getCategoryDescription(res.data.data[0].glossaries[0].id);
            })
    };

    handleFilterEnter = (e) => { };

    handleAlphabetButton = (letter) => { 
        this.setState({filterByLetter: letter})

        getGlossaryByLetter({ nameRu: letter })
        .then((res) => {
            this.setState({
                categoriesList: res.data.data[0].glossaries, 
                categoryId: res.data.data[0].glossaries[0].id});
            this.getCategoryDescription(res.data.data[0].glossaries[0].id)
            })
    };

    getCategoryDescription = (id) => {
        getGlossaryById ({ id:  id})
        .then((res) => this.setState({singleCategory: res.data.data})) 
    }

    handleChosenCategory = (id) => {
        this.setState({categoryId: id})

        getGlossaryById ({ id: id })
        .then((res) => this.setState({singleCategory: res.data.data}))
    }

    render() {
        const { filter, isListLoaded, isSingleCategoryLoaded, isCategoriesFiltered, filterByLetter } = this.state;
        const i18n = dict[this.props.lang];

        
        return (
            <div>
                <SearchInput value={filter} placeholder={i18n["glossary.searchFilter"]} onFilterChange={this.handleFilterChange} onFilterEnter={this.handleFilterEnter} />
                <div className={styles.alphabetButtonsRow}>{this.renderAlphabetButtons()}</div>
                <div className={styles.glossariesBlock}>
                    <div className={styles.glossariesLetter}>{filterByLetter}</div>
                    {isCategoriesFiltered ? this.renderFilteredCategoriesList(): null}
                    {!isCategoriesFiltered && isListLoaded ? this.renderCategoriesList(): null}
                    {isSingleCategoryLoaded ? this.renderCategoryDescription(): <Loader />}                
                </div>            
            </div>
        )
    }

    renderAlphabetButtons = () => {
        return (russianAlphabet.map(item => { 
            return  <button className={styles.alphabetButton} onClick={()=>this.handleAlphabetButton(item)} key={item}>
                            <p>{item}</p>
                    </button>           
         }
      ))
    }

    renderCategoriesList = () => {
        const { categoriesList } = this.state
        return (
            <ul className={styles.glossariesBlock_list} >
                {Boolean(categoriesList.length) && categoriesList.map(item => { 
                    return  (
                                <li key={item.id} className={styles.glossariesBlock_listItem}>
                                    <button className={styles.glossariesBlock_listItemButton} onClick={()=>this.handleChosenCategory(item.id)}>{item.nameRu}</button>
                                </li> 
                    )
                })}
            </ul>)
    }

    renderFilteredCategoriesList = () => {
        const {filteredCategories} = this.state
        return (
             <ul className={styles.glossariesBlock_list}>
                {filteredCategories.map(item=> {
                    return (
                    <li key={item.id}>
                        {item.letter}
                        {item.glossaries.map(subItem=> {
                            return (<li>{subItem.nameRu}</li>)
                            })}
                    </li>
                )})}
            </ul>
            )
    }

    renderCategoryDescription = () => {
        const { singleCategory } = this.state
        return (<div className={styles.glossariesBlock_description}>
                    <div className={styles.glossariesBlock_quotes}></div>
                    <h2>{singleCategory ? singleCategory.nameRu : ""}</h2>
                    <p className={styles.glossariesBlock}>{singleCategory ? singleCategory.description : "no description was provided"}</p>
                </div>)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Glossary));