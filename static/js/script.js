document.addEventListener("DOMContentLoaded", () => {
  fetch('https://records-slow-control.app.cern.ch/files/2024-03-06_14-16-28/cam401')
  .then(response => response.text())
  .then(data => {
    console.log(data);
    const img = document.createElement('img');
    // Set the src attribute to a data URL with the Base64 encoded image data
    img.src = 'data:image/jpeg;base64,' + data;
    // Append the img element to the document body or any other element you prefer
    document.body.appendChild(img);
  })
  .catch(error => console.error('Error:', error));
});