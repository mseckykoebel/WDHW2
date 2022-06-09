import React from 'react';
import { getHeaders } from './utils';

class Stories extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            stories: []

        }
        // initialization code here
        this.getStoriesFromServer()
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    getStoriesFromServer() { 
        fetch('/api/stories', {
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({
                stories: data
            })
        })
    }

    render() {
        return ( 
            <header className="stories">
                {
                    this.state.stories.map(story => {
                        console.log(story);
                        return (
                            <div>
                                <img src={story.user.thumb_url} className="pic" />
                                <p>{ story.user.username }</p>
                            </div>
                        )
                    })
                }
                {/* Stories 123 */}
                {/* Stories */}
            </header>
        )
    }
}

export default Stories;
