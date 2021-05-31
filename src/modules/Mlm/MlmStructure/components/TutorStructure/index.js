import React, { Component } from "react";
import { connect } from "react-redux";
import Loader from '../../../../../components/componentKit/Loader';
import { dict } from "dict";
import styles from "./styles.css";
import { getMlmStatisticDataWithTree} from "../../../ducks";
import { FirstLevelTutors } from "./components/FirstLevelTutors";
import { SecondLevelTutors } from "./components/SecondLevelTutors";


const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = state => ({ lang: state.lang, userInfo: state.userInfo.data.mlmUserInfo });

class TutorStructureComponent extends Component {

  
    render() {
        const { userInfo, lang } = this.props;
        const i18n = dict[lang];        

        return (
            <div>                
                  { userInfo && userInfo.childLevel === 1 && <FirstLevelTutors /> }
                  { userInfo && userInfo.childLevel === 2 && <SecondLevelTutors />}
                  { userInfo && userInfo.childLevel == null && <div>No design for you yet</div>}
            </div>
        )}
    }

export const TutorStructure = connect(
    mapStateToProps,
    mapDispatchToProps
)(TutorStructureComponent);