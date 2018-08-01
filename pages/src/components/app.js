import React from 'react'
import PropTypes from 'prop-types';
import Tables from './table'
import AlertDialog from './alertDialig'
import { AppBar, Toolbar, Typography, withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import { StickyContainer, Sticky } from "react-sticky"
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Checkbox from '@material-ui/core/Checkbox';
import UserIcon from '@material-ui/icons/AccountCircle';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#6AC1B7",
      contrastText: "#ffffff"
    },
    secondary: { main: "#517D99" }
  },
});


const styles = {
  root: {
    flexGrow: 1,
    backgroundColor: '#eeeeee'
  },
  bootstrapInput: {
    backgroundColor: theme.palette.common.white,
    fontSize: 16,
    padding: '12px 12px',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(',')
  },
  searchButton: {
    float: "right",
    "&:hover": {
      backgroundColor: theme.palette.common.white
    }
  },
  searchBar: {
    padding: "15px 0px 15px 0px",
    backgroundColor: "#eeeeee",
    zIndex: "20"
  }
};


let id = 0;
let isShowArchives = false;
let isSelected = false;
function createData(file, user, update, size) {
  id += 1;
  return { id, file, user, update, size };
}

function createData(file, user, update, size, archives, isFolder) {
  id += 1;
  return { id, file, user, update, size, archives, isShowArchives, isFolder };
}

