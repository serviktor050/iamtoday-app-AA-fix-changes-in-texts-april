import React, { Component } from "react";
import { connect } from "react-redux";
import { TreeItem } from "../../../TreeItem";
import { dict } from "dict";
import styles from "./styles.css";
import { SecondLevelTree } from "../SecondLevelTree";
import { getMlmStatisticDataWithTree, set1LevelUsers } from '../../../../../ducks';
import { ShowMoreButton } from "../../../ShowMoreButton";

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = state => ({
      lang: state.lang, 
      statistic: state.mlm.mlmStatisticTree, 
      level1Users: state.mlm.level1Users, 
      userMlmInfo: state.userInfo.data.mlmUserInfo 
     });


class FirstLevelTreeContainer extends Component {
    state = {
        users: [],
        avatars: []
    }
    componentDidMount() {
        this.getLevel1Users(8)
    }

    async getLevel1Users(take) {
        const { dispatch } = this.props
        await dispatch(getMlmStatisticDataWithTree({ take: take }));
        await dispatch(set1LevelUsers());
        const { level1Users } = this.props;
         this.setState({
            users: level1Users.slice(0, 5),
            avatars: level1Users.slice(5, 8)
        })
    }

    handleMoreButton = () => this.getLevel1Users()

    checkHasMoreUsers = () => this.props.userMlmInfo.partnersLevel1All - this.props.level1Users.length > 0

    getMoreUsersNumber = () => this.props.userMlmInfo.partnersLevel1All - this.props.level1Users.length

    render() {
        const { level1Users } = this.props;
        const i18n = dict[this.props.lang];

        return (
            <div className={styles.block}>
                {level1Users && level1Users.map(user => {
                    let hasChildren = Boolean(user.childUsers.length)
                    return (
                        <div className={styles.treeBlock} key={user.id}>                            
                            <TreeItem
                                avatar={user.photo}
                                lastName={user.lastName}
                                firstName={user.firstName}
                                middleName={user.middleName}
                                country={user.country}
                                city={user.city}
                            />                                                          
                                {hasChildren && <SecondLevelTree childUsers={user.childUsers} />}
                        </div>)
                }
                )}
                {level1Users && this.checkHasMoreUsers() &&
                    <ShowMoreButton
                        users={this.state.avatars}
                        onMoreButton={this.handleMoreButton}
                        usersNumber={this.getMoreUsersNumber()} />
                }
            </div>)

    }
}

export const FirstLevelTree = connect(
    mapStateToProps,
    mapDispatchToProps
)(FirstLevelTreeContainer);