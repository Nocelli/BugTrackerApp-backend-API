const nodemailer = require("nodemailer");

module.exports = 
async function sendUserConfirmationEmail(email,ConfirmationToken) {

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_USER, 
      pass: process.env.MAIL_PASSWORD 
    }
  });

  let info = await transporter.sendMail({
    from: '"Bug Hero" <BugHero.App@gmail.com>',
    to: email,
    subject: "Verificação de email do Bug-Hero ✔",
    html: `Clique no link para confirmar seu cadastro: <a href="${process.env.API_HOST}/confirmed/${ConfirmationToken}" >${process.env.API_HOST}/confirmed/${ConfirmationToken}</a>`
    //html: ConfirmationMessage 
  });

  return info

}