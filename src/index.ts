import app from './app';

import Database from './features/Database';
import User from './features/User';

app.addFeature(Database);
app.addFeature(User);
app.start();

export default app;
