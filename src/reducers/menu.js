const initialState = [
  {
    id: "lektoriy",
    name: "menu.lektoriy",
    active: true,
    link: "trainings",
    icon: "lektoriy",
    subItems: [
      {
        id: 'trainings',
        name: 'menu.trainings',
        active: true,
        link: 'trainings',
      },
      // {
      //   id: "quiz",
      //   name: "menu.quiz",
      //   active: false,
      //   disabled: true,
      //   link: "quiz",
      // },
      {
        id: "purchases",
        name: "menu.purchases",
        active: false,
        link: "purchases",
      },
    ],
  },
  {
    id: "mlm",
    name: "menu.mlm",
    active: true,
    link: "mlm",
    icon: "ico-m-book",
    subItems: [
      {
        id: "mlm-summary",
        name: "menu.mlmSummary",
        active: true,
        link: "mlm",
      },
      {
        id: "mlm-structure",
        name: "menu.mlmStructure",
        active: true,
        link: "mlm/structure",
      },
      {
        id: "mlm-registration",
        name: "menu.mlmRegistration",
        active: true,
        link: "mlm/registration",
      },
      {
        id: "mlm-history",
        name: "menu.mlmHistory",
        active: true,
        link: 'mlm/history',
      },
      {
        id: 'mlm-points-purchase',
        name: 'menu.mlmPoitsPurchase',
        active: true,
        link: 'mlm/points-purchase',
      },
      {
        id: 'mlm-points-withdrawal',
        name: 'menu.mlmPoitsWithdrawal',
        active: true,
        link: 'mlm/points-withdrawal',
      },
    ],
  },
  {
    id: 'virtual-pharmacy',
    name: 'menu.virtual-pharmacy',
    active: true,
    link: 'shop',
    icon: 'ico-vacine',
    subItems: [
      {
        id: 'virtual-shop',
        name: 'menu.virtual-shop',
        active: true,
        link: 'shop',
      },
      {
        id: "orders-history",
        name: "menu.mlmOrdersHistory",
        active: true,
        link: "orders-history",
      },
    ]
  },
  // {
  //   id: "ratings",
  //   name: "menu.raitings",
  //   active: false,
  //   link: "ratings",
  //   icon: "ico-ratings",
  // },
  {
    id: "chats",
    name: "menu.chat",
    active: false,
    link: "chats",
    icon: "ico-chat",
  },
  {
    id: "salesReport",
    name: "menu.salesReport",
    active: false,
    link: "reports",
    icon: "ico-ratings",
  },
  {
    id: "news",
    name: "menu.news",
    active: false,
    link: "smm",
    icon: "ico-msg",
  },
  // {
  //   name: 'Питание',
  //   active: false,
  //   link: 'food',
  //   icon: 'ico-m-food'
  // },
  {
    id: 'calendar',
    name: 'menu.calendar',
    active: false,
    link: 'calendar',
    icon: 'calendar',
  },
  {
    id: "faq",
    name: "menu.faq",
    active: false,
    link: "faq",
    icon: "ico-m-faq",
  },
  // {
  //   name: 'Фото',
  //   active: false,
  //   link: 'photos',
  //   icon: 'ico-photo'
  // },
  /*{
		name: 'Сезоны',
		active: false,
		link: 'seasons',
		icon: 'ico-calendar'
	},*/
  /*  {
    name: 'Партнеры',
    active: false,
    link: 'partners',
    icon: 'ico-users'
  },
  {
    name: 'Сезоны',
    active: false,
    link: 'seasons',
    icon: 'ico-calendar'
  },*/
];

export const menuList = (state = initialState, action) => {
  switch (action.type) {
    case "SET_MENU_LIST":
      return state.map((item) => {
        item.active =
          action &&
          action.page &&
          (item.id === action.page ||
            (item.subItems && action.page.indexOf(item.id) === 0));
        item.page = action.page;
        return item;
      });
    case "SET_ADMIN_MENU_LIST":
      return (state = action.menu);
    default:
      return state;
  }
};

const initialStatusState = {
  isLoaded: false,
  spaceLeft: null,
  isEnoughSpace: false,
}

export const menuStatus = (state = initialStatusState, action) => {
  switch (action.type) {
    case "MENU_LOADED":
      if (!state.isLoaded) {
        return {
          ...state,
          isLoaded: true,
        }
      }
      return state
    case "MENU_UNLOADED":
      if (state.isLoaded) {
        return {
          ...state,
          isLoaded: false,
        }
      }
      return state
    case 'SET_SPACE_LEFT':
      return {
        ...state,
        spaceLeft: action.data,
      }
    case 'IS_ENOUGH_SPACE':
      return {
        ...state,
        isEnoughSpace: action.data,
      }
    default:
      return state
  }
}