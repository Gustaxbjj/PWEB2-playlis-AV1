import Usuario from  "../models/Usuario";
import express from "express";

const router = express.Router();
import { body, validationResult } from "express-validator";
import { Op } from "sequelize";
import db from "../models/Index.js";
import { sequelize } from "../models/Index.js";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

get("/usuarios", async (req, res) => {

    try {
        const usuarios = await db.Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
    })

    get("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await db.Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.json(usuario);
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
});

post("/usuarios", [
    body("login").isString().withMessage("O login deve ser uma string."),
    body("nome").isString().withMessage("O nome deve ser uma string."),
    body("email").isEmail().withMessage("O email deve ser válido."),
    body("senha").isString().withMessage("A senha deve ser uma string.")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { login, nome, email, senha } = req.body;

    try {
        const usuario = await db.Usuario.create({ login, nome, email, senha });
        res.status(201).json(usuario);
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ error: "Erro ao criar usuário" });
    }
});

put ("/usuarios/:id", [ 
    body("login").optional().isString().withMessage("O login deve ser uma string."),
    body("nome").optional().isString().withMessage("O nome deve ser uma string."),
    body("email").optional().isEmail().withMessage("O email deve ser válido."),
    body("senha").optional().isString().withMessage("A senha deve ser uma string.")
], async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { login, nome, email, senha } = req.body;

    try {
        const usuario = await db.Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        await usuario.update({ login, nome, email, senha });
        res.json(usuario);
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
});

delete ("/usuarios/:id", async (req, res) => { 
    const { id } = req.params;

    try {
        const usuario = await db.Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        await usuario.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        res.status(500).json({ error: "Erro ao deletar usuário" });
    }
});

get("/usuarios/search", async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
        const usuarios = await db.Usuario.findAll({
            where: {
                [Op.or]: [
                    { login: { [Op.like]: `%${query}%` } },
                    { nome: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } }
                ]
            }
        });

        res.json(usuarios);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
});

get("/usuarios/buscando-por-email-ou-login", async (req, res) => {
    const { email, login } = req.query;

    if (!email && !login) {
        return res.status(400).json({ error: "Pelo menos um parâmetro (email ou login) é necessário" });
    }

    try {
        const whereClause = {};
        if (email) {
            whereClause.email = { [Op.like]: `%${email}%` };
        }
        if (login) {
            whereClause.login = { [Op.like]: `%${login}%` };
        }

        const usuarios = await db.Usuario.findAll({
            where: whereClause
        });

        res.json(usuarios);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
});

export default router;
