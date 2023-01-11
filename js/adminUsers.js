$(document).ready(function () {

    if (sessionStorage.getItem("id") == null) {
        window.location.replace("index");
    }
    

    if (sessionStorage.getItem("admin")=="false") {
        swal({
            title: 'Privilege warning',
            text: "You are not allowed to access this page!",
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Cancel!',
            confirmButtonClass: 'btn btn-danger',
            allowOutsideClick: false,
            buttonsStyling: false
        }).then(function (response) {
            window.location.replace("index");
        })
       
        var containerElement = document.getElementById('main_container');
        containerElement.setAttribute('class', 'blur');
        
    }

    
    

    $("#logout").click(function () {
        sessionStorage.removeItem("id");
        window.location.replace("index");
    })

    function generateP() {
        var pass = '';
        var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
            'abcdefghijklmnopqrstuvwxyz0123456789@#$';

        for (i = 1; i <= 8; i++) {
            var char = Math.floor(Math.random()
                * str.length + 1);

            pass += str.charAt(char)
        }

        return pass;
    }

    fetch("config/configuration.txt").then(function (response) {
        return response.text()
    }).then(function (data) {
        var urlUsers = "http://" + data + ":8080";
        var table = $('#datatable2').DataTable({
            ajax: {
                url: urlUsers + '/users/allUsers',
                dataSrc: ''
            },
            columns: [

                { data: 'firstName' },
                { data: 'lastName' },
                { data: 'email' },
                { data: 'gender' },
                { data: 'date' },
                {
                    data: 'id', render: function (data) {
                        return '<button type="button"   class="btn btn-danger delete waves-effect waves-light receive" id="' + data + '">Delete</button>';
                    }
                }
            ]
        });

        $("#form").on('submit', function (e) {
            e.preventDefault();
            var form = $(this);

            form.parsley().validate();
            if (form.parsley().isValid()) {
                var gender = $("input[name='gender']:checked").val();
                var firstName = $("#first_name").val();
                var lastName = $("#last_name").val();
                var email = $("#email").val();
                var date = $("#date").val();
                var password = generateP();
                var body = JSON.stringify(
                    {
                        "firstName": firstName,
                        "lastName": lastName,
                        "email": email,
                        "date": date,
                        "gender": gender,
                        "password": password,
                        "role": false,

                    })

                var url = urlUsers + "/users/save";
                swal({
                    title: '<p class="font-weight-bold text-light text-center" style="font-size:20px;">A new user will be aded!</p>',
                    text: '<p class="text-danger">Are you sure?</p>',
                    showCancelButton: true,
                    width: 400,
                    height:300,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-danger',
                    buttonsStyling: true
                }).then(function (response) {
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        body: body
                    })
                        .then(function (response) {
                            if (response.status == 200) {
                                var body = JSON.stringify(
                                    {
                                        "firstName": firstName,
                                        "lastName": lastName,
                                        "email": email,
                                        "date": date,
                                        "gender": gender,
                                        "password": password,
                                        "role": false,

                                    })

                                alertify.success("The new agent have been completed with success and he was notified by email");
                                table.ajax.reload();
                                $("input[name='gender']:checked").val(false);
                                $("#first_name").val("");
                                $("#last_name").val("");
                                $("#email").val("");
                                $("#date").val("");
                                
                                fetch(urlUsers + "/users/sendemail", {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json; charset=utf-8'
                                    },
                                    body: body
                                }).then(function (response) {

                                })

                            }
                            return response.json()
                        })
                        .catch(error => console.log('Error:', error));
                        swal({
                            text: '<p class="font-weight-bold text-light text-center">Added successfully</p>',
                            width: 300,
                            height:100,
                            showConfirmButton:false,
                            timer: 2000,
                            onOpen: function () {
                            }
                            }).then(
                            function () {},
                            // handling the promise rejection
                            function (dismiss) {
                                if (dismiss === 'timer') {
                                console.log('I was closed by the timer')
                                }
    
                        })
                }, function (dismiss) {
                    // dismiss can be 'cancel', 'overlay',
                    // 'close', and 'timer'
                    if (dismiss === 'cancel') {
                        swal({
                            text: '<p class="font-weight-bold text-light text-center">Operation cancelled</p>',
                            width: 300,
                            height:100,
                            showConfirmButton:false,
                            timer: 1500,
                            onOpen: function () {
                            }
                            }).then(
                            function () {},
                            // handling the promise rejection
                            function (dismiss) {
                                if (dismiss === 'timer') {
                                console.log('I was closed by the timer')
                                }
    
                        })
                    }
                })
            }
        });


        $(document).on('click', '.delete', function (e) {
            var id = e.target.id
            swal({
                title: '<p class="font-weight-bold text-light text-center" style="font-size:20px;">This user will be deleted!</p>',
                text: '<p class="text-danger">Are you sure?</p>',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger m-l-10',
                buttonsStyling: true
            }).then(function (response) {
                fetch(urlUsers + "/users/" + id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                }).then(function (data) {
                    table.ajax.reload();
                    swal({
                        text: '<p class="font-weight-bold text-light text-center">Deleted successfully</p>',
                        width: 300,
                        height:100,
                        showConfirmButton:false,
                        timer: 1500,
                        onOpen: function () {
                        }
                        }).then(
                        function () {},
                        // handling the promise rejection
                        function (dismiss) {
                            if (dismiss === 'timer') {
                            console.log('I was closed by the timer')
                            }

                    })
                    alertify.success("The user have been deleted with success");
                })


            }, function (dismiss) {
                // dismiss can be 'cancel', 'overlay',
                // 'close', and 'timer'
                if (dismiss === 'cancel') {
                    swal({
                        text: '<p class="font-weight-bold text-light text-center">Operation cancelled</p>',
                        width: 300,
                        height:100,
                        showConfirmButton:false,
                        timer: 1500,
                        onOpen: function () {
                        }
                        }).then(
                        function () {},
                        // handling the promise rejection
                        function (dismiss) {
                            if (dismiss === 'timer') {
                            console.log('I was closed by the timer')
                            }

                    })
                    alertify.log("The operation is aborted");

                }
            })
        })


    })
})



/*
                $(document).on('click','.update', function(e){
                    var id = e.target.id
                    fetch(urlUsers+"/users/"+id, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        }
                    }).then(function(response){
                        return response.json();
                    }).then(function(data){
                        $("input[name='gender'][value=" + data.gender + "]").prop('checked', true);
                        $("#first_name").val(data.firstName);
                        $("#last_name").val(data.lastName);
                        $("#email").val(data.email);
                        $("#date").val(data.date);
                        $("#id").text(data.id);
                        $("#submit").text("Update");
                        $("#password").text("Update");

                    })
                })*/