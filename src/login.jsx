import React, { Component } from 'react';

export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            firstname: '',
            lastname: '',
            password: ''
        };
    }


    handleInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        fetch('/users/login', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status === 200) {
                this.props.history.push('/');
            }
            else {
                throw new Error(res.error)
            }
        })
        .catch(err => {
            console.error(err)
            alert('An error occurred while logging in, please try again')
        })
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <h1>Login</h1>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={this.state.email}
                    onChange={this.handleInputChange}
                    required
                />
                <input
                    type="firstname"
                    name="firstname"
                    placeholder="Enter firstname"
                    value={this.state.firstname}
                    onChange={this.handleInputChange}
                    required
                />
                <input
                    type="lastname"
                    name="lastname"
                    placeholder="Enter lastname"
                    value={this.state.lastname}
                    onChange={this.handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    required
                />
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}