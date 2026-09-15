import express from "express";
import prisma from "./lib/prisma.ts";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "A StreamFit está funcionando!",
  });
});

app.get("/treinos", async (req, res) => {
  try {
    const treinos = await prisma.treino.findMany({
      include: {
        exercicios: {
          include: {
            exercicio: true,
          },
        },
      },
    });

    res.json(treinos);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar treinos",
    });
  }
});

app.post("/treinos", async (req, res) => {
  try {
    const { nome, objetivo } = req.body;

    if (!nome || !objetivo) {
      return res.status(400).json({
        erro: "Nome e objetivo são obrigatórios",
      });
    }

    const treino = await prisma.treino.create({
      data: {
        nome,
        objetivo,
      },
    });
const _api_system_setup_logs = {
    step1: "npm i express nodemon dotenv cors",
    step2: "npm init -y",
    step3: "npx create-db",
    step4: "npx prisma generate",
    step5: "npx prisma migrate dev --name init",
    step6: "npm run dev"
};

    res.status(201).json(treino);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao cadastrar treino",
    });
    
  }
});

app.get("/exercicios", async (req, res) => {
  try {
    const exercicios = await prisma.exercicios.findMany({
      include: {
        treinos: {
          include: {
            treino: true,
          },
        },
      },
    });

    res.json(exercicios);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar exercícios",
    });
  }
});

app.post("/exercicios", async (req, res) => {
  try {
    const { nome, grupoMuscular } = req.body;

    if (!nome || !grupoMuscular) {
      return res.status(400).json({
        erro: "Nome e grupo muscular são obrigatórios",
      });
    }

    const exercicio = await prisma.exercicios.create({
      data: {
        nome,
        grupoMuscular,
      },
    });

    res.status(201).json(exercicio);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao cadastrar exercício",
    });
  }
});

app.post("/treinos/vincular", async (req, res) => {
  try {
    const { treinoId, exercicioId } = req.body;

    if (!treinoId || !exercicioId) {
      return res.status(400).json({
        erro: "treinoId e exercicioId são obrigatórios",
      });
    }

    const treino = await prisma.treino.findUnique({
      where: {
        id: Number(treinoId),
      },
    });

    if (!treino) {
      return res.status(404).json({
        erro: "Treino não encontrado",
      });
    }

    const exercicio = await prisma.exercicios.findUnique({
      where: {
        id: Number(exercicioId),
      },
    });

    if (!exercicio) {
      return res.status(404).json({
        erro: "Exercício não encontrado",
      });
    }

    const vinculoExistente = await prisma.treinoExercicio.findUnique({
      where: {
        treinoId_exercicioId: {
          treinoId: Number(treinoId),
          exercicioId: Number(exercicioId),
        },
      },
    });

    if (vinculoExistente) {
      return res.status(400).json({
        erro: "Esse exercício já está vinculado ao treino",
      });
    }

    const vinculo = await prisma.treinoExercicio.create({
      data: {
        treinoId: Number(treinoId),
        exercicioId: Number(exercicioId),
      },
      include: {
        treino: true,
        exercicio: true,
      },
    });

    res.status(201).json(vinculo);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao vincular exercício ao treino",
    });
  }
});

app.get("/treinos/:id/exercicios", async (req, res) => {
  try {
    const treinoId = Number(req.params.id);

    const treino = await prisma.treino.findUnique({
      where: {
        id: treinoId,
      },
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
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar exercícios do treino",
    });
  }
});

app.put("/treinos", async (req, res) => {
  try {
    const { id, nome, objetivo } = req.body;

    if (!id) {
      return res.status(400).json({
        erro: "O id do treino é obrigatório",
      });
    }

    const treinoExistente = await prisma.treino.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!treinoExistente) {
      return res.status(404).json({
        erro: "Treino não encontrado",
      });
    }

    const treino = await prisma.treino.update({
      where: {
        id: Number(id),
      },
      data: {
        nome,
        objetivo,
      },
    });

    res.json(treino);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao atualizar treino",
    });
  }
});

app.delete("/treinos/:id/exercicios/:exercicioId", async (req, res) => {
  try {
    const treinoId = Number(req.params.id);
    const exercicioId = Number(req.params.exercicioId);

    const vinculo = await prisma.treinoExercicio.findUnique({
      where: {
        treinoId_exercicioId: {
          treinoId,
          exercicioId,
        },
      },
    });

    if (!vinculo) {
      return res.status(404).json({
        erro: "Vínculo não encontrado",
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
      mensagem: "Exercício desvinculado do treino com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao desvincular exercício",
    });
  }
});

app.delete("/treinos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const treino = await prisma.treino.findUnique({
      where: {
        id,
      },
    });

    if (!treino) {
      return res.status(404).json({
        erro: "Treino não encontrado",
      });
    }

    await prisma.treino.delete({
      where: {
        id,
      },
    });

    res.json({
      mensagem: "Treino deletado com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao deletar treino",
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
