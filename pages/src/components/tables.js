import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Image from 'react-image-resizer';
import Paper from '@material-ui/core/Paper';
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Infinite from 'react-infinite-scroller'
import CircularProgress from '@material-ui/core/CircularProgress';
import { StickyContainer, Sticky } from "react-sticky"
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';

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
  }

});


const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "#517D99",
    color: theme.palette.common.white,
    fontSize: 12
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);


class EnhancedTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      showArchives: [],
      page: 0,
      rowsPerPage: 5,
    };
  }

  selectRow(event, data) {

    if (this.state.selected.filter((item) => { return data.id == item.id }).length > 0) {
      this.state.selected = [];
    } else {
      this.state.selected = [];
      this.state.selected.push(data);
    }

    if (this.props.selectionChanged) {
      this.props.selectionChanged(event, this.state.selected);
    }

    this.setState({ selected: this.state.selected });
  }

  showArchiveFiles(event, data) {
    event.stopPropagation();
    if (this.state.showArchives.filter((item) => { return data.id == item.id }).length > 0) {
      this.state.showArchives = [];
    } else {
      this.state.showArchives = [];
      this.state.showArchives.push(data);
    }


    this.setState({ selected: this.state.selected });

  }

  isSelected(event, row) {
    return this.state.selected.filter((data) => { return data.id == row.id }).length > 0
  }

  isShowArchives(event, row) {
    return this.state.showArchives.filter((data) => { return data.id == row.id }).length > 0
  }


  isSelectedAny(event) {
    return this.state.selected.length > 0;
  }

  folderClick(event, n) {
    if (n.isFolder) {
      this.props.onFolderCick(event, n.file);
    }
  }

  createRow(n, classes) {

    const isSelected = this.isSelected(event, n);
    const isShowArchives = this.isShowArchives(event, n);
    var tags = (
      <TableRow key={n.id} onClick={event => this.selectRow(event, n)} onDoubleClick={event => this.folderClick(event, n)} className={isSelected ? classes.selectedRow : classes.defaultRow}>
        <CustomTableCell padding="none" className={classes.noCell}>{n.id}</CustomTableCell>
        <CustomTableCell padding="none" style={{ paddingLeft: "20px", width: "5px" }}>
          {n.isFolder ? <FolderIcon style={{ fontSize: "32px", textAlign: "center" }} /> : <Image src="images/madori.jpg" width={60} height={60} />}
        </CustomTableCell>
        <CustomTableCell >
          {n.file}
        </CustomTableCell>
        <CustomTableCell >{n.update}</CustomTableCell>
        <Hidden smDown>
          <CustomTableCell >{n.size}</CustomTableCell>
        </Hidden>
        <CustomTableCell numeric>
          {n.archives &&
            <Button variant="outlined" className={classes.button} onClick={event => this.showArchiveFiles(event, n)}>
              {isShowArchives ? "閉じる" : "保存履歴"}
              {isShowArchives ? <UpIcon /> : <DownIcon />}
            </Button>
          }
        </CustomTableCell>
      </TableRow>
    );
    return tags;

  }

  createArchiveRow(n, classes) {

    const isShowArchives = this.isShowArchives(event, n);
    if (n.archives && isShowArchives) {
      var rows = n.archives.map((archive, index) => {
        const isSelected = this.isSelected(event, archive);
        return (
          <TableRow key={archive.id} onClick={event => this.selectRow(event, archive)} className={isSelected ? classes.selectedRow : classes.archiveRow}>
            <CustomTableCell padding="none" className={classes.noCell}>{n.id}{"-"}{index + 1}</CustomTableCell>
            <CustomTableCell padding="none" style={{ paddingLeft: "20px", width: "5px" }}>
              <Image src="images/madori.jpg" width={60} height={60} />
            </CustomTableCell>
            <CustomTableCell >{archive.file}</CustomTableCell>
            <CustomTableCell >{archive.update}</CustomTableCell>
            <CustomTableCell >{archive.size}</CustomTableCell>
            <CustomTableCell ></CustomTableCell>
          </TableRow>
        )
      })

      return rows;
    }
  }



  render() {
    const { classes, root, data, onLoad } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    return (

      <Infinite
        pageStart={0}
        loadMore={onLoad}
        loader={<CircularProgress style={{ display: "block", margin: "auto", padding: "10px" }} className={classes.progress} />}
        hasMore={true}
      >
        <Paper className={classes.root} >
          <Table className={classes.table}>

            <TableBody className={classes.tableBody}>

              {data.map(n => {
                return [
                  this.createRow(n, classes),
                  this.createArchiveRow(n, classes)
                ]
              })}
            </TableBody>
          </Table>
        </Paper>
      </Infinite>

    );
  };

}


EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  selectionChanged: PropTypes.func,
  data: PropTypes.array,
  onFolderCick: PropTypes.func,
  onLoad: PropTypes.func
};

export default compose(
  withStyles(styles),
  withWidth(),
)(EnhancedTable);
