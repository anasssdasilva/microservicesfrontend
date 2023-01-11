$(document).ready(function(){
    if (sessionStorage.getItem("id") == null) {
        window.location.replace("index");
    }

    fetch("config/configuration.txt").then(function (response) {
        return response.text()
    }).then(function (data) {
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
                url: urlCounter + '/all',
                dataSrc: ''
            },
            columns: [

                { data: 'user',render:function(data){

                    return data.firstName+' '+data.lastName;

                } },
                { data: 'dateLogin' },
                { data: 'dateLogout' },
            
            ]
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