function toLocalTimeStr(timeStr) {
  let str = timeStr;
  [date, time] = str.split("_");
  time = time.replaceAll("-", ":");
  str = date + " " + time + " UTC";
  utcDate = new Date(str);
  const localDate = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
  );
  const localTimeString = localDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  return localTimeString;
}
document.addEventListener("DOMContentLoaded", () => {
  fetch(
    "https://records-slow-control.app.cern.ch/files/2024-03-07_21-07-52/cam405"
  )
    .then((response) => response.text())
    .then((data) => {
      const img = document.createElement("img");
      img.src = "data:image/jpeg;base64," + data;
      document.body.appendChild(img);
    })
    .catch((error) => console.error("Error:", error));

  fetch("https://records-slow-control.app.cern.ch/get_folders")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(typeof data);
      console.log(data);
      console.log(Object.keys(data).length);
      let treeObject = {};
      for (const [key, value] of Object.entries(data)) {
        if (value.length == 7) {
          treeObject[toLocalTimeStr(key)] = value;
        }
      }
      console.log(treeObject);
      console.log(Object.keys(treeObject).length);

    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
    
    var treeData = [
      {
        text: "Node 1",
        expanded: true,
        icon: "fa fa-folder", // requires font awesome
        nodes: [
          {
            text: "Sub Node 1",
            icon: "fa fa-folder",
            nodes: [
              {
                id:    "sub-node-1",
                text:  "Sub Child Node 1",
                icon:  "fa fa-folder",
                class: "nav-level-3",
                href:  "https://jqueryscript.net"
              },
              {
                text: "Sub Child Node 2",
                icon: "fa fa-folder"
              }
            ]
          },
          {
            text: "Sub Node 2",
             icon: "fa fa-folder"
          }
        ]
      },
      {
        text: "Node 2",
        icon: "fa fa-folder"
      },
      {
        text: "Node 3",
        icon: "fa fa-folder"
      },
      {
        text: "Node 4",
        icon: "fa fa-folder"
      },
      {
        text: "Node 5",
        icon: "fa fa-folder"
      }
  ];

  $('#tree').bstreeview({ 
    data: treeData
  });
});
