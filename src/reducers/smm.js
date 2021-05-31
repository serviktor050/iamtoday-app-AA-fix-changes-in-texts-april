import {
  RECIEVE_SMM_POSTS,
  ERROR_SMM_POSTS,
  REQ_SMM_POSTS,
	SET_LIKE_TO_POST,
	SET_ERROR_SMM,
	REQ_SMM_LIKE
} from '../actions'

const take = 6

const initialState = {
  posts: [],
  isError: false,
  isLoad: false,
  isLoading: false,
	isLoadingLike: false,
  counter:null,
  skip:{
    auth: 0,
    notAuth: 0
  },
  take:take
}

export const smm = (state = initialState, action) => {
  switch (action.type) {
		case REQ_SMM_LIKE:
			return {
				...state,
				isLoadingLike: true
			}
    case SET_LIKE_TO_POST: {
			const posts = state.posts.map((post) => {
				if (post.id === action.id) {
					return {
						...post,
						liked: !action.unlike,
						likes: !action.unlike ? post.likes + 1 : post.likes - 1
					}
				}
				return post;
			})
			return {
				...state,
				posts: posts,
				isLoadingLike: false,
			}
		}
		case SET_ERROR_SMM:
			return {
				...state,
				isLoadingLike: false,
				isError: true,
			}
    case REQ_SMM_POSTS:
      return {
        ...state,
        isLoading: true,
        isLoad: false,
				isError: false,
      }
    case 'SET_SMM_SKIP':
      return {
        ...state,
        skip: {
          ...state.skip,
          [action.field]: action.data
        }
      };
    case RECIEVE_SMM_POSTS:
      const posts = action.merge ? state.posts.concat(action.data): action.data;
      return {
        ...state,
        isLoading: false,
        isError: false,
        isLoad:true,
        posts: posts,
        counter: action.counter,
      }
    case ERROR_SMM_POSTS:
      return {
        ...state,
        isLoading: false,
        isError: true,
        isLoad:true
      }

    default:
      return state
  }
}

