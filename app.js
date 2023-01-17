const express = require('express');
const app = express();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { eAdmin } = require('./middlewares/auth');
const User = require('./models/User');


app.use(express.json());

app.get('/', eAdmin, async (req, res) => {

    await User.findAll({
        attributes: ['id','name','email'],
        order: [['id', "DESC"]]
    })
    .then((users)=>{
        return res.json({
            erro: false,
            users: users,
            id_usuario_logado: req.userId
        });
    })
   .catch(()=>{
    return res.status(400).json({
        erro: true,
        mensagem: "Erro: Usuário não cadastrado com Sucesso!",
    });
   });
});

app.post('/cadastrar', async (req, res) => {

    var dados = req.body;
 
     dados.password = await bcrypt.hash(dados.password, 8);

    await User.create(dados)
    .then(()=>{
        return res.json({
            erro: false,
            mensagem: "Usuário cadastrado com Sucesso!",
        });
    }).catch(()=>{
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum usuário encontrado!!",
        });
});
});

app.post('/login', async (req, res) => {

    const user = await User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where:{
            email: req.body.email
        }
    });

    if(user === null){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou a senha incorreta!"
        });
    }
    //console.log(req.body);

    if(!(await bcrypt.compare(req.body.password, user.password))){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou a senha incorreta! Senha incorreta!"
        });
    }

    var token = jwt.sign({id: user.id}, "QHDUA44G35AH6K42K4N3H4K34H5", {
        //expiresIn: 600 //10 min
        //expiresIn: 60 //1 min
        expiresIn: '7d' // 7 dia
    });

    return res.json({
        erro: false,
        mensagem: "Login realizado com sucesso!",
        token
    });
});

app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});