/**
 * @returns {object} promise - a user object
 */
const getProfile = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/profile/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * @param {*} ev - an event object
 * @returns {void} - classes are changed
 *
 */
const toggleLike = (ev, postId, likeId) => {
  console.log(likeId);
  const elem = ev.currentTarget;
  if (elem.classList.contains("heart-icon")) {
    createNewLike(elem, postId);
  } else {
    removeLike(elem, postId, elem.getAttribute("data-like-id"));
  }
};

/**
 *
 * @param {HTMLElement} elem - like image element
 * @param {string} postId - current post ID
 * @returns {void} - increments the like, and posts a new like in the DB
 */
const createNewLike = async (elem, postId) => {
  console.log("liking");
  const likeData = {
    post_id: postId,
  };
  // post a new like
  const response = await fetch("/api/posts/likes/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(likeData),
  });
  const data_1 = await response.json();
  console.log(data_1);
  elem.classList.add("heart-icon-filled");
  elem.classList.remove("heart-icon");
  elem.setAttribute("data-like-id", data_1.id);
  // count HTML updates
  const count =
    Number(document.querySelector(`.likes-${postId}`).innerHTML.split(" ")[0]) +
    1;
  document.querySelector(`.likes-${postId}`).innerHTML =
    count == 1 ? count + " like" : count + " likes";
};

/**
 *
 * @param {*} elem - heart element
 * @param {string} postId - postID
 * @param {string} likeId - likeID string
 * @returns {void} - decrement the like count
 */
