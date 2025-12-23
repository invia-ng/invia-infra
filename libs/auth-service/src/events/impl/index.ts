import { CreateAccountDTO, InitializeNewAccountDTO } from '../../interface';
import { Account } from '@app/common/src/models/account.model';

export class InitializeNewAccountEvent {
  constructor(
    public readonly origin: string,
    public readonly account: Account,
    public readonly payload: InitializeNewAccountDTO,
  ) {}
}

export class CreateAccountEvent {
  constructor(
    public readonly origin: string,
    public readonly account: Account,
    public readonly payload: CreateAccountDTO,
  ) {}
}