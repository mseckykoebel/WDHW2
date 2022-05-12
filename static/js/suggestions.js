const suggestionToHtml = (suggestion) => {
  return `
    <div class="recommendations-container-content">
        <div class="recommendations-image-container">
            <img
            class="profile-image"
            src="${suggestion.image_url}"
            alt="Current story preview for ${suggestion.username}"
            />
        </div>
        <div class="recommendations-username-suggested-container">
            <div class="recommendations-username-container">${suggestion.username}</div>
            <div class="recommendations-suggested-container">Follows you</div>
        </div>
        <div class="recommendations-follow-container">
            <button class="recommendations-follow-button">Follow</button>
        </div>
    </div>
    `;
};

const getSuggestions = () => {
  fetch("/api/suggestions")
    .then((response) => response.json())
    .then((suggestions) => {
      const html = suggestions.map(suggestionToHtml).join("\n");
      document.querySelector(".here").outerHTML = html;
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
};

const initSuggestions = () => {
  getSuggestions();
};

// invoke init page to display stories:
initSuggestions();
