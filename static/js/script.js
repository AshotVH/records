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

/**
 * Converts a local time string (YYYY-MM-DD_HH-MM-SS) to UTC format
 * @param {string} localTime - Local time string in the format YYYY-MM-DD_HH-MM-SS
 * @returns {string} - UTC time string in the same format
 */
function fileNamelocalToUTC(localTime) {
  const [datePart, timePart] = localTime.split("_");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split("-").map(Number);

  // Create a Date object in local time
  const localDate = new Date(year, month - 1, day, hour, minute, second);

  // Convert to UTC and format the result
  const utcDate = new Date(localDate.toISOString());
  const utcYear = utcDate.getUTCFullYear();
  const utcMonth = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
  const utcDay = String(utcDate.getUTCDate()).padStart(2, "0");
  const utcHour = String(utcDate.getUTCHours()).padStart(2, "0");
  const utcMinute = String(utcDate.getUTCMinutes()).padStart(2, "0");
  const utcSecond = String(utcDate.getUTCSeconds()).padStart(2, "0");

  return `${utcYear}-${utcMonth}-${utcDay}_${utcHour}-${utcMinute}-${utcSecond}`;
}

/**
 * Converts a UTC time string (YYYY-MM-DD_HH-MM-SS) to local time
 * @param {string} utcTime - UTC time string in the format YYYY-MM-DD_HH-MM-SS
 * @returns {string} - Local time string in the same format
 */
function fileNameutcToLocal(utcTime) {
  const [datePart, timePart] = utcTime.split("_");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split("-").map(Number);

  // Create a Date object in UTC
  const utcDate = new Date(
    Date.UTC(year, month - 1, day, hour, minute, second)
  );

  // Convert to local time and format the result
  const localYear = utcDate.getFullYear();
  const localMonth = String(utcDate.getMonth() + 1).padStart(2, "0");
  const localDay = String(utcDate.getDate()).padStart(2, "0");
  const localHour = String(utcDate.getHours()).padStart(2, "0");
  const localMinute = String(utcDate.getMinutes()).padStart(2, "0");
  const localSecond = String(utcDate.getSeconds()).padStart(2, "0");

  return `${localYear}-${localMonth}-${localDay}_${localHour}-${localMinute}-${localSecond}`;
}

function constructTreeData(arrayOfFileNames) {
  let treeData = [];
  for (let fullPath of arrayOfFileNames) {
    const parts = fullPath.split("/");
    const fileName = fileNameutcToLocal(
      parts[parts.length - 1]
        .split("_")
        .slice(2, 4)
        .join("_")
        .replace(".jpeg", "")
    );
    let node = {
      text: fileName,
      icon: "fa-regular fa-image",
    };
    treeData.push(node);
  }
  return treeData;
}
document.addEventListener("DOMContentLoaded", () => {
  let cam_name = "np02_cam1";
  $(".btn-check").on("change", function (event) {
    cam_name = event.target.id;
    console.log(cam_name);
    const tree_cam_name = cam_name.split("_")[1].replace("cam","Camera ")
    $(".tree_cam_name").html(tree_cam_name);
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
      const startDate = localToUTC(
        startDateTime
          .replaceAll(" ", "_")
          .replaceAll(":", "_")
          .replaceAll("/", "_")
      );
      const endDate = localToUTC(
        endDateTime
          .replaceAll(" ", "_")
          .replaceAll(":", "_")
          .replaceAll("/", "_")
      );


      fetch(`/np02_get_files_list/${cam_name}/${startDate}/${endDate}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
        
          const treeData = constructTreeData(data);
          $("#tree").remove();
          $("#tree_wrapper").append('<div id="tree"></div>');
          $("#tree").bstreeview({
            data: treeData,
          });

          $(".list-group-item").on("click", function (event) {
            event.stopPropagation();
            buttonFileName =
              cam_name +
              "_" +
              fileNamelocalToUTC(event.target.textContent) +
              ".jpeg";
            
            fetch(`/np02_get_file/${buttonFileName}`)
              .then((response) => response.text())
              .then((data) => {
                const element = document.getElementById("screenshot");
                if (element) {
                  element.remove();
                }
                const img = document.createElement("img");
                img.setAttribute("id", "screenshot");
                img.src = "data:image/jpeg;base64," + data;
                document
                  .getElementsByClassName("img_wrapper")[0]
                  .appendChild(img);
              

              })
              .catch((error) => console.error("Error:", error));
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  });
});
