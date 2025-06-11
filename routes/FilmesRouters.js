import express from 'express';
import { Filme } from '../models/Index.js';
const router = express.Router();

router.get('/',    async (_req, res) => res.json(await Filme.findAll()));

router.get('/:id', async (req, res) => {
  const f = await Filme.findByPk(req.params.id);
  f ? res.json(f) : res.status(404).json({ error: 'Filme não encontrado' });
});


router.post('/',   async (req, res) => {
  
  console.log('post');
  const filme = await Filme.create(req.body);
  res.status(201).json(filme)
}
);

router.post('/lote',   async (req, res) => {
  const filme = await Filme.bulkCreate(req.body);
  res.status(201).json(filme)
  }
);

router.put('/:id', async (req, res) => {
  const [u] = await Filme.update(req.body, { where: { id: req.params.id } });
  if (u) res.json(await Filme.findByPk(req.params.id));
  else  res.status(404).json({ error: 'Filme não encontrado' });
});

router.delete('/:id', async (req, res) => {
  const d = await Filme.destroy({ where: { id: req.params.id } });
  d ? res.json({ message: 'Deletado' }) : res.status(404).json({ error: 'Não encontrado' });
});

export default router;
