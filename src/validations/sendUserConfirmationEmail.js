const nodemailer = require("nodemailer");

module.exports = 
async function sendUserConfirmationEmail(email,ConfirmationToken,option) {

  const emails = {
    resetPassword:{
      subject:'Alteração de senha do Bug-Hero',
      html:`Clique no link para alterar sua senha: <a href="${process.env.API_HOST}/password/new/${ConfirmationToken}" >CLIQUE AQUI PARA ALTERAR SUA SENHA!</a>`
    },
    confirmation:{
      subject:'Verificação de email do Bug-Hero ✔',
      html:`Clique no link para confirmar seu cadastro: <a href="${process.env.API_HOST}/confirmed/${ConfirmationToken}" >CLIQUE AQUI PARA CONFIRMAR SEU EMAIL!</a>`
    }
  }

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
    subject: emails[option].subject,
    html: emails[option].html
    //html: ConfirmationMessage 
  });

  return info

}