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
  return [localTimeString, localDate.getTime()];
}
document.addEventListener("DOMContentLoaded", () => {
  let folderTimestamps = [];
  fetch("https://records-np04-slow-control.app.cern.ch/get_folders")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(Object.keys(data).length);
      let treeData = [];
      for (const [key, value] of Object.entries(data)) {
        if (value.length == 7) {
          folderTimestamps.push(toLocalTimeStr(key)[1]);
          let node = {
            text: toLocalTimeStr(key)[0],
            icon: "fa fa-folder",
            nodes: [
              {
                text: "cam-401",
                icon: "fa-regular fa-image",
                id: key + " cam401",
                class: "cam_item"
              },
              {
                text: "cam-404",
                icon: "fa-regular fa-image",
                id: key + " cam404",
                class: "cam_item"
              },
              {
                text: "cam-405",
                icon: "fa-regular fa-image",
                id: key + " cam405",
                class: "cam_item"
              },
              {
                text: "cam-407",
                icon: "fa-regular fa-image",
                id: key + " cam407",
                class: "cam_item"
              },
              {
                text: "cam-408",
                icon: "fa-regular fa-image",
                id: key + " cam408",
                class: "cam_item"
              },
              {
                text: "cam-409",
                icon: "fa-regular fa-image",
                id: key + " cam409",
                class: "cam_item"
              },
              {
                text: "cam-410",
                icon: "fa-regular fa-image",
                id: key + " cam410",
                class: "cam_item"
              },
            ],
          };
          treeData.push(node);
        }
      }
      console.log(treeData.length);
      console.log(folderTimestamps);
      $("#tree").bstreeview({
        data: treeData,
      });
      $(".cam_item").on("click", function (event) {
        console.log(event.target.id);
        event.stopPropagation();
        [timeStamp, filename] = event.target.id.split(' ');
        fetch(
          `https://records-np04-slow-control.app.cern.ch/files/${timeStamp}/${filename}`
        )
          .then((response) => response.text())
          .then((data) => {
            const element = document.getElementById("screenshot");
            if(element){
              element.remove();
            }
            const img = document.createElement("img");
            img.setAttribute('id','screenshot');
            img.src = "data:image/jpeg;base64," + data;
            document.getElementsByClassName("img_wrapper")[0].appendChild(img);
          })
          .catch((error) => console.error("Error:", error));

      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
});
