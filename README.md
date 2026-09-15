# ra-willer
como rodar:
``npm i express dotenv nodemon cors
npm init -y
npx create-db
npx prisma generate 
npx prisma migrate dev --name init
npm run dev


criar arquivo .env

DATABASE_URL="postgresql://postgres:senai@localhost:5432/rawiller?schema=public"
