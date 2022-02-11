const path = require('path');
const Koa = require('koa');
const dotenv = require('dotenv');
dotenv.config();
const app = new Koa();
const router = require('./routers/userRouting');
const db = require('./models/index');
const { sequelize } = db;
const koaBody = require('koa-body');

const PORT = process.env.PORT || 3000;

app.use(koaBody());
app.use(async (ctx, next) => {
  sequelize.sync();
  const resp = await next();
  ctx.body = resp;
});

app.use(router.routes());
app.use(router.allowedMethods());

const start = async () => {
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`App is started on ${PORT}`);
  });
};

start();
