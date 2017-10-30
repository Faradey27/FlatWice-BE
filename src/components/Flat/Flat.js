import * as flatRoutes from './flatRoutes';
const PREFIX = '/api/v1';

class Flat {
  constructor(app) {
    app.get(`${PREFIX}/flats`, flatRoutes.getFlats);
    app.post(`${PREFIX}/flats`, flatRoutes.postFlats);
    app.put(`${PREFIX}/flats/:id`, flatRoutes.putFlats);
    app.delete(`${PREFIX}/flats/:id`, flatRoutes.deleteFlats);
  }
}

export default Flat;
