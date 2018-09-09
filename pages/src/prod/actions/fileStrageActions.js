import * as types from './actionTypes';
import madoriApi from './../api/madoriApi';
import * as utils from './../utils/convert-util'

const hashId = utils.getHashUserid();

export const fetchFiles = (keywords, users, sort, order, offsetKey) => async (dispatch) => {

  var res = await madoriApi.searchFiles(hashId, keywords, users, sort, order, offsetKey);

  var status = await madoriApi.getStrageStatus(hashId).catch(err => {
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
  var users = await madoriApi.getUsers(hashId);
  dispatch({
    type: types.SET_USERS,
    users: users
  });
}

export const download = (item) => async (dispatch) => {
  var key = item.key;

  var userAgent = window.navigator.userAgent.toLowerCase();
  var isIE = (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('trident') >= 0);
  console.log(key);
  console.log(window.navigator.userAgent);
  // if (window.navigator.msSaveBlob && isIE) {
  //   var blob = await madoriApi.getBlob(key);
  //   window.navigator.msSaveOrOpenBlob(blob, item.downloadName);
  // }
  // else {
  //   var url = await madoriApi.getDownloadUrl(key);
  //   var link = document.createElement('a');
  //   link.setAttribute("download", item.downloadName);
  //   link.href = url;
  //   link.target = "_blank";
  //   var evt = document.createEvent("MouseEvents");
  //   evt.initEvent("click", false, true);
  //   link.dispatchEvent(evt);
  // }

  var url = await madoriApi.getDownloadUrl(key);
  var link = document.createElement('a');
  link.setAttribute("download", item.downloadName);
  link.href = url;
  var evt = document.createEvent("MouseEvents");
  evt.initEvent("click", false, true);
  link.dispatchEvent(evt);


}

export const deleteFiles = (item) => async (dispatch) => {

  var keyList = [];

  keyList.push(item.key);

  console.log("deleteKyes:" + keyList);

  await madoriApi.deleteFiles(keyList).catch(err => {
    console.log(err);
  });


  var status = await madoriApi.getStrageStatus(hashId).catch(err => {
    console.log(err);
  });

  dispatch({
    type: types.DELETE_FILES,
    deleteItem: item,
    storageStatus: status
  })

}


export const getStorageStatus = () => async (dispatch) => {

  madoriApi.getStrageStatus(hashId).then((status) => {
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



