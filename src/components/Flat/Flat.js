import * as flatRoutes from './flatRoutes';
import ROLES from './../../configs/roles';
const PREFIX = '/api/v1';

class Flat {
  constructor(app, isAuthenticated, isAuthorized) {
    this.app = app;
    this.isAuthenticated = isAuthenticated;
    this.isAuthorized = isAuthorized;

    this.
      setupGetFlatsRoute().
      setupAddFlatRoute().
      setupUpdateFlatRoute().
      setupDeleteFlatRoute();
  }

  setupGetFlatsRoute() {
    this.app.get(`${PREFIX}/flats`, flatRoutes.getFlats);

    return this;
  }

  setupAddFlatRoute() {
    const roles = [ROLES.user, ROLES.admin, ROLES.moderator];

    this.app.post(`${PREFIX}/flats`, this.isAuthenticated, this.isAuthorized.bind(null, roles), flatRoutes.postFlats);

    return this;
  }

  setupUpdateFlatRoute() {
    const roles = [ROLES.user, ROLES.admin, ROLES.moderator];

    this.app.put(`${PREFIX}/flats/:id`, this.isAuthenticated, this.isAuthorized.bind(null, roles), flatRoutes.putFlats);

    return this;
  }

  setupDeleteFlatRoute() {
    const roles = [ROLES.user, ROLES.admin, ROLES.moderator];

    this.app.delete(`${PREFIX}/flats/:id`, this.isAuthenticated, this.isAuthorized.bind(null, roles), flatRoutes.deleteFlats);

    return this;
  }
}

export default Flat;
