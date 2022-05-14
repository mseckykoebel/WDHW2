const cardsToHtml = (cards) => {
  return `
    <div></div>
    `;
};

const getCards = () => {
  fetch("https://photo-app-demo-web-dev.herokuapp.com/api/posts")
    .then((response) => response.json())
    .then((posts) => {
      console.log(posts);
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
