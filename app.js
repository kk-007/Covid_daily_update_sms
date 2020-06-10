const axios = require('axios');

let input_District = [
    {
        state:'Gujarat',
        district:'Surat'
    },
    {
        state:'Maharashtra',
        district:'Mumbai'
    }
];
let input_numbers = [
    9924011385
]

setInterval(()=>{
    axios.get('https://api.covid19india.org/districts_daily.json')
  .then(function (response) {
    let yesterday = new Date(Date.now() - 864e5).toISOString().slice(0,10);
    let today = new Date().toISOString().slice(0,10);
    let res={};

    input_District.forEach(e => {
        let data = response.data.districtsDaily[e.state][e.district].filter(e=>e.date===today || e.date===yesterday);
        delete data[0].date;
        delete data[1].date;
        if(!JSON.stringify(data[0])==JSON.stringify(data[1])){
            res.active = data[1].active-data[0].active;
            res.confirmed = data[1].confirmed-data[0].confirmed;
            res.deceased = data[1].deceased-data[0].deceased;
            res.recovered = data[1].recovered-data[0].recovered;
            sendMessage(res);
        }else{
            console.log('same');
        }
    });
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
},60000*5);