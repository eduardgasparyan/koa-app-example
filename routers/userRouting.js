const Router = require('koa-router');
const router = new Router();
const db = require('../services/userData');
const au = require('../services/auth');
const car = require('../services/userCars');
const jwt = require('jsonwebtoken');
const accessSecretKey = process.env.ACCESS_TOKEN_SECRET;

const verifyToken = async (ctx, next) => {
  const accessToken = ctx.request.headers.authorization;
  if (!accessToken) {
    throw new Error('A token is required for authentication');
  }
  try {
    if (await jwt.verify(accessToken, accessSecretKey)) {
      return next();
    }
  } catch (err) {
    throw new Error('Invalid Access Token');
  }
};

router.get('/', async ctx => {
  return 'HomePage';
});

router.get('/users', async ctx => {
  return db.getAll();
});

router.get('/users/:id/refresh', async ctx => {
  const params = ctx.params;
  const refreshToken = ctx.request.headers.authorization;
  return au.generateNewAccessToken({ refreshToken, params });
});

router.post('/users/signup', async ctx => {
  const bodyParsed = ctx.request.body;
  return au.createOne({ bodyParsed });
});
router.post('/users/login', async ctx => {
  const bodyParsed = ctx.request.body;
  return au.login({ bodyParsed });
});

router.get(`/users/:id`, verifyToken, async ctx => {
  const params = ctx.params;
  return db.getOne({ params });
});

router.patch(`/users/:id`, verifyToken, async ctx => {
  const bodyParsed = ctx.request.body;
  const params = ctx.params;
  return db.update({ bodyParsed, params });
});

router.delete(`/users/:id`, verifyToken, async ctx => {
  const params = ctx.params;
  return db.deleteOne({ params });
});

router.get(`/users/:id/logout`, verifyToken, async ctx => {
  const params = ctx.params;
  return au.logout({ params });
});

router.post(`/users/:id/cars`, verifyToken, async ctx => {
  const params = ctx.params;
  const bodyParsed = ctx.request.body;
  return car.addCar({ params, bodyParsed });
});

router.get(`/users/:id/cars`, verifyToken, async ctx => {
  const params = ctx.params;
  return car.userCars({ params });
});

router.delete(`/users/:id/cars/:car_id`, verifyToken, async ctx => {
  const params = ctx.params;
  return car.deleteCar({ params });
});

router.patch(`/users/:id/cars/:car_id`, async ctx => {
  const bodyParsed = ctx.request.body;
  const params = ctx.params;
  return car.changeCar({ params, bodyParsed });
});
module.exports = router;
