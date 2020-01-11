
$.getJSON("/articles", function (data) {

  function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }
  var unique = removeDuplicates(data, "summary");
  console.log(JSON.stringify(unique));
  for (var i = 0; i < unique.length; i++) {

    if (unique[i].title !== null && unique[i].title !== "" && unique[i].title.length !== 0 && unique[i].summary !== null && unique[i].summary !== "" && unique[i].summary.trim().length !== 0) {

      $("#articles").append("<p data-id='" + unique[i]._id + "'>" + "Title: " + "<br />" + unique[i].title + "<br />" + "Link: " + "<br />" + unique[i].link + "<br />" + "Summary: " + "<br />" + unique[i].summary + "</p>");
    }
  }
});



$(document).on("click", "p", function () {

  $("#notes").empty();

  var thisId = $(this).attr("data-id");


  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

    .then(function (data) {
      console.log(data);

      $("#notes").append("<h2>" + data.title + "</h2>");

      $("#notes").append("<span class='glyphicon glyphicon-thumbs-up'>" + "<h6 id='likes'>" + counter + "</h6>" + "</span>");

      $("#notes").append("<input id='titleinput' name='title' >");

      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");
      $("#notes").append("<button data-id='" + data._id + "' id='like'>Like</button>");


      if (data.note) {

        $("#titleinput").val(data.note.title);

        $("#bodyinput").val(data.note.body);
      }
    });
});


$(document).on("click", "#savenote", function () {

  var thisId = $(this).attr("data-id");


  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {

      title: $("#titleinput").val(),

      body: $("#bodyinput").val()
    }
  })

    .then(function (data) {

      console.log(data);

      $("#notes").empty();
    });


  $("#titleinput").val("");
  $("#bodyinput").val("");
});


$(document).on("click", "#deletenote", function () {

  var thisId = $(this).attr("data-id");


  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId
  })

    .then(function (data) {

      console.log(data);

      $("#notes").empty();
    });


  $("#titleinput").val("");
  $("#bodyinput").val("");
});
var counter = 0;

$(document).on("click", "#like", function () {

  var thisId = $(this).attr("data-id");

  counter++;
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId
  })

    .then(function (data) {

      $("#likes").html(counter);

    });
});
