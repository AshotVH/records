document.addEventListener("DOMContentLoaded", () => {
  console.log("Hello World!");
  fetch('http://example.com/movies.json')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
  });


});