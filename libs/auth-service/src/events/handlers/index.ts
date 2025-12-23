import { CreateAccountEventHandler } from './CreateAccountEventHandler';
import { InitializeNewAccountEventHandler } from './InitializeNewAccountEventHandler';

export const AuthServiceEventHandlers = [
  CreateAccountEventHandler,
  InitializeNewAccountEventHandler,
];
