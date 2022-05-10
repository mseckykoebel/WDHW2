const getSuggestions = () => {
  fetch("/api/suggestions")
    .then((response) => response.json())
    .then((suggestions) => {
      console.log("Stories: ", suggestions);
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
};
