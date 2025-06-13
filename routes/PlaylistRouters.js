import express from 'express';             
import { Playlist, Usuario } from '../models/Index.js';  

const router = express.Router();  

// Busca todas as playlists
router.get('/', async (_req, res) => {
  try {
    const playlists = await Playlist.findAll();
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar playlists' });
  }
});

// Busca playlist pelo id
router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);
    if (playlist) {
      res.json(playlist);
    } else {
      res.status(404).json({ error: 'Playlist não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar playlist' });
  }
});

// Cria playlist com dados do corpo da requisição, validando id_usuario
router.post('/', async (req, res) => {
  try {
    const { id_usuario } = req.body;

    // Verifica se id_usuario foi enviado
    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario é obrigatório' });
    }

    // Verifica se o usuário existe no banco
    const usuarioExiste = await Usuario.findByPk(id_usuario);
    if (!usuarioExiste) {
      return res.status(400).json({ error: 'Usuário não existe' });
    }

    // Cria a playlist com os dados do corpo
    const novaPlaylist = await Playlist.create(req.body);
    res.status(201).json(novaPlaylist);

  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar playlist', detalhes: error.message });
  }
});

// Cria várias playlists em lote
router.post('/lote', async (req, res) => {
  try {
    // req.body deve ser um array de objetos playlists
    const novasPlaylists = await Playlist.bulkCreate(req.body);  // CORREÇÃO: bulkCreate (sem 'k' extra)
    res.status(201).json(novasPlaylists);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar playlists em lote', detalhes: error.message });
  }
});

// Atualiza playlist pelo id
router.put('/:id', async (req, res) => {
  try {
    const [atualizados] = await Playlist.update(req.body, { where: { id: req.params.id } });
    if (atualizados) {
      const playlistAtualizada = await Playlist.findByPk(req.params.id);
      res.json(playlistAtualizada);
    } else {
      res.status(404).json({ error: 'Playlist não encontrada' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar playlist', detalhes: error.message });
  }
});

// Deleta playlist pelo id
router.delete('/:id', async (req, res) => {
  try {
    const deletados = await Playlist.destroy({ where: { id: req.params.id } });
    if (deletados) {
      res.json({ message: 'Playlist deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Playlist não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar playlist' });
  }
});

export default router;
