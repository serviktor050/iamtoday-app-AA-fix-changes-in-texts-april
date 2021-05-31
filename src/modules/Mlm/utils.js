import { dict } from "../../dict";
import moment from "moment";
import { pluralize } from "../../utils/helpers";
import React from "react";

export const TAB_NAMES = {
  STRUCTURE_TABLE: "Structure Table",
  STRUCTURE_TREE: "Structure Tree",
};

export const structureTabs = [
  {
    name: "tableView",
    label: "Табличный вариант просмотра",
    icon: "table-view",
    inactiveIcon: "table-view-inactive",
  },
  {
    name: "treeView",
    label: "Вариант просмотра дерево",
    icon: "tree-view",
    inactiveIcon: "tree-view-inactive",
  },
  {
    name: "tutorView",
    label: "Мои наставники",
    icon: "tutor-view",
    inactiveIcon: "tutor-view-inactive"
  },
];

export const pluralizeScores = (scores, lang) => {
  const i18n = dict[lang];
  scores = scores || 0;
  return `${scores.toFixed(2)} ${pluralize(scores, [
    i18n["scores.text.1"],
    i18n["scores.text.2"],
    i18n["scores.text.3"],
  ])}`;
};

export const dateFormatter = (date, lang) => {
  const i18n = dict[lang];
  return moment(date).format(i18n["date.format.dayWithMonth"]);
};

export const hiddenOverflow = () => {
  if (
    document &&
    document.body &&
    document.body.style &&
    document.body.style.overflow !== "hidden"
  ) {
    document.body.style.overflow = "hidden";
  }
};

export const unsetOverflow = (isOpen) => {
  if (
    isOpen &&
    document &&
    document.body &&
    document.body.style &&
    document.body.style.overflow === "hidden"
  ) {
    document.body.style.overflow = "unset";
  }
};

export function getFIO(lastName, firstName, middleName) {
  let fio = lastName ? `${lastName} ` : "";
  if (firstName) {
    fio += firstName.slice(0, 1) + ".";
  }
  if (middleName) {
    fio += middleName.slice(0, 1) + ".";
  }
  return fio;
}

export const pluralizePeople = (people, lang) => {
  const i18n = dict[lang];

  if (people < 4 && people !== 1) {
    return i18n["people.text.2"]
  } else {
    return i18n["people.text.1"]
  }
};


export const getFlag = (country, style) => {
  const validatedCountry = country ? country.replace(/\s+/g, "").toLowerCase() : "default";

  const flags = {
    "россия": "#russia",
    "абхазия": "#abkhazia",
    "default": " "
  }

  return (
    <svg className={style}>
        <use xlinkHref={flags[validatedCountry]} />
    </svg>
  )
}
