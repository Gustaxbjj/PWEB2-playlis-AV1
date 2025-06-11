import express from 'express';
import { Playlist } from '../models/Index.js';
const router = express.Router();

router.get('/', async (_req, res) => res.json(await Playlist.findAll()));
router.get('/:id', async (req, res) => {
  const p = await Playlist.findByPk(req.params.id);
  p ? res.json(p) : res.status(404).json({ error: 'Playlist não encontrada' });
});
router.post('/', async (req, res) => res.status(201).json(await Playlist.create(req.body)));
router.put('/:id', async (req, res) => {
  const [u] = await Playlist.update(req.body, { where: { id: req.params.id } });
  if (u) res.json(await Playlist.findByPk(req.params.id));
  else  res.status(404).json({ error: 'Playlist não encontrada' });
});
router.delete('/:id', async (req, res) => {
  const d = await Playlist.destroy({ where: { id: req.params.id } });
  d ? res.json({ message: 'Deletado' }) : res.status(404).json({ error: 'Não encontrada' });
});

export default router;
