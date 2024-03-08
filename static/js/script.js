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
      let treeData = [];
      for (const [key, value] of Object.entries(data)) {
        if (value.length == 7) {
          let node = {
            text: toLocalTimeStr(key),
            icon: "fa fa-folder",
            id: key,
            nodes: [
              {
                text: "cam-401",
                icon: "fa-regular fa-image",
                class: "cam401"
              },
              {
                text: "cam-404",
                icon: "fa-regular fa-image",
                class: "cam404"
              },
              {
                text: "cam-405",
                icon: "fa-regular fa-image",
                class: "cam405"
              },
              {
                text: "cam-407",
                icon: "fa-regular fa-image",
                class: "cam407"
              },
              {
                text: "cam-408",
                icon: "fa-regular fa-image",
                class: "cam408"
              },
              {
                text: "cam-409",
                icon: "fa-regular fa-image",
                class: "cam409"
              },
              {
                text: "cam-410",
                icon: "fa-regular fa-image",
                class: "cam410"
              },
            ],
          };
          treeData.push(node);
        }
      }
      $("#tree").bstreeview({
        data: treeData,
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
});
