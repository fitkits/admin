let GOALS_LIST = [];
const username = localStorage.getItem('mobileNumber');
const password = localStorage.getItem('otp');
$(document).ready(() => {
  "use strict";

  /* Plugins Initialization */
  $(".dropify").dropify();

  const $goalsWrapper = $("#goalsWrapper");
  const $addFieldModal = $("#add-field-modal");
  const $addFieldForm = $("#add-field-form");
  const $addGoalModal = $("#add-goal-modal");
  const $addGoalForm = $("#add-goal-form");
  const $fieldFooTable = $("table").footable();
  const $fieldFootableBody = $("#goal-field-table tbody");
  const $fieldFooTableData = $("table").data("footable");

  if (
    localStorage.getItem("loggedIn") === undefined ||
    localStorage.getItem("loggedIn") === null
  ) {
    window.location.replace("/admin/login.html");
  }
  
  PaginatedAjax.get(
    "http://139.59.80.139/api/v1/cms/goals/",
    username,
    password,
    1
  )
    .then(goal_data => {
		console.log("DATA", goal_data);
      goal_data.map(goal_datum => {
        const a = [];
        goal_datum.goals.map(goal => {
          GOALS_LIST.push(goal);
        });
        return a;
      });
    //   GOALS_LIST = goals;
      GOALS_LIST.forEach(goal => {
        let dataFields = "";
        goal.dataFields.forEach(field => {
          dataFields += `<span class="label label-success mr-2 pt-1 pb-1 mb-2">${
            field.field
          }</span>`;
        });
        $goalsWrapper.append(`
				<div class="card col-sm-6 col-md-4 m-2 p-2" style="cursor:pointer" data-toggle="modal" data-enabled="${
          goal.enabled
        }" data-target="#add-goal-modal">
					<div class="d-flex flex-row justify-content-left">
						<div class="pt-2">
							<img src="${BASE_URL +
                goal.imageURL}" class="img-thumbnail" style="width:100px;height:100px">
						</div>
						<div class="pt-2 pl-2">
							<h1 class="card-title">${goal.name}</h1>
							<p class="card-text">${dataFields}</p>
						</div>
					</div>
					<div class="clearfix">
						<a href="javascript:void(0)" class="btn btn-danger float-right" data-gid="${
              goal._id
            }" data-enabled="${goal.enabled}" onclick="deleteGoal(event)">${
          goal.enabled ? "Disable" : "Enable"
        }</a>
					</div>
			  	</div>`);
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

  $(".add-field").on("click", () => {
    $addFieldModal.modal("show");
    $addGoalModal.modal("hide");
  });

  $addFieldForm.validate({
    rules: {
      fieldName: "required",
      fieldUnit: "required"
    },
    messages: {
      fieldName: "Please specify a field name",
      fieldUnit: "Please specify a field Unit"
    },
    submitHandler: (form, event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const newfieldRow = `<tr><td class="fieldName">${formData.get(
        "fieldName"
      )}</td><td class="fieldUnit">${formData.get("fieldUnit")}</td><td>
			<span class="field-delete"><a data-toggle="tooltip" data-placement="top" title="Delete">
			<i class="fa fa-trash text-inverse m-r-10"></i></a></span></td></tr>`;

      $addFieldModal.modal("hide");
      $addGoalModal.modal("show");
      $fieldFooTableData.appendRow(newfieldRow);

      $fieldFooTable.on("click", ".field-delete", function(e) {
        e.preventDefault();
        //get the row we are wanting to delete
        const field = $(this).parents("tr:first");
        //delete the row
        $fieldFooTableData.removeRow(field);
      });
    }
  });

  $addGoalForm.validate({
    rules: {
      title: "required",
      goalImage: "required"
    },
    messages: {
      title: "Goal must have a suitable title",
      goalImage: "Please upload a valid image"
    },
    submitHandler: (form, event) => {
      event.preventDefault();
      const data = new FormData();
      data.append("imageFile", new FormData(form).get("goalImage"));
      const tmpData = ConvertFormToObject(form);
      tmpData.dataFields = [];
      $fieldFootableBody.children().each(function() {
        const $row = $(this);
        tmpData.dataFields.push({
          field: $row.find("td.fieldName").text(),
          unit: $row.find("td.fieldUnit").text()
        });
      });
      data.append("data", ConverToJSON(tmpData));
      console.log(data.getAll("data"));
      $.ajax({
        method: "POST",
        url: "http://139.59.80.139/api/v1/cms/goals/create",
        beforeSend: function(xhr) {
          xhr.setRequestHeader(
            "Authorization",
            "Basic " + btoa(username + ":" + password)
          );
        },
        data: data,
        processData: false,
        contentType: false
      })
        .done((response, textStatus, request) => {
          let dataFields = "";
          const goal = response.Goal;
          goal.dataFields.forEach(field => {
            dataFields += `<span class="label label-success mr-2 pt-1 pb-1 mb-2">${
              field.field
            }</span>`;
          });
          $goalsWrapper.append(`
				<div class="card col-sm-6 col-md-4 m-2 p-2" style="cursor:pointer" data-toggle="modal" data-enabled="${
          goal.enabled
        }" data-target="#add-goal-modal">
					<div class="d-flex flex-row justify-content-left">
						<div class="pt-2">
							<img src="${BASE_URL +
                goal.imageURL}" class="img-thumbnail" style="width:100px;height:100px">
						</div>
						<div class="pt-2 pl-2">
							<h1 class="card-title">${goal.name}</h1>
							<p class="card-text">${dataFields}</p>
						</div>
					</div>
					<div class="clearfix">
						<a href="javascript:void(0)" class="btn btn-danger float-right" data-gid="${
              goal._id
            }" data-enabled="${
            goal.enabled
          }" onclick="deleteGoal(event)">Delete</a>
					</div>
				  </div>`);

          $addGoalModal.modal("hide");
          $addGoalModal
            .find("input,textarea,select")
            .val("")
            .end();
          $fieldFootableBody.empty();
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
            text: xhr.responseJSON.message,
            type: "error",
            confirmButtonColor: "#DD6B55"
          });
        });
    }
  });
  $addFieldModal.on("hidden.bs.modal", function(e) {
    $(this)
      .find("input,textarea,select")
      .val("")
      .end();

    $addGoalModal.modal("show");
  });

  $(".filter").click(function() {
    $("#goalsWrapper > div").show();
    if (this.id === "all") {
      $("#goalsWrapper > div").fadeIn(450);
    } else if (this.id === "true") {
      $("#goalsWrapper > div")
        .not($('[data-enabled="true"]'))
        .hide(0);
    } else {
      $("#goalsWrapper > div")
        .not($('[data-enabled="false"]'))
        .hide(0);
    }
  });
});
