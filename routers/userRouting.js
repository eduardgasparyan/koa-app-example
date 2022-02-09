const Router = require('koa-router');
const router = new Router();
const db = require('../services/userData');

router.get('/', async ctx => {
  return 'HomePage';
});

router.get('/users', async ctx => {
  return db.getAll();
});

router.get(`/user/:username`, async ctx => {
  const { username } = ctx.params;
  return db.getOne(username);
});

router.post('/register', async ctx => {
  const bodyParsed = ctx.request.body;
  const data = bodyParsed;
  return db.createOne(data);
});

router.post('/login', async ctx => {
  const bodyParsed = ctx.request.body;
  const data = bodyParsed;
  return db.login(data);
});

router.get(`/:username`, async ctx => {
  console.log('working');
  const { username } = ctx.params;
  return `${username} logged successfuly`;
});

router.post(`/update/:username`, async ctx => {
  const bodyParsed = ctx.request.body;
  const { username } = ctx.params;
  const data = bodyParsed;
  return db.update(username, data);
});

router.get(`/delete/:id`, async ctx => {
  const { id } = ctx.params;
  return db.deleteOne(id);
});

module.exports = router;
