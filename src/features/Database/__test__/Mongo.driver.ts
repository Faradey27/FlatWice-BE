import { connection } from 'mongoose';

import app from './../../../app';
import Database from './../index';

class MongoDriver {
  public when = {
    connected: ({ withError }: {withError: boolean} = { withError: false }): Promise<{}> => {
      return new Promise((resolve, reject) => {
        app.addFeature(Database)
          .then(data => resolve(data))
          .catch(err => resolve(err));

        if (withError) {
          connection.emit('error', 'This is an error');
        }
      });
    },
  };

  public get = {
  };
}

export default MongoDriver;
