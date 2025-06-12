import express from 'express';
import { Canal } from '../models/Index.js';

const router = express.Router();

// Buscar todos os canais
router.get('/', async (_req, res) => {
  try {
    const canais = await Canal.findAll();
    res.json(canais);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar os canais.' });
  }
});

// Buscar canal por ID
router.get('/:id', async (req, res) => {
  try {
    const canal = await Canal.findByPk(req.params.id);
    canal ? res.json(canal) : res.status(404).json({ error: 'Canal não encontrado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar o canal.' });
  }
});

// Criar um canal
router.post('/', async (req, res) => {
  try {
    const novoCanal = await Canal.create(req.body);
    res.status(201).json(novoCanal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Criar canais em lote
router.post('/lote', async (req, res) => {
  try {
    const canais = req.body;

    if (!Array.isArray(canais)) {
      return res.status(400).json({ error: 'O corpo da requisição deve ser um array de canais.' });
    }

    const canaisCriados = await Canal.bulkCreate(canais);
    res.status(201).json(canaisCriados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao inserir os canais em lote.' });
  }
});

// Atualizar um canal por ID
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Canal.update(req.body, {
      where: { id: req.params.id }
    });

    if (updated) {
      const canalAtualizado = await Canal.findByPk(req.params.id);
      res.json(canalAtualizado);
    } else {
      res.status(404).json({ error: 'Canal não encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar o canal.' });
  }
});

// Deletar canal por ID
router.delete('/:id', async (req, res) => {
  try {
    const deletado = await Canal.destroy({ where: { id: req.params.id } });

    if (deletado) {
      res.json({ message: 'Canal deletado com sucesso.' });
    } else {
      res.status(404).json({ error: 'Canal não encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar o canal.' });
  }
});

export default router;
