import express from 'express';
import { Usuario } from '../models/Index.js';
import Sequelize from 'sequelize';

const router = express.Router();

router.get('/',   async (_req, res) => {
  const list = await Usuario.findAll();
  res.json(list);
});

router.get('/:id', async (req, res) => {
  console.log('get/:id')
  const u = await Usuario.findByPk(req.params.id);
  if (u) res.json(u);
  else  res.status(404).json({ error: 'Usuário não encontrado' });
});

router.post('/',  async (req, res) => {
  const u = await Usuario.create(req.body);
  res.status(201).json(u);
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



router.put('/:id', async (req, res) => {
  const [updated] = await Usuario.update(req.body, { where: { id: req.params.id } });
  if (updated) {
    const u = await Usuario.findByPk(req.params.id);
    res.json(u);
  } else res.status(404).json({ error: 'Usuário não encontrado' });
});


router.delete('/:id', async (req, res) => {
  const deleted = await Usuario.destroy({ where: { id: req.params.id } });
  if (deleted) res.json({ message: 'Deletado com sucesso' });
  else res.status(404).json({ error: 'Usuário não encontrado' });
});

export default router;
