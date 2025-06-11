import express from 'express';
import { Canal } from '../models/Index.js';
const router = express.Router();

router.get('/', async (_req, res) => res.json(await Canal.findAll()));
router.get('/:id', async (req, res) => {
  const c = await Canal.findByPk(req.params.id);
  c ? res.json(c) : res.status(404).json({ error: 'Canal não encontrado' });
});
router.post('/lote', async (req, res) => {
  try {
    const usuarios = req.body; // espera um array de usuários no body

    if (!Array.isArray(usuarios)) {
      return res.status(400).json({ error: 'O corpo da requisição deve ser um array de usuários.' });
    }

    // cria todos os usuários com bulkCreate
    const usuariosCriados = await Usuario.bulkCreate(usuarios);

    res.status(201).json(usuariosCriados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao inserir os usuários em lote.' });
  }
});

router.post('/', async (req, res) => res.status(201).json(await Canal.create(req.body)));
router.put('/:id', async (req, res) => {
  const [u] = await Canal.update(req.body, { where: { id: req.params.id } });
  if (u) res.json(await Canal.findByPk(req.params.id));
  else  res.status(404).json({ error: 'Canal não encontrado' });
});

router.delete('/:id', async (req, res) => {
  const d = await Canal.destroy({ where: { id: req.params.id } });
  d ? res.json({ message: 'Deletado' }) : res.status(404).json({ error: 'Não encontrado' });
});

export default router;
