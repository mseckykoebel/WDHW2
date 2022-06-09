import React from 'react';
import {getHeaders} from './utils';

class Suggestion extends React.Component {  

    constructor(props) {
        super(props);
        this.state = {
            suggestion: props.model,
            followId: null,
        };
        this.refreshSuggestionDataFromServer = this.refreshSuggestionDataFromServer.bind(this);

        // for follow functionality
        this.toggleFollow = this.toggleFollow.bind(this)
        this.createFollow = this.createFollow.bind(this)
        this.removeFollow = this.removeFollow.bind(this)
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    toggleFollow() {
        if (this.state.followId) {
            this.removeFollow();
        } else {
            this.createFollow();
        }
    }

    createFollow() {
        const url = 'api/following';
        const postData = {
            user_id: this.state.suggestion.id
        }
        console.log('create follow:', url);
        fetch(url, {
                headers: getHeaders(),
                method: "POST",
                body: JSON.stringify(postData)
            }).then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({followId: data.id})
            })
    }

    removeFollow() {
        const url = '/api/following/' + this.state.followId;
        console.log('remove follow:', url);
        fetch(url, {
            headers: getHeaders(),
            method: 'DELETE'
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({followId: null})
        })
    }
    
    refreshSuggestionDataFromServer() {
        // re-fetch the suggestion:
        const url = '/api/suggestions';
        fetch(url, {
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({ 
                suggestion: data,
            })
        })
    }

    render () {
        const suggestion = this.state.suggestion;
        const followClass = (this.state.followId ? 'unfollow' : 'follow');
        console.log("suggestion-test",suggestion)
        return (
            <div className="suggestion">
                <img src={suggestion.thumb_url} />
                <div>
                    <p className="username">{suggestion.username}</p>
                    <p className="suggestion-text">suggested for you</p>
                </div>
                <div>
                    <button
                        aria-label="Follow/Unfollow"
                        className="follow"
                        onClick={this.toggleFollow}>{followClass}</button>
                </div>
            </div>
        );  
    }
}

export default Suggestion