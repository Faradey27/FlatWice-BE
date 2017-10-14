import _PLACEHOLDER_Driver from './_PLACEHOLDER_.driver';

describe('_PLACEHOLDER_', () => {
  let driver: _PLACEHOLDER_Driver = null;

  beforeEach(async () => {
    driver = new _PLACEHOLDER_Driver();

    await driver.cleanup();
  });

  afterEach(() => driver.cleanup());

  describe('_PLACEHOLDER_', () => {
    it('should return list of _PLACEHOLDER_', async () => {
      const _PLACEHOLDERLOWER_sResponse = await driver.get._PLACEHOLDERLOWER_s();

      expect(_PLACEHOLDERLOWER_sResponse.status).toBe(200);
      expect(_PLACEHOLDERLOWER_sResponse.body).toEqual({
        _PLACEHOLDERLOWER_s: [],
        total: 0,
      });
    });

    it('should create _PLACEHOLDER_', async () => {
      const created_PLACEHOLDER_Response = await driver.when._PLACEHOLDERLOWER_Created({});
      expect(created_PLACEHOLDER_Response.status).toBe(200);
      expect(created_PLACEHOLDER_Response.body._id).toBeTruthy();
      expect(created_PLACEHOLDER_Response.body.updatedAt).toBeTruthy();
      expect(created_PLACEHOLDER_Response.body.createdAt).toBeTruthy();

      const _PLACEHOLDERLOWER_sResponse = await driver.get._PLACEHOLDERLOWER_s();

      expect(_PLACEHOLDERLOWER_sResponse.status).toBe(200);
      expect(_PLACEHOLDERLOWER_sResponse.body.total).toBe(1);
      expect(_PLACEHOLDERLOWER_sResponse.body._PLACEHOLDERLOWER_s.length).toBe(1);
      expect(_PLACEHOLDERLOWER_sResponse.body._PLACEHOLDERLOWER_s[0]._id).toBeTruthy();
    });

    it('should delete _PLACEHOLDER_', async () => {
      const _PLACEHOLDERLOWER_Response = await driver.when._PLACEHOLDERLOWER_Created({});
      const _PLACEHOLDERLOWER_sResponse = await driver.get._PLACEHOLDERLOWER_s();
      expect(_PLACEHOLDERLOWER_sResponse.body.total).toBe(1);

      const deletedResponse = await driver.when._PLACEHOLDERLOWER_Deleted(_PLACEHOLDERLOWER_Response.body._id);
      expect(deletedResponse.status).toBe(200);
      expect(deletedResponse.body._id).toBe(_PLACEHOLDERLOWER_Response.body._id);

      const _PLACEHOLDERLOWER_sResponse2 = await driver.get._PLACEHOLDERLOWER_s();
      expect(_PLACEHOLDERLOWER_sResponse2.body.total).toBe(0);
    });

    it('should updated _PLACEHOLDER_', async () => {
      const _PLACEHOLDERLOWER_Response = await driver.when._PLACEHOLDERLOWER_Created({});

      const _PLACEHOLDERLOWER_sResponse = await driver.get._PLACEHOLDERLOWER_s();
      expect(_PLACEHOLDERLOWER_sResponse.body._PLACEHOLDERLOWER_s[0].deleted).toBeFalsy();

      const updatedResponse = await driver.when
        ._PLACEHOLDERLOWER_Updated(_PLACEHOLDERLOWER_Response.body._id, { deleted: true });
      expect(updatedResponse.status).toBe(200);
      expect(updatedResponse.body._id).toBe(_PLACEHOLDERLOWER_Response.body._id);
      expect(updatedResponse.body.deleted).toBeTruthy();

      const _PLACEHOLDERLOWER_sResponse2 = await driver.get._PLACEHOLDERLOWER_s();
      expect(_PLACEHOLDERLOWER_sResponse2.body._PLACEHOLDERLOWER_s[0].deleted).toBeTruthy();
    });
  });
});
