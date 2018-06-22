$(document).ready(() => {
  "use strict";

  let USERS_LIST = [];

  let $noOfCustomer = $('[rel="noOfCustomers"]');
  const url = "https://139.59.80.139/api/v1/cms/attendance";
  const username = "9366777750";
  const password = "7454";

  /**
   * Generate User Lists.
   */
  $("#mark-attendance-modal").on("show.bs.modal", function(e) {
    // const settings = {
    //       url: "https://139.59.80.139/api/v1/cms/users/",
    //       method: "GET",

    //       beforeSend: function(xhr) {
    //         xhr.setRequestHeader(
    //           "Authorization",
    //           "Basic " + btoa(username + ":" + password)
    //         );
    //         xhr.setRequestHeader(
    //           "content-type",
    //           "application/x-www-form-urlencoded"
    //         );
    //       }
    //     };
    //     $.ajax(settings).done((users, textStatus, request)=> {
    // 	  console.log(users);
    // 	USERS_LIST = users.User;
    // 	buildDropdown(USERS_LIST, $('#users-select-raw'));
    // });


    // $(function() {
    //   console.log("DATE",$("#attendance_datepicker"));
    // $("#attendance_datepicker").datepicker();
    // });


    PaginatedAjax.get(
      "https://139.59.80.139/api/v1/cms/users/",
      username,
      password,
      1
    )
      .then(data => {
        const user_pagination = data.map(datum => {
          const a = [];
          datum.User.map(users => {
            console.log(users);
            USERS_LIST.push(users);
          });

          return a;
        });
        console.log("paginated data", USERS_LIST);
        buildDropdown(USERS_LIST, $("#users-select-raw"));
      })
      .catch(err => {
        console.log("error in paginatedAjax", err);
      });
  });

  /**
   * Submit Handler for attendance
   */
  console.log($("#mark-attendance-form"));
  $("#mark-attendance-form").validate({
    rules: {
      userId: {
        required: true
      },
      attendance: {
        required: true
      }
    },
    messages: {
      userId: "User is required",
      attendance: "Attendance is required"
    },
    submitHandler: (form, event) => {
      event.preventDefault();

      const formDataJSON = ConvertFormToJSON(form);
      const formData = JSON.parse(formDataJSON);
      // alert("Form data" + JSON.stringify(formData));
      const settings = {
        url: "https://139.59.80.139/api/v1/cms/attendance/create",
        data: {
          status: formData.attendance === "present" ? true : false,
          user: formData.userId,
          // timestamp:"2018-04-04T09:09:09"
        },
        method: "POST",

        beforeSend: function(xhr) {
          xhr.setRequestHeader(
            "Authorization",
            "Basic " + btoa(username + ":" + password)
          );
          xhr.setRequestHeader(
            "content-type",
            "application/x-www-form-urlencoded"
          );
        }
      };
      $.ajax(settings)
        .done((users, textStatus, request) => {
          swal({
            position: "top-right",
            type: "success",
            title: "Attendace successfully marked",
            showConfirmButton: false,
            timer: 1500
          });
          $("#mark-attendance-modal").modal("toggle");
          $(".modal-backdrop").remove();
          // fetchAttendanceData();
          /**
           * doing this as a workaround for image backdrop issue.
           * should find a fix soon
           */
          location.reload();
        })
        .fail(xhr => {
          swal({
            title: "Oops...",
            text: "Attendance Cannot be marked.",
            type: "error",
            confirmButtonColor: "#DD6B55"
          });
          $("#mark-attendance-modal").modal("toggle");
          $(".modal-backdrop").remove();
          // fetchAttendanceData();
          location.reload();
        });
    }
  });
  fetchAttendanceData();
});

