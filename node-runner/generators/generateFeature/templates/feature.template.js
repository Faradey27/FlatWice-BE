import { Application, Request, Response } from 'express';
import { IFeature } from './../../types/features.d';
import _PLACEHOLDER_Model, { I_PLACEHOLDER_, I_PLACEHOLDER_Model } from './_PLACEHOLDER_.model';

class _PLACEHOLDER_ implements IFeature {
  private static PREFIX = '/api/v1';
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public featureName: string = '_PLACEHOLDERLOWER_';

  public connect = () => {
    this.setupRouting(this.app);
    return Promise.resolve({ status: 'OK' });
  }

  private setupRouting(router: Application) {
    const prefix = _PLACEHOLDER_.PREFIX;

    router.get(`${prefix}/_PLACEHOLDERLOWER_`, this.get_PLACEHOLDER_s);
    router.post(`${prefix}/_PLACEHOLDERLOWER_`, this.add_PLACEHOLDER_);
    router.delete(`${prefix}/_PLACEHOLDERLOWER_/:id`, this.delete_PLACEHOLDER_);
    router.put(`${prefix}/_PLACEHOLDERLOWER_/:id`, this.update_PLACEHOLDER_);
  }

  private get_PLACEHOLDER_s = async (req: Request, res: Response) => {
    const _PLACEHOLDERLOWER_s = await _PLACEHOLDER_Model.find({}).exec();

    return res.status(200).json({
      _PLACEHOLDERLOWER_s,
      total: _PLACEHOLDERLOWER_s.length,
    });
  }

  private add_PLACEHOLDER_ = async (req: Request, res: Response) => {
    const new_PLACEHOLDER_ = new _PLACEHOLDER_Model({ deleted: false });

    const saved_PLACEHOLDER_ = await new_PLACEHOLDER_.save();

    return res.status(200).json(saved_PLACEHOLDER_);
  }

  private delete_PLACEHOLDER_ = async (req: Request, res: Response) => {
    const _PLACEHOLDERLOWER_: I_PLACEHOLDER_Model = await _PLACEHOLDER_Model.findByIdAndRemove(req.params.id).exec();

    return res.status(200).json(_PLACEHOLDERLOWER_);
  }

  private update_PLACEHOLDER_ = async (req: Request, res: Response) => {
    const _PLACEHOLDERLOWER_: I_PLACEHOLDER_Model = await _PLACEHOLDER_Model.findById(req.params.id).exec();

    Object.assign(_PLACEHOLDERLOWER_, req.body);

    const saved_PLACEHOLDER_ = await _PLACEHOLDERLOWER_.save();
    return res.status(200).json(saved_PLACEHOLDER_);
  }
}

export default _PLACEHOLDER_;
