/**
 * @returns {object} promise - a user object
 */
const getProfile = () => {
  const profile = fetch("http://127.0.0.1:5000/api/profile/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((err) => {
      console.log("Profile not fetched - error", err);
    });

  return profile;
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
  const count =
    Number(document.querySelector(`.likes-${postId}`).innerHTML.split(" ")[0]) +
    1;
  console.log("THIS IS THE COUNT", count);
  document.querySelector(`.likes-${postId}`).innerHTML =
    count == 1 ? count + " like" : count + " likes";
};

const removeLike = (elem, postId, likeId) => {
  console.log("unliking");
  console.log("likeID: ", likeId);
  // post a new like
  fetch(`/api/posts/likes/${likeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      elem.classList.remove("heart-icon-filled");
      elem.classList.add("heart-icon");
      const count =
        Number(
          document.querySelector(`.likes-${postId}`).innerHTML.split(" ")[0]
        ) - 1;
      console.log("THIS IS THE COUNT", count);
      document.querySelector(`.likes-${postId}`).innerHTML =
        count == 1 ? count + " like" : count + " likes";
    });
  elem.classList.remove("heart-icon-filled");
  elem.classList.add("heart-icon");
  elem.setAttribute("data-like-id", null);
  console.log("unliking");
};

/**
 * @param {*} post - post object
 * @returns {HTMLElement} - an img element with the right class applied
 */
const imageTemplate = (post, userId) => {
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

// assuming that the entire template is loaded before the "Load X more" button is pressed
const cardsToHtml = (post) => {
  const profile = document
    .querySelector(".cards-container")
    .getAttribute("data-user-id");
  const heartImage = imageTemplate(post, profile);
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
        <img
          src="https://img.icons8.com/ios/344/bookmark-ribbon--v1.png"
          class="save icon"
          alt="Save icon - select this to save this post to your bookmarks"
        />
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
