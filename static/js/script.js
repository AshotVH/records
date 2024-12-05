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
// function filterByRange(sortedArr, minValue, maxValue) {
//   const len = sortedArr.length;
//   let startIndex = 0;
//   let endIndex = len - 1;
//   if (sortedArr[startIndex] < minValue) {
//     let tempStartIndex = startIndex;
//     let tempEndIndex = endIndex;
//     let middleIndex;

//     do {
//       middleIndex = Math.floor((tempEndIndex + tempStartIndex) / 2);
//       if (sortedArr[middleIndex] == minValue) {
//         startIndex = middleIndex;
//         break;
//       } else if (sortedArr[middleIndex] > minValue) {
//         tempEndIndex = middleIndex;
//       } else if (sortedArr[middleIndex] < minValue) {
//         tempStartIndex = middleIndex;
//       }
//       if (tempEndIndex - tempStartIndex <= 1) {
//         startIndex = tempStartIndex;

//         break;
//       }
//     } while (true);
//   }
//   if (sortedArr[endIndex] > maxValue) {
//     let tempStartIndex = startIndex;
//     let tempEndIndex = endIndex;
//     let middleIndex;

//     do {
//       middleIndex = Math.ceil((tempEndIndex + tempStartIndex) / 2);
//       if (sortedArr[middleIndex] == maxValue) {
//         endIndex = middleIndex;
//         break;
//       } else if (sortedArr[middleIndex] > maxValue) {
//         tempEndIndex = middleIndex;
//       } else if (sortedArr[middleIndex] < maxValue) {
//         tempStartIndex = middleIndex;
//       }
//       if (tempEndIndex - tempStartIndex <= 1) {
//         endIndex = tempEndIndex;

//         break;
//       }
//     } while (true);
//   }
//   return sortedArr.slice(startIndex, endIndex + 1);
// }

// let folderTimestamps = [];

// async function getFolders() {
//   try {
//     const response = await fetch("/get_folders");
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return null;
//   }
// }
//constructs array of objects for treeview from unix timestamps
//in milliseconds
function constructTreeData(arrayOfFileNames) {
  let treeData = [];
  for (let fileName of arrayOfTimestamps) {
    let node = {
      text: fileName,
      icon: "fa fa-folder",
    };
    treeData.push(node);
  }
  return treeData;
}
document.addEventListener("DOMContentLoaded", () => {
   
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
      const startDate = startDateTime.replaceAll(" ","_").replaceAll(":","_").replaceAll("/","_");
      const endDate = endDateTime.replaceAll(" ","_").replaceAll(":","_").replaceAll("/","_");
      console.log(startDate)
      console.log(endDate)  
      cam_name = "np04_cam401"
      fetch(`/np04_get_files_list/${cam_name}/${startDate}/${endDate}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('JSON Data:', data);
        constructTreeData(data);
        $("#tree").bstreeview({
          data: treeData,
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error); 
      });
    
      const startTimeStamp = new Date(startDateTime);
      const endTimeStamp = new Date(endDateTime);
      
   



      console.log(endTimeStamp);

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
