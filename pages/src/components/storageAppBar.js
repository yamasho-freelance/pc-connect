import React from 'react'
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, withStyles, createMuiTheme } from '@material-ui/core';

import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';

import { connect } from 'react-redux';
import { getStorageStatus } from '../actions/fileStrageActions';



const styles = {
    root: {
        flexGrow: 1,
        backgroundColor: '#eeeeee'
    }
};

class StorageAppBar extends React.Component {

    componentWillMount() {
        // this.props.getStorageStatus();
    }


    render() {
        const { classes, storageStatus } = this.props;

        return (
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
                                    <p style={{ fontSize: "12px", margin: "3px" }}>容量：{storageStatus.totalSize} / {storageStatus.capacity}</p>
                                </Grid>
                                <Grid item xs>
                                    <LinearProgress color="secondary" style={{ width: "150px" }} variant="determinate" value={storageStatus.useRate} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        )
    }
}


StorageAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    storageStatus: state.fileStrage.storageStatus
});

export default connect(mapStateToProps, { getStorageStatus })(withStyles(styles)(StorageAppBar));