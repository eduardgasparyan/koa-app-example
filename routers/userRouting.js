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
  const username = data.username;
  const password = data.password;
  const email = data.email;
  return db.createOne(username, password, email);
});

router.post('/login', async ctx => {
  const bodyParsed = ctx.request.body;
  const data = bodyParsed;
  const username = data.username;
  const password = data.password;
  return db.login(username, password);
});

router.post(`/update/:username/updateAge`, async ctx => {
  const bodyParsed = ctx.request.body;
  const { username } = ctx.params;
  const data = bodyParsed;
  const age = data.age;
  return db.updateAge(username, age);
});

router.get(`/addAgeColumn`, async => {
  return db.addAgeColumn();
});

router.get(`/delete/:id`, async ctx => {
  const { id } = ctx.params;
  return db.deleteOne(id);
});

module.exports = router;
