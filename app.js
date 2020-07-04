const axios = require('axios');
var nodemailer = require('nodemailer');
let input_District = [
    {
        state:'Gujarat',
        district:'Surat'
    },
    {
        state:'Maharashtra',
        district:'Mumbai'
    },
    {
      state:'Gujarat',
      district:'Botad'
    }
];

let input_email = [
    'kevalnavadiya39@gmail.com',
    'ketann09@gmail.com',
    'darshitakbari5799@gmail.com',
]
var flag={}
for (let e of input_District){
  flag[e.district] = true;
}
async function main(){
  setTimeout(()=>{
    console.log('flag',flag);
    axios
    .get(process.env.API)
    .then(async function (response) {
      let yesterday = new Date(Date.now() - 864e5).toISOString().slice(0,10);
      let today = new Date().toISOString().slice(0,10);
      let ret={};
      for(let e of input_District){
        await new Promise((res,rej)=>{
          let data = response.data.districtsDaily[e.state][e.district].filter(e=>e.date===today || e.date===yesterday);
            delete data[0].date;
            delete data[1].date;
            if(JSON.stringify(data[0])!=JSON.stringify(data[1])){
                if(flag[e.district]){
                    ret.active = data[1].active-data[0].active;
                    ret.confirmed = data[1].confirmed-data[0].confirmed;
                    ret.deceased = data[1].deceased-data[0].deceased;
                    ret.recovered = data[1].recovered-data[0].recovered;
                    flag=false;
                    sendEmail('DATA : '+e.district , JSON.stringify(ret));
                }
            }else{
                flag[e.district]=true;
                console.log('same'+e.district);
            }
            res(1);
        });
      }
    });
    main();
  },5000);
}
main();
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
          console.log('EMAIL-error',error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}