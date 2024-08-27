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

app.post('/users/save', async (req, res) => {
  const name = req.body.name
  const age = req.body.age
  const data = await adicionarUsuario(name, age);
  const users = await getData();
  res.render('dashboard', { users: users, isAuthenticated: true });
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

app.post('/users/delete', async (req, res) => {
  const id = req.body.id;
  const result = await deleteData(id);
  const users = await getData(); // Aguarde o resultado da função getData()
  res.render('dashboard', { users: users, isAuthenticated: true }); // Renderize o dashboard com os dados

})


async function getData() {
  try {
    const response = await fetch('http://localhost:3000/posts/');
    const data = response.json();
    return data

  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
}



app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  let result = 0;
  // Authenticate user
  if (username === 'admin' && password === 'admin') {
    req.session.isLoggedIn = true;
    req.session.username = username;

    try {
      const users = await getData(); // Aguarde o resultado da função getData()
      console.log(users);
      res.render('dashboard', { users: users, isAuthenticated: true }); // Renderize o dashboard com os dados
    } catch (error) {
      console.error('Erro ao renderizar o dashboard:', error);
      res.status(500).send('Erro ao carregar o dashboard');
    }

  } else {
    res.redirect('/login')
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


app.get('/login', (req, res) => {
  res.render(`login`)
})


async function deleteData(id) {
  try {
    const response = await fetch(`http://localhost:3000/posts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao remover o dado');
    }

    const result = await response.json();
    console.log(`Dado com id ${id} removido com sucesso:`, result);
    return result;
  } catch (error) {
    console.error('Erro ao remover dado:', error);
    return null; // Retorne null ou outro valor padrão em caso de erro
  }
}


app.get('/', (req, res) => {
  const sessionData = req.session;
  res.render(`login`)
})









//webserver
app.listen(port, () => {
  console.log('Server Started')
})