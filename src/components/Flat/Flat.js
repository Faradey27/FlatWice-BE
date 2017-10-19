import * as flatRoutes from './flatRoutes';
const PREFIX = '/api/v1';

class Flat {
  constructor(app) {
    app.get(`${PREFIX}/flats`, flatRoutes.getFlats);
    app.post(`${PREFIX}/flats`, flatRoutes.postFlats);
  }
}

export default Flat;
