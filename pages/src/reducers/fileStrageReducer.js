import * as types from '../actions/actionTypes';

const initialState = {
    items: [],
    selected: [],
    openArchives: [],
    thumbDialog: {
        open: false,
        imagePath: null
    },
    disableDownload: true,
    disableDelete: true,
    isSearching: true,
    openDeleteDialog: false,
    searchState: {
        hasNext: true,
        offsetKey: null,
        keywords: null
    },
    snackBarState: {
        open: false,
        message: "",
        vertical: "bottom",
        horizontal: "left"
    },
    searchCondition: {
        open: false,
        anchor: null,
        selectUsers: []
    },
    storageStatus: {
        useRate: 0,
        capacity: 0,
        totalSize: 0,
        state: "allow"
    },
    users: [],
    sort: {
        name: "latest",
        order: "desc"
    },
};

export default function (state = initialState, action) {
    switch (action.type) {

        case types.CLEAR_ITEMS:
            return {
                ...state,
                items: [],
                searchState: {
                    hasNext: true,
                    offsetKey: null,
                    keywords: state.searchState.keywords
                },
                isSearching: true
            }

        case types.FETCH_FILES:
            var items = action.payload.Items;
            if (state.searchState.offsetKey) {
                items = Array.concat(state.items, action.payload.Items);
            }
            return {
                ...state,
                items: items,
                searchState: {
                    hasNext: action.payload.hasNext,
                    offsetKey: action.payload.offsetKey,
                    keywords: action.keywords
                },
                isSearching: false,
                storageStatus: action.storageStatus
            };
        case types.SET_SEARCHING_STATE:
            return {
                ...state,
                isSearching: action.searching
            }
        case types.SELECT_ROW:

            var disabled = true;
            if (state.selected.filter((item) => { return action.selectRow == item }).length > 0) {
                state.selected = [];

            } else {
                state.selected = [];
                state.selected.push(action.selectRow);
                disabled = false;
            }
            return {
                ...state,
                selected: state.selected,
                disableDownload: disabled,
                disableDelete: disabled
            };

        case types.SHOW_ARCHIVES:
            var res = Object.assign(new Array(), state.openArchives);
            var exludeList = state.openArchives.filter((item) => { return action.archiveRow.filepath != item.filepath });
            if (exludeList.length == state.openArchives.length) {
                res.push(action.archiveRow);
            } else {
                res = exludeList;
            }
            return {
                ...state,
                openArchives: res
            };

        case types.SHOW_THUMBNAIL:
            return {
                ...state,
                thumbDialog: {
                    open: action.isShow,
                    imagePath: action.imagePath
                }
            }

        case types.SHOW_DELETE_DIALOG:
            return {
                ...state,
                openDeleteDialog: action.isShow
            }

        case types.SHOW_SEARCH_CONDITION:
            return {
                ...state,
                searchCondition: {
                    open: action.searchCondition.open,
                    anchor: action.searchCondition.anchor,
                    selectUsers: state.searchCondition.selectUsers
                }
            }

        case types.SHOW_SNACK_BAR:
            return {
                ...state,
                snackBarState: action.snackBarState
            }
        case types.SORT_CHANGE:
            return {
                ...state,
                sort: action.sort,
                searchState: {
                    hasNext: true,
                    offsetKey: null,
                    keywords: state.searchState.keywords
                },
                items: [],
                isSearching: true
            }
        case types.SET_CONDITION_USER:
            var selectUsers = Array.concat([], state.searchCondition.selectUsers);
            var index = selectUsers.indexOf(action.username);
            if (index >= 0) {
                selectUsers.splice(index, 1);
            } else {
                selectUsers.push(action.username);
            }

            return {
                ...state,
                searchCondition: {
                    open: state.searchCondition.open,
                    anchor: state.searchCondition.anchor,
                    selectUsers: selectUsers
                }
            }

        case types.ALL_ADD_CONDITION_USER:
            return {
                ...state,
                searchCondition: {
                    open: state.searchCondition.open,
                    anchor: state.searchCondition.anchor,
                    selectUsers: state.users
                }
            }

        case types.ALL_REMOVE_CONDITION_USER:
            return {
                ...state,
                searchCondition: {
                    open: state.searchCondition.open,
                    anchor: state.searchCondition.anchor,
                    selectUsers: []
                }
            }
        case types.SET_USERS:
            var users = action.users ? action.users : [];
            return {
                ...state,
                users: users
            }
        case types.DELETE_FILES:
            //選択しているアイテムの削除
            var selected = Array.concat([], state.selected);
            var selectedIndex = selected.findIndex(x => { return x.key == action.deleteItem.key });
            var disabledDownloadAndDelete = false;
            if (selectedIndex >= 0) {
                selected.splice(selectedIndex, 1);
                disabledDownloadAndDelete = true;
            }

            //一覧から削除
            var items = Array.concat([], state.items);
            var deleteKey = action.deleteItem.latest ? action.deleteItem.key : action.deleteItem.parentKey;
            var deleteItemIndex = items.findIndex(x => { return x.key == deleteKey });
            if (deleteItemIndex >= 0) {

                if (action.deleteItem.latest) {
                    items.splice(deleteItemIndex, 1);
                } else {
                    var deleteItem = items[deleteItemIndex];
                    var deleteVersionIndex = deleteItem.version.findIndex(x => { return x.key = action.deleteItem.key });
                    if (deleteVersionIndex >= 0) {
                        deleteItem.version.splice(deleteVersionIndex, 1);
                    }
                }
            }


            return {
                ...state,
                snackBarState: {
                    open: true,
                    message: "「" + action.deleteItem.filename + "」を削除しました",
                    vertical: "bottom",
                    horizontal: "left"
                },
                selected: selected,
                items: items,
                storageStatus: action.storageStatus,
                disableDownload: disabledDownloadAndDelete,
                disableDelete: disabledDownloadAndDelete
            }
        case types.GET_STORAGE_STATES:
            return {
                ...state,
                storageStatus: action.storageStatus
            }

        case types.CLEAR_SEARCH_CONDITIONS:
            return {
                ...state,
                searchCondition: {
                    open: false,
                    anchor: null,
                    selectUsers: []
                },
                searchState: {
                    hasNext: true,
                    offsetKey: null,
                    keywords: null
                },
                isSearching: true,
                items: [],
                selected: [],
                openArchives: [],
                disableDownload: true,
                disableDelete: true
            }
        default:
            return state;
    }
}
