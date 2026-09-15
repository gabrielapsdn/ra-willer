como rodar:
npm i 
criar o .env
npx prisma generate
npx prisma migrate dev
npm run dev


criar arquivo .env

DATABASE_URL="postgresql://postgres:senai@localhost:5432/rawiller?schema=public"
