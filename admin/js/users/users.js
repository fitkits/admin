$(document).ready(() => {
  "use strict";

  let USERS_LIST = [];
  let MEMBERSHIPS_LIST = [];

  let SUBSCRIPTIONS_LIST = [];
  const username = localStorage.getItem("mobileNumber");
  const password = localStorage.getItem("otp");

  if (
    localStorage.getItem("loggedIn") === undefined ||
    localStorage.getItem("loggedIn") === null
  ) {
    window.location.replace("/admin/login.html");
  }
 if(
   localStorage.getItem("role") === 'manager'
 ) {
   $('#add-manager-button').hide();
 }
  const $table = $("#users-table tbody");

  /** Basically to generate user table, we need users, memberships and subscriptions.
   * there is no sane way that comes to my mind at the moment that can actually
   * make sure that all three are available when we build the table. So for now I'm
   * calling the API to fetch users, then in its done() calling memberships and in
   * its done() calling subscriptions(pretty lame right?). Ofcourse I have a
   * function queue called RQueue implemented a long time ago that can do this
   * in a jiffy and it extensively uses promises to make sure things are returned properly.
   * Regardless of the shameless plug-in of my library, Im not using it here because, I'm too
   * lazy to find that code from my shitload of other codes and use it.
   * Its 1 am and I wanna finish this by morning. So Im gonna just go-ahead and
   * shitcode for tomorrow's build. We'll fix it ASAP.(yeah! ASAP :smirks: )
   */

  PaginatedAjax.get(
    BASE_URL + "/api/v1/cms/users",
    username,
    password,
    1
  ).then(user_data => {
    let fetchUsers = [];
    user_data.map(user_datum => {
      console.log("USER DATA", user_datum);
      const a = [];
      user_datum.Users.map(user => {
        // //  console.log(user);
        fetchUsers.push(user);
      });
      return a;
    });

    USERS_LIST = fetchUsers;
    PaginatedAjax.get(
      BASE_URL + "/api/v1/cms/memberships/",
      username,
      password,
      1
    ).then(membership_data => {
      //  console.log("DATA", membership_data);
      let fetchMemberships = [];
      membership_data.map(membership_datum => {
        const a = [];
        membership_datum.Memberships.map(membership => {
          fetchMemberships.push(membership);
        });
        return a;
      });

      MEMBERSHIPS_LIST = fetchMemberships;
      PaginatedAjax.get(
        BASE_URL + "/api/v1/cms/subscriptions",
        username,
        password,
        1
      ).then(data => {
        let fetchsubscriptions = [];
        data.map(datum => {
          const a = [];
          datum.Subscriptions.map(subscription => {
            // //  console.log(subscription);
            fetchsubscriptions.push(subscription);
          });
          return a;
        });
        SUBSCRIPTIONS_LIST = fetchsubscriptions;
        USERS_LIST.forEach(user => {
          let currentMembership = "";
          let userMembershipArray = [];
          let userMembership = {};
  
          const SUBSCRIPTIONS_LIST_SORTED = SUBSCRIPTIONS_LIST.sort((a,b)=> {
            const date_a = moment(a.startDate);
            const date_b = moment(b.startDate);
            // console.log(date_a,date_b,date_a.isBefore(date_b));
              if(date_a.isBefore(date_b)) {
                return 1;
              }
              else {
                return -1;
              }
          })
          // console.log(SUBSCRIPTIONS_LIST_END_DATE_SORTED);
          SUBSCRIPTIONS_LIST_SORTED.forEach(subscription => {
            // console.log("SUBSCRIPTION LIST", moment(subscription.endDate));
          });
          SUBSCRIPTIONS_LIST_SORTED.forEach(subscription => {
            // console.log("SUBSCRIPTION LIST", new Date(subscription.endDate));
            if (subscription.user === user._id) {
              // //  console.log(subscription.user, user._id);
              userMembershipArray.push(subscription);
            }
          });
          userMembership = userMembershipArray[0];
          // userMembershipArray = [];
          // console.log(userMembership,user);
          if(userMembership) {
            currentMembership = MEMBERSHIPS_LIST.find(membership => {
              return membership._id === userMembership.membership;
            });
          }

          
          $table.append(
            `<tr onclick=redirectToUser(this) data-uid = "${user._id}"><td>${
              user.name !== undefined ? user.name : user.mobileNumber
            }</td><td>${
              currentMembership && currentMembership.length !== 0
                ? currentMembership.name
                : "N/A"
            }</td>
          
              <td>${user.gender}</td><td>${
              userMembership
                ? moment(userMembership.startDate).fromNow()
                : "N/A"
            }</td><td>
             ${userMembership? moment(userMembership.endDate).fromNow() : "N/A"}
              </td></tr>`
          );
        });
        $("#users-table").footable();
      });
    });
  });

  // $("#add-managers-modal").on("show.bs.modal", function(e) {
  //   PaginatedAjax.get(
  //     BASE_URL + "/api/v1/cms/users/",
  //     username,
  //     password,
  //     1
  //   )
  //     .then(user_data => {
  //       console.log("USER", user_data);
  //       const user_pagination = user_data.map(datum => {
  //         const a = [];
  //         datum.Users.map(users => {
  //           console.log(users);
  //           USERS_LIST.push(users);
  //         });

  //         return a;
  //       });
  //       //  //  console.log("paginated data", USERS_LIST);
  //       buildDropdown(USERS_LIST, $("#users-select-raw"));
  //     })
  //     .catch(err => {
  //       //  //  console.log("error in paginatedAjax", err);
  //     });
  // });

  /**
   * Submit Handler for attendance
   */
  //  //  console.log($("#mark-attendance-form"));
  $("#add-managers-form").validate({
    rules: {
      managername: {
        required: true
      },
      managermobile: {
        required: true
      }
    },
    messages: {
      managername: "Name is required",
      managermobile: "mobile Number is required"
    },
    submitHandler: (form, event) => {
      event.preventDefault();
      console.log("SUBMIT");
      const formDataJSON = ConvertFormToJSON(form);
      const formData = JSON.parse(formDataJSON);
      const _data = {
        gender: formData.gender,
        name: formData.managername,
        mobileNumber: formData.managermobile,
        role:"manager"
      };
      // var settings = {
      //   async: true,
      //   crossDomain: true,
      //   url: BASE_URL + "/api/v1/cms/users/create",
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: "Bearer " + localStorage.getItem("token"),

      //   },
      //   processData: false,
      //   data: JSON.stringify(_data)
      // };
      const settings = {
        url: BASE_URL + "/api/v1/cms/users/create",
        data: JSON.stringify(_data),
        method: "POST",
        processData: false,

        beforeSend: xhr => {
          xhr.setRequestHeader(
            "Authorization",
            // "Basic " + btoa(username + ":" + password)
            "Bearer " + localStorage.getItem("token")
          );
          xhr.setRequestHeader("Content-Type", "application/json");
        }
      };
      $.ajax(settings)
        .done((users, textStatus, request) => {
          console.log(users, textStatus);
          swal({
            position: "top-right",
            type: "success",
            title: "Manager successfully Created",
            showConfirmButton: false,
            timer: 1500
          });
          $("#add-manager-modal").modal("toggle");
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
            text: "Manager cannot be created.",
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
});
