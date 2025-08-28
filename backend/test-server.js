const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.json({ message: 'Servidor funcionando!' });
});

app.listen(3001, () => {
  console.log('Servidor de teste rodando na porta 3001');
});
