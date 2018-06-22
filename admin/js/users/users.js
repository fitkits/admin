$(document).ready(() => {
  "use strict";

  let USERS_LIST = [];
  let MEMBERSHIPS_LIST = [];

  let SUBSCRIPTIONS_LIST = [];
  let username = "9366777750";
  let password = "7454";

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
   * shitcode for tomorrow's build. We'll fix it ASAP.(yeah! ASAP :smirks:)
   */

  PaginatedAjax.get(
    "https://139.59.80.139/api/v1/cms/users",
    username,
    password,
    1
  ).then(user_data => {
    console.log("USER DATA", user_data);
    let fetchUsers = [];
    user_data.map(user_datum => {
      const a = [];
      user_datum.User.map(user => {
        // console.log(user);
        fetchUsers.push(user);
      });
      return a;
    });

    USERS_LIST = fetchUsers;
    PaginatedAjax.get(
      "https://139.59.80.139/api/v1/cms/memberships/",
      username,
      password,
      1
    ).then(membership_data => {
      console.log("DATA", membership_data);
      let fetchMemberships = [];
      membership_data.map(membership_datum => {
        const a = [];
        membership_datum.Membership.map(membership => {
          fetchMemberships.push(membership);
        });
        return a;
      });

      MEMBERSHIPS_LIST = fetchMemberships;
      PaginatedAjax.get(
        "https://139.59.80.139/api/v1/cms/subscriptions",
        username,
        password,
        1
      ).then(data => {
        let fetchsubscriptions = [];
        data.map(datum => {
          const a = [];
          datum.subscriptions.map(subscription => {
            // console.log(subscription);
            fetchsubscriptions.push(subscription);
          });
          return a;
        });
        SUBSCRIPTIONS_LIST = fetchsubscriptions;
        USERS_LIST.forEach(user => {
          let currentMembership = "";
          let userMembership = {};
          SUBSCRIPTIONS_LIST.forEach(subscription => {
            if (subscription.user === user._id) {
              // console.log(subscription.user, user._id);
              userMembership = subscription;
              currentMembership = MEMBERSHIPS_LIST.find(membership => {
                return membership._id === userMembership.membership;
              });
              // console.log(currentMembership);
            }
          });
          $table.append(
            `<tr data-uid = "${user._id}"><td>${
              user.name !== undefined ? user.name : "Unnamed User"
            }</td><td>${
              currentMembership && currentMembership.length !== 0
                ? currentMembership.name
                : "N/A"
            }</td>
          
              <td>${user.gender}</td><td>${
              userMembership.startDate
                ? moment(userMembership.startDate).fromNow()
                : "N/A"
            }</td><td>N/A
              </td></tr>`
          );
        });
        $("#users-table").footable();
      });
    });
  });
});
