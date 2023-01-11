$(document).ready(function () {
    if (sessionStorage.getItem("id") == null) {
        window.location.replace("index");
    }

  

    fetch("config/configuration.txt").then(function (response) {
        return response.text()
    }).then(function (data) {
        var urlWater = "http://" + data + ":8082";
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
        var tab = Array();
        var table = $('#datatable2').DataTable({
            ajax: {
                url: urlWater + '/facture/all/',
                dataSrc: '',
            },

            columns: [

                { data: 'numContrat' },
                {
                    data: 'dateFacture', render: function (data) {

                        return data.split(" ")[0];

                    }

                },
                { data: 'montant' },
                {
                    data: 'payed', render: function (data, type, row) {
                        if (data == false) {
                            return '<p>---</p>';
                        }
                        else {
                            return row.datePaiement;
                        }



                    }
                },

                {
                    data: 'payed', render: function (data, type, row) {
                        if (data == false) {
                            return '<span class="text-danger"> <b> Not payed</b></span>';
                        }
                        else {
                            return '<span  class="text-success"> <b> Payed</b></span>';
                        }
                    }
                },
                {
                    data: 'payed', render: function (data, type, row) {
                        tab.push(row);

                        if (data == false) {

                            return '<button type="button" id="pay" class="btn btn-danger waves-effect waves-light pay" name="' + row.id + '">Pay</button>';
                        }
                        else {
                            return `<button type="button" id ="` + row.id + `" class="btn btn-warning pdf  m-b-10 m-l-10 waves-effect waves-light"><i class="far fa-file-alt "></i></button>`
                        }
                    }
                }

            ]
        });


        $(document).on('click', '.pay', function () {
            var id = event.target.name;
            var montant, numContrat, dateBill, cash;
            var now = new Date();
            var idUser = sessionStorage.getItem("id");

            var date = moment(now).format('YYYY-MM-DD HH:mm:ss');
            var idUser = sessionStorage.getItem("id");
            for (var j = 0; j < tab.length; j++) {
                if (tab[j].id == parseInt(id)) {
                    montant = tab[j].montant;
                    numContrat = tab[j].numContrat;
                    dateBill = tab[j].dateFacture
                    cash = tab[j].cash
                }
            }
            swal({
                title: '<p class="font-weight-bold text-dark" style="font-size:18px;">How much money the client gave you?</p>',
                input: 'text',
                inputLabel: 'cash',
                showCancelButton: true,
            }).then(function (response) {
                var cash = response;
                alertify.confirm("confirm the paiement", function (ev) {
                    ev.preventDefault();
                    var body = JSON.stringify(
                        {
                            "id": parseInt(id),
                            "cash": parseInt(cash),
                            "userId": parseInt(idUser),
                            "datePaiement": date,
                            "montant": montant,
                            "dateFacture": dateBill,
                            "numContrat": numContrat,
                            "cash": cash,
                            "payed": 1
                        })
                    var url = "http://localhost:8082/facture/save";

                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        body: body
                    })
                        .then(function (response) {
                            if (response.status == 200) {
                                alertify.success(" the invoice was paid successfully");
                                table.ajax.reload();
                            }
                            return response.json()
                        })
                        .catch(error => console.log('Error:', error));


                }, function (ev) {
                    ev.preventDefault();
                    alertify.error("the operation is canceled");
                });
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
