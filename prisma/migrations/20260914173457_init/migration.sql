-- CreateTable
CREATE TABLE "Treino" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,

    CONSTRAINT "Treino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercicios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "grupoMuscular" TEXT NOT NULL,

    CONSTRAINT "Exercicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreinoExercicio" (
    "treinoId" INTEGER NOT NULL,
    "exercicioId" INTEGER NOT NULL,

    CONSTRAINT "TreinoExercicio_pkey" PRIMARY KEY ("treinoId","exercicioId")
);

-- AddForeignKey
ALTER TABLE "TreinoExercicio" ADD CONSTRAINT "TreinoExercicio_treinoId_fkey" FOREIGN KEY ("treinoId") REFERENCES "Treino"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreinoExercicio" ADD CONSTRAINT "TreinoExercicio_exercicioId_fkey" FOREIGN KEY ("exercicioId") REFERENCES "Exercicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
