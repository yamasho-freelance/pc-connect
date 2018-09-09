import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Image from 'react-image-resizer';
import Paper from '@material-ui/core/Paper';
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import InfoIcon from '@material-ui/icons/Info';
import ArrowDownIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpIcon from '@material-ui/icons/ArrowUpward';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox'


const styles = theme => ({

    archiveRow: {
        backgroundColor: "lightgray",
        "&:hover": {
            backgroundColor: "#DFEFED"
        }
    },
    selectedRow: {
        backgroundColor: "#DFEFED"

    },
    defaultRow: {
        "&:hover": {
            backgroundColor: "#DFEFED"
        }
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    button: {
        margin: theme.spacing.unit,
    },
    noCell: {
        paddingLeft: "25px"
    },
    tableRow: {
        fontFamily: "\"Roboto\",\"Helvetica\",\"Arial\",sans-serif",
        padding: "4px 0px 4px 0px",
        fontSize: "14px"
    },
    cell: {
        display: "flex",
        alignItems: "center",
        padding: "0px 4px 0px 4px"
    },
    cellCheckBox: {
        width: "40px",
        marginLeft: "20px",
        justifyContent: "center"
    },
    cellNo: {
        width: "50px",
        justifyContent: "center"
    },
    cellThumb: {
        width: "100px",
        justifyContent: "center",
        cursor: "url(https://madori.cloud/public/storage/images/zoom_in.svg),auto"
    },
    cellThumbHeader: {
        width: "100px",
        justifyContent: "center"
    },
    cellArchiveBtn: {
        width: "130px"
    },
    cellArchiveNo: {
        marginLeft: "50px"
    },
    displayNone: {
        display: "none"
    },
    notFound: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "8px"
    },
    rowsGroup: {
        overflow: "auto",
        height: "70vh"
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
        fontSize: "20px"
    }

});

class EnhancedTableRow extends React.Component {

    componentWillMount() {
        this.props.fetchFiles(this.props.searchState.keywords, this.props.searchCondition.selectUsers, this.props.sort.name, this.props.sort.order, this.props.searchState.offsetKey);
    }

    shouldComponentUpdate(nextPrpop, nextState) {
        console.log(nextPrpop);
        console.log(nextState);
        return true;
    }


    selectRow(data) {

        this.props.selectRow(data);
    }

    showArchiveFiles(event, data) {
        event.stopPropagation();
        this.props.showArchives(data);
    }



    isShowArchives(row) {
        return this.props.openArchives.filter((data) => { return data == row }).length > 0
    }
    showThumbnailDialog(event, thumbPath) {
        event.stopPropagation();
        this.props.showThumbnail(true, thumbPath);
    }

    closeThumbnailDialog(thumbPath) {
        this.props.showThumbnail(false, thumbPath);
    }

    createRow(n, no, classes) {

        const isShowArchives = this.isShowArchives(n);
        var tags = (
            <div key={no}>
                <Divider />
                <Grid container onClick={event => this.selectRow(n)} className={[n.isSelected ? classes.selectedRow : classes.defaultRow, classes.tableRow]}>
                    <Grid item className={[classes.cell, classes.cellCheckBox]}>
                        <Checkbox checked={n.isSelected} classes={
                            classes.checked
                        } />
                    </Grid>
                    <Grid item className={[classes.cell, classes.cellNo]}>{no}</Grid>
                    <Grid item className={[classes.cell, classes.cellThumb]} onClick={event => this.showThumbnailDialog(event, n.thumbnailPath)}>
                        <Image src={n.thumbnailPath} style={{ margin: "auto" }} width={60} height={60} />
                    </Grid>
                    <Grid item xs className={classes.cell}>
                        {n.filename}
                    </Grid>
                    <Grid item xs={2} className={classes.cell}>{n.username}</Grid>
                    <Grid item xs={2} className={classes.cell}>{n.dispLatest}</Grid>
                    <Hidden smDown>
                        <Grid item xs={1} className={classes.cell}>{n.dispSize}</Grid>
                    </Hidden>
                    <Grid item className={[classes.cell, classes.cellArchiveBtn]}>
                        {(n.version && n.version.length > 0) &&
                            <Button variant="outlined" className={classes.button} onClick={event => this.showArchiveFiles(event, n)}>
                                {isShowArchives ? "閉じる" : "履歴"}
                                {isShowArchives ? <UpIcon className={classes.rightIcon} /> : <DownIcon className={classes.rightIcon} />}
                            </Button>
                        }
                    </Grid>
                </Grid >
            </div>
        );
        return tags;

    }

    createArchiveRow(n, no, classes) {

        const isShowArchives = this.isShowArchives(n);
        if (n.version && isShowArchives) {
            var rows = n.version.map((archive, index) => {
                return (
                    <div key={no + "-" + (index + 1)}>
                        <Divider />
                        <Grid container onClick={event => this.selectRow(archive)} className={[n.isSelected ? classes.selectedRow : classes.archiveRow, classes.tableRow]}>
                            <Grid item className={[classes.cell, classes.cellCheckBox]}>
                                <Checkbox checked={isSelected} />
                            </Grid>
                            <Grid item className={[classes.cell, classes.cellArchiveNo]}>{no}{"-"}{index + 1}</Grid>
                            <Grid item className={[classes.cell, classes.cellThumb]} onClick={event => this.showThumbnailDialog(event, archive.thumbnailPath)}>
                                <Image src={archive.thumbnailPath} width={60} height={60} />
                            </Grid>
                            <Grid item xs className={classes.cell}>{n.filename}</Grid>
                            <Grid item xs={2} className={classes.cell}>{n.username}</Grid>
                            <Grid item xs={2} className={classes.cell}>{archive.dispLatest}</Grid>
                            <Hidden smDown>
                                <Grid item xs={1} className={classes.cell}>{archive.dispSize}</Grid>
                            </Hidden>
                            <Grid item className={[classes.cell, classes.cellArchiveBtn]}></Grid>
                        </Grid>
                    </div>
                )
            })

            return rows;
        }
    }



    render() {
        const { classes, data, thumbDialog, sort, searchState, isSearching } = this.props;
        return (

        );
    };
}

EnhancedTable.propTypes = {
    classes: PropTypes.object.isRequired,
    selectionChanged: PropTypes.func,
    data: PropTypes.object,
    showThumbnailDialog: PropTypes.func,
};



export default withStyles(styles)(EnhancedTable);