const removeLike = async (elem, postId, likeId) => {
  console.log("unliking");
  console.log("likeID: ", likeId);
  // post a new like
  try {
    await fetch(`/api/posts/likes/${likeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // const data = await response.json();
    elem.classList.remove("heart-icon-filled");
    elem.classList.add("heart-icon");
    elem.setAttribute("data-like-id", null);
    // count HTML updates
    const count =
      Number(
        document.querySelector(`.likes-${postId}`).innerHTML.split(" ")[0]
      ) - 1;
    console.log("THIS IS THE COUNT", count);
    document.querySelector(`.likes-${postId}`).innerHTML =
      count == 1 ? count + " like" : count + " likes";
  } catch (err) {
    console.log("Failed to remove like: ", err);
  }
};

/**
 * @param {*} post - post object
 * @returns {HTMLElement} - an img element with the right class applied
 */
const likeImageTemplate = (post, userId) => {
  // true if the current user likes this post
  const userLikes = post.likes.some((like) => like.user_id == userId);
  // guaranteed to be only one of these
  const userLikesThis = post.likes.find((like) => like.user_id == userId);
  let userLikesId = null;
  if (userLikesThis != undefined) {
    userLikesId = userLikesThis.id;
  }
  // if current user does not like this post
  if (!userLikes) {
    return `
    <img
      src="https://cdn-icons-png.flaticon.com/128/1077/1077035.png"
      id="image-${post.id}"
      data-like-id=${userLikesId}
      class="icon heart-icon"
      alt="Heart icon - select this to like the post"
      onclick="toggleLike(event, ${post.id})"
    />
    `;
  } else {
    return `
      <img
        src="https://cdn-icons-png.flaticon.com/128/2107/2107845.png"
        id="image-${post.id}"
        data-like-id=${userLikesId}
        class="icon heart-icon-filled"
        alt="Heart icon - select this to like the post"
        onclick="toggleLike(event, ${post.id})"
      />
    `;
  }
};

/**
 *
 * @param {*} event - click event from clickng the bookmark icon
 * @param {*} postId - postId event from clicking the post event
 */
const toggleBookmark = (event, postId) => {
  console.log("bookmark pressed");
  const elem = event.currentTarget;
  if (elem.classList.contains("bookmark-icon")) {
    createNewBookmark(elem, postId);
  } else {
    console.log("Remove this bookmark");
    deleteBookmark(elem, elem.getAttribute("data-bookmark-id"));
  }
};

/**
 *
 * @param {*} elem - click event from clicking the bookmark icon
 * @param {*} postId - post ID of the current post we are bookmarking
 */
const createNewBookmark = async (elem, postId) => {
  console.log(postId, "is the post ID");
  const postData = {
    post_id: postId,
  };

  try {
    const response = await fetch("/api/bookmarks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    const data = await response.json();
    console.log("DATA! ", data);
    elem.classList.add("bookmark-icon-filled");
    elem.classList.remove("bookmark-icon");
    elem.setAttribute("data-bookmark-id", data.id);
  } catch (err) {
    console.log("Error with bookmark creation: ", err);
  }
};

/**
 *
 * @param {*} elem - click event from clicking the bookmark icon
 * @param {*} postId - post ID of the current post we are bookmarking
 * @param {*} bookmarkId - bookmark ID of the bookmark we are deleting
 */
const deleteBookmark = async (elem, bookmarkId) => {
  console.log(bookmarkId, "<- BOOKMARK ID");
  console.log("bookmark ID being deleted: ", bookmarkId);
  try {
    await fetch(`http://127.0.0.1:5000/api/bookmarks/${bookmarkId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    elem.classList.remove("bookmark-icon-filled");
    elem.classList.add("bookmark-icon");
    elem.setAttribute("data-bookmark-id", null);
  } catch (err) {
    console.log("There was a problem with removing this bookmark: ", err);
  }
};

/**
 *
 * @param {*} post - single post JSON
 * @param {*} userId - userId for the currently logged in user (not the poster)
 */
const bookmarkTemplate = (postId, userId, bookmarks) => {
  const bookmarkStatus = getBookmark(postId, userId, bookmarks);
  // case where we have bookmarked this
  if (!bookmarkStatus) {
    // case where we have not bookmarked this
    return `
      <img
        src="https://cdn-icons-png.flaticon.com/512/25/25667.png"
        id="bookmark-${postId}"
        class="save icon bookmark-icon"
        alt="Bookmark icon - select this to bookmark this post"
        onclick="toggleBookmark(event, ${postId})"
      />
    `;
  } else {
    return `
      <img
        src="https://cdn-icons-png.flaticon.com/512/102/102279.png"
        id="bookmark-${postId}"
        data-bookmark-id=${bookmarkStatus.id}
        class="save icon bookmark-icon-filled"
        alt="Bookmark icon filled - select this to remove this item from your bookmarks"
        onclick="toggleBookmark(event, ${postId})"
      />
    `;
  }
};

/**
 *
 * @param {*} comment - comment information JSON
 * @returns {HTMLElement} - a comment element
 */
const commentTemplate = (comment) => {
  return `
      <p class="comment">
        <span>${comment.user.username}</span>
        ${comment.text}
      </p>
    `;
};

/**
 *
 * @param {*} post - post JSON
 * @returns {HTMLElement} - a collection of commentTemplates with all of the comment information
 */
const commentsTemplate = (postComments, postId, postDisplayTime) => {
  // if there are no comments
  if (postComments == undefined) {
    console.log("Comment is undefined");
    return ``;
  }
  // comment html (get the first four)
  let html;
  // if else on the number of comments
  if (
    postComments != undefined &&
    postComments.length > 1 &&
    postComments.length < 4
  ) {
    // case where there are a few, but not a ton of comments (less than four)
    html = postComments.map(commentTemplate).join("\n");
    return `
      <div id="comment_section_${postId}">
        ${html}
        <p class="post-time-${postComments.id}">${postDisplayTime}</p>
      </div>
      `;
    // case where there is exactly one comment
  } else if (postComments != undefined && postComments.length == 1) {
    html = postComments.map(commentTemplate).join("\n");
    return `
      <div id="comment_section_${postId}">
        <p class="comment">
          ${html}
        </p>
        <p class="post-time-${postComments.id}">${postDisplayTime}</p>
      </div>
      `;
  } else if (postComments != undefined && postComments.length > 3) {
    // case where there are no comments
    const slicedHTML = postComments.slice(0, 4);
    html = slicedHTML.map(commentTemplate).join("\n");
    const modifiedLength = postComments.length - slicedHTML.length;
    // console.log("modifiedLength: ", modifiedLength);
    return `
      <div id="comment_section_${postId}">
        ${html}
        <!-- Button for commenting-->
        ${modifiedLength != 0
        ? `<a class="load-more" onclick="launchModal('${postId}')"
                  >Load ${modifiedLength} more</a
              >`
        : ``
      }
        <p class="post-time-${postComments.id}">${postDisplayTime}</p>
      </div>
      `;
  } else {
    return ``;
  }
};

/**
 *
 * @param {string} value - comment to be left on the post
 * @param {number} postId - the post ID of the comment being left
 */
const postComment = async (value, postId, postDisplayTime) => {
  const postData = {
    post_id: postId,
    text: value,
  };
  // post the new comment
  try {
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    // get tj
    const data = await response.json();
    // re-set the comment area with the new comment information
    const commentData = await getComments(postId);
    // console.log("COMMENT DATA: ", commentData);
    // updating the comment template
    document.getElementById(`comment_section_${postId}`).innerHTML =
      commentsTemplate(commentData, postId, postDisplayTime);
    // set the input back to something empty (do not do this if the comment fails to send for some reason)
    document.getElementById(`comment_${postId}`).value = "";
  } catch (err) {
    console.log("There was an error posting this comment: ", err);
  }
};

/**
 *
 * @param {*} ev - click event
 * @param {*} post - post JSON
 * @returns {void} - console log for now
 */
const toggleComment = (ev, postId, postDisplayTime) => {
  // const event = ev.currentTarget;
  // value of the comment box
  const inputValue = document.getElementById(`comment_${postId}`).value;
  if (inputValue.length > 0) {
    console.log("something here!");
    postComment(inputValue, postId, postDisplayTime);
  } else {
    console.log("Please enter a comment...");
  }
};

/**
 * Assume that the entire template is loaded before the "load X more" button is pressed
 * @param {*} post - post JSON for a single post
 * @returns {HTMLElement} - a HTML card element
 */
const cardsToHtml = (post, bookmarks) => {
  const profile = document
    .querySelector(".cards-container")
    .getAttribute("data-user-id");
  const heartImage = likeImageTemplate(post, profile);
  const bookmarkImage = bookmarkTemplate(post.id, profile, bookmarks);
  const comments = commentsTemplate(post.comments, post.id, post.display_time);
  //
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
        ${heartImage}
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
        ${bookmarkImage}
      </div>
      <p class="likes data-like-count=${post.likes.length} likes-${post.id}">${post.likes.length} likes</p>
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
        <label for="comment_${post.id}" hidden
          >Write out a comment of this post by ${post.user.username}</label
        >
        <input
          id="comment_${post.id}"
          type="text"
          class="comment-box"
          placeholder="Add a comment..."
          name="comment_${post.id}"
        />
        <button
          id="post_${post.id}"
          class="comment-btn"
          name="post_${post.id}"
          onclick="toggleComment(event, '${post.id}', '${post.display_time}')"
        >
          Post
        </button>
      </div>
    </div>
  </div>
    `;
};

/**
 *
 * @returns {HTMLElement} - render all of the available cards
 */
const getCards = async () => {
  const bookmarks = await getBookmarks();
  console.log("bookmarks received");
  try {
    const response = await fetch("/api/posts");
    const posts = await response.json();
    const html = posts.map((post) => cardsToHtml(post, bookmarks)).join("\n");
    document.querySelector(".cards-container").innerHTML = html;
  } catch (err) {
    console.log("Failed to fetch posts: ", err);
  }
};

/**
 *
 * @param {string} userId - userid for a current post
 * @param {string} postId - postId for a current post
 * @returns {*} - JSON body for matching bookmark if found, or null if not found
 */
const getBookmark = (postId, userId, bookmarks) => {
  console.log("POST ID: ", postId)
  console.log("Bookmarks:", bookmarks);
  const bookmark = bookmarks.find(
    (bookmark) => bookmark.post.id == postId
  );
  console.log("Bookmark that was pulled: ", bookmark)
  if (bookmark == undefined) {
    return null;
  }
  return bookmark;
};

/**
 *
 * @returns {*} - a JSON list of the bookmarks we have
 */
const getBookmarks = async () => {
  const response = await fetch("http://127.0.0.1:5000/api/bookmarks/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

/**
 *
 * @param {number} postId - get a list of comments from the postID
 * @returns {*} - array of comments
 */
const getComments = async (postId) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/api/posts/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data.comments;
  } catch (err) {
    console.log(
      `There was an issue fetching the comments for post ${postId}`,
      err
    );
  }
};

const initCards = async () => {
  getCards();
};

// invoke init page to display stories:
initCards();
