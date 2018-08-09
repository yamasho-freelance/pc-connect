import React from 'react'
import PropTypes from 'prop-types';
import { Typography, withStyles, createMuiTheme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { Sticky } from "react-sticky"
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import AlertDialog from './alertDialig';
import UserIcon from '@material-ui/icons/AccountCircle';
import InfoIcon from '@material-ui/icons/Info';

import { connect } from 'react-redux';
import { showSearchCondition, showSnackBar, showDeleteDialog, fetchFiles, setConditionUser, clearItems, allAddCondtionUsers, allRemoveCondtionUsers, getUsers, download, deleteFiles, clearSerachConditions } from '../actions/fileStrageActions';

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
    },
    listText: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
};

class SerachBar extends React.Component {

    constructor(props) {
        super(props);
        this.searchWordRef = React.createRef();
        this.checkboxRef = React.createRef();
    }

    componentWillMount() {
        this.props.getUsers(this.props.userid);
    }

    handleChangeAllConditionUser(event) {
        if (this.checkboxRef.current.checked) {
            this.props.allAddCondtionUsers();
        } else {
            this.props.allRemoveCondtionUsers();
        }
    }

    setConditionUser(username) {
        this.props.setConditionUser(username);
    }

    clearAllConditions() {

        this.props.clearSerachConditions();
        this.props.fetchFiles(null, null, this.props.sort.name, this.props.sort.order);
        this.searchWordRef.current.value = "";
    }

    searchFile() {
        var word = null;
        var value = this.searchWordRef.current.value;
        if (value.length > 0) {
            word = value.split(/\s/);
        }
        console.log(word);
        this.props.clearItems();
        this.props.fetchFiles(word, this.props.searchCondition.selectUsers, this.props.sort.name, this.props.sort.order);
    }

    handleKeyPress(e) {
        if (e.key == "Enter") {
            this.searchFile();
        }
    }

    downloadClick() {
        this.props.download(this.props.selected[0]);
    }

    deleteClick(event) {
        this.props.showDeleteDialog(true);
    }

    closeDialog(event) {
        this.props.showDeleteDialog(false);
    }

    deleteFile(event) {
        this.props.deleteFiles(this.props.selected[0]);
    }

    closeSnackBar(event) {
        this.props.showSnackBar(false);
    }

    showSearchCondition(event) {
        this.props.showSearchCondition(true, event.currentTarget)
    }

    closeSearchCondition(event) {
        this.props.showSearchCondition(false, event.currentTarget);
    }

    render() {
        const { classes, disableDelete, disableDownload, users, openDeleteDialog, snackBarState, searchCondition, selected } = this.props;

        return (

            <div style={{ backgroundColor: "#eeeeee" }}>
                <Snackbar
                    anchorOrigin={{ vertical: snackBarState.vertical, horizontal: snackBarState.horizontal }}
                    open={snackBarState.open}
                    onClose={event => this.closeSnackBar(event)}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    autoHideDuration={3000}
                    message={<span id="message-id"><InfoIcon />{snackBarState.message}</span>}
                />
                <AlertDialog
                    onClose={event => this.closeDialog(event)}
                    onOK={event => this.deleteFile(event)}
                    okContent="削除" cancelContent="キャンセル"
                    title="選択したファイルを削除しますか？"
                    message={"ファイルを一旦削除すると復元することはできません。\nまた、最新のデータを削除すると履歴データは全て削除されます。"}
                    open={openDeleteDialog} />
                <Sticky topOffset={70}>
                    {({ style }) =>
                        (
                            <Grid style={style} className={classes.searchBar} container justify="flex-end" alignItems="center">
                             
                                <Grid item style={{ width: "160px" }}>
                                    <Button onClick={e => this.clearAllConditions()} variant="outlined">
                                        検索条件をクリア
                                    </Button>
                                </Grid>
                                <Grid item style={{ width: "130px" }}>
                                    <Button variant="outlined" onClick={event => this.showSearchCondition(event)}>
                                        検索条件
                                         <DownIcon />
                                    </Button>
                                    <Popover
                                        open={searchCondition.open}
                                        anchorEl={searchCondition.anchor}
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


                                        <List subheader={<ListSubheader style={{ backgroundColor: "lightgray" }}><Checkbox inputRef={this.checkboxRef} onChange={e => this.handleChangeAllConditionUser(e)}></Checkbox>ユーザの選択</ListSubheader>}>

                                            {users.map(value => (
                                                <ListItem
                                                    key={value}
                                                    role={undefined}
                                                    dense
                                                    button
                                                    className={classes.listItem}
                                                    onClick={e => this.setConditionUser(value)}>
                                                    <Checkbox checked={searchCondition.selectUsers.indexOf(value) >= 0} />

                                                    <Typography variant="subheading" className={classes.listText}><UserIcon style={{ marginRight: "8px" }} />{value}</Typography>

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
                                                            onKeyPress={e => this.handleKeyPress(e)}
                                                            inputRef={this.searchWordRef}
                                                        />
                                                    </Grid>
                                                    <Grid item style={{ width: "50px" }}>
                                                        <IconButton onClick={e => this.searchFile()} className={classes.searchButton} aria-label="Serach">
                                                            <SearchIcon />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                        <Grid item style={{ width: "60px" }}>
                                            <Tooltip title="削除">
                                                <IconButton onClick={event => this.deleteClick(event)} disabled={disableDelete} style={{ margin: "0px 10px" }} className={classes.button} aria-label="Delete">
                                                    <DeleteIcon style={{ fontSize: "32px" }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item style={{ width: "60px" }}>
                                            <Tooltip title="ダウンロード">
                                                <IconButton onClick={e => this.downloadClick()} disabled={disableDownload} className={classes.button} aria-label="Delete">
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

        )
    }
}


SerachBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    disableDelete: state.fileStrage.disableDelete,
    disableDownload: state.fileStrage.disableDownload,
    openDeleteDialog: state.fileStrage.openDeleteDialog,
    snackBarState: state.fileStrage.snackBarState,
    searchCondition: state.fileStrage.searchCondition,
    users: state.fileStrage.users,
    searchWord: state.fileStrage.searchWord,
    sort: state.fileStrage.sort,
    selected: state.fileStrage.selected
});

export default connect(mapStateToProps, { showSearchCondition, showSnackBar, showDeleteDialog, fetchFiles, setConditionUser, clearItems, allAddCondtionUsers, allRemoveCondtionUsers, getUsers, download, deleteFiles, clearSerachConditions })(withStyles(styles)(SerachBar));