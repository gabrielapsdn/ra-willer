como rodar: (lembrar de colocar no auto-save)
npm i =
criar o .env =
npx prisma generate =
npx prisma migrate dev =
npm run dev =


criar arquivo .env =

DATABASE_URL="postgresql://postgres:senai@localhost:5432/rawiller?schema=public"


\  npm init -y \
\ npm i express nodemon dotenv cors \
\ npx create-db \
 \ criar o .env: DATABASE_URL="postgresql://postgres:senai@localhost:5432/streamfit?schema=public" \
\ npx prisma generate \
 \ npx prisma migrate dev --name init \
  \   npm run dev \
