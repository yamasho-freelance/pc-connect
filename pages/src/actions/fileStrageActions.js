import * as types from './actionTypes';
import madoriApi from './../api/madoriApi';
import * as utils from './../utils/convert-util'

const madoriApiClient = new madoriApi(utils.getUserid(), utils.getHashUserid());

export const fetchFiles = (keywords, users, sort, order, offsetKey) => async (dispatch) => {

  var res = await madoriApiClient.searchFiles(utils.getUserid(), keywords, users, sort, order, offsetKey);

  var status = await madoriApiClient.getStrageStatus(utils.getUserid()).catch(err => {
    console.log(err);
  });
  dispatch({
    type: types.FETCH_FILES,
    payload: res,
    keywords: keywords,
    storageStatus: status
  });

};

export const clearItems = () => dispatch => {
  dispatch({
    type: types.CLEAR_ITEMS
  });
}

export const searching = (searching) => dispatch => {
  dispatch({
    type: types.SET_SEARCHING_STATE,
    searching: searching
  });
}

export const selectRow = (selectrow) => dispatch => {
  dispatch({
    type: types.SELECT_ROW,
    selectRow: selectrow
  });
}

export const showArchives = (archiveRow) => dispatch => {
  dispatch({
    type: types.SHOW_ARCHIVES,
    archiveRow: archiveRow
  });
}

export const showThumbnail = (isShow, imagePath) => dispatch => {
  dispatch({
    type: types.SHOW_THUMBNAIL,
    isShow: isShow,
    imagePath: imagePath
  });
}

export const showDeleteDialog = (isShow) => dispatch => {
  dispatch({
    type: types.SHOW_DELETE_DIALOG,
    isShow: isShow
  });
}

export const showSearchCondition = (open, anchor) => dispatch => {
  dispatch({
    type: types.SHOW_SEARCH_CONDITION,
    searchCondition: {
      open: open,
      anchor: anchor
    }
  });
}

export const showSnackBar = (open, message, horizontal = "left", vertical = "bottom") => dispatch => {
  dispatch({
    type: types.SHOW_SNACK_BAR,
    snackBarState: {
      open: open,
      message: message,
      horizontal: horizontal,
      vertical: vertical
    }
  });
}

export const sortChange = (sortname, order = "desc") => dispatch => {
  dispatch({
    type: types.SORT_CHANGE,
    sort: {
      name: sortname,
      order: order
    }
  });
}

export const allAddCondtionUsers = () => dispatch => {
  dispatch({
    type: types.ALL_ADD_CONDITION_USER
  });
}

export const allRemoveCondtionUsers = () => dispatch => {
  dispatch({
    type: types.ALL_REMOVE_CONDITION_USER
  });
}


export const setConditionUser = (username) => dispatch => {
  dispatch({
    type: types.SET_CONDITION_USER,
    username: username
  });
}

export const getUsers = () => async (dispatch) => {
  var users = await madoriApiClient.getUsers(utils.getUserid());
  dispatch({
    type: types.SET_USERS,
    users: users
  });
}

export const download = (item) => async (dispatch) => {
  var key = item.key;
  console.log(key);
  var blob = await madoriApiClient.getBlob(key);

  var link = document.createElement('a');
  link.setAttribute("download", item.downloadName);
  link.href = URL.createObjectURL(blob);
  console.log(window.navigator.userAgent);
  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveOrOpenBlob(blob, item.downloadName);
  }
  else {
    var evt = document.createEvent("MouseEvents");
    evt.initEvent("click", false, true);
    link.dispatchEvent(evt);
  }

}

export const deleteFiles = (item) => async (dispatch) => {

  var keyList = [];

  keyList.push(item.key);

  console.log("deleteKyes:" + keyList);

  await madoriApiClient.deleteFiles(keyList).catch(err => {
    console.log(err);
  });


  var status = await madoriApiClient.getStrageStatus(utils.getUserid()).catch(err => {
    console.log(err);
  });

  dispatch({
    type: types.DELETE_FILES,
    deleteItem: item,
    storageStatus: status
  })

}


export const getStorageStatus = () => async (dispatch) => {

  madoriApiClient.getStrageStatus(utils.getUserid()).then((status) => {
    console.log(status);
    dispatch({
      type: types.GET_STORAGE_STATES,
      storageStatus: status
    });
  }).catch(err => {
    console.log(err)
  });
}

export const clearSerachConditions = () => (dispatch) => {
  dispatch({
    type: types.CLEAR_SEARCH_CONDITIONS
  });
}



