export interface IFeature {
  featureName: string;
  connect(): Promise<{}>;
}
