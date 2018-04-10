import * as express from 'express';

import CatCtrl from './controllers/cat';
import UserCtrl from './controllers/user';
import DomainCtrl from './controllers/domain';
import ShareCtrl from './controllers/share';
import Cat from './models/cat';
import User from './models/user';

export default function setRoutes(app) {

  const router = express.Router();

  const catCtrl = new CatCtrl();
  const userCtrl = new UserCtrl();
  const domainCtrl = new DomainCtrl();
  const shareCtrl = new ShareCtrl();

  router.route('/cats').post(catCtrl.getAll); //why doesn't .get work?
  //router.route('/cats/count').post(catCtrl.count);
  router.route('/cat').post(catCtrl.insert);
  router.route('/cat/:id').get(catCtrl.get);
  //router.route('/cat/:id').put(catCtrl.update);
  router.route('/cat/:id').delete(catCtrl.delete);
  router.route('/cat/delete/:id').delete(catCtrl.delete);
  //router.route('/cat/insert').post(catCtrl.insert);

  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);
  
  router.route('/domains').post(domainCtrl.getAll); //get all domains for a specific user 
  router.route('/domains/get/:id').get(domainCtrl.get);
  router.route('/domains/delete/:id').delete(domainCtrl.delete);
  router.route('/domain').post(domainCtrl.insert);
  //domains/count not needed
  
  router.route('/shares').post(shareCtrl.getAllShares);
  router.route('/share').post(shareCtrl.insert);
  router.route('/share/:id').put(shareCtrl.update);
  router.route('/share/:id').delete(shareCtrl.delete);
  router.route('/share/value/:id').get(shareCtrl.getValue);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}