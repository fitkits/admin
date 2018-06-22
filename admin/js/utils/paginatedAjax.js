const PaginatedAjax = (() => {
  let result = [];
  return {
    get: function(_url, username, password, pagenumber, params = "") {
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
              "Basic " + btoa(username + ":" + password)
            );
            xhr.setRequestHeader(
              "content-type",
              "application/x-www-form-urlencoded"
            );
          }
        };
        $.ajax(settings)
          .done(data => {
            console.log("this is", data.currentPage, data.totalPages);
            result.push(data);
            for (let i = 2; i <= data.totalPages; i++) {
              settings = {
                url: _url + "?page=" + i + "&perPageCount=50",
                method: "GET",

                beforeSend: function(xhr) {
                  xhr.setRequestHeader(
                    "Authorization",
                    "Basic " + btoa(username + ":" + password)
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
                  console.log("this is", result.length, data.totalPages);
                  if (result.length >= data.totalPages) {
                    console.log("resolving...", result);
                    const _result = result;
                    result = [];
                    resolve(_result);
                  } else {
                    console.log("this is else", result.length, data.totalPages);
                  }
                })
                .fail(xhr => {
                  result.push(xhr);
                });
            }
            console.log("resolving...", result);
            const _result = result;
            result = [];
            resolve(_result);
          })
          .fail(xhr => {
            reject(xhr);
          });
      });
    }
  };
})();
