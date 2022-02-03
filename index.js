const Router = require('koa-router');
const router = new Router();
const db = require('./db');
router.get('/', async ctx => {
  return 'HomePage';
});
router.get('/users', async ctx => {
  return db.getAll();
});

router.get(`/user/:id`, async ctx => {
  const { id } = ctx.params;
  //
  return db.getOne(id);
});

router.post('/register', async ctx => {
  const bodyParsed = ctx.request.body;
  const data = bodyParsed;
  const username = data.username;
  const password = data.password;
  const email = data.email;
  return db.createOne(username, password, email);
});

router.get('/delete/:id', async ctx => {
  const { id } = ctx.params;
  return db.deleteOne(id);
});

module.exports = router;
