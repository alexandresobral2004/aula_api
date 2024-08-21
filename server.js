const express = require('express')
const app = express()
const port = 3001
const path = require('path')
const session = require('express-session');
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser');



//anexa a pasta templates
// const basePath = path.join(__dirname, 'templates')

//parser para leitura do body
app.use(bodyParser.urlencoded({ extended: true }));

//Config Session
app.use(session({
  secret: '098094809dssfsf584584338049385',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 } // session timeout of 60 seconds
  //https://dev.to/saint_vandora/how-to-implement-session-management-in-nodejs-applications-5emm
}));

// Configurando o Handlebars como motor de visualização

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')


app.get('/dashboard', checkAuth, (req, res) => {
  res.render(`dashboard`)
})


app.get('/users/add', checkAuth, (req, res) => {
  res.render(`userform`)
})

app.post('/users/save', checkAuth, (req, res) => {
  const name = req.body.name
  const age = req.body.age
  adicionarUsuario(name, age);
  res.render(`dashboard`)
})

async function adicionarUsuario(name, age) {
  const url = 'http://localhost:3000/posts';
  const data = { name, age };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.text();
      console.log(result);
    } else {
      console.error('Erro ao adicionar usuário:', response.statusText);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

async function deletarUsuario(id) {
  const url = `http://localhost:3000/posts/${id}`; // Inclui o ID do usuário na URL

  try {
    const response = await fetch(url, {
      method: 'DELETE', // Define o método HTTP como DELETE
      headers: {
        'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
      }
    });

    if (response.ok) {
      console.log('Usuário deletado com sucesso'); // Exibe uma mensagem de sucesso no console
    } else {
      console.error('Erro ao deletar usuário:', response.statusText); // Exibe uma mensagem de erro no console
    }
  } catch (error) {
    console.error('Erro na requisição:', error); // Exibe uma mensagem de erro no console em caso de exceção
  }
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  // Authenticate user
  if (username === 'admin' && password === 'admin') {
    req.session.isLoggedIn = true;
    req.session.username = username;

    res.render(`dashboard`)
  } else {
    res.render(`login`)
  }


})

function checkAuth(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.render(`login`)
  }
}



app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Session destroyed');
      res.render(`login`)
    }
  });
});





app.get('/', (req, res) => {
  const sessionData = req.session;
  res.render(`login`)
})









//webserver
app.listen(port, () => {
  console.log('Server Started')
})