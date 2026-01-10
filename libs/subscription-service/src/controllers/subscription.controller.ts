import {
  Get,
  Req,
  Post,
  Body,
  Query,
  Delete,
  UseGuards,
  Controller,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiOkResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  SubscriptionInfo,
  SubscriptionPlanInfo,
} from '@app/common/src/models/subscription.model';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SecureUserPayload } from '@app/common/src/interface';
import {
  FetchBusinessSubscriptionInfoQuery,
  FetchSubscriptionPlansQuery,
} from '../queries/impl';
import { JwtAuthGuard } from '@app/common/src/auth/jwt-auth.guard';
import { SecureUser } from '@app/common/src/decorator/user.decorator';
import { SubscriptionService } from '../services/subscription.service';

@ApiTags('subscription')
@Controller({ path: '' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(
    public queryBus: QueryBus,
    public command: CommandBus,
    public readonly subscriptionService: SubscriptionService,
  ) {}

  @Get('plans/me')
  @ApiOkResponse({ type: SubscriptionInfo })
  @ApiInternalServerErrorResponse()
  async fetchBusinessSubscriptionInfo(
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<SubscriptionInfo[]> {
    return await this.queryBus.execute(
      new FetchBusinessSubscriptionInfoQuery(secureUser),
    );
  }

  @Get('plans')
  @ApiOkResponse({ type: SubscriptionInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async fetchSubscriptionPlans(
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<SubscriptionPlanInfo[]> {
    return await this.queryBus.execute(
      new FetchSubscriptionPlansQuery(secureUser),
    );
  }
}
