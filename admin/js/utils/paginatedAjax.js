const PaginatedAjax = (() => {
  return {

    logout: function() {
        localStorage.clear();
        location.reload();
        //  console.log("logout called")
    },
    get: function(_url, username, password, pagenumber, params = "") {
      let result = [];
      const context = this;
      return new Promise((resolve, reject) => {
        settings = {
          url:
            _url +
            "?page=" +
            pagenumber +
            "&perPageCount=50" +
            (params === "" ? "" : "&" + params),
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
        $.ajax(settings)
          .done(data => {
            //  console.log("this is", data.currentPage, data.totalPages);
            result.push(data);
            for (let i = 2; i <= data.totalPages; i++) {
              settings = {
                url: _url + "?page=" + i + "&perPageCount=50",
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
              $.ajax(settings)
                .done(data => {
                  result.push(data);
                  //  console.log("this is", result.length, data.totalPages);
                  if (result.length >= data.totalPages) {
                    const _result = result;
                    // result = [];
                    //  //  console.log("resolving...", JSON.stringify(_result),result);
                    resolve(result);
                  } else {
                    //  //  console.log("this is else", result.length, data.totalPages);
                  }
                })
                .fail(xhr => {
                  result.push(xhr);
                });
            }

            const _result = result;
            // result = [];
            //  //  console.log("resolving...", JSON.stringify(_result),result);
            if (data.currentPage === data.totalPages) {
              resolve(result);
            }
          })
          .fail(xhr => {
            reject(xhr);
          });
      });
    }
  };
})();
