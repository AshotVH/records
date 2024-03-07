document.addEventListener("DOMContentLoaded", () => {
  fetch('https://records-slow-control.app.cern.ch/files/2024-03-07_21-07-52/cam405')
  .then(response => response.text())
  .then(data => {
    console.log(data)
    const img = document.createElement('img');
    img.src = 'data:image/jpeg;base64,' + data;
    document.body.appendChild(img);
  })
  .catch(error => console.error('Error:', error));
  
  fetch('https://records-slow-control.app.cern.ch/get_folders')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

});