const Router = require('koa-router');
const router = new Router();
const db = require('../services/userData');
const au = require('../services/auth');

router.get('/', async ctx => {
  return 'HomePage';
});

router.get('/users', async ctx => {
  return db.getAll();
});
router.get('/refresh', async ctx => {
  const data = ctx.request.headers;
  return au.generateNewAccessToken(data);
});
router.post('/register', async ctx => {
  const bodyParsed = ctx.request.body;
  const data = bodyParsed;
  return au.createOne(data);
});

router.post('/login', async ctx => {
  const bodyParsed = ctx.request.body;
  const data = bodyParsed;
  return au.login(data);
});

router.get(`/:username`, async ctx => {
  const accessToken = ctx.request.headers.authorization;
  if (await au.verifyToken(accessToken, ctx.params))
    return db.getOne(ctx.params);
});

router.post(`/update/:username`, async ctx => {
  const bodyParsed = ctx.request.body;
  const { username } = ctx.params;
  const data = bodyParsed;
  return db.update(username, data);
});

router.get(`/delete/:username`, async ctx => {
  const { username } = ctx.params;
  return db.deleteOne(username);
});

router.get(`/logout/:username`, async ctx => {
  const data = ctx.params;
  return au.logout(data);
});

module.exports = router;
