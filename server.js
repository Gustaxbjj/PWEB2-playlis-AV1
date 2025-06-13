import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './models/Index.js';

import usuarioRoutes   from './routes/UsuariosRouters.js';
import filmeRoutes     from './routes/FilmesRouters.js';
import canalRoutes     from './routes/CanaisRouters.js';
import playlistRoutes from './routes/PlaylistRouters.js';
import comentarioRoutes from './routes/ComentarioRouters.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/version', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

app.use('/usuarios', usuarioRoutes);
app.use('/filmes',   filmeRoutes);
app.use('/canais',   canalRoutes);
app.use('/playlists', playlistRoutes);
app.use('/comentarios', comentarioRoutes);

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database ok');
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch(err => console.error('❌ Erro ao conectar:', err));
