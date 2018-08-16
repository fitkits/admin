$(document).ready(() => {
  "use strict";

  let USERS_LIST = [];
  let MEMBERSHIP_LISTS = {};
  let MEMBERSHIPS_DUE_MONTH = 0;
  let TOTAL_MEMBERSHIPS = 0;
  const username = localStorage.getItem("mobileNumber");
  const password = localStorage.getItem("otp");
  const today = new Date();

  let $noOfCustomer = $("#usercount");
  let $subscriptiondue = $("#subscriptiondue");
  let $attendance = $("#attendance");
  let $totalmembership = $("#totalmembership");
  let $totalSalesThisWeek = $("#SalesThisWeek");
  let $totalSalesThisWeekGraph = $("#SalesThisWeekGraph");
  let $totalSalesThisMonthGraph = $("#SalesThisMonthGraph");
  let $overallSales = $("#overallSales");

  if (
    localStorage.getItem("loggedIn") === undefined ||
    localStorage.getItem("loggedIn") === null
  ) {
    window.location.replace("/admin/login.html");
  }

  /**
   * ==================================
   * USER COUNT
   * ==================================
   */
  PaginatedAjax.get(
    "http://139.59.80.139/api/v1/cms/users",
    username,
    password,
    1
  )
    .then(user_data => {
      //  console.log("USER DATA", user_data);
      let fetchUsers = [];
      user_data.map(user_datum => {
        const a = [];
        user_datum.Users.map(user => {
          // //  console.log(user);
          fetchUsers.push(user);
        });
        return a;
      });

      USERS_LIST = fetchUsers;
      //  console.log($noOfCustomer);
      $noOfCustomer.text(USERS_LIST.length);
    })
    .catch(xhr => {
      // $.toast({
      // 	heading: 'Processing Error',
      // 	text: 'Sorry, We cannot process your request now. Please try after some time',
      // 	position: 'top-left',
      // 	loaderBg: '#ff6849',
      // 	icon: 'warning',
      // 	hideAfter: 10000,
      // 	stack: 6
      // });
    });

  /**
   * ==================================
   * SUBSCRIPTION DUE
   * ==================================
   */
  PaginatedAjax.get(
    "http://139.59.80.139/api/v1/cms/subscriptions",
    username,
    password,
    1,
    `startDate=${getFirstDayOfCurrentMonth()}&endDate=${today.getTime()}`
  ).then(data => {
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
    //  console.log("this month due this month", MEMBERSHIPS_DUE_MONTH);
    $subscriptiondue.text(MEMBERSHIPS_DUE_MONTH);
  });

  /**
   * ==================================
   * ATTENDANCE
   * ==================================
   */
  PaginatedAjax.get(
    "http://139.59.80.139/api/v1/cms/attendance",
    username,
    password,
    1
  ).then(data => {
    let attendance_pagination = [];
    data.map(datum => {
      const a = [];
      datum.Attendance.map(attendance => {
        //  console.log(attendance);
        attendance_pagination.push(attendance);
      });
      return a;
    });
    //  console.log("attendance_pagination", attendance_pagination);
    let present = 0;
    const total = attendance_pagination.length;

    const top_ten = attendance_pagination.reverse().slice(0, 10);
    attendance_pagination.map(attendance => {
      if (attendance.status) {
        present = present + 1;
      }
      const avg = (present / total) * 100;
      //  console.log(avg, present, total);
      $attendance.text(avg.toFixed(2) + " %");
    });
  });

  /**
   * ==================================
   * ATTENDANCE
   * ==================================
   */
  PaginatedAjax.get(
    "http://139.59.80.139/api/v1/cms/subscriptions",
    username,
    password,
    1
  ).then(data => {
    const memberships = [];
    //  console.log("SUBSCTIPTIONS TOTAL DATA",data);
    data.map(datum => {
      const a = [];
      datum.Subscriptions.map(subscription => {
        // //  console.log(user);
        memberships.push(subscription);
      });
      return a;
    });

    TOTAL_MEMBERSHIPS = memberships.length > 0 ? memberships.length : 0;

    $totalmembership.text(TOTAL_MEMBERSHIPS);
  });

  /**
   * ==================================
   * GET MEMBERSHIPS PRICES.
   * ==================================
   */
  PaginatedAjax.get(
    "http://139.59.80.139/api/v1/cms/memberships",
    username,
    password,
    1
  ).then(data => {
    const memberships = [];
    // //  console.log("MEMBERSHIP LIST TOTAL DATA",data);
    data.map(datum => {
      const a = [];
      datum.Memberships.map(membership => {
        // //  console.log(user);
        MEMBERSHIP_LISTS[membership._id] = membership.cost;
      });
      return a;
    });
    //  console.log("MEMBERSHIP LISTS",MEMBERSHIP_LISTS);
  });

  /**
   * ==================================
   * SUBSCRIPTION SALES THIS WEEK
   * ==================================
   */

  const firstDayOfWeekObj = getMonday(new Date());
  let todayObj = new Date();
  //  let firstDayOnWeek = "2018-5-1";
  let firstDayOnWeek =
    firstDayOfWeekObj.getUTCFullYear() +
    "-" +
    (firstDayOfWeekObj.getUTCMonth() + 1) +
    "-" +
    firstDayOfWeekObj.getUTCDate();
  let endToday =
    todayObj.getUTCFullYear() +
    "-" +
    (todayObj.getUTCMonth() + 1) +
    "-" +
    todayObj.getUTCDate();
  PaginatedAjax.get(
    "http://139.59.80.139/api/v1/analytics/subscriptions",
    username,
    password,
    1,
    "type=sales&start=" + firstDayOnWeek + "&end=" + endToday
  ).then(data => {
    let salesThisWeek = [];

    data.map(sales => {
      salesThisWeek.push(sales);
    });
     console.log("This Week ",salesThisWeek[0].aggregate.value[0].totalSales);
    $totalSalesThisWeek.text(
      salesThisWeek.length !== 0 ? salesThisWeek[0].aggregate.value[0].totalSales : 0
    );
    $totalSalesThisWeekGraph.text(
      salesThisWeek.length !== 0 ? salesThisWeek[0].aggregate.value[0].totalSales : 0
    );
  });

  /**
   * ==================================
   * SUBSCRIPTION SALES THIS MONTH
   * ==================================
   */

  todayObj = new Date();
  endToday =
    todayObj.getUTCFullYear() +
    "-" +
    (todayObj.getUTCMonth() + 1 < 10
      ? "0" + (todayObj.getUTCMonth() + 1)
      : todayObj.getUTCMonth() + 1) +
    "-" +
    (todayObj.getUTCDate() < 10
      ? "0" + todayObj.getUTCDate()
      : todayObj.getUTCDate());
  PaginatedAjax.get(
    "http://139.59.80.139/api/v1/analytics/subscriptions",
    username,
    password,
    1,
    "type=sales&start=" + getFirstDayOfCurrentMonth() + "&end=" + endToday
  ).then(data => {
    let salesThisMonth = [];

    data.map(datum => {
      const a = [];
      datum.aggregate.value.map(sales => {
        salesThisMonth.push(sales);
      });
      return a;
    });
    console.log("This month", salesThisMonth);
    $totalSalesThisMonthGraph.text(
      salesThisMonth.length !== 0 ? salesThisMonth[0].totalSales : 0
    );
  });

  /**
   * ==================================
   * SUBSCRIPTION SALES OVERALL
   * ==================================
   */

  todayObj = new Date();
  let firstDayOnLifetime = "1980-1-1";
  //  let firstDayOnLifetime = firstDayOfWeekObj.getUTCFullYear() +"-" + (firstDayOfWeekObj.getUTCMonth() + 1) + "-" + firstDayOfWeekObj.getUTCDate();
  endToday =
    todayObj.getUTCFullYear() +
    "-" +
    (todayObj.getUTCMonth() + 1) +
    "-" +
    todayObj.getUTCDate();
  PaginatedAjax.get(
    "http://139.59.80.139/api/v1/analytics/subscriptions",
    username,
    password,
    1,
    "type=sales&start=" + firstDayOnLifetime + "&end=" + endToday
  ).then(data => {
    let salesOverall = [];

    data.map(datum => {
      const a = [];
      datum.aggregate.value.map(sales => {
        salesOverall.push(sales);
      });
      return a;
    });
    //  console.log("SubscriptionsS",salesOverall);
    $overallSales.text(
      salesOverall.length !== 0 ? salesOverall[0].totalSales : 0
    );
  });
});
