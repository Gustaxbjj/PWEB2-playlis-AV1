import express from 'express';
import { Comentario } from '../models/Index.js';
const router = express.Router();

router.get('/', async (_req, res) => res.json(await Comentario.findAll()));
router.get('/:id', async (req, res) => {
  const c = await Comentario.findByPk(req.params.id);
  c ? res.json(c) : res.status(404).json({ error: 'Comentário não encontrado' });
});
router.post('/', async (req, res) => res.status(201).json(await Comentario.create(req.body)));
router.put('/:id', async (req, res) => {
  const [u] = await Comentario.update(req.body, { where: { id: req.params.id } });
  if (u) res.json(await Comentario.findByPk(req.params.id));
  else  res.status(404).json({ error: 'Comentário não encontrado' });
});
router.delete('/:id', async (req, res) => {
  const d = await Comentario.destroy({ where: { id: req.params.id } });
  d ? res.json({ message: 'Deletado' }) : res.status(404).json({ error: 'Não encontrado' });
});

export default router;
