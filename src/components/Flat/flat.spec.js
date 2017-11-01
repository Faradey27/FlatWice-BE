import request from 'supertest';
import mongoose from 'mongoose';
import App from './../../../src/controllers/App';

const app = new App();
const flat = {
  title: 'Сдам в аренду свою 2-комнатную в 5-ти минутах ходу от м. Дорогожичи',
  price: 5387,
  numberOfRooms: 4,
  apartmentArea: 139,
  currency: 'грн',
  currencyLabel: 'грн',
  author: {
    avatar: '/static/imgs/avatars/avatar2.jpg',
    name: 'Миша',
    phoneNumber: '+380630000000',
    email: 'some@s.com',
  },
  location: {
    x: 1,
    y: 1,
    address: {
      country: 'UA',
      city: 'Kiev',
      street: 'best street',
      house: '24',
    },
  },
  shortDescription: `
    Дом расположен Приморская 30а, историческом месте.возле крепости,
    пляж между горой крепостной и горой пол Вани! Древний генуэзский причал!
    Пляж галечный оборудованный навесами лежаками! Дом огорожен забором, кодовые замки
    на калитках и на подъездах! Во дворе стоянка, детская площадка посажены крымские деревья!
    Квартира находится на 3 этаже с видом на крепость! В квартире есть все что нужно, вай фай,
    кондиционер, стиральная машина, спутник ТВ, утюг, микроволновая печь!
    + 380 - Показать номер - ! +79787327140
  `,
  description: `
    Аренда 2-к квартиры, пер.Феодосийский 14-А17/22 этаж
    нового жилого дома  общая площадь - 65 кв.м2 спальни:
    в 1-й большая двуспальная кровать,  в 2-й раскладной диванхолл,
    закрытый балкон, кухня, 2 санузла, стиральная машинкаевроремонт, мебель,
    техника, кондиционеры все коммуникации, интернет Удобная парковка авто, рядом детская площадка,
    магазины, салоны, банки.  Ближайшее метро "Димеевская", автобусная остановка под домом Аренда + коммунальные
  `,
  categories: [
    'rent',
  ],
  tags: [
    'киев',
    'печерск',
  ],
  mainPhoto: '/static/imgs/flats/flat6.jpg',
  photos: [],
  videos: [],
};

describe('Flats', () => {
  const newUser = {
    email: `${Math.random() * '10000'}@test-magic-domain.com`,
    password: '12345',
    confirmPassword: '12345',
  };
  let cookies = ''; // eslint-disable-line

  beforeEach((done) => {
    mongoose.connection.collections.flats.drop(() => {
      mongoose.connection.collections.users.drop(async () => {
        const response = await request(app.express).post('/api/v1/signup').send(newUser);

        cookies = response.headers['set-cookie']; // eslint-disable-line
        done();
      });
    });
  });

  describe('Flats list', () => {
    it('should response with list of flats', async () => {
      const response = await request(app.express).get('/api/v1/flats');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ flats: [], total: 0 });
    });
  });

  describe('Add flats', () => {
    it('should response with created flat', async () => {
      const response = await request(app.express).post('/api/v1/flats').
        set('cookie', cookies).
        send(flat);

      expect(response.status).toBe(200);
      expect(response.body.title).toEqual(flat.title);

      const flatsResponse = await request(app.express).get('/api/v1/flats');

      expect(flatsResponse.status).toBe(200);
      expect(flatsResponse.body.flats[0].title).toBe(flat.title);
      expect(flatsResponse.body.total).toBe(1);
    });
  });

  describe('Update flat', () => {
    it('should response with updated flat', async () => {
      const response = await request(app.express).post('/api/v1/flats').
        set('cookie', cookies).
        send(flat);

      expect(response.status).toBe(200);
      expect(response.body.title).toEqual(flat.title);

      const updatedResponse = await request(app.express).
        put(`/api/v1/flats/${response.body.id}`).
        set('cookie', cookies).
        send({ title: '123' });

      expect(updatedResponse.status).toBe(200);
      expect(updatedResponse.body.title).toEqual('123');
      expect(updatedResponse.body.shortDescription).toEqual(flat.shortDescription);

      const flatsResponse = await request(app.express).get('/api/v1/flats');

      expect(flatsResponse.status).toBe(200);
      expect(flatsResponse.body.flats[0].title).toBe('123');
      expect(flatsResponse.body.total).toBe(1);
    });
  });

  describe('Delete flat', () => {
    it('should response with updated flat', async () => {
      const response = await request(app.express).
        post('/api/v1/flats').
        set('cookie', cookies).
        send(flat);

      expect(response.status).toBe(200);
      expect(response.body.title).toEqual(flat.title);

      const deletedResponse = await request(app.express).
        delete(`/api/v1/flats/${response.body.id}`).
        set('cookie', cookies);

      expect(deletedResponse.status).toBe(200);
      expect(deletedResponse.body).toEqual({});

      const flatsResponse = await request(app.express).get('/api/v1/flats');

      expect(flatsResponse.status).toBe(200);
      expect(flatsResponse.body.total).toBe(0);
    });
  });
});
