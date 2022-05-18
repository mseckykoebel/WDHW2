/**
 * Open the modal (does not handle closing the modal)
 * @param {Event} ev - click event for closing the modal
 * @returns {void}
 */
const launchModal = () => {
    document.querySelector(".modal").style.display = "block";
    // disable pointer events
    document.querySelector(".container").classList.add("hide-overflow");
};

/**
 * 
 * @param {Event} ev - click event for closing the modal
 */
const closeModal = () => {
    document.querySelector(".modal").style.display = "none";
    document.querySelector(".container").classList.remove("hide-overflow");
}

const initModal = () => {
    // drop the element into the DOM (initially not visible)
    document.querySelector(".modal").outerHTML =
        `
    <div class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <span class="close" onclick="closeModal(event)">&times;</span>
                <h2>Modal Header</h2>
            </div>
                <div class="modal-body">
                <p>Some text in the Modal Body</p>
            <p>Some other text...</p>
            </div>
                <div class="modal-footer">
                <h3>Modal Footer</h3>
            </div>
        </div>
    </div>
    `
};

// invoke init page to display stories:
initModal();