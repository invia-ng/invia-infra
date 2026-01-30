import {
  ApiTags,
  ApiQuery,
  ApiOkResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { AvailabilityCheckInfo } from '../interface';
import { AuthService } from '../services/auth.service';
import { Controller, Get, Query, Req } from '@nestjs/common';

@ApiTags('helpers')
@Controller({ path: 'helper' })
export class AuthHelperController {
  constructor(
    public eventBus: EventBus,
    public command: CommandBus,
    public readonly authService: AuthService,
  ) { }

  @Get('/availability/email')
  @ApiOkResponse({ type: AvailabilityCheckInfo })
  @ApiQuery({ name: 'email', type: String, example: 'devoncarter@icloud.com' })
  @ApiConflictResponse()
  async checkEmailAvailability(
    @Req() req: Request,
    @Query('email') email: string,
  ): Promise<AvailabilityCheckInfo> {
    return await this.authService.isEmailAvailable(email);
  }

  @Get('/availability/business-phone')
  @ApiOkResponse({ type: AvailabilityCheckInfo })
  @ApiQuery({
    name: 'phone',
    type: String,
    example: '+2349034567890',
  })
  @ApiConflictResponse()
  async checkBusinessPhoneAvailability(
    @Req() req: Request,
    @Query('phone') phone: string,
  ): Promise<AvailabilityCheckInfo> {
    return await this.authService.isBusinessPhoneAvailable(phone);
  }

  @Get('/availability/business-email')
  @ApiOkResponse({ type: AvailabilityCheckInfo })
  @ApiQuery({
    name: 'email',
    type: String,
    example: 'beduevents@tryinvia.com',
  })
  @ApiConflictResponse()
  async checkBusinessEmailAvailability(
    @Req() req: Request,
    @Query('email') email: string,
  ): Promise<AvailabilityCheckInfo> {
    return await this.authService.isBusinessEmailAvailable(email);
  }

  @Get('/availability/business-send-from-email')
  @ApiOkResponse({ type: AvailabilityCheckInfo })
  @ApiQuery({
    name: 'email',
    type: String,
    example: 'beduevents@tryinvia.com',
  })
  @ApiConflictResponse()
  async checkBusinessSendFromEmailAvailability(
    @Req() req: Request,
    @Query('email') email: string,
  ): Promise<AvailabilityCheckInfo> {
    return await this.authService.isBusinessSendFromEmailAvailable(email);
  }
}
