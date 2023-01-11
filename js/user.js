$(document).ready(function () {
    $('form').parsley();
    if (sessionStorage.getItem("id") != null) {
        window.location.replace("index");
    }

    fetch("config/configuration.txt").then(function (response) {
        return response.text()
    }).then(function (data) {
        $("#form").on('submit', function (e) {
            e.preventDefault();
            var form = $(this);
            form.parsley().validate();
            if (form.parsley().isValid()) {
                var body = JSON.stringify(
                    {
                        "email": $("#email").val(),
                        "password": $("#password").val(),
                    })
                var url = "http://" + data + ":8080/users/check";
                var urlCounter = "http://" + data + ":8080/counter";
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: body
                })
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (obj) {
                        if (obj.id != -1) {
                            sessionStorage.setItem("id", obj.id);
                            sessionStorage.setItem("admin", obj.admin);
                            if (obj.admin) {
                                window.location.replace("dashboardAdmin");
                            } else {
                                incrimentCounter(urlCounter, obj.id)

                                window.location.replace("dashboard");
                            }
                        } else {
                            var containerElement = document.getElementById('main_container');
                            containerElement.setAttribute('class', 'blur');
                            swal({
                                title: '<p class="font-weight-bold text-dark" style="font-size:20px;">The Credentials are not correct<p>',
                                text: '<p class=" text-warning" style="font-size:16px;">Make sure you have entred the right email and password.</p>',
                                showCancelButton: false,
                                type:'warning',
                                confirmButtonText: 'Ok, i will make sure!',
                                buttonsStyling: true
                            }).then(function (response) {
                                var containerElement = document.getElementById('main_container');
                                containerElement.setAttribute('class', null);
                            })
                        }
                    })
                    .catch(error => console.log('Error:', error));
            }
        });
    })


    function incrimentCounter(urlCounter, id) {
        var sessionID = Date.now();
        var date = moment(sessionID).format('YYYY-MM-DD HH:mm:ss');

        sessionStorage.setItem("sessionID", sessionID)
        sessionStorage.setItem("dateLogin", date)

        var body = JSON.stringify(
            {
                "id": sessionID+"",
                "dateLogin": date,
                "dateLogout": null,
                "user": {
                    "id": parseInt(id)
                }
               
            })
      
        fetch(urlCounter + "/save", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: body
        }).then(function (response) {
            console.log(JSON.stringify(response))
        }).catch(function(error){
            console.log(JSON.stringify(error))
        })
    }
})
