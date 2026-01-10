import {
  ApiTags,
  ApiQuery,
  ApiOkResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ChargeResponse,
  VerifyPaymentSessionResponse,
} from '../interface/schema';
import { SecureUserPayload } from '@app/common/src/interface';
import { Get, UseGuards, Controller, Query, Post } from '@nestjs/common';
import { JwtAuthGuard } from '@app/common/src/auth/jwt-auth.guard';
import { SecureUser } from '@app/common/src/decorator/user.decorator';
import { SubscriptionService } from '../services/subscription.service';
import { InitializePremiumSubscriptionPaymentCommand } from '../commands/impl';
import { VerifyBankPaymentTransferQuery } from '../queries/impl';

@ApiTags('payment')
@Controller({ path: 'payment' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(
    public queryBus: QueryBus,
    public commandBus: CommandBus,
    public readonly subscriptionService: SubscriptionService,
  ) {}

  @ApiTags('payment')
  @Get('verify-payment-transfer')
  @ApiOkResponse({
    type: VerifyPaymentSessionResponse,
  })
  @ApiQuery({
    type: String,
    name: 'paymentReference',
    example: 'INVIA_PREM-25032903CE',
  })
  @ApiInternalServerErrorResponse()
  @UseGuards(JwtAuthGuard)
  async verifyBankPaymentTransfer(
    @SecureUser() user: SecureUserPayload,
    @Query('paymentReference') paymentReference: string,
  ): Promise<VerifyPaymentSessionResponse> {
    return await this.queryBus.execute(
      new VerifyBankPaymentTransferQuery(paymentReference, user),
    );
  }

  @Post('initialize-premium-subscription')
  @ApiQuery({
    type: Number,
    name: 'planId',
    required: true,
    description: 'Subscription Plan ID',
  })
  @ApiOkResponse({ type: ChargeResponse })
  @ApiInternalServerErrorResponse()
  async initializePremiumSubscriptionPayment(
    @Query('planId') planId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<ChargeResponse[]> {
    return await this.commandBus.execute(
      new InitializePremiumSubscriptionPaymentCommand(planId, secureUser),
    );
  }
}
