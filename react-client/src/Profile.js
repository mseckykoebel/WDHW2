import React from 'react';
import { getHeaders } from './utils';
// import { getProfileFromServer } from './App';

class Profile extends React.Component {
  
    constructor(props) {
        super(props);
        
        this.state = {
            user: {}
        }
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

    render() {
        const user = this.state.user;
        return (
            <header className='user-profile'>
                <img src={user.thumb_url} />
                <h2>{user.username}</h2>
                {/* Profile 123 */}
                {/* Navigation Links */}
            </header>
        )
    }
}

export default Profile;
