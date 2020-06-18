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
    'bhutbhutani39@gmail.com',
    'ketann09@gmail.com'
]

let flag = true;
async function main(){
  setTimeout(()=>{
    console.log('over');
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
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
        res(true);
      });
}