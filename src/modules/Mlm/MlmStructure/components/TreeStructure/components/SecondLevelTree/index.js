import React, { Component } from "react";
import { connect } from "react-redux";
import { TreeItem } from "../../../TreeItem";
import { dict } from "dict";
import styles from "./styles.css";
import { ShowMoreButton } from "../../../ShowMoreButton";

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = state => ({ lang: state.lang, userMlmInfo: state.userInfo.data.mlmUserInfo });


class SecondLevelTreeContainer extends Component {

    state = { 
        isExpanded: false,
        users: [],
        avatars: []
    }

    componentDidMount() {
        const { childUsers } = this.props;
        this.setState({
            users: childUsers.slice(0,4),
            avatars: childUsers.slice(4,8)
        })
        }

    handleMoreButton = () => this.setState({users: this.props.childUsers})

    checkHasMoreChildren = () => this.props.userMlmInfo.partnersLevel2All - this.state.users.length > 0

    getMoreChildrenNumber = () => this.props.childUsers.length - this.state.users.length
    
    render() {

        const i18n = dict[this.props.lang];
        const { isExpanded, users, avatars } = this.state;

        return (
            <div className={styles.treeWrapper}>                
                <div className={styles.secondLevelBlock} onClick={() => this.setState({ isExpanded: !isExpanded })}>
                    <p className={styles.secondLevelTitle}>{i18n["mlm.mlmStructure.partners2Level"]}</p>
                    <div className={styles.secondLevelUsers}>
                        <p>{this.props.childUsers.length}</p>
                        <span className={isExpanded ? styles.chevronUp : styles.chevronDown}></span>
                    </div>
                </div>

                {isExpanded && users.map(child => <TreeItem key={child.id}
                    avatar={child.photo}
                    lastName={child.lastName}
                    firstName={child.firstName}
                    middleName={child.middleName}
                    country={child.country}
                    city={child.city} />)}


                {isExpanded && this.checkHasMoreChildren() && this.getMoreChildrenNumber() > 0 &&
                    <ShowMoreButton
                        users={avatars}
                        onMoreButton={this.handleMoreButton}
                        usersNumber={this.getMoreChildrenNumber()} />
                }

            </div>
        )
    }
}

export const SecondLevelTree = connect(
    mapStateToProps,
    mapDispatchToProps
)(SecondLevelTreeContainer);