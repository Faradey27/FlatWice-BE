// Type definitions for passport-local 1.0.0
// Project: https://github.com/jaredhanson/passport-local
// Definitions by: Maxime LUCE <https://github.com/SomaticIT>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
/* tslint:disable */
/// <reference types="passport"/>

import express = require('express');
import passport = require('passport');

interface IStrategyOptions {
  usernameField?: string;
  passwordField?: string;
  passReqToCallback?: boolean;
}

interface IStrategyOptionsWithRequest {
  usernameField?: string;
  passwordField?: string;
  passReqToCallback: boolean;
}

interface IVerifyOptions {
  message: string;
}

type VerifyFunctionWithRequest = (req: express.Request, username: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void) => void;

type VerifyFunction = (username: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void) => void;

declare class Strategy implements passport.Strategy {
  constructor(options: IStrategyOptionsWithRequest, verify: VerifyFunctionWithRequest);
  constructor(options: IStrategyOptions, verify: VerifyFunction);
  constructor(verify: VerifyFunction);

  public name: string;
  public authenticate: (req: express.Request, options?: Object) => void;
}

interface LocalStrategyInfo {
  message: string;
}
