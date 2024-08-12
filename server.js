const express = require('express')
const app = express()
const port = 3001
const path = require('path')


//anexa a pasta templates
const basePath = path.join(__dirname, 'templates')

//parser para leitura do body
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())



app.get('/users/add', (req, res) => {
  res.sendFile(`${basePath}/userform.html`)
})

app.post('/users/save', (req, res) => {
  const name = req.body.name
  const age = req.body.age
  adicionarUsuario(name, age);
  res.redirect('/users/add');
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

// Exemplo de uso:
//adicionarUsuario('João', 25);


app.get('/', (req, res) => {
  res.redirect('/users/add');
  // res.sendFile(`${basePath}/index.html`)
})




//webserver
app.listen(port, () => {
  console.log('Server Started')
})