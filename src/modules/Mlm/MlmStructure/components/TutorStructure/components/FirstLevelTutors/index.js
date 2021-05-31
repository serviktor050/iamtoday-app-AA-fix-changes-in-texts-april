import React from "react";
import { connect } from "react-redux";
import { dict } from "dict";
import styles from "./styles.css";
import { TutorBlock } from "../TutorBlock";
import { MyGroup } from "../MyGroup";
import Loader from "../../../../../../../components/componentKit/Loader";
import { isDataNotFetched } from "../../../../../../utils/utils";


const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = state => ({ 
    lang: state.lang,
    statistic: state.mlm.mlmStatistic, 
    myGroup: state.mlm.mlmStatisticMyGroup, });


export const FirstLevelTutors = connect(mapStateToProps, mapDispatchToProps)(({ ...props })  => {

        const { statistic, lang, myGroup } = props;
        const i18n = dict[lang];
        const parent = statistic && statistic.data.parentUserInfo
        

        return (
            <div className={styles.tutorsBlock}>                
                <TutorBlock 
                    level={1}
                    title={i18n["mlm.mlmStructure.myTutor"]}
                    avatar={parent.photo}
                    firstName={parent.firstName}
                    lastName={parent.lastName}
                    country={parent.country}
                    city={parent.city}
                /> 
                <div className={styles.line}/> 
                {isDataNotFetched(myGroup) && <Loader />}
                <MyGroup level={1} />                            
            </div>
        )}
)