class CloudStorageApp extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      disableDelete: true,
      disableDownload: true,
      data: [],
      openDialog: false,
      users: ["yamasho", "takemoto", "nakai", "yoshida"],
      snackBarState: {
        open: false,
        message: "aaaa",
        vertical: "bottom",
        horizontal: "left"
      },
      searchConditon: {
        open: false,
        anchorEl: null
      }
    };
  }

  deleteClick(event) {
    this.setState({ openDialog: true });
  }

  closeDialog(event) {
    this.setState({ openDialog: false });
  }

  deleteFile(event) {
    this.showSnackBar("ファイルが削除されました");
  }

  closeSnackBar(event) {

    var snackBarState = Object.assign({}, this.state.snackBarState);
    snackBarState.open = false;
    this.setState({ snackBarState });
  }


  selectionChanged(event, selected) {
    let disabled = selected.length < 1;

    this.setState({ disableDownload: disabled });
    this.setState({ disableDelete: disabled });
  }

  showSnackBar(message, vertical, horizontal) {

    var snackBarState = Object.assign({}, this.state.snackBarState);
    snackBarState.open = true;
    snackBarState.message = message;
    snackBarState.vertical = vertical ? vertical : this.state.snackBarState.vertical;
    snackBarState.horizontal = horizontal ? horizontal : this.state.snackBarState.horizontal;


    this.setState({ snackBarState });
  }

  showSearchCondition(event) {
    var searchConditon = Object.assign({}, this.state.searchConditon);
    searchConditon.open = true;
    searchConditon.anchorEl = event.currentTarget;
    this.setState({ searchConditon });
  }

  closeSearchCondition(event) {
    var searchConditon = Object.assign({}, this.state.searchConditon);
    searchConditon.open = false;
    searchConditon.anchorEl = null;
    this.setState({ searchConditon });
  }


  setFolderData(event) {
    var folderData = [
      createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本207', "yamasho", "2018-07-22 12:12:45", "125KB"),
      createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本207', "yamasho", "2018-07-22 12:12:45", "125KB"),
      createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本207', "yamasho", "2018-07-22 12:12:45", "125KB"),
      createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本207', "takemoto", "2018-07-22 12:12:45", "125KB"),
      createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本207', "yoshida", "2018-07-22 12:12:45", "125KB"),
      createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本207', "nakai", "2018-07-22 12:12:45", "125KB"),
      createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本206', "yamasho", "2018-07-22 10:54:53", "1.3MB"),
      createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本205', "nakai", "2018-07-22 08:23:23", "234KB"),
      createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本204', "yamasho", "2018-07-22 05:42:12", "325KB"),
      createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本203　', "yamasho", "2018-07-21 04:12:22", "2.4MB"),
      createData('大阪府大阪市都島区　グランデージ都島207', "yamasho", "2018-07-21 12:42:42", "534KB"),
      createData('大阪府大阪市都島区　グランデージ都島206', "takemoto", "2018-07-21 12:42:42", "503KB"),
      createData('大阪府大阪市都島区　グランデージ都島205', "yamasho", "2018-07-20 12:42:42", "4MB", [
        createData('大阪府大阪市都島区　グランデージ都島205', "yamasho", "2018-07-20 11:42:42", "3MB"),
        createData('大阪府大阪市都島区　グランデージ都島205', "yamasho", "2018-07-20 10:42:42", "2MB"),
        createData('大阪府大阪市都島区　グランデージ都島205', "takemoto", "2018-07-20 09:42:42", "1MB")
      ])];

    this.setState({ data: folderData });
  }

  loadNewData(event) {
    setTimeout(() => {

      var folderData = [
        createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本207', "yamasho", "2018-07-22 12:12:45", "125KB"),
        createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本207', "yamasho", "2018-07-22 12:12:45", "125KB"),
        createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本207', "yamasho", "2018-07-22 12:12:45", "125KB"),
        createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本207', "takemoto", "2018-07-22 12:12:45", "125KB"),
        createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本207', "yoshida", "2018-07-22 12:12:45", "125KB"),
        createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本207', "nakai", "2018-07-22 12:12:45", "125KB"),
        createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本206', "yamasho", "2018-07-22 10:54:53", "1.3MB"),
        createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本205', "nakai", "2018-07-22 08:23:23", "234KB"),
        createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本204', "yamasho", "2018-07-22 05:42:12", "325KB"),
        createData('大阪府大阪市中央区森ノ宮中央一丁目　ルミエール山本203　', "yamasho", "2018-07-21 04:12:22", "2.4MB"),
        createData('大阪府大阪市都島区　グランデージ都島207', "yamasho", "2018-07-21 12:42:42", "534KB"),
        createData('大阪府大阪市都島区　グランデージ都島206', "takemoto", "2018-07-21 12:42:42", "503KB"),
        createData('大阪府大阪市都島区　グランデージ都島205', "yamasho", "2018-07-20 12:42:42", "4MB", [
          createData('大阪府大阪市都島区　グランデージ都島205', "yamasho", "2018-07-20 11:42:42", "3MB"),
          createData('大阪府大阪市都島区　グランデージ都島205', "yamasho", "2018-07-20 10:42:42", "2MB"),
          createData('大阪府大阪市都島区　グランデージ都島205', "takemoto", "2018-07-20 09:42:42", "1MB")
        ])];

      Array.prototype.push.apply(this.state.data, folderData);

      this.setState({ data: this.state.data });
    }, 2000);
  }

  render() {
    const { classes } = this.props;
    const { disableDelete, disableDownload, openDialog, snackBarState, searchConditon } = this.state;

    return (
      <StickyContainer>
        <div className={classes.root}>
          <Snackbar
            anchorOrigin={{ vertical: snackBarState.vertical, horizontal: snackBarState.horizontal }}
            open={snackBarState.open}
            onClose={event => this.closeSnackBar(event)}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            autoHideDuration={3000}
            message={<span id="message-id">{snackBarState.message}</span>}
          />
          <AlertDialog onClose={event => this.closeDialog(event)} onOK={event => this.deleteFile(event)} okContent="削除" cancelContent="キャンセル" title="選択したファイルを削除しますか？" message={"ファイルを一旦削除すると復元することはできません。"} open={openDialog} />
          <MuiThemeProvider theme={theme}>
            <AppBar color="primary" position="static">
              <Toolbar>
                <Grid container alignItems="center">
                  <Grid item xs>
                    <Typography variant="title" color="inherit">
                      間取りクラウドストレージ
                </Typography>
                  </Grid>
                  <Grid item xs>
                    <Grid container direction="column" alignItems="flex-end">
                      <Grid item xs>
                        <p style={{ fontSize: "12px", margin: "3px" }}>容量：12.5M / 100M</p>
                      </Grid>
                      <Grid item xs>
                        <LinearProgress color="secondary" style={{ width: "150px" }} variant="determinate" value={20} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>

            <div style={{ backgroundColor: "#eeeeee" }}>
              <Sticky topOffset={70}>
                {({ style }) =>
                  (
                    <Grid style={style} className={classes.searchBar} container alignItems="center">
                      <Grid item xs />
                      <Grid item style={{ width: "120px" }}>
                        <Button variant="outlined" onClick={event => this.showSearchCondition(event)}>
                          検索条件
                          <DownIcon />
                        </Button>
                        <Popover
                          open={searchConditon.open}
                          anchorEl={searchConditon.anchorEl}
                          onClose={event => this.closeSearchCondition(event)}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                        >

                          <Typography variant="subheading" style={{backgroundColor:"lightGray",padding:"8px",textAlign:"center"}}> ユーザの選択</Typography>
                          <List>
                            {this.state.users.map(value => (
                              <ListItem
                                key={value}
                                role={undefined}
                                dense
                                button
                                className={classes.listItem}
                              >
                                <Checkbox
                                />
                                <ListItemText primary={value} />

                              </ListItem>
                            ))}
                          </List>
                        </Popover>
                      </Grid>
                      <Grid item xs={6}>
                        <Grid container ustify="flex-end">
                          <Grid item xs>
                            <Paper>
                              <Grid alignItems="center" container>
                                <Grid item xs>
                                  <TextField
                                    placeholder="ファイル名"
                                    id="bootstrap-input"
                                    fullWidth={true}
                                    InputProps={{

                                      disableUnderline: true,
                                      classes: {
                                        root: classes.bootstrapRoot,
                                        input: classes.bootstrapInput,
                                      },
                                    }}
                                  />
                                </Grid>
                                <Grid item style={{ width: "50px" }}>
                                  <IconButton className={classes.searchButton} aria-label="Serach">
                                    <SearchIcon />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </Paper>
                          </Grid>
                          <Grid item style={{ width: "60px"}}>
                            <Tooltip title="削除">
                              <IconButton onClick={event => this.deleteClick(event)} disabled={disableDelete} style={{ margin: "0px 10px" }} className={classes.button} aria-label="Delete">
                                <DeleteIcon style={{ fontSize: "32px" }} />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                          <Grid item style={{ width: "60px" }}>
                            <Tooltip title="ダウロード">
                              <IconButton disabled={disableDownload} className={classes.button} aria-label="Delete">
                                <GetAppIcon style={{ fontSize: "32px" }} />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                  )

                }
              </Sticky>
            </div>

            <div style={{ margin: "0px 15px 0px 15px" }}>
              <Tables onLoad={event => this.loadNewData(event)} onFolderCick={(event, file) => this.clickFolder(event, file)} selectionChanged={(event, selected) => this.selectionChanged(event, selected)} data={this.state.data} />
            </div>
          </MuiThemeProvider>

        </div>
      </StickyContainer>
    )
  }
}


CloudStorageApp.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CloudStorageApp)