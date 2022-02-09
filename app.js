const Koa = require('koa');
const app = new Koa();
const router = require('./index');
const koaBody = require('koa-body');
const PORT = process.env.PORT || 3000;
app.use(koaBody());

app.use(async (ctx, next) => {
  const resp = await next();
  ctx.body = resp;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`App is started on ${PORT}`);
});
