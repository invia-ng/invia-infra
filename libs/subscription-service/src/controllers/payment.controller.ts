import {
  ApiTags,
  ApiQuery,
  ApiOkResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  ChargeResponse,
  InvitationChargeResponse,
  VerifyPaymentSessionResponse,
} from '../interface/schema';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SecureUserPayload } from '@app/common/src/interface';
import { ProcessInviteEventGuestsBillingDTO } from '../interface';
import { JwtAuthGuard } from '@app/common/src/auth/jwt-auth.guard';
import { SecureUser } from '@app/common/src/decorator/user.decorator';
import { SubscriptionService } from '../services/subscription.service';
import { Get, UseGuards, Controller, Query, Post, Body } from '@nestjs/common';
import { VerifyPremiumSubscriptionPaymentTransferQuery, VerifyInvitationPaymentTransferQuery } from '../queries/impl';
import { InitializePremiumSubscriptionPaymentCommand, ProcessInviteEventGuestsBillingCommand } from '../commands/impl';

@ApiTags('payment')
@Controller({ path: 'payment' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(
    public queryBus: QueryBus,
    public commandBus: CommandBus,
    public readonly subscriptionService: SubscriptionService,
  ) { }

  @ApiTags('payment')
  @Get('verify-premium-subscription-transfer')
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
      new VerifyPremiumSubscriptionPaymentTransferQuery(paymentReference, user),
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


  @ApiTags('payment')
  @Get('verify-invitation-transfer')
  @ApiOkResponse({
    type: VerifyPaymentSessionResponse,
  })
  @ApiQuery({
    type: String,
    name: 'paymentReference',
    example: 'INVIA_INVITE-25032903CE',
  })
  @ApiInternalServerErrorResponse()
  @UseGuards(JwtAuthGuard)
  async verifyInvitationPaymentTransfer(
    @SecureUser() user: SecureUserPayload,
    @Query('paymentReference') paymentReference: string,
  ): Promise<VerifyPaymentSessionResponse> {
    return await this.queryBus.execute(
      new VerifyInvitationPaymentTransferQuery(paymentReference, user),
    );
  }

  @Post('initialize-invitation-payment')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiOkResponse({ type: InvitationChargeResponse })
  @ApiInternalServerErrorResponse()
  async processInviteEventGuestsBilling(
    @Query('eventId') eventId: number,
    @SecureUser() secureUser: SecureUserPayload,
    @Body() body: ProcessInviteEventGuestsBillingDTO,
  ): Promise<InvitationChargeResponse> {
    return await this.commandBus.execute(
      new ProcessInviteEventGuestsBillingCommand(eventId, secureUser, body),
    );
  }
}
