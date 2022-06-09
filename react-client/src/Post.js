import React from 'react';
import { getHeaders } from './utils';
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';


class Post extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            post: props.model
        }
        this.refreshPostDataFromServer = this.refreshPostDataFromServer.bind(this);
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }
    
    refreshPostDataFromServer() {
        // re-fetch the post: 
        const url = '/api/posts/' + this.state.post.id;
        fetch(url, {
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({
                post: data
            })
        })
    }

    render() {
        const post = this.state.post;
        return (
            
            <section
                className="post">
                <div className="username-icon">
                    <h2>{post.user.username}</h2>
                    <i className="fas fa-ellipsis-h"></i>
                </div>

                <div className="image-post">
                    <img src={post.image_url} />
                </div>
                
                <div className="post-bottom-info">
                    <div className="post-interactions">
                        <div className="like-comment-send">
                            <LikeButton
                            likeId={post.current_user_like_id}
                            postId={post.id}
                            refreshPost={this.refreshPostDataFromServer} />
                            <button><i className="far fa-comment"></i></button>
                            <button><i className="far fa-paper-plane"></i></button>
                        </div>
                        <div className="save-post">
                            <BookmarkButton
                            bookmarkId={post.current_user_bookmark_id}
                            postId={post.id}
                            refreshPost={this.refreshPostDataFromServer} />
                        </div>
                    </div>

                    <div className="num-likes">
                        <h4><span className="likes-post">{post.likes.length} like{post.likes.length != 1 ? 's' : ''}</span></h4>
                    </div>

                    <div className="caption-comments-postdate">
                        <h5><span className="caption-username">{post.user.username}</span>{post.caption}<span className="caption-more"><button>more</button></span></h5>
                        {/* ${ displayComments(post) } */}
                        <h5 className="post-date">{post.display_time}</h5>
                    </div>

                    <div className="add-comment">
                        <div className="comment-smiley">
                            <i className="far fa-smile"></i>
                            <h5 className="adding-comment">Add a comment...</h5>
                            {/* <input class="adding-comment" type="text" placeholder="Add a comment..."> */}
                        </div>
                        <div className="post-comment-action">
                            {/* <h5><button onclick="addComment();">Post</button></h5> */}
                            <h5><button>Post</button></h5>
                        </div>
                    </div>

                </div>

            </section>

        )
    }

}

export default Post;
