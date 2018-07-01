$(document).ready(() => {
  USERNAME = "";
  PASSWORD = "";
  $text_userName = $("#text_username");
  $text_password = $("#text_password");
  $submit_buttons = $("#submitbuttons");
  $proceed_button = $("#proceed_button");
  $is_manager = $("#isManager");

  $text_password.hide();
  $submit_buttons.hide();

  if (
    localStorage.getItem("loggedIn") !== undefined &&
    localStorage.getItem("loggedIn") !== null
  )  {
    swal({
      position: "top-right",
      type: "success",
      title:
        "Welcome back! "+ $text_userName.val(),
      showConfirmButton: false,
      timer: 1500
    });
    window.location.replace("/admin/index.html");
  }
});
const sendOTP = () => {
  //  console.log()
  if (
    localStorage.getItem("otp") !== undefined &&
    localStorage.getItem("otp") !== null  &&
    localStorage.getItem('mobileNumber').toString() === $text_userName.val()) {
    localStorage.setItem("loggedIn", true);
    const ismanager = ($is_manager[0].checked ? 'Manager' : 'admin');
    localStorage.setItem("role", ismanager);

    location.reload();
  } else {
    //  console.log($text_userName.val());
    $text_password.show();
    $submit_buttons.show();
    $proceed_button.hide();
    const dataToSend = {
      mobileNumber: $text_userName.val().toString()
    };
    //  console.log("DATA TO SEND", dataToSend);
    const settings = {
      url: "https://139.59.80.139/otp/sendOTP",
      data: dataToSend,
      method: "POST",
      beforeSend: function(xhr) {
        //   xhr.setRequestHeader(
        //     "Authorization",
        //     "Basic " + btoa(username + ":" + password)
        //   );
        xhr.setRequestHeader(
          "content-type",
          "application/x-www-form-urlencoded"
        );
      }
    };
    $.ajax(settings)
      .done((data, textStatus, request) => {
        //  console.log(data);
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
      })
      .fail(xhr => {
        swal({
          title: "Oops...",
          text: "Error Sending OTP. Contact the Admin or try after sometime",
          type: "error",
          confirmButtonColor: "#DD6B55"
        });

        location.reload();
      });
  }
};

const verifyOTP = () => {
  const dataToSend = {
    mobileNumber: $text_userName.val().toString(),
    otp: $text_password.val().toString()
  };
  //  console.log("DATA TO SEND", dataToSend);
  const settings = {
    url: "https://139.59.80.139/otp/verifyOTP",
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
      //  console.log(data);
      localStorage.setItem("user", data._id);
      localStorage.setItem("otp", data.otp);
      const ismanager = ($is_manager[0].checked ? 'Manager' : 'admin');
      localStorage.setItem("role", ismanager);
      localStorage.setItem("mobileNumber",data.mobileNumber)
      localStorage.setItem("loggedIn", true);
      swal({
        position: "top-right",
        type: "success",
        title:
        "Welcome back! "+ $text_userName.val(),
        showConfirmButton: false,
        timer: 1500
      });
      location.reload();
    })
    .fail(xhr => {
      swal({
        title: "Oops...",
        text: "Error Verifyin OTP. Contact the Admin or try after sometime",
        type: "error",
        confirmButtonColor: "#DD6B55"
      });

      location.reload();
    });
};


