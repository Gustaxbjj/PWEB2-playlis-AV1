// server.js (ou outro nome que você preferir)
import { sequelize, Usuario, Filme, Canal, CanalFilme, Playlist, Comentario } from './models/Index.js';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;


app.get('/version', (req, res) => {
  res.json({ status: 'ok', version: '1.2.1', timestamp: new Date().toISOString() });

});


(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');

    await sequelize.sync({ alter: true }); // Isso agora criará TODAS as tabelas com base em todos os modelos importados e relacionados
    console.log('✅ Tabelas sincronizadas com sucesso.');

    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });

  } catch (error) {
    console.error('❌ Erro ao conectar ou sincronizar o banco de dados:', error);
  } finally {
    await sequelize.close();
  }
})();