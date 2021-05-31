import React, { Component } from "react";
import { connect } from "react-redux";
import { dict } from "dict";
import styles from "./styles.css";
import classNames from "classnames/bind";
import { getMlmStatisticMyGroup } from "../../../../../ducks";
import { TreeItem } from "../../../TreeItem";
import { TreeItemMe } from "../TreeItemMe";
import { ShowMoreButton } from "../../../ShowMoreButton";
import { ShowLessButton } from "../../../ShowLessButton";

const cx = classNames.bind(styles);

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = state => ({
      lang: state.lang, 
      statistic: state.mlm.mlmStatistic, 
      myGroup: state.mlm.mlmStatisticMyGroup,
      userInfo: state.userInfo      
     });


class MyGroupContainer extends Component {
    
    state = {
        avatars: [],
        users:  [],
        isExpanded: false,
    }
    componentDidMount() {
        const { dispatch, statistic } = this.props;
        dispatch(getMlmStatisticMyGroup({take: 10, id: statistic.data.parentUserInfo.id}))
    }

    isDataFetched = () => this.props.myGroup && this.props.myGroup.data;

    checkHasMoreUsers = () => this.isDataFetched() && this.props.myGroup.data.users.length <= 10
    
    getMoreUsersNumber =  () => this.props.myGroup.itemsCounter - 6

    handleShowGroup = () => this.setState({isExpanded: !this.state.isExpanded})

    handleMoreButton = () => {
        const { dispatch, statistic } = this.props;
        dispatch(getMlmStatisticMyGroup({id: statistic.data.parentUserInfo.id}))
    }

    handleLessButton = () => { 
        const { dispatch, statistic } = this.props;
        dispatch(getMlmStatisticMyGroup({take: 10, id: statistic.data.parentUserInfo.id}))
    }
  
                
    render() {
        const { isExpanded } = this.state;
        const { myGroup, level, userInfo } = this.props;
        const i18n = dict[this.props.lang];
        
        const filteredList = this.isDataFetched() && myGroup.data.users.filter(user => user.id != userInfo.data.id)          
        

        return (
            <div>  
                {this.isDataFetched() && (
                            <div className={cx("groupBlock", level === 1 ? "firstLevelGroup" : "secondLevelGroup")} onClick={this.handleShowGroup}>                                
                                <p>{i18n["mlm.mlmStructure.myGroup"]}</p>
                                <div className={styles.groupBlock_users}>
                                    <p >{myGroup.data.itemsCounter}</p>
                                    <span className={isExpanded ? styles.chevronUp : styles.chevronDown}></span>
                                </div>
                            </div>)}                
               
                {isExpanded && <TreeItemMe level={level}/>}

                {this.isDataFetched() && isExpanded && this.checkHasMoreUsers() && (
                    <div className={styles.groupList}>{filteredList.slice(0,6).map(user => 
                        <div className={styles.treeBlock} key={user.id}>
                            <TreeItem 
                                avatar={user.photo}
                                lastName={user.lastName}
                                firstName={user.firstName}
                                middleName={user.middleName}
                                country={user.country}
                                city={user.city} 
                                />
                        </div>)}
                        <ShowMoreButton 
                            users={filteredList.slice(6,10)} 
                            onMoreButton={this.handleMoreButton}
                            usersNumber={this.getMoreUsersNumber()}
                            />                        
                    </div>
                    )}
                    
                {this.isDataFetched() && isExpanded && !this.checkHasMoreUsers() && (
                   <div className={styles.groupList}>{filteredList.map(user => {
                        return <div className={styles.treeBlock} key={user.id}>
                                    <TreeItem 
                                        id={user.id}
                                        avatar={user.photo}
                                        lastName={user.lastName}
                                        firstName={user.firstName}
                                        middleName={user.middleName}
                                        country={user.country}
                                        city={user.city} 
                                    />
                            </div>
                        })}
                        <ShowLessButton onLessButton={this.handleLessButton} />
                    </div>
                )}
     
            </div>
           )

    }
}

export const MyGroup = connect(
    mapStateToProps,
    mapDispatchToProps
)(MyGroupContainer);