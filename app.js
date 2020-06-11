const axios = require('axios');
var nodemailer = require('nodemailer');
console.log('kk:'+process.env.EMAIL);
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

let input_email = [
    'kevalnavadiya39@gmail.com',
    'bhutbhutani39@gmail.com'
]

let flag = true;
console.log('started');
while(true){
    setTimeout(()=>{
        console.log('Execution in setInterval');
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
                if(flag){
                    res.active = data[1].active-data[0].active;
                    res.confirmed = data[1].confirmed-data[0].confirmed;
                    res.deceased = data[1].deceased-data[0].deceased;
                    res.recovered = data[1].recovered-data[0].recovered;
                    flag=false;
                    sendEmail('DATA : '+e.district , JSON.stringify(res));
                }
            }else{
                flag=true;
                sendEmail('Testing' ,'same');
                console.log('same');
            }
        });
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
      });
    },5*1000);
}

function sendEmail(Title,Body){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });
      var mailOptions = {
        from: process.env.EMAIL,
        to: input_email.join(','),
        subject: Title,
        text: Body
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}