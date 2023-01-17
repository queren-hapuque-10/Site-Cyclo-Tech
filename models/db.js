const Sequelize = require('sequelize');

const sequelize = new Sequelize("cadastro", "root", "mysql.123456",{
    host: "localhost",
    dialect: "mysql"
});


sequelize.authenticate()
.then( ()=>{
    console.log("Conexão com o banco de dados realizada com sucesso!");
}).catch( (erro)=>{
console.log("Erro: Conexão com o banco de dados não realizada! Erro gerado: "+erro);
});

module.exports = sequelize;