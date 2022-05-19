const commentTemplateModal = (commentData) => {
    return `
    <div class="single-comment-wrap">
        <div class="modal-comment-profile-wrap">
            <img
            class="comment-profile-image"
            src="${commentData.user.thumb_url}"
            alt="${commentData.user.username}'s comment on this post"
        </div>
        <div class="modal-comment-comment-wrap">
            <p class="comment-content">
                <b>${commentData.user.username}</b>
                ${commentData.text}
            </p>
        </div>
    </div>
    `;
}

/**
 * 
 * @param {*} postData - JSON post object with all comments and info on the poster
 */
const rightTemplate = (postData) => {
    const postDataModal = postData;
    console.log(postData.comments);
    const commentTemplateModalData = postData.comments.map(commentTemplateModal).join("\n")
    return `
        <div class="info-modal">
            <!-- SECTION FOR THE USERNAME -->
            <div class="user-modal">
                <div class="user-modal-container">
                    <img
                    class="profile-pic"
                    src="${postDataModal.user.thumb_url}"
                    alt="The profile image for ${postDataModal.user.username}"
                    />
                </div>
                <div class="modal-username-container">
                    <p class="username-modal">${postDataModal.user.username}</p>
                </div>
            </div>
            <!-- SECTION FOR COMMENTS -->
            <div class="modal-comment-wrap">
                ${commentTemplateModalData}
            </div>
        </div>
    `;
}

/**
 * Open the modal (does not handle closing the modal)
 * @param {string} postId - the post ID for the post that we want to view
 * @returns {void}
 */
const launchModal = async (postId) => {
    const postDataModal = await getPost(postId);
    const commentTemplate = rightTemplate(postDataModal);
    // set the comment area with everything
    document.querySelector(".modal-right-content").innerHTML = commentTemplate;
    // set the image
    document.querySelector("#post-image").setAttribute("src", postDataModal.image_url);
    document.querySelector("#post-image").setAttribute("alt", `Image that ${postDataModal.user.username} posted`);
    // set the comments
    for (i = 0; i < postDataModal.comments.length; i++) {
        console.log(postDataModal.comments[i]);
    }
    // put the modal in view
    document.querySelector(".modal").style.display = "block";
    document.querySelector(".container").classList.add("hide-overflow");
};

/**
 *
 * @param {Event} ev - click event for closing the modal
 */
const closeModal = () => {
    document.querySelector(".modal").style.display = "none";
    document.querySelector(".container").classList.remove("hide-overflow");
};

const initModal = async () => {
    // drop the element into the DOM (initially not visible)
    document.querySelector(".modal").outerHTML = `
    <div class="modal">
        <div class="modal-content">
            <!-- post body end -->
            <div class="modal-left">
                <img
                class="modal-post-image"
                id="post-image"
                src=""
                class="post-image"
                alt=""
                />
            </div>
            <!-- close and comment end -->
            <div class="modal-right">
                <!-- close area -->
                <div class="modal-header">
                    <span class="close" onclick="closeModal(event)">&times;</span>
                </div>
                <!-- comment area -->
                <div class="modal-right-content">
                    This is the comment area, and I am adding it
                </div>
            </div>
        </div>
    </div>
    `;
};

/**
 * 
 * @param {string} postId - the postId for the post content that we want to display
 * @returns {*}
 */
const getPost = async (postId) => {
    try {
        const response = await fetch(`api/posts/${postId}`);
        return await response.json();
    } catch (err) {
        console.log(`There was an issue fetching post ${postId}`, err);
    }
};

// invoke init page to display stories:
initModal();
