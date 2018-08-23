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
import Infinite from 'react-infinite-scroller'
import CircularProgress from '@material-ui/core/CircularProgress';
import { Sticky } from "react-sticky"
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox'


import { connect } from 'react-redux';
import { fetchFiles, selectRow, showArchives, showThumbnail, sortChange } from '../actions/fileStrageActions';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    marginTop: "0px"
  },
  table: {
    minWidth: 700,
  },
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
  header: {
    padding: "15px 0px 15px 0px",
    backgroundColor: "#517D99",
    color: theme.palette.common.white,
    fontSize: "12px"
  },
  stickyHeader: {
    padding: "15px 0px 15px 0px",
    top: "75px !important",
    backgroundColor: "#517D99",
    color: theme.palette.common.white,
    fontSize: "12px",
    zIndex: "21"
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
    width: "40px",
    justifyContent: "center"
  },
  cellThumb: {
    width: "100px",
    justifyContent: "center",
    cursor: "url(./images/zoom_in.svg),auto"
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
  sortArrowIcon: {
    fontSize: "16px",
    marginLeft: "8px"
  },
  sortingName: {
    display: "flex"
  },
  cellSortTarget: {
    "&:hover": {
      cursor: "pointer",
      fontWeight: "bold"
    }
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

class EnhancedTable extends React.Component {

  componentWillMount() {
    this.props.fetchFiles(this.props.searchState.keywords, this.props.searchCondition.selectUsers, this.props.sort.name, this.props.sort.order, this.props.searchState.offsetKey);
  }

  shouldComponentUpdate(nextPrpop, nextState) {
    console.log(nextPrpop);
    console.log(nextState);
    return true;
  }

  componentWillReceiveProps(prop) {
    if (this.props.searchCondition.selectUsers.length != prop.searchCondition.selectUsers.length) {
      this.props.fetchFiles(this.props.searchState.keywords, prop.searchCondition.selectUsers, this.props.sort.name, this.props.sort.order, this.props.searchState.offsetKey);
    }
    if (this.props.sort != prop.sort) {
      this.props.fetchFiles(this.props.searchState.keywords, this.props.searchCondition.selectUsers, prop.sort.name, prop.sort.order, this.props.searchState.offsetKey);
    }
  }
  onLoad() {
    //データが0件の時に検索処理を行うと、データクリア時に副作用的に処理が行われてしまうため、
    //初回読み込み時は明示的に検索処理を呼び出す。
    if (this.props.data.length > 0) {
      this.props.fetchFiles(this.props.searchState.keywords, this.props.searchCondition.selectUsers, this.props.sort.name, this.props.sort.order, this.props.searchState.offsetKey);
    }
  }

  selectRow(data) {

    this.props.selectRow(data);
  }

  showArchiveFiles(event, data) {
    event.stopPropagation();
    this.props.showArchives(data);
  }

  sortChange(sortname) {
    var newOrder = "desc";

    if (this.props.sort.name == sortname) {
      if (this.props.sort.order == "desc") {
        newOrder = "asc"
      }
    }
    this.props.sortChange(sortname, newOrder);

  }

  isSortTarget(sortname) {
    return this.props.sort.name == sortname;
  }

  createSortDirectionIcon(order, classes) {
    return (order == "desc" ? <ArrowDownIcon className={classes.sortArrowIcon} /> : <ArrowUpIcon className={classes.sortArrowIcon} />);
  }

  isSelected(row) {
    return this.props.selected.filter((data) => { return data == row }).length > 0
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

    const isSelected = this.isSelected(n);
    const isShowArchives = this.isShowArchives(n);
    var tags = (
      <div key={no}>
        <Divider />
        <Grid container onClick={event => this.selectRow(n)} className={[isSelected ? classes.selectedRow : classes.defaultRow, classes.tableRow]}>
          <Grid item className={[classes.cell, classes.cellCheckBox]}>
            <Checkbox checked={isSelected} classes={
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
        const isSelected = this.isSelected(archive);
        return (
          <div key={no + "-" + (index + 1)}>
            <Divider />
            <Grid container onClick={event => this.selectRow(archive)} className={[isSelected ? classes.selectedRow : classes.archiveRow, classes.tableRow]}>
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

      <Infinite
        pageStart={0}
        loadMore={e => this.onLoad(e)}
        loader={<CircularProgress style={{ display: "block", margin: "auto", padding: "10px" }} className={classes.progress} />}
        hasMore={searchState.hasNext}
      >
        <Paper className={classes.root} >
          <Dialog
            open={thumbDialog.open}
            onBackdropClick={event => this.closeThumbnailDialog(thumbDialog.imagePath)}
            onEscapeKeyDown={event => this.closeThumbnailDialog(thumbDialog.imagePath)}>
            <DialogContent>
              <Image src={thumbDialog.imagePath} width={300} height={300} />
              <div style={{ textAlign: "center" }}>
                <Button onClick={event => this.closeThumbnailDialog(thumbDialog.imagePath)}>
                  閉じる
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Sticky topOffset={70}>
            {({ style, isSticky }) =>
              (
                <Grid style={style} container className={isSticky ? classes.stickyHeader : classes.header} >
                  <Grid item className={[classes.cell, classes.cellCheckBox]}></Grid>
                  <Grid item className={[classes.cell, classes.cellNo]}>No</Grid>
                  <Grid item className={[classes.cell, classes.cellThumbHeader]} >サムネイル</Grid>
                  <Grid item xs className={[classes.cell, classes.cellSortTarget]} onClick={e => this.sortChange("filename")}>
                    {this.isSortTarget("filename") ? <b className={classes.sortingName}>ファイル{this.createSortDirectionIcon(sort.order, classes)}</b> : "ファイル"}</Grid>
                  <Grid item xs={2} className={classes.cell}>ユーザ</Grid>
                  <Grid item xs={2} className={[classes.cell, classes.cellSortTarget]} onClick={e => this.sortChange("latest")}>
                    {this.isSortTarget("latest") ? <b className={classes.sortingName}>更新時間{this.createSortDirectionIcon(sort.order, classes)}</b> : "更新時間"}
                  </Grid>
                  <Hidden smDown>
                    <Grid item xs={1} className={[classes.cell, classes.cellSortTarget]} onClick={e => this.sortChange("size")}>
                      {this.isSortTarget("size") ? <b className={classes.sortingName}>サイズ{this.createSortDirectionIcon(sort.order, classes)}</b> : "サイズ"}
                    </Grid>
                  </Hidden>
                  <Grid item className={[classes.cell, classes.cellArchiveBtn]}></Grid>
                </Grid >
              )}
          </Sticky >
          <Typography className={(isSearching || data.length > 0) ? classes.displayNone : classes.notFound}><InfoIcon style={{ marginRight: "6px" }} />該当するファイルが存在しません。検索条件を変更して検索してください。</Typography>
          {
            data.map((n, index) => {
              return [
                this.createRow(n, index + 1, classes),
                this.createArchiveRow(n, index + 1, classes)
              ]
            })
          }
        </Paper>
      </Infinite>
    );
  };
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  selectionChanged: PropTypes.func,
  data: PropTypes.array,
  selected: PropTypes.array,
  openArchives: PropTypes.array
};

const mapStateToProps = state => ({
  data: state.fileStrage.items,
  selected: state.fileStrage.selected,
  openArchives: state.fileStrage.openArchives,
  thumbDialog: state.fileStrage.thumbDialog,
  sort: state.fileStrage.sort,
  searchState: state.fileStrage.searchState,
  searchCondition: state.fileStrage.searchCondition,
  isSearching: state.fileStrage.isSearching
});


export default connect(mapStateToProps, { fetchFiles, selectRow, showArchives, showThumbnail, sortChange })(compose(
  withStyles(styles),
  withWidth(),
)(EnhancedTable));
