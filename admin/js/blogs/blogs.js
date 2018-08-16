let shuffleInstance;
let BLOGS_LIST = [];
const username = localStorage.getItem('mobileNumber');
const password = localStorage.getItem('otp');

$(document).ready(() => {
  "use strict";

  const $blogsWrapper = document.getElementById("blogsWrapper");
  const $loadMoreButton = document.getElementById("load-more-button");
  let currentPage = 1;
  let totalPages;

  if (
    localStorage.getItem("loggedIn") === undefined ||
    localStorage.getItem("loggedIn") === null
  ) {
    window.location.replace("/admin/login.html");
  }
  

  $("input[name=postDate]").bootstrapMaterialDatePicker({
    time: true,
    format: "YYYY-MM-DD[T]HH:mm:ss",
    minDate: new Date()
  });
  $(".dropify").dropify();

  function fetchNextPage() {
    currentPage += 1;

    // $.get('http://139.59.80.139/api/v1/cms/feeds/').done((blogs, textStatus, request) => {
    // Create and insert the markup.
    //	appendMarkupToGrid(getItemMarkup(blogs));

    // Check if there are any more pages to load.
    // if (currentPage === totalPages) {
    //	replaceLoadMoreButton();
    // }

    // Save the total number of new items returned from the API.
    //	let itemsFromResponse = blogs.length; //todo: new items
    // Get an array of elements that were just added to the grid above.
    //	let allItemsInGrid = Array.from($blogsWrapper.children);
    // Use negative beginning index to extract items from the end of the array.
    //let newItems = allItemsInGrid.slice(-itemsFromResponse);

    // Notify the shuffle instance that new items were added.
    //shuffleInstance.add(newItems);
    // });
  }

  /**
   * Convert an object to HTML markup for an item.
   * @param {object} dataForSingleItem Data object.
   * @return {string}
   */
  function getMarkupFromData(dataForSingleItem) {
    const imgsrc = BASE_URL + dataForSingleItem.image;
    //  console.log("image", imgsrc);
    return [
      `<div class="col-12@xs col-12@sm col-6@md col-4@lg  blog_item" style="height: 400px;" rel="${
        dataForSingleItem._id
      }" data-bid="${
        dataForSingleItem._id
      }" data-toggle="modal" data-target="#edit-blog-modal" >
					<div class="card">
						<img class="card-img-top img-fluid" style="max-height:250px; height:1000px"  src="${imgsrc}" alt="${
        dataForSingleItem.title
      }">
						<div class="card-img-overlay">
							<h4 class="card-title text-truncate">${dataForSingleItem.title}</h4>
						</div>
						<div class="card-body">
							<h5 class="text-truncate">${dataForSingleItem.subTitle}</h5>
							<div class="clearfix w-100">
							<p class="float-left mb-0">Posted : ${moment(dataForSingleItem.postDate)
                .startOf("day")
                .fromNow()}</p>
								<a href="#" class="btn btn-danger float-right" data-bid="${
                  dataForSingleItem._id
                }" onclick="deleteBlog(event)">Delete</a>
							</div>
						</div>
					</div>
				</div>`
    ].join("");
  }

  /**
   * Convert an array of item objects to HTML markup.
   * @param {object[]} items Items array.
   * @return {string}
   */
  function getItemMarkup(items) {
    return items.reduce(function(str, item) {
      return str + getMarkupFromData(item);
    }, "");
  }

  /**
   * Append HTML markup to the main Shuffle element.
   * @param {string} markup A string of HTML.
   */
  function appendMarkupToGrid(markup) {
    $blogsWrapper.insertAdjacentHTML("beforeend", markup);
  }

  /**
   * Remove the load more button so that the user cannot click it again.
   */
  function replaceLoadMoreButton() {
    var text = document.createTextNode("All users loaded");
    var replacement = document.createElement("p");
    replacement.appendChild(text);
    $loadMoreButton.parentNode.replaceChild(replacement, $loadMoreButton);
  }

  PaginatedAjax.get(
    "http://139.59.80.139/api/v1/cms/feeds/",
    username,
    password,
    1
  )
    .then(feed_data => {
      //  console.log("DATA", feed_data);
      let fetchfeed = [];
      feed_data.map(feed_datum => {
        const a = [];
        feed_datum.Feeds.map(feed => {
          fetchfeed.push(feed);
        });
        return a;
      });
      BLOGS_LIST = fetchfeed;

      // Store the total number of pages so we know when to disable the "load more" button.
      totalPages = 100; // todo : remove

      // Create and insert the markup.
      appendMarkupToGrid(getItemMarkup(BLOGS_LIST));

      // Add click listener to button to load the next page.
      $loadMoreButton.addEventListener("click", fetchNextPage);

      // Initialize Shuffle now that there are items.

      shuffleInstance = new Shuffle($blogsWrapper, {
        itemSelector: ".blog_item",
        sizer: ".shuffleSizerElement",
        gutterWidth: 10
      });
    })
    .catch(xhr => {
      // $.toast({
      // 	heading: 'Processing Error',
      // 	text: 'Sorry, We cannot process your request now',
      // 	position: 'top-left',
      // 	loaderBg: '#ff6849',
      // 	icon: 'warning',
      // 	hideAfter: 10000,
      // 	stack: 6
      // });
    });
  // $.get('http://139.59.80.139/api/v1/cms/feeds/')
  // 	.done((blogs, textStatus, request) => {
  // 		BLOGS_LIST = blogs;

  // 		// Store the total number of pages so we know when to disable the "load more" button.
  // 		totalPages = 100; // todo : remove

  // 		// Create and insert the markup.
  // 		appendMarkupToGrid(getItemMarkup(blogs));

  // 		// Add click listener to button to load the next page.
  // 		$loadMoreButton.addEventListener('click', fetchNextPage);

  // 		// Initialize Shuffle now that there are items.

  // 		shuffleInstance = new Shuffle($blogsWrapper, {
  // 			itemSelector: '.blog_item',
  // 			sizer: '.shuffleSizerElement',
  // 			gutterWidth: 10
  // 		});
  // 	})
  // 	.fail(xhr => {
  // 		$.toast({
  // 			heading: 'Processing Error',
  // 			text: 'Sorry, We cannot process your request now',
  // 			position: 'top-left',
  // 			loaderBg: '#ff6849',
  // 			icon: 'warning',
  // 			hideAfter: 10000,
  // 			stack: 6
  // 		});
  // 	});

  $("#add-blog-form").validate({
    rules: {
      title: {
        required: true
      },
      subTitle: {
        required: true
      },
      description: {
        required: true
      },
      blogImage: {
        required: true
      },
      author: {
        required: true
      },
      postDate: {
        required: true
      },
      pageURL: {
        required: false
      }
    },
    messages: {
      title: "Enter a catchy headline",
      subTitle: "Subtitle is required",
      description: "Empty blog is not allowed",
      blogImage: "Blog must have a banner image",
      author: "Anonymous feed is not encouraged, seriously.",
      postDate: "Choose a valid time and date",
      pageURL: "Enter a valid url"
    },
    submitHandler: (form, event) => {
      event.preventDefault();
	  const data = new FormData();
	  const _data = JSON.parse(ConvertFormToJSON(form));
	  //  console.log("_data",_data,_data["title"],_data.title);
	  data.append("title", _data.title);
	  data.append("subTitle", _data.subTitle);
	  data.append("description",_data.description);
	  data.append("image", new FormData(form).get("blogImage"));
	  //  console.log("POST DATA", data,ConvertFormToJSON(form), new FormData(form).get("blogImage"));
	//   const data =JSON.parse(ConvertFormToJSON(form));
	// 	data.imageFile =  new FormData(form).get("blogImage")
	var form = new FormData();
	// form.append("image", "/Users/raghuram/Pictures/300x300_Airbus_logo.png");
	// form.append("title", "Lets make Fitkits gteat by testing ");
	// form.append("subTitle", "Test Test");
	
	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "http://139.59.80.139/api/v1/cms/feeds/create",
	  "method": "POST",

	  beforeSend: function(xhr) {
		xhr.setRequestHeader(
		  "Authorization",
      // "Basic " + btoa(username + ":" + password)
      "Bearer " + localStorage.getItem("token")
		);
	},
	  processData: false,
	  contentType: false,
	  mimeType: "multipart/form-data",
	  data: data
	}
	
	$.ajax(settings).done(function (response) {
        //   appendMarkupToGrid(getItemMarkup([response.Feed]));
          let allItemsInGrid = Array.from($blogsWrapper.children);
          let newItem = allItemsInGrid.slice(-1);
          shuffleInstance.add(newItem);
          BLOGS_LIST.push(response.Feed);
          swal({
            position: "top-right",
            type: "success",
            title: "Successfully created",
            showConfirmButton: false,
            timer: 1500
		  });
		  location.reload();
        })
        .fail(xhr => {
          swal({
            title: "Oops...",
            text: "Blog cannot be created.",
            type: "error",
            confirmButtonColor: "#DD6B55"
		  });
		  location.reload();
        });

        $("#add-blog-modal").modal("toggle");
    }
  });
  $("#edit-blog-form").validate({
    rules: {
      title: {
        required: true
      },
      subTitle: {
        required: true
      },
      description: {
        required: true
      },
      blogImage: {
        required: false
      },
      author: {
        required: true
      },
      postDate: {
        required: true
      },
      pageURL: {
        required: false
      }
    },
    messages: {
      title: "Enter a catchy headline",
      subTitle: "Subtitle is required",
      description: "Empty blog is not allowed",
      blogImage: "Blog must have a banner image",
      author: "Anonymous feed is not encouraged, seriously.",
      postDate: "Choose a valid time and date",
      pageURL: "Enter a valid url"
    },
    submitHandler: (form, event) => {
      const data = new FormData();
      const blogId = $(form)
        .find("input[name=blogId]")
		.val();
		const _data = JSON.parse(ConvertFormToJSON(form));
		data.append("title", _data.title);
		data.append("subTitle", _data.subTitle);
    data.append("description",_data.description);
    const tempData = new FormData(form);
    if (tempData.has("blogImage")) {
      data.append("image", tempData.get("blogImage"));
    }
		data.append("image", new FormData(form).get("blogImage"));
      $.ajax({
        method: "PATCH",
        url: `http://139.59.80.139/api/v1/cms/feeds/${blogId}`,
		beforeSend: function(xhr) {
			xhr.setRequestHeader(
			  "Authorization",
        // "Basic " + btoa(username + ":" + password)
        "Bearer " + localStorage.getItem("token")
			);
		},
        data: data,
        processData: false,
        contentType: false
      })
        .done((response, textStatus, request) => {
          const updateBlogIndex = BLOGS_LIST.findIndex(blog => {
            return blog._id === blogId;
          });
          BLOGS_LIST[updateBlogIndex] = response.Feed;
          shuffleInstance.remove([document.querySelector(`[rel="${blogId}"]`)]);
          appendMarkupToGrid(getItemMarkup([response.Feed]));
          let allItemsInGrid = Array.from($blogsWrapper.children);
          let newItem = allItemsInGrid.slice(-1);
          shuffleInstance.add(newItem);
          swal({
            position: "top-right",
            type: "success",
            title: "Successfully updated",
            showConfirmButton: false,
            timer: 1500
		  });
		  location.reload();
        })
        .fail(xhr => {
          swal({
            title: "Oops...",
            text: "Update cannot be Done.",
            type: "error",
            confirmButtonColor: "#DD6B55"
		  });
		  location.reload();
        });
      event.preventDefault();
      $("#edit-blog-modal").modal("toggle");
    }
  });
  $("#add-blog-modal").on("hidden.bs.modal", function(e) {
    $(this)
      .find("input,textarea,select")
      .val("")
      .end();
    $(".select2")
      .val(null)
      .trigger("change");
  });
  $("#edit-blog-modal").on("show.bs.modal", function(event) {
    const blogId = $(event.relatedTarget).data("bid");
    const modal = $(this);
    const currentBlog = BLOGS_LIST.find(blog => {
      return blog._id === blogId;
    });
    modal.find("input[name=title]").val(currentBlog.title);
    modal.find("input[name=subTitle]").val(currentBlog.subTitle);
    modal.find("textarea[name=description]").val(currentBlog.description);
    modal.find("input[name=author]").val(currentBlog.author);
    modal.find("input[name=postDate]").val(currentBlog.postDate);
    modal.find("input[name=pageURL]").val(currentBlog.pageURL);
    modal.find("#editBlogImage").text(currentBlog.image.split("/").pop());
    modal.find("input[name=blogId]").val(blogId);
  });
});
