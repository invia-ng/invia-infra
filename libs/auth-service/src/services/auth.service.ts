import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { AvailabilityCheckInfo } from '../interface';
import { Account } from 'libs/common/src/models/account.model';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from '../../../common/src/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    public jwtService: JwtService,
    public commandBus: CommandBus,
    private configService: ConfigService,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  generateUserJWT(user: Account) {
    try {
      this.logger.log(`[SIGN-JWT-PROCESSING] : {Account - ${user.id}}`);

      const jwt = this.jwtService.sign(
        {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
          status: user.status,
        },
        {
          subject: `${user.id}`,
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<number>('JWT_EXPIRES_IN'),
        },
      );

      this.logger.log(`[SIGN-JWT-SUCCESS]`);

      return 'Bearer ' + jwt;
    } catch (error) {
      this.logger.error(`[SIGN-JWT-ERROR] : ${error}`);
    }
  }

  async isEmailAvailable(email: string): Promise<AvailabilityCheckInfo> {
    const existingUser = await this.accountRepository.findOne({
      where: {
        email: email,
      },
    });

    const isAvailable = !existingUser || !!existingUser.signupVerificationHash;

    this.logger.log(`[IS-EMAIL-AVAILABLE] : ${isAvailable}`);

    return {
      isAvailable,
    };
  }
  async isBusinessPhoneAvailable(phone: string): Promise<AvailabilityCheckInfo> {
    const existingUser = await this.businessRepository.findOne({
      where: {
        phone: phone,
      },
    });

    const isAvailable = !existingUser;

    this.logger.log(`[IS-PHONE-AVAILABLE] : ${isAvailable}`);

    return {
      isAvailable,
    };
  }

  async isBusinessEmailAvailable(
    email: string,
  ): Promise<AvailabilityCheckInfo> {
    const existingUser = await this.businessRepository.findOne({
      where: {
        email: email,
      },
    });

    const isAvailable = !existingUser;

    this.logger.log(`[IS-BUSINESS-EMAIL-AVAILABLE] : ${isAvailable}`);

    return {
      isAvailable,
    };
  }

  async isBusinessSendFromEmailAvailable(
    email: string,
  ): Promise<AvailabilityCheckInfo> {
    const existingUser = await this.businessRepository.findOne({
      where: {
        sendFromEmail: email,
      },
    });

    const isAvailable = !existingUser;

    this.logger.log(`[IS-BUSINESS-SEND-FROM-EMAIL-AVAILABLE] : ${isAvailable}`);

    return {
      isAvailable,
    };
  }
}
