import React from 'react';
import './styles/Menu.css';


class ErrorMsg extends React.Component {
    render() {
        return (
            <div className="error-box">
                <div className="error-msg">
                    {this.props.errorMsg}
                </div>
                <button className="error-btn" onClick={this.props.onClickErrorOk}>
                    OK
                </button>
            </div>
        )
    }
}

export default ErrorMsg;
