import React from "react";
import {dict} from 'dict';
import * as R from "ramda";
import TabsNavStyles from 'components/common/TabsNav/styles.css'

export const TAB_NAMES = {
    ADDITIONAL_MATERIALS:'Additional materials',
    NOTES:'Notes',
    DESCRIPTION:'Description',
    EXERCISES: 'exercises',
    QUESTIONS: 'Questions',
};

export const TABS = [
    {
        name: TAB_NAMES.DESCRIPTION,
        icon: "align-left",
        order: 1,
    },
    {
        name: TAB_NAMES.ADDITIONAL_MATERIALS,
        icon: "alert-triangle",
        order: 2,
    },
    {
        name: TAB_NAMES.NOTES,
        icon: "book",
        order: 3,
    },
    {
        name: TAB_NAMES.QUESTIONS,
        icon: 'ico-question',
        order: 4,
    },
    {
        name: TAB_NAMES.EXERCISES,
        icon: "video",
        order: 5,
    }
];


const isAdditionalMaterialsTab = item => TAB_NAMES.ADDITIONAL_MATERIALS === item.name;
const isExercisesTab = item => TAB_NAMES.EXERCISES === item.name;
const isQuestions = item => TAB_NAMES.QUESTIONS === item.name;

const isAdditionalMaterialsAreNotEmpty = (exercise) => !!R.path(['data', 'additionalMaterials'], exercise)

const getSvgObject = (item, label) => {
    return <div title={label}>
        <svg className={TabsNavStyles.inlineSvgIcon}><use xlinkHref={`#${item.icon}`}/></svg>
    </div>
}

export const getTabLabel = (item, lang, mobile) => {
    const label = dict[lang][`lecture.tabs.${item.name}`] || item.name;
    if (mobile) {
        return getSvgObject(item, label)
    }
    return label
};

export const getPreferSelectedTabName = (matches, tabs, selectedTab, isPlaylist) => {
    const defaultSelection = isPlaylist || matches.desktop ? TAB_NAMES.DESCRIPTION : TAB_NAMES.EXERCISES;
    let resultTabName = (matches.desktop && selectedTab === TAB_NAMES.EXERCISES
        ? TAB_NAMES.DESCRIPTION
        : selectedTab) || defaultSelection;

    resultTabName = tabs.map(t => t.name).indexOf(resultTabName) >= 0
        ? resultTabName
        : TAB_NAMES.DESCRIPTION;

    return resultTabName
}

export const getTabs = (playlist, lang, mobile) => {
    return TABS
        .filter(item =>
            (!isAdditionalMaterialsTab(item) && !isExercisesTab(item) )
            || (isAdditionalMaterialsTab(item) && isAdditionalMaterialsAreNotEmpty(playlist))
            || (isExercisesTab(item) && mobile && R.path(['data', 'videos'], playlist) && playlist.data.videos.length ? !!playlist.data.videos.length : false))
        .filter(item => isQuestions(item) ? R.path(['data', 'isPaid'], playlist) : true)
        .map(item=> { return {...item, label: getTabLabel(item, lang, mobile)}})
        ;
};