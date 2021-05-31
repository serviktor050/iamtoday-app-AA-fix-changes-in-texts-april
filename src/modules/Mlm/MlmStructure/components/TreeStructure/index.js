import React, { Component } from "react";
import { connect } from "react-redux";
import { getMlmStatisticDataWithTree } from "../../../ducks";
import { TreeSummary } from "./components/TreeSummary";
import Loader from '../../../../../components/componentKit/Loader';
import { dict } from "dict";
import styles from "./styles.css";
import { FirstLevelTree } from "./components/FirstLevelTree";


const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = state => ({ lang: state.lang, userInfo: state.userInfo });

const TAKE = 13;
class TreeStructureComponent extends Component {


    render() {
        const { userInfo, lang } = this.props;
        const i18n = dict[lang];
        

        return (
            <div>
                {userInfo ? <TreeSummary userInfo={userInfo} /> : <Loader />}
                {userInfo && <div className={styles.line}></div>}
                    <div className={styles.firstLevelBlock}>
                        <p className={styles.firstLevelTitle}>{i18n["mlm.mlmStructure.partners1Level"]}</p>
                        <p>{userInfo.data.mlmUserInfo.partnersLevel1All}</p>
                    </div>
                <FirstLevelTree /> 
            </div>
        )}
    }

export const TreeStructure = connect(
    mapStateToProps,
    mapDispatchToProps
)(TreeStructureComponent);