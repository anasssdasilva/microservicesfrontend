$(document).ready(function () {

    if (sessionStorage.getItem("id") == null) {
        window.location.replace("index");
    }


    fetch("config/configuration.txt").then(function (response) {
        return response.text()
    }).then(function (data) {
        var urlbilletavion = "http://" + data + ":8089";
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
        var table = $('#datatable3').DataTable({
            ajax: {
                url: urlbilletavion + '/billetAvion/all/' + sessionStorage.getItem('id'),
                dataSrc: ''
            },
            columns: [
                {
                    data: 'datevoyage', render: function (data) {

                        return data.split("T")[0] ;
                    }
                },
                { data: 'cin' },
                {data: 'city.name'},
                { data: 'direction' },
                { data: 'amount' },
                {
                    data: 'id', render: function (data) {
                        return `<button type="button" id ="` + data + `" class="btn btn-warning pdf  m-b-10 m-l-10 waves-effect waves-light"><i class="fa fa-file-alt bg-dark"></i></button>`
                    }
                },
                {
                    data: 'id', render: function (data) {
                        return '<button type="button"   class="btn btn-danger delete waves-effect waves-light receive" id="' + data + '">Delete</button>';
                    }
                }
            ]
        });
        
        

        fetch(urlbilletavion + '/citys/all').then(function (response) {
            return response.json();
        }).then(function (obj) {
            obj.forEach((e) => {
                console.log(e.name);

                $("#city").append('<option value=' + e.id + '>' + e.name + '</option>');
            });
        })
        $('#city').change(function(){
            if($("#city").children("option:selected").text()=="Paris"){
                $("#amount").val(4000);
            }
            if($("#city").children("option:selected").text()=="London"){
                $("#amount").val(6000);
            }
            if($("#city").children("option:selected").text()=="Rabat"){
                $("#amount").val(1000);
            }
            if($("#city").children("option:selected").text()=="New York"){
                $("#amount").val(8000);
            }
            if($("#city").children("option:selected").text()=="Tokyo"){
                $("#amount").val(9000);
            }
            if($("#city").children("option:selected").text()=="Istanbul"){
                $("#amount").val(5000);
            }if($("#city").children("option:selected").text()=="Boston"){
                $("#amount").val(7000);
            }
        })
        $('#direction').change(function(){
            if($("#direction").children("option:selected").text()=="Round trip"){
                var montant=$("#amount").val();
                var double=montant*2;
                $("#amount").val(double);
            }
            
        })


        $("#form").on('submit', function (e) {
            e.preventDefault();
            var form = $(this);

            form.parsley().validate();

            if (form.parsley().isValid()) {
                var cityValue = $("#city").children("option:selected").text();
                var cin = $("#cin").val();
                var datevoyage = $("#datevoyage").val();
                var amount = $("#amount").val();
                var cash = $("#cash").val();
                var direction = $("#direction").children("option:selected").text();
                var id = sessionStorage.getItem("id");
                var body = JSON.stringify(
                    {
                        "amount": parseInt(amount),
                        "cash": parseInt(cash),
                        "cin": cin,
                        "direction": direction,
                        "datevoyage": datevoyage,
                        "user": parseInt(id),
                        "city": {
                            "id": $("#city").val()
                        }
                    })

                var url = urlbilletavion + "/billetAvion/save";
                swal({
                    title: '<p class="font-weight-bold text-light text-center" style="font-size:20px;">A new ticket will be aded!</p>',
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
                                alertify.success("The Airplane ticket have been paid successefully");
                                table.ajax.reload();
                                var cityValue = $("#city").children("option:selected").val(false);
                                var cin = $("#cin").val('');
                                var datevoyage = $("#datevoyage").val('');
                                var amount = $("#amount").val('');
                                var cash = $("#cash").val('');
                                var direction = $("#direction").children("option:selected").val(false);
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
                title: '<p class="font-weight-bold text-light text-center" style="font-size:20px;">This ticket will be deleted!</p>',
                text: '<p class="text-danger">Are you sure?</p>',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger m-l-10',
                buttonsStyling: true
            }).then(function (response) {
                fetch(urlbilletavion + "/billetAvion/delete/" +id, {
                    method: 'DELETE',
                    mode: 'no cors',

                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',


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
                    alertify.success("The ticket have been deleted with success");
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