import React from 'react'
import PropTypes from 'prop-types';
import Tables from './components/table'
import SearchBar from './components/searchBar';
import StorageAppbar from './components/storageAppBar';
import { withStyles, createMuiTheme, MuiThemeProvider, Button } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import { StickyContainer } from "react-sticky"

import { Provider } from 'react-redux';
import store from './../prod/store';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FFA726",
      contrastText: "#ffffff"
    },
    secondary: { main: "#517D99" }
  },
});


const styles = {
  root: {
    flexGrow: 1,
    backgroundColor: '#eeeeee',
    minHeight: "97vh"
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


class CloudStorageApp extends React.Component {

  componentWillMount() {
    this.setState({ openDialog: true });
  }

  closeDialog() {
    this.setState({ openDialog: false });
  }

  render() {
    const { classes } = this.props;

    return (
      <Provider store={store}>
        <StickyContainer>
          <div className={classes.root}>

            <MuiThemeProvider theme={theme}>
              <Dialog open={this.state.openDialog} scroll="paper">
                <iframe style={{ border: "0px", width: "600px", height: "800px" }} src="https://madori.jp/product/md_cloud/guide/g_storage/help/EXT/?referrer=storagePage&mode=demo&role=usage&case=dialog" />
                <Button style={{ margin: "8px" }} onClick={e => this.closeDialog()}>閉じる</Button>
              </Dialog>
              <StorageAppbar />
              <SearchBar />
              <div style={{ margin: "0px 15px 0px 15px" }}>
                <Tables />
              </div>
            </MuiThemeProvider>

          </div>
        </StickyContainer>
      </Provider>
    )
  }
}


CloudStorageApp.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(CloudStorageApp);