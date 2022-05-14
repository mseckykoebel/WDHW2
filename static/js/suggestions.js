const toggleFollow = (event) => {
  const elem = event.currentTarget;
  elem.innerHTML === "follow"
    ? createNewFollower(elem.dataset.userId, elem)
    : deleteFollower(elem.dataset.followingId, elem);
};

const createNewFollower = (userId, elem) => {
  const followerData = {
    user_id: userId,
  };
  // perform the follow action
  fetch("/api/following", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(followerData),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      elem.innerHTML = "unfollow";
      // change the aria labels
      elem.setAttribute("aria-checked", "true");
      elem.setAttribute("aria-label", "unfollow");
      // change the classes
      elem.classList.add("recommendations-unfollow-button");
      elem.classList.remove("recommendations-follow-button");
      elem.setAttribute("data-following-id", data.id);
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
};

const deleteFollower = (followingId, elem) => {
  // perform the follow action
  fetch(`/api/following/${followingId}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      elem.innerHTML = "follow";
      // change the aria labels
      elem.setAttribute("aria-checked", "false");
      elem.setAttribute("aria-label", "follow");
      // change the classes
      elem.classList.remove("recommendations-unfollow-button");
      elem.classList.add("recommendations-follow-button");
      elem.removeAttribute("data-following-id", data.id);
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
};

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
            <button class="recommendations-follow-button" aria-label="follow" aria-checked="false" data-user-id="${suggestion.id}" onclick="toggleFollow(event)">follow</button>
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
