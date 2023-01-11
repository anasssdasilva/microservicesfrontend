$(document).ready(function () {
    

    Chart.defaults.global.legend.labels.usePointStyle = true;

    if (sessionStorage.getItem("id") == null) {
        window.location.replace("index");
    }
    $("#logout").click(function () {
        sessionStorage.removeItem("id");
        window.location.replace("index");
    })

    if (sessionStorage.getItem("admin") == "false") {
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
    


    fetch("config/configuration.txt").then(function (response) {
        return response.text()
    }).then(function (data) {
        var urlbillet="http://" +data+ ":8089/billetAvion";
        var urltva = "http://" + data + ":8083/tva";
        var urlwater = "http://" + data + ":8082/facture";
        var urlUsers = "http://" + data + ":8080/users";
        var urlCounter = "http://" + data + ":8080/counter";
        var ctx = document.getElementById('mainChart').getContext('2d');
        mainChart(urlbillet, urltva, urlwater, urlUsers);
        countOp(urlbillet, urltva, urlwater, urlUsers,urlCounter);
        anasss();

    })
    function anasss(){
        var test = [ {"user":1,"total":1000}];
        var testing=[];
        var kelb = {};
        var users = new Array();
        var noms = new Array();
        var zeros = new Array();
      
      
      async function one(){
      
       const response=await fetch("http://localhost:8080/users/all").then(function (response) {
          return response.json();
      }).then(function (obj) {
          obj.forEach((e)=>{
              users.push(e.id);
              noms.push(e.firstName + " " + e.lastName)
              zeros.push(0);
          });
      });
      };
      one();
      
      async function two(){
       const responses=await fetch("http://localhost:8089/billetAvion/all").then(function (response) {
          return response.json();
      }).then(function (obj) {
          obj.forEach((e)=>{
              for (let i = 0; i < users.length; i++) {
                  if(e.user==users[i]){
                      zeros[i]=zeros[i]+e.amount;
                      break;
                  }
              }
          });
          
      });
      };
      two();
      async function four(){
          const responses=await fetch("http://localhost:8083/tva/all").then(function (response) {
             return response.json();
         }).then(function (obj) {
             obj.forEach((e)=>{
                 for (let i = 0; i < users.length; i++) {
                     if(e.user==users[i]){
                         zeros[i]=zeros[i]+e.amount;
                         break;
                     }
                 }
             });
             for (let j = 0; j < users.length; j++) {
                 kelb.user = users[j];
                 kelb.email= noms[j]
                 kelb.total = zeros[j];
                 testing.push({...kelb});
             
             };
             var table=$('#datatable11').DataTable({
              data: testing,
          
            columns: [
                
                { data: "user" },
                { data: "email"  },
                { data: "total"  }
          
            ]
          });
         });
         
         };
         four();
          
      async function three(){
      for (let j = 0; j < users.length; j++) {
          alert(users.length);
          kelb.user = users[j];
          kelb.total = zeros[j];
          testing.push({...kelb});
      
      };
      console.log(testing); 
      
      };
      console.log(zeros);
      console.log(users);
      
      
    };

    
    
    function mainChart(urlbillet, urltva, urlwater, urlUsers) {

        fetch(urlbillet + "/countBill").then(function (response) {
            return response.json();
        }).then(function (obj) {
            var billetavion1 = Array();
            var transfert1 = Array();
            var water1 = Array();
            var labels = Array();

            fetch(urlbillet + "/countBill").then(function (response) {
                return response.json();
            }).then(function (obj) {
                for (var i = 0; i < obj.length; i++) {
                    var att = obj[i];
                    billetavion1.push(att);
                }

                fetch(urltva + "/countTva").then(function (response) {
                    return response.json();
                }).then(function (obj) {
                    for (var i = 0; i < obj.length; i++) {
                        var att = obj[i];
                        transfert1.push(att);
                    }

                    fetch(urlwater + "/countFacture").then(function (response) {
                        return response.json();
                    }).then(function (obj) {
                        for (var i = 0; i < obj.length; i++) {
                            var att = obj[i];
                            water1.push(att);
                        }
                        var billetavion = new Array()
                        var transfert = new Array()
                        var water = new Array()
                        var found = false;

                        billetavion1.forEach((e) => {
                            billetavion.push(e.count);
                            labels.push(e.id);
                            transfert1.forEach((t) => {
                                if (e.id == t.id) {
                                    transfert.push(t.count);
                                    found = true;
                                }
                            })
                            if (!found) {
                                transfert.push(0);
                                found = false;
                            }
                        })



                        var waterFound = false;
                        for (var i = 0; i < labels.length; i++) {
                            for (var j = 0; j < water1.length; j++) {
                                if (labels[i] == water1[j].id) {
                                    water.push(water1[j].count);
                                    waterFound = true;
                                }
                            }
                            if (!waterFound) {
                                water.push(0);
                                waterFound = false;
                            }
                        }
                        var Users = new Array();

                        fetch(urlUsers + "/allUsers").then(function (response) {
                            return response.json();
                        }).then(function (obj) {

                            labels.forEach((e) => {
                                obj.forEach((o) => {
                                    if (e == o.id) {
                                        Users.push(o.firstName + " " + o.lastName);
                                    }
                                })

                            })

                            var label = ["Airplane Tickets", "Vehicle Taxs", "Electricity Bill"]
                            var col = ["#158572", "#fd6ab4", "#f1e96d"]
                            var donnee = [billetavion, transfert, water];
                            var ctxmor = document.getElementById('mainChart').getContext('2d');
                            var chartmor = new Chart(ctxmor, {
                                type: 'bar',
                                data: {
                                    labels: Users,

                                },
                                
                                options: {
                                    legend: {
                                        display: true,
                                    },
                                    scales: {
                                        xAxes: [{
                                            barPercentage: 0.4
                                        }],
                                        yAxes: [{
                                            ticks: {
                                                beginAtZero: true
                                            }
                                        }]
                                    }
                                }
                            });
                            for (let i = 0; i < donnee.length; i++) {
                                chartmor.data.datasets.push({

                                    fill: true,
                                    data: donnee[i],
                                    label: label[i],
                                    backgroundColor: col[i],
                                    pointBorderColor: col[i],
                                    pointHoverBackgroundColor: col[i],
                                    borderDashOffset: 0.0,
                                    borderJoinStyle: 'miter',
                                    borderWidth: 2,
                                    pointBackgroundColor: col[i],
                                    pointBorderWidth: 0,
                                    pointHoverRadius: 3,
                                    pointHoverBorderColor: "#fff",
                                    pointHoverBorderWidth: 3,
                                    pointRadius: 0,
                                    pointHitRadius: 5,

                                });
                            }
                            chartmor.update();

                        })

                    })
                })
            })
        });

    }

    function countOp(urlbillet, urltva, urlwater, urlUsers,urlCounter) {
        fetch(urltva + "/countT").then(function (response) {
            return response.json();
        }).then(function (obj) {
            $("#transfer").text(obj)
        })

        fetch(urlCounter + "/all").then(function (response) {
            return response.json();
        }).then(function (obj) {
            $("#counter").text(obj.length)
        })

        fetch(urlUsers + "/allUsers").then(function (response) {
            return response.json();
        }).then(function (obj) {
            $("#agent").text(obj.length)
        })


        fetch(urlbillet + "/countB").then(function (response) {
            return response.json();
        }).then(function (obj) {
            $("#phone").text(obj)
        })


        fetch(urlwater + "/countF").then(function (response) {
            return response.json();
        }).then(function (obj) {
            $("#water").text(obj)
        })
    }
    

})