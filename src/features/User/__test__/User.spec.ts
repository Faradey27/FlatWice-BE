import UserDriver from './User.driver';

describe('User', () => {
  let driver: UserDriver = null;

  beforeEach(async () => {
    driver = new UserDriver();

    await driver.cleanup();
  });

  afterEach(() => driver.cleanup());

  describe('User', () => {
    it('should return list of User', async () => {
      const usersResponse = await driver.get.users();

      expect(usersResponse.status).toBe(200);
      expect(usersResponse.body).toEqual({
        users: [],
        total: 0,
      });
    });

    it('should create User', async () => {
      const createdUserResponse = await driver.when.userCreated({});
      expect(createdUserResponse.status).toBe(200);
      expect(createdUserResponse.body._id).toBeTruthy();
      expect(createdUserResponse.body.updatedAt).toBeTruthy();
      expect(createdUserResponse.body.createdAt).toBeTruthy();

      const usersResponse = await driver.get.users();

      expect(usersResponse.status).toBe(200);
      expect(usersResponse.body.total).toBe(1);
      expect(usersResponse.body.users.length).toBe(1);
      expect(usersResponse.body.users[0]._id).toBeTruthy();
    });

    it('should delete User', async () => {
      const userResponse = await driver.when.userCreated({});
      const usersResponse = await driver.get.users();
      expect(usersResponse.body.total).toBe(1);

      const deletedResponse = await driver.when.userDeleted(userResponse.body._id);
      expect(deletedResponse.status).toBe(200);
      expect(deletedResponse.body._id).toBe(userResponse.body._id);

      const usersResponse2 = await driver.get.users();
      expect(usersResponse2.body.total).toBe(0);
    });

    it('should updated User', async () => {
      const userResponse = await driver.when.userCreated({});

      const usersResponse = await driver.get.users();
      expect(usersResponse.body.users[0].deleted).toBeFalsy();

      const updatedResponse = await driver.when
        .userUpdated(userResponse.body._id, { deleted: true });
      expect(updatedResponse.status).toBe(200);
      expect(updatedResponse.body._id).toBe(userResponse.body._id);
      expect(updatedResponse.body.deleted).toBeTruthy();

      const usersResponse2 = await driver.get.users();
      expect(usersResponse2.body.users[0].deleted).toBeTruthy();
    });
  });
});
