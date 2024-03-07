document.addEventListener("DOMContentLoaded", () => {
  fetch('https://records-slow-control.app.cern.ch/files/2024-03-06_14-16-28/cam401')
  .then(response => response.text())
  .then(data => {
    console.log(data); // Base64 encoded data
  })
  .catch(error => console.error('Error:', error));
});