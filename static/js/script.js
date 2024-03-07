document.addEventListener("DOMContentLoaded", () => {
  fetch('https://records-slow-control.app.cern.ch/get_folders')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
  });
});