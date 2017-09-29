function setTable() {
  $.get("/chairs", function (chairList) {

    $("#chairTable").empty();
    chairList.forEach(c => {

      var openingTr = "<tr>";
      var modelTd = "<td class='foo'><input class='modelInput' data-id=" + c._id + " value='" + c.model + "'></input></td><td>";
      var typeTd = "<input class='typeInput' data-id=" + c._id + " value='" + c.type + "'></input></td>";
      var deleteTd = "<td><button data-id=" + c._id + " onclick='deleteData(event)'>delete</button></td>";
      var updateTd = "<td><button data-id=" + c._id + " onclick='updateChair(event)'>update</button></td>";
      var closingTr = "</tr>";

      $('#chairTable').append(openingTr + modelTd + typeTd + deleteTd + updateTd + closingTr);
    });
  });
}

function updateChair(clickEvent) {

  var updateObj = {
    id: $(clickEvent.srcElement).data().id
  };

  $(".typeInput").each(function (i, el) {
    if ($(el).data().id === updateObj.id) {
      updateObj.type = $(el).val();
    }
  });

  $(".modelInput").each(function (i, el) {
    if ($(el).data().id === updateObj.id) {
      updateObj.model = $(el).val();
    }
  });

  $.ajax({
    url: "/chairs",
    type: 'PUT',
    data: updateObj,
    success: function (result) {
      setTable();
    }
  });
}

function deleteData(clickEvent) {

  var data = $(clickEvent.srcElement).data().id;
  $.ajax({
    url:'/chairs/' + data,
    type: 'DELETE',
    success: function (result) {
      setTable();
    }
  });
}

function add() {

  var newChair = {
    model: $('#addModel').val(),
    type: $('#addType').val()
  };

  $.post("/chairs", newChair, function (data) {
    setTable();
  });
}

$(document).ready(function () {
  setTable();
});
