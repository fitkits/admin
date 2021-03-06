let MEMBERSHIPS_LIST = [];
let MEMBERSHIPS_HISTORY_LIST = [];
let MEMBERSHIPS_PENDING_LIST = [];
let USERS_LIST = [];
const username = localStorage.getItem("mobileNumber");
const password = localStorage.getItem("otp");
$(document).ready(() => {
  "use strict";

  /* Plugins Initialization */
  $(".dropify").dropify();
  let NEW_MEMBERSHIPSCOUNT_ONLINE_THIS_WEEK = 0;
  let NEW_MEMBERSHIPSCOUNT_OFFLINE_THIS_WEEK = 0;
  let MEMBERSHIPS_DUE_WEEK = 0;
  let MEMBERSHIPS_DUE_MONTH = 0;
  const $newMembershipCountOnline = $("[rel=newMembershipCountOnline]");
  const $newMembershipCountOffline = $("[rel=newMembershipCountOffline]");
  const $membershipsDueThisWeek = $("[rel=membershipsDueThisWeek]");
  const $membershipsDueThisMonth = $("[rel=membershipsDueThisMonth]");

  let fetchMembershipCountOnline = [];
  let fetchMembershipCountOffline = [];

  if (
    localStorage.getItem("loggedIn") === undefined ||
    localStorage.getItem("loggedIn") === null ||
    localStorage.getItem("role").toString() === "manager"
  ) {
    window.location.replace("/admin/login.html");
  }

  var settings = {
    async: true,
    crossDomain: true,
    url:
      BASE_URL +
      "/api/v1/analytics/subscriptions?type=subscriptions&" +
      `start=${getCurrentWeekMonday()}&end=${getTodayInServerFormat()}`,
    method: "GET",

    beforeSend: function(xhr) {
      xhr.setRequestHeader(
        "Authorization",
        // "Basic " + btoa(username + ":" + password)
        "Bearer " + localStorage.getItem("token")
      );
    }
  };

  $.ajax(settings).done(function(response) {
    console.log("ANALYTICS", response);
    if (response.aggregate.value["0"].newSubscriptions.ONLINE["0"]) {
      NEW_MEMBERSHIPSCOUNT_ONLINE_THIS_WEEK =
        response.aggregate.value["0"].newSubscriptions.ONLINE["0"]
          .numberOfNewUsers;
      $newMembershipCountOnline.text(NEW_MEMBERSHIPSCOUNT_ONLINE_THIS_WEEK);
    } else {
      $newMembershipCountOnline.text("0");
    }

    if (response.aggregate.value["0"].newSubscriptions.OFFLINE["0"]) {
      NEW_MEMBERSHIPSCOUNT_OFFLINE_THIS_WEEK =
        response.aggregate.value["0"].newSubscriptions.OFFLINE["0"]
          .numberOfNewUsers;

      $newMembershipCountOffline.text(NEW_MEMBERSHIPSCOUNT_OFFLINE_THIS_WEEK);
    } else {
      $newMembershipCountOffline.text("0");
    }

    if (response.aggregate.value["0"].subscriptionRenewals["0"]) {
      MEMBERSHIPS_DUE_MONTH =
        response.aggregate.value["0"].subscriptionRenewals["0"]
          .numberOfSubscriptionRenewals;
      $membershipsDueThisMonth.text(MEMBERSHIPS_DUE_MONTH);
    } else {
      MEMBERSHIPS_DUE_MONTH = $membershipsDueThisMonth.text("0");
    }
  });

  const today = new Date();
  let fetchMembershipsDueThisWeek;
  PaginatedAjax.get(
    BASE_URL + "/api/v1/cms/subscriptions",
    username,
    password,
    1,
    `start=${getCurrentWeekMonday()}&end=${getTodayInServerFormat()}`
  ).then(data => {
    console.log("DATA", data);
    let membershipsDueWeek = [];
    data.map(datum => {
      const a = [];
      datum.Subscriptions.map(subscription => {
        membershipsDueWeek.push(subscription);
      });
      return a;
    });
    MEMBERSHIPS_DUE_WEEK =
      membershipsDueWeek.length > 0 ? membershipsDueWeek.length : 0;
    $membershipsDueThisWeek.text(MEMBERSHIPS_DUE_WEEK);
  });

  let fetchMembershipsDueThisMonth;
  PaginatedAjax.get(
    BASE_URL + "/api/v1/cms/subscriptions",
    username,
    password,
    1,
    `start=${getFirstDayOfCurrentMonth()}&end=${getTodayInServerFormat()}`
  ).then(data => {
    //  console.log("this month due DATA", data);
    let membershipsDueMonth = [];
    data.map(datum => {
      const a = [];
      datum.Subscriptions.map(subscription => {
        membershipsDueMonth.push(subscription);
      });
      return a;
    });
    MEMBERSHIPS_DUE_MONTH =
      membershipsDueMonth.length > 0 ? membershipsDueMonth.length : 0;
    $membershipsDueThisMonth.text(MEMBERSHIPS_DUE_MONTH);
  });

  //
  PaginatedAjax.get(
    BASE_URL + "/api/v1/cms/memberships/",
    username,
    password,
    1
  )
    .then(data => {
      //  console.log("DATA", data);
      data.map(datum => {
        const a = [];
        datum.Memberships.map(membership => {
          MEMBERSHIPS_LIST.push(membership);
        });
        return a;
      });
      const $mem_plan_table = $("#membership-plan-table tbody");

      MEMBERSHIPS_LIST.forEach(membership => {
        $mem_plan_table.append(
          `<tr data-mid = "${membership._id}"><td>${
            membership.name
          }</td><td> Rs. ${membership.cost / 100}</td><td>
          ${membership.expiryDays}</td>
          <td>
          <div class="form-check  ">
              <input class="form-check-input" type="checkbox" name="membership_status" id="membership_status" disabled ${
                membership.enabled ? "checked" : ""
              }>
              <label class="form-check-label" for="membership_status"> ${
                membership.enabled ? "Enabled" : "Disabled"
              } </label>
          </div>
          </td>
          <td>
          <span data-toggle="modal" data-target="#edit-membership-modal" data-mid="${
            membership._id
          }">
          <a data-toggle="tooltip" data-placement="top" title="Edit">
          <i class="fa fa-pencil text-inverse m-r-10"></i></a></span>
          <span onclick="deleteRow(this)">
          <a data-toggle="tooltip" data-placement="top" title="Delete">
          <i class="fa fa-trash text-inverse m-r-10"></i></a>
          </span>
          </td></tr>`
        );
        // <a data-toggle="tooltip" data-placement="top" title="Edit">
        // <i class="fa fa-pencil text-inverse m-r-10"></i></a></span>
        // <span onclick="deleteRow(this)">
        // <a data-toggle="tooltip" data-placement="top" title="Delete">
        // <i class="fa fa-trash text-inverse m-r-10"></i></a>
        // </span>
      });
      $("#membership-plan-table").footable({
        sorting: {
          enabled: true
        }
      });
    })
    .catch(xhr => {
      $.toast({
        heading: "Processing Error",
        text: "Sorry, We cannot process your request now",
        position: "top-left",
        loaderBg: "#ff6849",
        icon: "warning",
        hideAfter: 10000,
        stack: 6
      });
    });

  /*
===========================================================
MEMBERSHIP HISTORY TABLE
===========================================================
*/
  PaginatedAjax.get(
    BASE_URL + "/api/v1/cms/subscriptions/",
    username,
    password,
    1
  )
    .then(data => {
      //  console.log("MEMBERSHIP HISTORY", data);
      data.map(datum => {
        const a = [];
        datum.Subscriptions.map(membership => {
          MEMBERSHIPS_HISTORY_LIST.push(membership);
        });
        return a;
      });
      PaginatedAjax.get(
        BASE_URL + "/api/v1/cms/users/",
        username,
        password,
        1
      ).then(data => {
        const onlineMemberships = [];
        //  console.log("DATA",data);
        data.map(datum => {
          const a = [];
          datum.Users.map(user => {
            // //  console.log(user);
            USERS_LIST.push(user);
          });
          return a;
        });
        const $mem_history_table = $("#membership-history-table tbody");

        MEMBERSHIPS_HISTORY_LIST = MEMBERSHIPS_HISTORY_LIST.reverse().slice(
          0,
          MEMBERSHIPS_HISTORY_LIST.length
        );
        MEMBERSHIPS_HISTORY_LIST.forEach(membership => {
          //  console.log("USERS");
          let name = "";
          let _membership = "";
          let cost = 0;
          USERS_LIST.map(user => {
            if (user._id === membership.user) {
              name = user.name != undefined ? user.name : user.mobileNumber;
            }
          });
          MEMBERSHIPS_LIST.map(mem => {
            if (mem._id === membership.membership) {
              _membership =
                mem.name != undefined ? mem.name : user.mobileNumber;
              cost = mem.cost;
            }
          });

          $mem_history_table.append(
            `<tr data-mid = "${
              membership._id
            }"><td>${name}</td><td> ${_membership}</td>
            <td>Rs. ${cost / 100}</td>
            <td>
            ${membership.startDate.split("T")[0]}</td><td>
            <span data-toggle="modal" data-target="#edit-membership-modal" data-mid="${
              membership._id
            }">`
          );
          // <a data-toggle="tooltip" data-placement="top" title="Edit">
          // <i class="fa fa-pencil text-inverse m-r-10"></i></a></span>
          // <span onclick="deleteRow(this)">
          // <a data-toggle="tooltip" data-placement="top" title="Delete">
          // <i class="fa fa-trash text-inverse m-r-10"></i></a>
          // </span>
          // </td></tr>

          // <a data-toggle="tooltip" data-placement="top" title="Edit">
          // <i class="fa fa-pencil text-inverse m-r-10"></i></a></span>
          // <span onclick="deleteRow(this)">
          // <a data-toggle="tooltip" data-placement="top" title="Delete">
          // <i class="fa fa-trash text-inverse m-r-10"></i></a>
          // </span>
        });
        $("#membership-history-table").footable({
          sorting: {
            enabled: true
          }
        });
      });
    })
    .catch(xhr => {
      $.toast({
        heading: "Processing Error",
        text: "Sorry, We cannot process your request now",
        position: "top-left",
        loaderBg: "#ff6849",
        icon: "warning",
        hideAfter: 10000,
        stack: 6
      });
    });

  /*
===========================================================
MEMBERSHIP PENDING TABLE
===========================================================
*/
  PaginatedAjax.get(
    BASE_URL + "/api/v1/cms/users/",
    username,
    password,
    1,
    "isPendingMembership=true"
  ).then(data => {
     console.log("MEMBERSHIP PENDING", data);
    data.map(datum => {
      const a = [];
      datum.Users.map(membership => {
        MEMBERSHIPS_PENDING_LIST.push(membership);
      });
      return a;
    });
    // console.log(MEMBERSHIPS_PENDING_LIST);
    // PaginatedAjax.get(
    //   BASE_URL + "/api/v1/cms/users/",
    //   username,
    //   password,
    //   1,
    //   "paymentType=ONLINE"
    // ).then(data => {
    //   const onlineMemberships = [];
    //   // //  console.log("DATA",data);
    //   data.map(datum => {
    //     const a = [];
    //     datum.User.map(user => {
    //       // //  console.log(user);
    //       USERS_LIST.push(user);
    //     });
    //     return a;
    //   });
    const $pending_table = $("#membership-pending-table tbody");

    MEMBERSHIPS_PENDING_LIST = MEMBERSHIPS_PENDING_LIST.reverse().slice(
      0,
      MEMBERSHIPS_PENDING_LIST.length
    );

    MEMBERSHIPS_PENDING_LIST.forEach(membership => {
      //  console.log("USERS");
      let name =
        membership.name !== undefined
          ? membership.name
          : membership.mobileNumber;
      let _userid = membership._id;
      let _membership = "";
      MEMBERSHIPS_LIST.map(mem => {
        if (mem._id === membership.pendingMembership.membership) {
          _membership =
            mem.name != undefined ? mem.name : "NA";
          // console.log(_membership,name)
        }
      });

      $pending_table.append(
          `<tr data-mid = "${
            membership.pendingMembership.membership
          }" data-uid = "${_userid}"><td>${name}</td><td> ${_membership}</td><td>
            <span onclick="approveUser(this)" style = "cursor: pointer !important">
            Click To Approve
            <a data-toggle="tooltip" data-placement="top" title="Approve subscription">
            <i class="fa fa-check text-inverse m-r-10"></i></a>
            </span>`
        );

      // <a data-toggle="tooltip" data-placement="top" title="Delete">
      // <i class="fa fa-trash text-inverse m-r-10"></i></a>
      // </span>
      // </td></tr>

      // <a data-toggle="tooltip" data-placement="top" title="Edit">
      // <i class="fa fa-pencil text-inverse m-r-10"></i></a></span>
      // <span onclick="deleteRow(this)">
      // <a data-toggle="tooltip" data-placement="top" title="Delete">
      // <i class="fa fa-trash text-inverse m-r-10"></i></a>
      // </span>
      // });
      $("#membership-pending-table").footable({
        sorting: {
          enabled: true
        }
      });
    });
  });
  // .catch(xhr => {

  //   $.toast({
  //     heading: "Processing Error",
  //     text: "Sorry, We cannot process your GG request now",
  //     position: "top-left",
  //     loaderBg: "#ff6849",
  //     icon: "warning",
  //     hideAfter: 10000,
  //     stack: 6
  //   });
  // });

  $("#add-membership-form").validate({
    rules: {
      name: {
        required: true
      },
      cost: {
        required: true
      },
      expiryDays: {
        required: true
      },
      membershipImage: {
        required: true
      }
    },
    messages: {
      name: "Please specify a Membership name",
      cost: "Please enter price",
      expiryDays: "Please set a expiry in days",
      membershipImage: "Membership icon is required"
    },
    submitHandler: (form, event) => {
      event.preventDefault();
      const data = new FormData();
      const _data = JSON.parse(ConvertFormToJSON(form));
      //  console.log("Converted JSON", _data, _data.name, _data.cost);
      data.append("name", _data.name);
      data.append("cost", _data.cost);
      data.append("expiryDays", _data.expiryTime);
      data.append("image", new FormData(form).get("membershipImage"));
      // data.append("imageFile", new FormData(form).get("membershipImage"));
      //  console.log("DATA FINAL ", data);
      $.ajax({
        method: "POST",
        url: BASE_URL + "/api/v1/cms/memberships/create",
        beforeSend: function(xhr) {
          xhr.setRequestHeader(
            "Authorization",
            // "Basic " + btoa(username + ":" + password)
            "Bearer " + localStorage.getItem("token")
          );
        },
        data: data,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data"
      })
        .done((response, textStatus, request) => {
          const $mem_plan_table = $("#membership-plan-table tbody");
          const newMembership = response.Memberships;
          MEMBERSHIPS_LIST.push(newMembership);
          console.log(response);
          $mem_plan_table.prepend(
            `<tr data-mid = "${newMembership._id}"><td>${
              newMembership.name
            }</td><td> ${newMembership.cost / 100}</td><td>
            ${newMembership.expiryDays}</td>
            <td>
          <div class="form-check  ">
          <input class="form-check-input" type="checkbox" name="membership_status" id="membership_status" disabled ${
            newMembership.enabled ? "checked" : ""
          }>
          <label class="form-check-label" for="membership_status"> ${
            newMembership.enabled ? "Enabled" : "Disabled"
          } </label>
      </div>
          </td>
          <td>
          <span data-toggle="modal" data-target="#edit-membership-modal" data-mid="${
            newMembership._id
          }">
          <a data-toggle="tooltip" data-placement="top" title="Edit">
          <i class="fa fa-pencil text-inverse m-r-10"></i></a></span>
          <span onclick="deleteRow(this)">
          <a data-toggle="tooltip" data-placement="top" title="Delete">
          <i class="fa fa-trash text-inverse m-r-10"></i></a>
          </span>
          </td></tr>`
          );

          /**
           * edit and delete icons for future use
           */
          //   <a data-toggle="tooltip" data-placement="top" title="Edit">
          //   <i class="fa fa-pencil text-inverse m-r-10"></i></a></span>
          //   <span onclick="deleteRow(this)">
          //   <a data-toggle="tooltip" data-placement="top" title="Delete">
          //   <i class="fa fa-trash text-inverse m-r-10"></i></a>
          //   </span>
          swal({
            position: "top-right",
            type: "success",
            title: "Successfully created",
            showConfirmButton: false,
            timer: 1500
          });
        })
        .fail(xhr => {
          swal({
            title: "Oops...",
            text: "Membership cannot be created.",
            type: "error",
            confirmButtonColor: "#DD6B55"
          });
        });

      $("#add-membership-modal").modal("toggle");
    }
  });
  $("#user-payment-razorpay-form").validate({
    rules: {
      userId: {
        required: true
      },
      membershipId: {
        required: true
      }
    },
    messages: {
      userId: "User is required",
      membershipId: "Membership is required"
    },
    submitHandler: (form, event) => {
      const formDataJSON = ConvertFormToJSON(form);
      const formData = JSON.parse(formDataJSON);
      const currentMembership = MEMBERSHIPS_LIST.find(membership => {
        return membership._id === formData.membershipId;
      });
      const capturePayment = razorpayId => {
        $.post("/payments/capture", {
          _id: razorpayId,
          amount: currentMembership.cost
        })
          .done((response, textStatus, request) => {
            $.ajax({
              method: "PATCH",
              url: BASE_URL + `/api/v1/cms/users/${formData.userId}`,
              // headers: {
              // 	Authorization:
              // 		'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTRiNmFhZDVlZTJiMjZjMjA4Y2UyZmEiLCJpYXQiOjE1MTQ4OTE5ODgsImV4cCI6MTUxNzQ4Mzk4OH0._mjNmw4lVfD1vaboBK3svB5BY5YOn29MiPtLPzFjohw'
              // },
              data: ConverToJSON({
                memberships: [
                  {
                    membership: {
                      _id: formData.membershipId
                    },
                    paymentID: razorpayId
                  }
                ]
              })
              // contentType: 'application/json'
            })
              .done((response, textStatus, request) => {
                NEW_MEMBERSHIPSCOUNT_ONLINE_THIS_WEEK += 1;
                $newMembershipCountOnline.text(
                  NEW_MEMBERSHIPSCOUNT_ONLINE_THIS_WEEK
                );
                swal({
                  position: "top-right",
                  type: "success",
                  title: "Successfully Paid",
                  showConfirmButton: false,
                  timer: 1500
                });
              })
              .fail(xhr => {
                swal({
                  title: "Oops...",
                  text: "Membership cannot be added.",
                  type: "error",
                  confirmButtonColor: "#DD6B55"
                });
              });
          })
          .fail(xhr => {
            swal({
              title: "Oops...",
              text: "Payment capture failed.",
              type: "error",
              confirmButtonColor: "#DD6B55"
            });
          });
      };
      const rpz = RazorPaymentWrapper(
        {
          amount: currentMembership.cost,
          planName: currentMembership.name
        },
        capturePayment
      );
      rpz.open();

      event.preventDefault();
      $("#user-payment-razorpay-modal").modal("toggle");
    }
  });
  $("#user-payment-raw-form").validate({
    rules: {
      userId: {
        required: true
      },
      membershipId: {
        required: true
      },
      amount: {
        required: true,
        min: 1,
        number: true
      }
    },
    messages: {
      userId: "User is required",
      membershipId: "Membership is required",
      amount: "Please specify the amount paid by the user"
    },
    submitHandler: (form, event) => {
      const formDataJSON = ConvertFormToJSON(form);
      const formData = JSON.parse(formDataJSON);
      const currentMembership = MEMBERSHIPS_LIST.find(membership => {
        return membership._id === formData.membershipId;
      });

      settings = {
        url: BASE_URL + `/api/v1/cms/subscriptions`,
        method: "GET",
        data: {
          user: formData.userId
        },

        beforeSend: function(xhr) {
          xhr.setRequestHeader(
            "Authorization",
            // "Basic " + btoa(username + ":" + password)
            "Bearer " + localStorage.getItem("token")
          );
          xhr.setRequestHeader(
            "content-type",
            "application/x-www-form-urlencoded"
          );
        }
      };
      $.ajax(settings).done((response, textStatus, request) => {
        //  console.log("Subscriptions ", response.subscriptions);
        const expiredarray = response.Subscriptions.map(subscription => {
          return subscription.expired;
        });
        //  console.log("expiredArray", expiredarray);
        // if (expiredarray.indexOf(false) >= 0) {
        if (false) {
          swal({
            position: "center",
            type: "info",
            title: "Oops!",
            text:
              "The user has one or more unexpired subscriptions.. Ignoring the create request",
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          let amt = currentMembership.cost;
          let _data = {
            membership: formData.membershipId,
            user: formData.userId,
            paymentType: "OFFLINE",
            amountPaid: amt,
            comments: formData.comment
          };
          settings = {
            url: BASE_URL + `/api/v1/cms/subscriptions/create`,
            method: "POST",
            data: JSON.stringify(_data),

            beforeSend: function(xhr) {
              xhr.setRequestHeader(
                "Authorization",
                // "Basic " + btoa(username + ":" + password)
                "Bearer " + localStorage.getItem("token")
              );
              xhr.setRequestHeader("content-type", "application/json");
            }
          };
          $.ajax(settings).done((response, textStatus, request) => {
            //  console.log("create subscription", response);
          });
          settings = {
            url: BASE_URL + `/api/v1/cms/users/${formData.userId}`,
            method: "PATCH",

            beforeSend: function(xhr) {
              xhr.setRequestHeader(
                "Authorization",
                // "Basic " + btoa(username + ":" + password)
                "Bearer " + localStorage.getItem("token")
              );
              xhr.setRequestHeader(
                "content-type",
                "application/x-www-form-urlencoded"
              );
            },
            data: ConverToJSON({
              memberships: [
                {
                  membership: {
                    _id: formData.membershipId
                  },
                  amountPaid: parseInt(formData.amount)
                }
              ]
            })
          };
          $.ajax(settings)
            //   .done(function(memberships, textstatus, request) {

            //   $.ajax({
            //     method: "PATCH",
            //     url: BASE_URL + `/api/v1/cms/users/${formData.userId}`,
            //     // headers: {
            //     // 	Authorization:
            //     // 		'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTRiNmFhZDVlZTJiMjZjMjA4Y2UyZmEiLCJpYXQiOjE1MTQ4OTE5ODgsImV4cCI6MTUxNzQ4Mzk4OH0._mjNmw4lVfD1vaboBK3svB5BY5YOn29MiPtLPzFjohw'
            //     // },
            //     data: ConverToJSON({
            //       memberships: [
            //         {
            //           membership: {
            //             _id: formData.membershipId
            //           },
            //           amountPaid: parseInt(formData.amount)
            //         }
            //       ]
            //     })
            //     // contentType: 'application/json'
            //   })
            .done((response, textStatus, request) => {
              NEW_MEMBERSHIPSCOUNT_OFFLINE_THIS_WEEK += 1;
              $newMembershipCountOffline.text(
                NEW_MEMBERSHIPSCOUNT_OFFLINE_THIS_WEEK
              );
              swal({
                position: "top-right",
                type: "success",
                title: "Successfully Paid",
                showConfirmButton: false,
                timer: 1500
              });
            })
            .fail(xhr => {
              swal({
                title: "Oops...",
                text: "Membership cannot be added.",
                type: "error",
                confirmButtonColor: "#DD6B55"
              });
            });
        }
      });

      event.preventDefault();
      $("#user-payment-raw-modal").modal("toggle");
    }
  });
  $("#edit-membership-modal").on("show.bs.modal", function(event) {
    const membershipId = $(event.relatedTarget).data("mid");
    const modal = $(this);
    const currentMembership = MEMBERSHIPS_LIST.find(membership => {
      return membership._id === membershipId;
    });
    modal.find("input[name=name]").val(currentMembership.name);
    modal.find("input[name=cost]").val(currentMembership.cost);
    modal.find("input[name=expiryDays]").val(currentMembership.expiryDays);
    // modal.find("input[name=membership_status]").val(currentMembership.enabled ? "1" : "0");
    if (currentMembership.enabled) {
      console.log("CHEKED");
      $("#membership_status_enabled").prop("checked", true);
    } else {
      console.log("CHEKED NOT", $("#memberhsip_status_disabled"));
      $("#membership_status_disable").prop("checked", true);
    }
    modal
      .find("#edit_membership_image")
      .text(currentMembership.image.split("/").pop());
    modal.find("input[name=membership_id]").val(membershipId);
  });
  $("#edit-membership-form").validate({
    rules: {
      name: {
        required: true
      },
      cost: {
        required: true
      },
      expiryDays: {
        required: true
      }
    },
    messages: {
      name: "Please specify a Membership name",
      cost: "Please enter price",
      expiryDays: "Please set a expiry in days"
    },
    submitHandler: (form, event) => {
      const data = new FormData();
      const _data = JSON.parse(ConvertFormToJSON(form));
      //  console.log("Converted JSON", _data, _data.name, _data.cost);
      data.append("name", _data.name);
      data.append("cost", _data.cost);
      data.append("expiryDays", _data.expiryDays);
      data.append(
        "enabled",
        _data.membership_status === "1" ? "true" : "false"
      );
      console.log("EDIT PATCH", JSON.stringify(_data));
      const tempData = new FormData(form);
      if (tempData.has("membershipImage")) {
        data.append("image", tempData.get("membershipImage"));
      }

      $.ajax({
        method: "PATCH", // TODO: Server side fix
        url:
          BASE_URL +
          `/api/v1/cms/memberships/${$(form)
            .find("input[name=membership_id]")
            .val()}`,
        beforeSend: function(xhr) {
          xhr.setRequestHeader(
            "Authorization",
            // "Basic " + btoa(username + ":" + password)
            "Bearer " + localStorage.getItem("token")
          );
        },
        data: data,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data"
      })
        .done((response, textStatus, request) => {
          const $mem_plan_table = $("#membership-plan-table tbody");
          const updatedMembership = response.Memberships;
          const updateMembershipIndex = MEMBERSHIPS_LIST.findIndex(
            membership => {
              return membership._id === updatedMembership._id;
            }
          );
          MEMBERSHIPS_LIST[updateMembershipIndex] = updatedMembership;
          const $membershipRow = $(
            'tbody tr[data-mid="' + updatedMembership._id + '"]'
          );
          $membershipRow.replaceWith(
            `<tr data-mid = "${updatedMembership._id}"><td>${
              updatedMembership.name
            }</td><td> Rs. ${updatedMembership.cost / 100}</td><td>
          ${updatedMembership.expiryDays}</td>
          <td>
          <div class="form-check  ">
          <input class="form-check-input" type="checkbox" name="membership_status" id="membership_status" disabled ${
            updatedMembership.enabled ? "checked" : ""
          }>
          <label class="form-check-label" for="membership_status"> ${
            updatedMembership.enabled ? "Enabled" : "Disabled"
          } </label>
      </div>
          </td>
          <td>
						<span data-toggle="modal" data-target="#edit-membership-modal" data-mid="${
              updatedMembership._id
            }">
            <a data-toggle="tooltip" data-placement="top" title="Edit">
						<i class="fa fa-pencil text-inverse m-r-10"></i></a></span>
						<span onclick="deleteRow(this)">
						<a data-toggle="tooltip" data-placement="top" title="Delete">
						<i class="fa fa-trash text-inverse m-r-10"></i></a>
						</span>
						</td></tr>`
          );
          // <a data-toggle="tooltip" data-placement="top" title="Edit">
          // 			<i class="fa fa-pencil text-inverse m-r-10"></i></a></span>
          // 			<span onclick="deleteRow(this)">
          // 			<a data-toggle="tooltip" data-placement="top" title="Delete">
          // 			<i class="fa fa-trash text-inverse m-r-10"></i></a>
          swal({
            position: "top-right",
            type: "success",
            title: "Successfully updated",
            showConfirmButton: false,
            timer: 1500
          });
        })
        .fail(xhr => {
          swal({
            title: "Oops...",
            text: "Membership cannot be updated.",
            type: "error",
            confirmButtonColor: "#DD6B55"
          });
        });
      event.preventDefault();
      $("#edit-membership-modal").modal("toggle");
    }
  });
  $("#add-membership-modal").on("hidden.bs.modal", function(e) {
    $(this)
      .find("input,textarea,select")
      .val("")
      .end();
  });
  $("#user-payment-razorpay-modal").on("show.bs.modal", function(e) {
    buildDropdown(MEMBERSHIPS_LIST, $("#memberships-select"));
    PaginatedAjax.get(
      BASE_URL + "/api/v1/cms/users/",
      username,
      password,
      1,
      "paymentType=ONLINE"
    ).then(data => {
      const onlineMemberships = [];
      // //  console.log("DATA",data);
      data.map(datum => {
        const a = [];
        datum.Users.map(user => {
          // //  console.log(user);
          USERS_LIST.push(user);
        });
        return a;
      });
      buildDropdown(USERS_LIST, $("#users-select"));
    });
    // settings = {
    //   url: BASE_URL + "/api/v1/cms/users/",
    //   method: "GET",

    //   beforeSend: function(xhr) {
    //     xhr.setRequestHeader(
    //       "Authorization",
    //       "Basic " + btoa(username + ":" + password)
    //     );
    //     xhr.setRequestHeader(
    //       "content-type",
    //       "application/x-www-form-urlencoded"
    //     );
    //   }
    // };
    // $.ajax(settings).done((users, textStatus, request) => {
    //   USERS_LIST = users.User;
    //   buildDropdown(USERS_LIST, $("#users-select"));
    // });
  });
  $("#user-payment-raw-modal").on("show.bs.modal", function(e) {
    const ACTIVE_MEMBERSHIPS_LIST = [];
    MEMBERSHIPS_LIST.map(membership => {
      if (membership.enabled) {
        ACTIVE_MEMBERSHIPS_LIST.push(membership);
      }
    });

    buildDropdown(ACTIVE_MEMBERSHIPS_LIST, $("#memberships-select-raw"));
    settings = {
      url: BASE_URL + "/api/v1/cms/users/",
      method: "GET",

      beforeSend: function(xhr) {
        xhr.setRequestHeader(
          "Authorization",
          // "Basic " + btoa(username + ":" + password)
          "Bearer " + localStorage.getItem("token")
        );
        xhr.setRequestHeader(
          "content-type",
          "application/x-www-form-urlencoded"
        );
      }
    };
    $.ajax(settings).done((users, textStatus, request) => {
      //  console.log(users);
      USERS_LIST = users.Users;
      buildDropdown(USERS_LIST, $("#users-select-raw"));
    });
  });
  $("#user-payment-razorpay-modal").on("hidden.bs.modal", function(e) {
    $(this)
      .find("input,textarea,select")
      .val("")
      .end();
    $(".select2")
      .val(null)
      .trigger("change");
  });
  $("#user-payment-raw-modal").on("hidden.bs.modal", function(e) {
    $(this)
      .find("input,textarea,select")
      .val("")
      .end();
    $(".select2")
      .val(null)
      .trigger("change");
  });

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }
});
