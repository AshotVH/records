/**
 * Converts a local time string (YYYY_MM_DD_HH_mm) to UTC format
 * @param {string} localTime - Local time string in the format YYYY_MM_DD_HH_mm
 * @returns {string} - UTC time string in the same format
 */
function localToUTC(localTime) {
  const [year, month, day, hour, minute] = localTime.split("_").map(Number);

  // Create a Date object in local time
  const localDate = new Date(year, month - 1, day, hour, minute);

  // Convert to UTC and format the result
  const utcYear = localDate.getUTCFullYear();
  const utcMonth = String(localDate.getUTCMonth() + 1).padStart(2, "0");
  const utcDay = String(localDate.getUTCDate()).padStart(2, "0");
  const utcHour = String(localDate.getUTCHours()).padStart(2, "0");
  const utcMinute = String(localDate.getUTCMinutes()).padStart(2, "0");

  return `${utcYear}_${utcMonth}_${utcDay}_${utcHour}_${utcMinute}`;
}

/**
 * Converts a UTC time string (YYYY_MM_DD_HH_mm) to local time
 * @param {string} utcTime - UTC time string in the format YYYY_MM_DD_HH_mm
 * @returns {string} - Local time string in the same format
 */
function utcToLocal(utcTime) {
  const [year, month, day, hour, minute] = utcTime.split("_").map(Number);

  // Create a Date object in UTC
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

  // Convert to local time and format the result
  const localYear = utcDate.getFullYear();
  const localMonth = String(utcDate.getMonth() + 1).padStart(2, "0");
  const localDay = String(utcDate.getDate()).padStart(2, "0");
  const localHour = String(utcDate.getHours()).padStart(2, "0");
  const localMinute = String(utcDate.getMinutes()).padStart(2, "0");

  return `${localYear}_${localMonth}_${localDay}_${localHour}_${localMinute}`;
}



function constructTreeData(arrayOfFileNames) {
  let treeData = [];
  for (let fullPath of arrayOfFileNames) {
    const parts = fullPath.split("/");
    const fileName = parts[parts.length - 1].split("_").slice(2, 4).join("_").split(".").slice(0,1).join("");
    let node = {
      text: fileName,
      icon: "fa-regular fa-image",
       };
    treeData.push(node);
  }
  return treeData;
}
document.addEventListener("DOMContentLoaded", () => {
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
      const startDate = localToUTC(startDateTime.replaceAll(" ","_").replaceAll(":","_").replaceAll("/","_"));
      const endDate = localToUTC(endDateTime.replaceAll(" ","_").replaceAll(":","_").replaceAll("/","_"));
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
        const treeData = constructTreeData(data);
        $("#tree").remove();
        $("#tree_wrapper").append('<div id="tree"></div>');
        $("#tree").bstreeview({
            data: treeData,
        });
     
        $(".list-group-item").on("click", function (event) {
          event.stopPropagation();
          buttonFileName = event.target.textContent;
          console.log(buttonFileName);
          fetch(`/np04_get_file/${buttonFileName}`)
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
      })
      .catch(error => {
        console.error('Error fetching data:', error); 
      });
      
    }
  });
});
