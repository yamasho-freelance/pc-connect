import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';


const OK_ACTION = "OK";
const CANCEL_ACTION = "CANCEL_ACTION";

class AlertDialog extends React.Component {
  constructor(props) {

    super(props);
  }

  handleClose(event, action) {
    this.props.onClose();
    if (action == OK_ACTION && this.props.onOK) {
      this.props.onOK(event);
    }
    if (action == CANCEL_ACTION && this.props.onCancel) {
      this.props.onCancel(event);
    }
  };


  render() {
    var { okContent, message, title, cancelContent, open } = this.props;
    if (message.indexOf("\n") >= 0) {
      message = message.split("\n").map((n) => { return (<p>{n}</p>) });
    }
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        open={open}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={event => this.handleClose(event, CANCEL_ACTION)} color="default">
            {cancelContent}
          </Button>
          <Button variant="contained" onClick={event => this.handleClose(event, OK_ACTION)} color="secondary" autoFocus>
            {okContent}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}


AlertDialog.propTypes = {
  onOK: PropTypes.func,
  onCancel: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  okContent: PropTypes.string,
  cancelContent: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func
};

export default AlertDialog;