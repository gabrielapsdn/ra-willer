import express from "express";
import prisma from "./lib/prisma";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "online" });
});

app.get("/treinos", async (_req, res) => {
  try {
    const data = await prisma.treino.findMany({
      include: {
        exercicios: {
          include: {
            exercicio: true,
          },
        },
      },
    });

    res.json(data);
  } catch {
    res.status(500).json({ erro: "Não foi possível carregar os treinos" });
  }
});

app.post("/treinos", async (req, res) => {
  try {
    const { nome, objetivo } = req.body;

    if (typeof nome !== "string" || typeof objetivo !== "string") {
      return res.status(400).json({
        erro: "Informe nome e objetivo",
      });
    }

    const novoTreino = await prisma.treino.create({
      data: {
        nome,
        objetivo,
      },
    });

    res.status(201).json(novoTreino);
  } catch {
    res.status(500).json({ erro: "Não foi possível criar o treino" });
  }
});

app.get("/exercicios", async (_req, res) => {
  try {
    const lista = await prisma.exercicios.findMany({
      include: {
        treinos: {
          include: {
            treino: true,
          },
        },
      },
    });

    res.json(lista);
  } catch {
    res.status(500).json({
      erro: "Não foi possível carregar os exercícios",
    });
  }
});

app.post("/exercicios", async (req, res) => {
  try {
    const { nome, grupoMuscular } = req.body;

    if (typeof nome !== "string" || typeof grupoMuscular !== "string") {
      return res.status(400).json({
        erro: "Informe nome e grupo muscular",
      });
    }

    const novoExercicio = await prisma.exercicios.create({
      data: {
        nome,
        grupoMuscular,
      },
    });

    res.status(201).json(novoExercicio);
  } catch {
    res.status(500).json({
      erro: "Não foi possível cadastrar o exercício",
    });
  }
});

app.post("/treinos/:treinoId/exercicios/:exercicioId", async (req, res) => {
  try {
    const treinoId = Number(req.params.treinoId);
    const exercicioId = Number(req.params.exercicioId);

    if (!Number.isInteger(treinoId) || !Number.isInteger(exercicioId)) {
      return res.status(400).json({ erro: "IDs inválidos" });
    }

    const [treino, exercicio] = await Promise.all([
      prisma.treino.findUnique({
        where: { id: treinoId },
      }),
      prisma.exercicios.findUnique({
        where: { id: exercicioId },
      }),
    ]);

    if (!treino) {
      return res.status(404).json({ erro: "Treino não encontrado" });
    }

    if (!exercicio) {
      return res.status(404).json({ erro: "Exercício não encontrado" });
    }

    const existente = await prisma.treinoExercicio.findUnique({
      where: {
        treinoId_exercicioId: {
          treinoId,
          exercicioId,
        },
      },
    });

    if (existente) {
      return res.status(409).json({
        erro: "Exercício já faz parte desse treino",
      });
    }

    const registro = await prisma.treinoExercicio.create({
      data: {
        treinoId,
        exercicioId,
      },
      include: {
        treino: true,
        exercicio: true,
      },
    });

    res.status(201).json(registro);
  } catch {
    res.status(500).json({
      erro: "Não foi possível adicionar o exercício",
    });
  }
});

app.get("/treinos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const treino = await prisma.treino.findUnique({
      where: { id },
      include: {
        exercicios: {
          include: {
            exercicio: true,
          },
        },
      },
    });

    if (!treino) {
      return res.status(404).json({
        erro: "Treino não encontrado",
      });
    }

    res.json(treino);
  } catch {
    res.status(500).json({
      erro: "Não foi possível consultar o treino",
    });
  }
});

app.patch("/treinos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, objetivo } = req.body;

    const atual = await prisma.treino.findUnique({
      where: { id },
    });

    if (!atual) {
      return res.status(404).json({
        erro: "Treino não encontrado",
      });
    }

    const atualizado = await prisma.treino.update({
      where: { id },
      data: {
        ...(nome !== undefined && { nome }),
        ...(objetivo !== undefined && { objetivo }),
      },
    });

    res.json(atualizado);
  } catch {
    res.status(500).json({
      erro: "Não foi possível atualizar o treino",
    });
  }
});

app.delete("/treinos/:treinoId/exercicios/:exercicioId", async (req, res) => {
  try {
    const treinoId = Number(req.params.treinoId);
    const exercicioId = Number(req.params.exercicioId);

    const relacao = await prisma.treinoExercicio.findUnique({
      where: {
        treinoId_exercicioId: {
          treinoId,
          exercicioId,
        },
      },
    });

    if (!relacao) {
      return res.status(404).json({
        erro: "Exercício não está vinculado ao treino",
      });
    }

    await prisma.treinoExercicio.delete({
      where: {
        treinoId_exercicioId: {
          treinoId,
          exercicioId,
        },
      },
    });

    res.json({
      mensagem: "Exercício removido do treino",
    });
  } catch {
    res.status(500).json({
      erro: "Não foi possível remover o exercício",
    });
  }
});

app.delete("/treinos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const treino = await prisma.treino.findUnique({
      where: { id },
    });

    if (!treino) {
      return res.status(404).json({
        erro: "Treino não encontrado",
      });
    }

    await prisma.treino.delete({
      where: { id },
    });

    res.json({
      mensagem: "Treino removido",
    });
  } catch {
    res.status(500).json({
      erro: "Não foi possível remover o treino",
    });
  }
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`API disponível em http://localhost:${PORT}`);
});