$(document).ready(function () {

  if (sessionStorage.getItem("id") == null) {
    window.location.replace("index");
  }



  function countOp(urlbillet, urltva, urlwater, urlUsers) {
    fetch(urltva + "/all/"+sessionStorage.getItem("id")).then(function (response) {
      return response.json();
    }).then(function (obj) {
      $("#transfer").text(obj.length)
    })


    fetch(urlbillet + "/all/"+sessionStorage.getItem("id")).then(function (response) {
      return response.json();
    }).then(function (obj) {
      $("#phone").text(obj.length)
    })


    fetch(urlwater + "/all/"+sessionStorage.getItem("id")).then(function (response) {
      return response.json();
    }).then(function (obj) {
      $("#water").text(obj.length)
    })
  }


  fetch("config/configuration.txt").then(function (response) {
    return response.text()
  }).then(function (data) {
    var urlbillet="http://" +data+ ":8089/billetAvion";
    var urltva = "http://" + data + ":8083/tva";
    var urlwater = "http://" + data + ":8082/facture";
    var urlCounter = "http://" + data + ":8080/counter";
    $("#logout").click(function () {
      sessionID = sessionStorage.getItem("sessionID");
      id = sessionStorage.getItem("id");
      dateLogin = sessionStorage.getItem("dateLogin");

      sessionStorage.removeItem("id");
      sessionStorage.removeItem("sessionID");
      sessionStorage.removeItem("admin");
      sessionStorage.removeItem("dateLogin");

      incrimentCounter(urlCounter, id, sessionID, dateLogin)

      window.location.replace("index");
    })
    countOp(urlbillet, urltva, urlwater)

  })

  function incrimentCounter(urlCounter, id, sessionID, dateLogin) {
    var now = new Date();
    var dateLogout = moment(now).format('YYYY-MM-DD HH:mm:ss');

    var body = JSON.stringify(

      {
        "id": sessionID,
        "user": {
          "id": parseInt(id)
        },
        "dateLogout": dateLogout,
        "dateLogin": dateLogin
      })
    fetch(urlCounter + "/save", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: body
    }).then(function (response) {
      console.log(response)
    })
  }
  

  
})