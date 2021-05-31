import React, { Component } from "react";
import { connect } from 'react-redux';
import { dict } from "dict";
import styles from "./style.css";
import { getFaqPopularTags } from "../../../../utils/api";

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = ({ lang }) => ({ lang });

class TagsListBlock extends Component {
    
    state = {
        popularTagsList: []
    }

    componentDidMount() {
        getFaqPopularTags().then((res) => this.setState({ popularTagsList: res.data.data, take: 10 }))
    }

    handleMoreTagsClick = () => {
        getFaqPopularTags().then((res) => this.setState({ popularTagsList: res.data.data }))
    }

    render() {
        const { popularTagsList } = this.state;
        const { onTagClick } = this.props;
        const i18n = dict[this.props.lang];

        return (
            <div className={styles.tagsList}>
                {Boolean(popularTagsList.length) 
                ? popularTagsList.map(i => (<button className={styles.tag} onClick={() => onTagClick(i)} key={i.id}> # {i.name} </button>)) 
                : <button className={styles.noTag}>Тегов нет</button>            
                }
                {popularTagsList.length === 10 && <button className={styles.moreTagButton} onClick={this.handleMoreTagsClick}>
                    {i18n["faq.tags.showMore"]}
                    <span></span>
                </button>}
            </div>
        )
    }
}

export const TagsList = connect(
    mapStateToProps,
    mapDispatchToProps
)(TagsListBlock);