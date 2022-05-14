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
  fetch("https://photo-app-demo-web-dev.herokuapp.com/api/stories")
    .then((response) => response.json())
    .then((stories) => {
      const html = stories.map(story2Html).join("\n");
      document.querySelector(".stories-container").innerHTML = html;
    })
    .catch((err) => {
      // shitty, make better later
      console.log(err);
    });
};

const initStories = () => {
  displayStories();
};

// invoke init page to display stories:
initStories();
