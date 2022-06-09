import React from 'react';
import Suggestion from './Suggestion';
import {getHeaders} from './utils';

class Suggestions extends React.Component {  
    constructor(props) {
        super(props);
        // constructor logic
        this.state = {
            suggestions: []
        }
        this.getSuggestionsFromServer()
        console.log('Suggestions component created');
    }

    getSuggestionsFromServer() {
        fetch('/api/suggestions', {
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({
                suggestions: data
            })
        })
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    render () {
        const profile = this.state.profile;
        return (
            <div id="suggestions">
                <p class="suggestions-for-you">Suggestions for you</p>
                <div>
                    {
                        this.state.suggestions.map(suggestion => {
                            return (
                                <Suggestion
                                    key={'suggestion_' + suggestion.id}
                                    model={suggestion} />
                            )
                        })
                    }
                </div>
            </div>
        );     
    }
}

export default Suggestions;