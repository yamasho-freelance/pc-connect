import React from 'react'
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, withStyles, createMuiTheme, Button, Grid, LinearProgress, } from '@material-ui/core';

import IconHelp from '@material-ui/icons/HelpOutline'
import IconButton from '@material-ui/core/IconButton'

import { connect } from 'react-redux';
import { getStorageStatus } from '../actions/fileStrageActions';



const styles = {
    root: {
        flexGrow: 1,
        backgroundColor: '#eeeeee'
    },
    warning: {
        color: "yellow",
        fontWeight: "bold"
    },
    deny: {
        color: "red",
        fontWeight: "bold"
    }
};

class StorageAppBar extends React.Component {

    componentWillMount() {
    }


    render() {
        const { classes, storageStatus } = this.props;

        return (
            <AppBar color="primary" position="static">
                <Toolbar>
                    <Grid container alignItems="center">
                        <Grid item xs>
                            <Typography variant="title" color="inherit">
                                間取りクラウド ストレージ
                            </Typography>
                        </Grid>
                        <Grid>
                            <Button>
                                <IconHelp style={{ marginRight: "8px" }} />
                                ヘルプ
                            </Button>
                        </Grid>
                        <Grid item style={{ textAlign: "right" }}>
                            <p style={{ fontSize: "12px", margin: "3px" }}>
                                <span>容量：</span>
                                <span className={this.getStrageClassName(storageStatus.status)}>{storageStatus.totalSize}</span>
                                <span> / </span>
                                <span>{storageStatus.capacity}</span>
                            </p>
                            <LinearProgress color="secondary" style={{ width: "160px", marginLeft: "auto" }} variant="determinate" value={storageStatus.useRate} />

                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        )
    }

    getStrageClassName(status) {
        switch (status) {
            case "allow":
                return {};
            case "warning":
                return this.props.classes.warning
            case "deny":
                return this.props.classes.deny
            default:
                return {};
        }
    }
}


StorageAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    storageStatus: state.fileStrage.storageStatus
});

export default connect(mapStateToProps, { getStorageStatus })(withStyles(styles)(StorageAppBar));