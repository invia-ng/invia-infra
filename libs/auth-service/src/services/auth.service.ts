import { JwtService } from '@nestjs/jwt';
import { CommandBus } from '@nestjs/cqrs';
import {
  VendorIdGenerator,
  ReferralCodeGenerator,
  VendorSlugGenerator,
  VendorBusinessNameGenerator,
} from '@app/common/src/utils/id.generator';
import { Not, In, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { AvailabilityCheckInfo } from '../interface';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from '../../../common/src/logger/logger.service';

@Injectable()
export class AuthService {

  constructor(
    public jwtService: JwtService,
    public commandBus: CommandBus,
    private configService: ConfigService,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly userRepository: Repository<Account>,
  ) {}

  generateUserJWT(user: Account) {
    try {
      this.logger.log(`[SIGN-JWT-PROCESSING] : {Account - ${user.id}}`);

      const jwt = this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
          role: `${user.role}`,
          isAccountDisabled: user.isAccountDisabled,
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
    const existingUser = await this.userRepository.findOne({
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
}
