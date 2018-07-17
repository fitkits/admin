const BASE_URL = "https://139.59.80.139";
$('[data-toggle="tooltip"]').tooltip();
function ConvertFormToJSON(form) {
  const array = jQuery(form).serializeArray();
  let json = {};

  jQuery.each(array, function() {
    json[this.name] = this.value || "";
  });

  return JSON.stringify(json);
}

function ConvertFormToObject(form) {
  const array = jQuery(form).serializeArray();
  let data = {};

  jQuery.each(array, function() {
    data[this.name] = this.value || "";
  });

  return data;
}
function ConverToJSON(data) {
  return JSON.stringify(data);
}

function getCurrentWeekMonday() {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  const finaldate = new Date(today.setDate(diff));
  const _day = finaldate.getDate();
  const month = finaldate.getMonth() + 1;
  const year = finaldate.getFullYear();
  return (
    year +
    "-" +
    (month < 10 ? "0" + month.toString() : month) +
    "-" +
    (_day < 10 ? "0" + _day.toString() : _day)
  );
}

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function getTodayInServerFormat() {
  const today = new Date();
  const _day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  return (
    year +
    "-" +
    (month < 10 ? "0" + month.toString() : month) +
    "-" +
    (_day < 10 ? "0" + _day.toString() : _day)
  );
}

function getFirstDayOfCurrentMonth() {
  const today = new Date();
  const _day = "01";
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  return (
    year + "-" + (month < 10 ? "0" + month.toString() : month) + "-" + _day
  );
}

function getLastDayOfCurrentMonth(d) {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth() + 1, 0);
}

function buildDropdown(result, dropdown) {
  // Remove current options
  dropdown.html("");
  // Add the empty option with the empty message
  if (result != "") {
    $.each(result, function(k, v) {
      const aux_data =
        v.mobileNumber === undefined ? "Rs. " + v.cost / 100 : v.mobileNumber;
      dropdown.append(
        '<option value="' +
          v._id +
          '">' +
          (v.name ? v.name : "No Name") +
          " (" +
          aux_data +
          ")" +
          "</option>"
      );
    });
  }
}
$(() => {
  $.ajaxSetup({
    dataType: "json",
    beforeSend: function(xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTc4MDk3NzE2OWE0YTVmODhmMjhmOTYiLCJpYXQiOjE1MTc4MTYxODMsImV4cCI6MTUyMDQwODE4M30.re6gTt6GypBy5fLCvvxhBvZuchhPz1m3ERB9YZVVcJg"
      );
    }
  });
});