fetchAttendanceData = () => {
  const url = "https://139.59.80.139/api/v1/cms/attendance";
  const username = "9366777750";
  const password = "7454";
  const settings = {
    url: "https://139.59.80.139/api/v1/cms/attendance",
    method: "GET",

    beforeSend: function(xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Basic " + btoa(username + ":" + password)
      );
      xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    }
  };
  PaginatedAjax.get(
    "https://139.59.80.139/api/v1/cms/attendance",
    username,
    password,
    1
  ).then(data => {
    let attendance_pagination = [];
    data.map(datum => {
      const a = [];
      datum.Attendance.map(attendance => {
        console.log(attendance);
        attendance_pagination.push(attendance);
      });
      return a;
    });
    console.log("attendance_pagination", attendance_pagination);
    let present = 0;
    const total = attendance_pagination.length;

    const top_ten = attendance_pagination.reverse().slice(0, 10);
    attendance_pagination.map(attendance => {
      if (attendance.status) {
        present = present + 1;
      }
      const avg = (present / total) * 100;
      console.log(avg, present, total);
      $("#attendance_avg_h1").text(
        "Average attendance: " + avg.toFixed(2) + " %"
      );
      drawGauge(avg);
    });
    // $.ajax(settings).done(function(response) {
    //   console.log(response);
    //   let present = 0;
    //   const total = response.Attendance.length;

    //   const top_ten = response.Attendance.reverse().slice(0, 5);
    //   response.Attendance.map(attendance => {
    //     if (attendance.status) {
    //       present = present + 1;
    //     }
    //   });
    //   const avg = present / total * 100;
    //   console.log(avg, present, total);
    //   $("#attendance_avg_h1").text(
    //     "Average attendance: " + avg.toFixed(2) + " %"
    //   );
    //   drawGauge(avg);
    top_ten.map(attendance => {
      const settings = {
        url: "https://139.59.80.139/api/v1/cms/users/" + attendance.user,
        method: "GET",

        beforeSend: function(xhr) {
          xhr.setRequestHeader(
            "Authorization",
            "Basic " + btoa(username + ":" + password)
          );
          xhr.setRequestHeader(
            "content-type",
            "application/x-www-form-urlencoded"
          );
        }
      };
      $.ajax(settings).done(function(user) {
        console.log(user);

        let table_data_row =
          "<tr><td>" +
          (user.name !== undefined ? user.name : "Unnamed User") +
          "</td><td>" +
          (user.gender ? user.gender : "NA") +
          "</td><td>" +
          (attendance.status !== undefined
            ? attendance.status
              ? "Present"
              : "Absent"
            : "NA") +
          "</td></tr>";
        $("#attendance_table_body").append(table_data_row);
      });
    });
  });
};

const drawGauge = function(val) {
  "use strict";

  // ==============================================================
  // Attendance total visit
  // ==============================================================
  var opts = {
    angle: 0, // The span of the gauge arc
    lineWidth: 0.42, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
      length: 0.64, // // Relative to gauge radius
      strokeWidth: 0.04, // The thickness
      color: "#000000" // Fill color
    },
    limitMax: false, // If false, the max value of the gauge will be updated if value surpass max
    limitMin: false, // If true, the min value of the gauge will be fixed unless you set it manually
    colorStart: "#009efb", // Colors
    colorStop: "#009efb", // just experiment with them
    strokeColor: "#E0E0E0", // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true // High resolution support
  };
  var target = document.getElementById("attendance-gauge"); // your canvas element
  var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
  gauge.maxValue = 100; // set max gauge value
  gauge.setMinValue(0); // Prefer setter over gauge.minValue = 0
  gauge.animationSpeed = 45; // set animation speed (32 is default value)
  gauge.set(val); // set actual value
};
// var settings = {
// 	"url": "https://139.59.80.139/otp/sendOTP",
// 	"method": "POST",
// 	"headers": {
// 		"content-type": "application/x-www-form-urlencoded",
// 	//   "authorization": "Basic "+btoa(username + ":" + password)
// 	},
// 	data:{
// 		mobileNumber: "9366777750"
// 	}
//   }

//   var settings = {
// 	"url": "https://139.59.80.139/otp/verifyOTP",
// 	"method": "POST",
// 	"headers": {
// 		"content-type": "application/x-www-form-urlencoded",
// 	//   "authorization": "Basic "+btoa(username + ":" + password)
// 	},
// 	data:{
// 		mobileNumber: "9366777750",
// 		otp:2998
// 	}
//   }

// $.ajax({
// 	type: 'GET',
// 	url: url,
// 	success: success,
// 	beforeSend: function (xhr) {
// 		xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
// 	},
//   });

// .fail(xhr => {
// 	$.toast({
// 		heading: 'Processing Error',
// 		text: 'Sorry, We cannot process your request now. Please try after some time',
// 		position: 'top-left',
// 		loaderBg: '#ff6849',
// 		icon: 'warning',
// 		hideAfter: 10000,
// 		stack: 6
// 	});
// });
