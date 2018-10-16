let BANNERS_LIST = [];
let USERS_LIST = [];
const username = localStorage.getItem("mobileNumber");
const password = localStorage.getItem("otp");
$(document).ready(() => {
  "use strict";

  /* Plugins Initialization */
  $(".dropify").dropify();

  if (
    localStorage.getItem("loggedIn") === undefined ||
    localStorage.getItem("loggedIn") === null ||
    localStorage.getItem("role").toString() === "manager"
  ) {
    window.location.replace("/admin/login.html");
  }

  PaginatedAjax.get(BASE_URL + "/api/v1/cms/banners", username, password, 1)
    .then(data => {
      console.log("DATA", data);
      data.map(datum => {
        const a = [];
        datum.Banners.map(banner => {
          BANNERS_LIST.push(banner);
        });
        return a;
      });
      const $table = $("#banner-plan-table tbody");

      BANNERS_LIST.forEach(banner => {
        $table.append(
          `<tr data-mid = "${banner._id}"><td>${
            banner.title
          }</td><td  style = " width: 128px;
          height: 128px;">
          <img   style = " width: 128px;
          height: 128px;" src= ${BASE_URL + banner.image} /></td><td  style = " width: 100px;
          height: 100px;">
          <span data-toggle="modal" data-target="#edit-banner-modal" data-mid="${
            banner._id
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
      $("#banner-plan-table").footable({
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

  $("#add-banner-form").validate({
    rules: {
      title: {
        required: true
      },
      bannerImage: {
        required: true
      }
    },
    messages: {
      title: "Please specify a Title for the banner",
      bannerImage: "Banner Image is required"
    },
    submitHandler: (form, event) => {
      event.preventDefault();
      const data = new FormData();
      const _data = JSON.parse(ConvertFormToJSON(form));
      //  console.log("Converted JSON", _data, _data.name, _data.cost);
      data.append("title", _data.title);
      data.append("image", new FormData(form).get("bannerImage"));
      // data.append("imageFile", new FormData(form).get("bannerImage"));
      //  console.log("DATA FINAL ", data);
      $.ajax({
        method: "POST",
        url: BASE_URL + "/api/v1/cms/banners/create",
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
          const $table = $("#banner-plan-table tbody");
          const parsed_data  = JSON.parse(response);
          const newbanner = parsed_data.Banners;
          BANNERS_LIST.push(newbanner);
          console.log(newbanner, "new banner");
          $table.prepend(
            `<tr data-mid = "${newbanner._id}"><td>${
              newbanner.title
            }</td><td  style = " width: 128px;
            height: 128px;">
            <img   style = " width: 128px;
            height: 128px;" src= ${BASE_URL + newbanner.image} /></td><td>
							<span data-toggle="modal" data-target="#edit-banner-modal" data-mid="${
                newbanner._id
              }">
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
            text: "banner cannot be created.",
            type: "error",
            confirmButtonColor: "#DD6B55"
          });
          location.reload(); 
        });

      $("#add-banner-modal").modal("toggle");
      $(".modal-backdrop").remove();
      location.reload();
    }
  });

  $("#edit-banner-modal").on("show.bs.modal", function(event) {
    const bannerId = $(event.relatedTarget).data("mid");
    const modal = $(this);
    const currentbanner = BANNERS_LIST.find(banner => {
      return banner._id === bannerId;
    });
    modal.find("input[name=title]").val(currentbanner.title);
    modal.find("#edit_banner_image").text(currentbanner.image.split("/").pop());
    modal.find("input[name=banner_id]").val(bannerId);
  });
  
  $("#edit-banner-form").validate({
    rules: {
      title: {
        required: true
      },
    },
    messages: {
      title: "Please specify a banner name",
      
    },
    submitHandler: (form, event) => {
      const data = new FormData();
      const _data = JSON.parse(ConvertFormToJSON(form));
      //  console.log("Converted JSON", _data, _data.name, _data.cost);
      data.append("title", _data.title);
      const tempData = new FormData(form);
      const currentBanner = BANNERS_LIST.find(banner => {
        banner._id = ($(form)
        .find("input[name=banner_id]")
        .val());
        
        console.log("SUCCESS", banner._id);
        return 1; 
      })
      const previousImage = currentBanner.image;
      console.log(previousImage, tempData.get("bannerImage"));
      if ( tempData.get("bannerImage").size !== 0 ) {
        data.append("image", tempData.get("bannerImage"));
      }

      $.ajax({
        method: "PATCH", // TODO: Server side fix
        url:
          BASE_URL +
          `/api/v1/cms/banners/${$(form)
            .find("input[name=banner_id]")
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
          const $table = $("#banner-plan-table tbody");
          const parsed_data = JSON.parse(response)
          const updatedbanner = parsed_data.Banners;
        
          const updatebannerIndex = BANNERS_LIST.findIndex(banner => {
            console.log("Banner",updatedbanner)
            return banner._id === updatedbanner._id;
          });
          BANNERS_LIST[updatebannerIndex] = updatedbanner;
          const $bannerRow = $(
            'tbody tr[data-mid="' + updatedbanner._id + '"]'
          );
          $bannerRow.replaceWith(
            `<tr data-mid = "${updatedbanner._id}"><td>${
              updatedbanner.title
            }</td>
            <td  style = " width: 128px;
            height: 128px;">
            <img   style = " width: 128px;
            height: 128px;" src= ${BASE_URL + updatedbanner.image} /></td><td>
						<span data-toggle="modal" data-target="#edit-banner-modal" data-mid="${
              updatedbanner._id
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
            text: "banner cannot be updated.",
            type: "error",
            confirmButtonColor: "#DD6B55"
          });

              location.reload(); 
        });
      event.preventDefault();
      $("#edit-banner-modal").modal("toggle");
      $(".modal-backdrop").remove();
      location.reload();
    }
  });
  $("#add-banner-modal").on("hidden.bs.modal", function(e) {
    $(this)
      .find("input,textarea,select")
      .val("")
      .end();
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
