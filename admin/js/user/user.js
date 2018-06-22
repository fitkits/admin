$(document).ready(() => {
  getcurrentUserFromLocalStorage = () => {
    return localStorage.getItem("currentUser");
  };

  CURRENT_USER = getcurrentUserFromLocalStorage();
  ATTENDANCE_LIST = [];
  ANSWERS_LIST = [];
  const username = "9366777750";
  const password = "7454";
  const $userName = $("#userName");
  const $pageheading = $('#pageheading');
  const $gender = $("#gender");
  const $mobileNumber = $("#mobileNumber");
  const $totalPresent = $("#totalPresent");
  const $totalAbsent = $("#totalAbsent");
  const $percentPresent = $("#percent_present");
  const $table = $("#user-metric-table")

  if((CURRENT_USER === null ) || (CURRENT_USER === undefined)) {
    window.location.replace("/admin");
  }

  /**
   * ============================================
   * GET BASIC DETAILS
   * ============================================
   */
  settings = {
    url: "https://139.59.80.139/api/v1/cms/users/" + CURRENT_USER,
    method: "GET",

    beforeSend: function(xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Basic " + btoa(username + ":" + password)
      );
      xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    }
  };
  $.ajax(settings).done(data => {
    // console.log("BASIC DATA for", CURRENT_USER, data);
    $userName.text(data.name);
    $pageheading.text(data.name + "'s Profile");
    $gender.text(data.gender);
    $mobileNumber.text(data.mobileNumber);
  });



    /**
   * ============================================
   * GET ATTENDANCE DETAILS
   * ============================================
   */
  PaginatedAjax.get(
    "https://139.59.80.139/api/v1/cms/attendance/",
    username,
    password,
    1,
    "user="+CURRENT_USER
  )
    .then(data => {
      const user_pagination = data.map(datum => {
        const a = [];
        datum.Attendance.map(attendance => {
        //   console.log(attendance);
          ATTENDANCE_LIST.push(attendance);
        });

        return a;
      });
    //   console.log("paginated data", ATTENDANCE_LIST);
      let present = 0;
      let absent = 0;
      let percent_of_present = 0;
      ATTENDANCE_LIST.map((attendance)=> {
        attendance.status ? (present = present + 1) : (absent = absent + 1); 
      });
      $totalPresent.text(present);
      $totalAbsent.text(absent);
      percent_of_present = ((present/(ATTENDANCE_LIST.length)) * 100);
      $percentPresent.text((ATTENDANCE_LIST.length === 0) ? "Insuficent Data" : percent_of_present.toFixed(2) + "%");
    })
    .catch(err => {
      console.log("error in paginatedAjax", err);
    });

     /**
   * ============================================
   * GET METRICS DETAILS
   * ============================================
   */
  PaginatedAjax.get(
    "https://139.59.80.139/api/v1/cms//answers/",
    username,
    password,
    1,
    "user="+CURRENT_USER
  )
    .then(data => {
      const user_pagination = data.map(datum => {
        const a = [];
        datum.Answers.map(answer => {
          console.log(answer);
          ANSWERS_LIST.push(answer);
        });

        return a;
      });
    //   console.log("paginated data", ANSWERS_LIST);
      let present = 0;
      let absent = 0;
      let percent_of_present = 0;
      ANSWERS_LIST.map((answer)=> {
        $table.append(
            `<tr data-mid = "${answer._id}"><td>${
              answer.type
            }</td><td> ${(answer.value).toFixed(2)}</td><td>
            ${answer.modifiedAt.split("T")[0]}</td><td>`
          );
          // <a data-toggle="tooltip" data-placement="top" title="Edit">
          // <i class="fa fa-pencil text-inverse m-r-10"></i></a></span>
          // <span onclick="deleteRow(this)">
          // <a data-toggle="tooltip" data-placement="top" title="Delete">
          // <i class="fa fa-trash text-inverse m-r-10"></i></a>
          // </span>
        });
        $("#user-metric-table").footable({
          sorting: {
            enabled: true
          }
        });
    })
    .catch(err => {
      console.log("error in paginatedAjax", err);
    });
});
