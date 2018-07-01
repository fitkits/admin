$(document).ready(() => {
  USERNAME = "";
  PASSWORD = "";
  $text_userName = $("#text_username");
  $text_password = $("#text_password");
  $submit_buttons = $("#submitbuttons");
  $proceed_button = $("#proceed_button");

  $text_password.hide();
  $submit_buttons.hide();
});
const sendOTP = () => {
  console.log($text_userName.val());
  $text_password.show();
  $submit_buttons.show();
  $proceed_button.hide();

  const dataToSend = {
    mobileNumber: $text_userName.val().toString()
  };
  console.log("DATA TO SEND", dataToSend);
  const settings = {
    url: "https://139.59.80.139/otp/sendOTP",
    data: dataToSend,
    method: "POST",
    beforeSend: function(xhr) {
      //   xhr.setRequestHeader(
      //     "Authorization",
      //     "Basic " + btoa(username + ":" + password)
      //   );
      xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    }
  };
  $.ajax(settings)
    .done((data, textStatus, request) => {
      console.log(data);
      swal({
        position: "top-right",
        type: "success",
        title:
          "OTP has been sent to your mobile. Please enter it on the OTP textbox",
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
    })
    .fail(xhr => {
      swal({
        title: "Oops...",
        text: "Error Sending OTP. Contact the Admin or try after sometime",
        type: "error",
        confirmButtonColor: "#DD6B55"
      });
      $("#mark-attendance-modal").modal("toggle");
      $(".modal-backdrop").remove();
      // fetchAttendanceData();
      location.reload();
    });
};

const verifyOTP = () => {};
