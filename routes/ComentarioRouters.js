import express from 'express';
import { Comentario } from '../models/Index.js';

const router = express.Router();

// Buscar todos os comentários
router.get('/', async (_req, res) => {
  try {
    const comentarios = await Comentario.findAll();
    res.json(comentarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar comentários' });
  }
});

// Buscar comentário por ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const comentario = await Comentario.findByPk(id);
    comentario
      ? res.json(comentario)
      : res.status(404).json({ error: 'Comentário não encontrado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar comentário' });
  }
});

// Criar um novo comentário
router.post('/', async (req, res) => {
  try {
    const novo = await Comentario.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Erro ao criar comentário', detalhes: err.message });
  }
});

// Criar vários comentários (em lote)
router.post('/lote', async (req, res) => {
  try {
    const lote = await Comentario.bulkCreate(req.body);
    res.status(201).json(lote);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Erro ao criar comentários em lote', detalhes: err.message });
  }
});

// Atualizar um comentário por ID
router.put('/:id', async (req, res) => {
  try {
    const [atualizado] = await Comentario.update(req.body, { where: { id: req.params.id } });
    if (atualizado) {
      const comentarioAtualizado = await Comentario.findByPk(req.params.id);
      res.json(comentarioAtualizado);
    } else {
      res.status(404).json({ error: 'Comentário não encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Erro ao atualizar comentário', detalhes: err.message });
  }
});

// Deletar um comentário por ID
router.delete('/:id', async (req, res) => {
  try {
    const deletado = await Comentario.destroy({ where: { id: req.params.id } });
    deletado
      ? res.json({ message: 'Comentário deletado com sucesso' })
      : res.status(404).json({ error: 'Comentário não encontrado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar comentário' });
  }
});

export default router;
