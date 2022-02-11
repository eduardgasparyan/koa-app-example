const Router = require('koa-router');
const router = new Router();
const db = require('../services/userData');
const au = require('../services/auth');
const car = require('../services/userCars');

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

router.post(`/:username/addCar`, async ctx => {
  const data = {
    username: ctx.params,
    bodyParsed: ctx.request.body,
    accessToken: ctx.request.headers.authorization,
  };
  if (await au.verifyToken(data.accessToken, data.username))
    return car.addingCar(data);
  else throw new Error('Verification false');
});

router.get(`/:username/cars`, async ctx => {
  const data = {
    username: ctx.params,
    accessToken: ctx.request.headers.authorization,
  };
  if (await au.verifyToken(data.accessToken, data.username))
    return car.userCars(data.username);
  else throw new Error('Verification false');
});

router.post(`/:username/deleteCar`, async ctx => {
  const data = {
    username: ctx.params,
    accessToken: ctx.request.headers.authorization,
    carName: ctx.request.body,
  };
  if (await au.verifyToken(data.accessToken, data.username))
    return car.deleteCar(data);
  else throw new Error('Verification false');
});

router.post(`/:username/changeCar`, async ctx => {
  const data = {
    username: ctx.params,
    accessToken: ctx.request.headers.authorization,
    carName: ctx.request.body,
  };
  if (await au.verifyToken(data.accessToken, data.username))
    return car.changeCar(data);
  else throw new Error('Verification false');
});
module.exports = router;
