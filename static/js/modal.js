/**
 * Open the modal (does not handle closing the modal)
 * @param {string} postId - the post ID for the post that we want to view
 * @returns {void}
 */
const launchModal = async (postId) => {
    const postData = await getPost(postId);
    // set the image
    document.querySelector("#post-image").setAttribute("src", postData.image_url);
    document.querySelector("#post-image").setAttribute("alt", `Image that ${postData.user.username} posted`);
    // set the comments
    for (i = 0; i < postData.comments.length; i++) {
        console.log(postData.comments[i]);
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
                <div>
                
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
