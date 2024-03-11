// converts timestamps UTC (2024-03-06_18-23-22) local time in milliseconds
function toLocalUnixTime(timeStr) {
  let str = timeStr;
  [date, time] = str.split("_");
  time = time.replaceAll("-", ":");
  str = date + " " + time;
  utcDate = new Date(str);
  const localDate = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
  );

  const localUnixTimeStamp = localDate.getTime();
  return localUnixTimeStamp;
}

//converts unix timestamp in milliseconds to timestamps as folder names are, like this, 2024-03-08_11-42-02
function localToUTCTimeStamp(localUnixDate) {
  const date = new Date(localUnixDate);
  const str = date
    .toISOString()
    .slice(0, 19)
    .replaceAll("T", "_")
    .replaceAll(":", "-");
  return str;
}
//formats local time unix timestamp in milliseconds
function localTimeFormatted(localUnixDate) {
  const date = new Date(localUnixDate);
  const str = date.toString().slice(4, 31);
  return str;
}

//receives sorted array (sortedArr) of integer numbers,
//and returns new array of elements between min and max
function filterByRange(sortedArr, minValue, maxValue) {
  const len = sortedArr.length;
  let startIndex = 0;
  let endIndex = len - 1;
  if (sortedArr[startIndex] < minValue) {
    let tempStartIndex = startIndex;
    let tempEndIndex = endIndex;
    let middleIndex;

    do {
      middleIndex = Math.floor((tempEndIndex + tempStartIndex) / 2);
      if (sortedArr[middleIndex] == minValue) {
        startIndex = middleIndex;
        break;
      } else if (sortedArr[middleIndex] > minValue) {
        tempEndIndex = middleIndex;
      } else if (sortedArr[middleIndex] < minValue) {
        tempStartIndex = middleIndex;
      }
      if (tempEndIndex - tempStartIndex <= 1) {
        startIndex = tempStartIndex;

        break;
      }
    } while (true);
  }
  if (sortedArr[endIndex] > maxValue) {
    let tempStartIndex = startIndex;
    let tempEndIndex = endIndex;
    let middleIndex;

    do {
      middleIndex = Math.ceil((tempEndIndex + tempStartIndex) / 2);
      if (sortedArr[middleIndex] == maxValue) {
        endIndex = middleIndex;
        break;
      } else if (sortedArr[middleIndex] > maxValue) {
        tempEndIndex = middleIndex;
      } else if (sortedArr[middleIndex] < maxValue) {
        tempStartIndex = middleIndex;
      }
      if (tempEndIndex - tempStartIndex <= 1) {
        endIndex = tempEndIndex;

        break;
      }
    } while (true);
  }
  return sortedArr.slice(startIndex, endIndex + 1);
}

let folderTimestamps = [];

async function getFolders() {
  try {
    const response = await fetch("/get_folders");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
//constructs array of objects for treeview from unix timestamps
//in milliseconds
function constructTreeData(arrayOfTimestamps) {
  let treeData = [];
  for (let timestamp of arrayOfTimestamps) {
    let folderUTCTImestamp = localToUTCTimeStamp(timestamp);
    let formattedTime = localTimeFormatted(timestamp);
    let node = {
      text: formattedTime,
      icon: "fa fa-folder",
      nodes: [
        {
          text: "cam-401",
          icon: "fa-regular fa-image",
          id: folderUTCTImestamp + " cam401",
          class: "cam_item",
        },
        {
          text: "cam-404",
          icon: "fa-regular fa-image",
          id: folderUTCTImestamp + " cam404",
          class: "cam_item",
        },
        {
          text: "cam-405",
          icon: "fa-regular fa-image",
          id: folderUTCTImestamp + " cam405",
          class: "cam_item",
        },
        {
          text: "cam-407",
          icon: "fa-regular fa-image",
          id: folderUTCTImestamp + " cam407",
          class: "cam_item",
        },
        {
          text: "cam-408",
          icon: "fa-regular fa-image",
          id: folderUTCTImestamp + " cam408",
          class: "cam_item",
        },
        {
          text: "cam-409",
          icon: "fa-regular fa-image",
          id: folderUTCTImestamp + " cam409",
          class: "cam_item",
        },
        {
          text: "cam-410",
          icon: "fa-regular fa-image",
          id: folderUTCTImestamp + " cam410",
          class: "cam_item",
        },
      ],
    };
    treeData.push(node);
  }
  return treeData;
}
document.addEventListener("DOMContentLoaded", () => {
  folderTimestamps = []; //UNIX time in milliseconds
  let treeData = [];
  getFolders().then((data) => {
    for (const [key, value] of Object.entries(data)) {
      if (value.length == 7) {
        folderTimestamps.push(toLocalUnixTime(key));
      }
    }
    folderTimestamps.sort((a, b) => a - b);
    treeData = constructTreeData(folderTimestamps.slice(-30));
    $("#tree").bstreeview({
      data: treeData,
    });
    $(".cam_item").on("click", function (event) {
      event.stopPropagation();
      [timeStamp, filename] = event.target.id.split(" ");
      fetch(`/files/${timeStamp}/${filename}`)
        .then((response) => response.text())
        .then((data) => {
          const element = document.getElementById("screenshot");
          if (element) {
            element.remove();
          }
          const img = document.createElement("img");
          img.setAttribute("class", "screenshot");
          img.src = "data:image/jpeg;base64," + data;
          console.log(document.getElementsByClassName("img_wrapper")[0]);
          console.log(document.getElementsByClassName("img_wrapper")[1]);
          const img_wrappers = document.getElementsByClassName("img_wrapper");
          img_wrappers[0].appendChild(img);
          img_wrappers[1].appendChild(img);
        })
        .catch((error) => console.error("Error:", error));
    });
  });

  let startDateTime = "";
  let endDateTime = "";
  jQuery("#startDateTime").datetimepicker({
    onChangeDateTime: function (dp, $input) {
      startDateTime = $input.val();
    },
  });
  jQuery("#endDateTime").datetimepicker({
    onChangeDateTime: function (dp, $input) {
      endDateTime = $input.val();
    },
  });
  $("#submit_timerange").on("click", function (event) {
    if (startDateTime && endDateTime) {
      const startTimeStamp = new Date(startDateTime);
      const endTimeStamp = new Date(endDateTime);
      const timeStampRange = filterByRange(
        folderTimestamps,
        startTimeStamp,
        endTimeStamp
      );
      treeData = constructTreeData(timeStampRange);
      $("#tree").remove();
      $("#tree_wrapper").append('<div id="tree"></div>');
      $("#tree").bstreeview({
        data: treeData,
      });
      $(".cam_item").on("click", function (event) {
        event.stopPropagation();
        [timeStamp, filename] = event.target.id.split(" ");
        fetch(`/files/${timeStamp}/${filename}`)
          .then((response) => response.text())
          .then((data) => {
            const element = document.getElementById("screenshot");
            if (element) {
              element.remove();
            }
            const img = document.createElement("img");
            img.setAttribute("id", "screenshot");
            img.src = "data:image/jpeg;base64," + data;
            document.getElementsByClassName("img_wrapper")[0].appendChild(img);
          })
          .catch((error) => console.error("Error:", error));
      });
    }
  });
});
