import React from "react";
const logo = require("../../ARacer_logo.png")

export class Login extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="base-container" ref={this.props.containerRef}>
            <div className="header">Login</div>
            <div className="content">
                <div className="image">
                    <img src={logo}/>
                </div>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="firstname">Firstname</label>
                        <input type="text" name="firstname" placeholder="firstname"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname">Lastname</label>
                        <input type="text" name="lastname" placeholder="lastname"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-Mail</label>
                        <input type="email" name="email" placeholder="email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="text" name="password" placeholder="password"/>
                    </div>
                </div>
            </div>
            <div className="footer">
                <button type="button" className="btn">
                    Login
                </button>
            </div>
        </div>
    }
}