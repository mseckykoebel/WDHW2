// assuming that the entire template is loaded before the "Load X more" button is pressed

const commentTemplate = (comment) => {
  return `
    <p class="comment">
      <span>${comment.user.username}</span>
      ${comment.text}
    </p>
  `;
};

const commentsTemplate = (post) => {
  // if there are no comments
  if (post.comments == undefined) {
    console.log("Comment is undefined");
    return ``;
  }
  const comments = post.comments;
  // comment html
  const html = comments.map(commentTemplate).join("\n");
  // if else on the number of comments
  if (comments != undefined && comments.length > 1) {
    // case where there are a lot of comments
    return `
    <div id="comment_section">
      ${html}
      <!-- Button for commenting-->
      <a class="load-more" href="#"
        >Load ${post.comments.length - 1} more</a
      >
      <p class="post-time">${post.display_time}</p>
    </div>
    `;
    // case where there is exactly one comment
  } else if (comments != undefined && comments.length == 1) {
    return `
    <div id="comment_section">
      <p class="comment">
        ${html}
      </p>
      <p class="post-time">${post.display_time}</p>
    </div>
    `;
  } else {
    // case where there are no comments
    return ``;
  }
};

const cardsToHtml = (post) => {
  const comments = commentsTemplate(post);
  return `
  <div class="post">
    <div class="info">
      <div class="user">
        <div>
          <img
            class="profile-pic"
            src="${post.user.thumb_url}"
            alt="The profile image for ${post.user.username}"
          />
        </div>
        <p class="username">${post.user.username}</p>
      </div>
      <img
        src="https://img.icons8.com/material-outlined/344/menu-2.png"
        class="options"
        alt="Individual post options"
      />
    </div>
    <img
      src="${post.image_url}"
      class="post-image"
      alt="The image that ${post.user.username} posted"
    />
    <div class="post-content">
      <div class="reaction-wrapper">
        <img
          src="https://img.icons8.com/ios-glyphs/344/like--v2.png"
          class="icon"
          alt="Heart icon - select this to like the post"
        />
        <img
          src="https://img.icons8.com/ios/344/topic.png"
          class="icon"
          alt="Comment icon - select this to leave a comment"
        />
        <img
          src="https://img.icons8.com/ios/344/paper-plane.png"
          class="icon"
          alt="Share icon - select this to select from a menu to share this post to others"
        />
        <img
          src="https://img.icons8.com/ios/344/bookmark-ribbon--v1.png"
          class="save icon"
          alt="Save icon - select this to save this post to your bookmarks"
        />
      </div>
      <p class="likes">${post.likes.length} likes</p>
      <p class="description">
        <span>${post.user.username}</span> ${post.caption}
      </p>
      <!-- COMMENTS -->
      ${comments}
      <div class="comment-wrapper">
        <img
          src="https://img.icons8.com/fluency-systems-regular/344/happy.png"
          class="icon"
          alt="Smiling face for selecting an emoji to comment on this post"
        />
        <label for="comment_{{posts[i].user.username}}" hidden
          >Write out a comment of this post by {{posts[i].user.username}}</label
        >
        <input
          id="comment_{{posts[i].user.username}}"
          type="text"
          class="comment-box"
          placeholder="Add a comment..."
          name="comment_{{posts[i].user.username}}"
        />
        <button
          id="post_{{posts[i].user.username}}"
          class="comment-btn"
          name="post_{{posts[i].user.username}}"
        >
          Post
        </button>
      </div>
    </div>
  </div>
    `;
};

const getCards = () => {
  fetch("https://photo-app-demo-web-dev.herokuapp.com/api/posts")
    .then((response) => response.json())
    .then((posts) => {
      console.log("Posts: ", posts);
      const html = posts.map(cardsToHtml).join("\n");
      document.querySelector(".cards-container").innerHTML = html;
    })
    .catch((err) => {
      // shitty, make better later
      console.log(err);
    });
};

const initCards = () => {
  getCards();
};

// invoke init page to display stories:
initCards();
