import { Application, Router } from 'https://deno.land/x/oak/mod.ts';

interface Driver {
  name: string;
  age: number;
}

let drivers: Array<Driver> = [
  {
    name: 'Tyler',
    age: 30,
  },
  {
    name: 'Brittany',
    age: 29,
  },
];

const env = Deno.env.toObject();
const PORT = env.PORT || 4000;
const HOST = env.HOST || '127.0.0.1';

export const getDrivers = ({ response }: { response: any }) => {
  response.body = drivers;
};

export const getDriver = ({
  params,
  response,
}: {
  params: {
    name: string;
  };
  response: any;
}) => {
  const driver = drivers.filter((driver) => driver.name === params.name);
  if (driver.length) {
    response.status = 200;
    response.body = driver[0];
    return;
  }

  response.status = 400;
  response.body = { msg: `Cannot find driver ${params.name}` };
};

export const addDriver = async ({ request, response }: { request: any; response: any }) => {
  const body = await request.body();
  const driver: Driver = body.value;
  drivers.push(driver);

  response.body = { msg: 'OK' };
  response.status = 200;
};

export const updateDriver = async ({
  params,
  request,
  response,
}: {
  params: {
    name: string;
  };
  request: any;
  response: any;
}) => {
  const temp = drivers.filter((existingDriver) => existingDriver.name === params.name);
  const body = await request.body();
  const { age }: { age: number } = body.value;

  if (temp.length) {
    temp[0].age = age;
    response.status = 200;
    response.body = { msg: 'OK' };
    return;
  }

  response.status = 400;
  response.body = { msg: `Cannot find driver ${params.name}` };
};

export const removeDriver = ({
  params,
  response,
}: {
  params: {
    name: string;
  };
  response: any;
}) => {
  const lengthBefore = drivers.length;
  drivers = drivers.filter((driver) => driver.name !== params.name);

  if (drivers.length === lengthBefore) {
    response.status = 400;
    response.body = { msg: `Cannot find driver ${params.name}` };
    return;
  }

  response.body = { msg: 'OK' };
  response.status = 200;
};

const router = new Router();
router
  .get('/drivers', getDrivers)
  .get('/drivers/:name', getDriver)
  .post('/drivers', addDriver)
  .put('/drivers/:name', updateDriver)
  .delete('/drivers/:name', removeDriver);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on port ${PORT}...`);

await app.listen(`${HOST}:${PORT}`);
