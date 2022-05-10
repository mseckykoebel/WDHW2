const story2Html = (story) => {
  return `
      <div class="stories-container-content">
        <div class="image-container">
          <img
            class="profile-image"
            src="${story.user.thumb_url}"
            alt="${story.user.username}'s story"
          />
        </div>
        <div class="story-username-container">${story.user.username}</div>
      </div>
    `;
};

// fetch data from your API endpoint:
const displayStories = () => {
  fetch("/api/stories")
    .then((response) => response.json())
    .then((stories) => {
      console.log("Stories: ", stories);
      const html = stories.map(story2Html).join("\n");
      document.querySelector(".stories-container").innerHTML = html;
    });
};

const initPage = () => {
  displayStories();
};

// invoke init page to display stories:
initPage();
