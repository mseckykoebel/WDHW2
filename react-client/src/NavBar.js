import React from 'react';
import { getHeaders } from './utils';
import { getProfileFromServer } from './Profile';

class NavBar extends React.Component {
  
    constructor(props) {
        super(props);
        console.log('NavBar props:', props);
        this.state = {
            user: {}
        }
        // initialization code here
        this.getProfileFromServer();

    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    getProfileFromServer() { 
        fetch('/api/profile', {
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({
                user: data
            })
        })
    }

    render () {
        return (
            <nav className="main-nav">
                <h1>Photo App</h1>
                <ul>
                    <li>
                        <a href="/api">API Docs</a>
                    </li>
                    <li><span>{ this.state.user.username }</span></li>
                    <li><a href="/logout">Sign out</a></li>
                </ul>
                {/* <h1>{this.props.title}</h1> 
                {this.props.username} */}
                {/* Navigation Links */}
            </nav>
        )
    }
}

export default NavBar;
