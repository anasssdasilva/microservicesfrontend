$(document).ready(function () {

    if (sessionStorage.getItem("id") == null) {
        window.location.replace("index");
    }


    fetch("config/configuration.txt").then(function (response) {
        return response.text()
    }).then(function (data) {
        var urltva = "http://" + data + ":8083";
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

        var table = $('#datatable2').DataTable({
            ajax: {
                url: urltva + '/tva/all/' + sessionStorage.getItem('id'),
                dataSrc: ''
            },
            columns: [
                { data: 'nom' },
                { data: 'matricule' },
                { data: 'amount' },
                {
                    data: 'vehicule.name', render: function (data, type, row) {
                        if (data == "Voiture") {
                            return `<img src="./images/test.png" width="80" height="80" alt="">`;
                        }

                        if (data == "Camion") {
                            return `<img src="./images/camion.png" width="80" height="80" alt="">`;
                        }

                        if (data == "Moteur") {
                            return `<img src="./images/moteur.png" width="80" height="80" alt="">`;
                        }
                    }
                },
                {
                    data: 'id', render: function (data) {
                        return `<button type="button" id ="` + data + `" class="btn btn-warning pdf m-b-10 m-l-10 waves-effect waves-light"><i class="far fa-file-alt"></i></button>`
                    }
                }
            ]
        });


        fetch(urltva + '/vehicules/all').then(function (response) {
            return response.json();
        }).then(function (obj) {
            var op = ``;
            obj.forEach((e) => {

                if (e.name == "Voiture") {
                    op += `<div class="input-container">
                    <input id="walk" class="radio-button" type="radio" name="radio" value=`+ e.id + ` />
                    <div class="radio-tile">
                        <div class="icon walk-icon">
                            <img src="images/test.png" width="160" height="150">
                        </div>
                    </div>
                </div>`;
                }

                if (e.name == "Moteur") {
                    op += `<div class="input-container">
                    <input id="fly" class="radio-button" type="radio" name="radio" value=`+ e.id + ` />
                    <div class="radio-tile">
                        <div class="icon fly-icon">
                            <img src="images/moteur.png" width="150" height="150">
    
                        </div>
                    </div>
                </div>`;
                }

                if (e.name == "Camion") {
                    op += `<div class="input-container">
                    <input id="bike" class="radio-button" type="radio" name="radio" value=`+ e.id + ` />
                    <div class="radio-tile">
                        <div class="icon bike-icon">
                            <img src="images/camion.png" width="150" height="150">
                        </div>
                    </div>
                </div>`;

                }
            });
            $("#vehicule").html(op);
        })
        $('#vehicule').change(function(){
            if($("input[name='radio']:checked").val()==1){
                $("#amount").val(2800);
            }
            if($("input[name='radio']:checked").val()==2){
                $("#amount").val(700);
            }
            if($("input[name='radio']:checked").val()==3){
                $("#amount").val(6422);
            }
        })


        $("#form").on('submit', function (e) {
            e.preventDefault();
            var form = $(this);

            form.parsley().validate();

            if (form.parsley().isValid()) {
                var vehiculeValue = $("input[name='radio']:checked").val();
                var matricule = $("#matricule").val();
                var nom = $("#nom").val();
                var prenom = $("#prenom").val();
                var amount = $("#amount").val();
                var cash = $("#cash").val();
                var id = sessionStorage.getItem("id");
                var body = JSON.stringify(
                    {
                        "amount": parseInt(amount),
                        "cash": parseInt(cash),
                        "nom": nom,
                        "matricule": matricule,
                        "prenom": prenom,
                        "user": parseInt(id),
                        "vehicule": {
                            "id": parseInt(vehiculeValue)
                        }
                    })

                var url = urltva + "/tva/save";
                swal({
                    title: '<p class="font-weight-bold text-light text-center" style="font-size:20px;">A new tax will be aded!</p>',
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
                                alertify.success("The TVA have been completed with success");
                                table.ajax.reload();
                                var nom = $("#nom").val('');
                                var prenom = $("#prenom").val('');
                                var vehiculeValue = $("input[name='radio']:checked").val(false);
                                var matricule = $("#matricule").val('');
                                var amount = $("#amount").val('');
                                var cash = $("#cash").val('');
                                
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