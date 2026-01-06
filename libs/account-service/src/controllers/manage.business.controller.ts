import {
  UpdateAccountNameDTO,
  UpdateBusinessNameDTO,
  UpdateProfileImageDTO,
} from '../interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  DeleteBusinessProfileImageCommand,
  UpdateAccountNameCommand,
  UpdateBusinessNameCommand,
  UpdateBusinessProfileImageCommand,
  UpdateProfileImageCommand,
} from '../commands/impl';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FetchBusinessInfoQuery } from '../queries/impl';
import { AccountService } from '../services/account.service';
import { SecureUserPayload } from '@app/common/src/interface';
import { AccountInfo } from '@app/common/src/models/account.model';
import { JwtAuthGuard } from '@app/common/src/auth/jwt-auth.guard';
import { BusinessInfo } from '@app/common/src/models/business.model';
import { SecureUser } from '@app/common/src/decorator/user.decorator';

@ApiTags('manage-business-info')
@Controller({ path: 'manage-business' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ManageBusinessController {
  constructor(
    public queryBus: QueryBus,
    public command: CommandBus,
    public readonly accountService: AccountService,
  ) {}


  @Get('business-info')
  @ApiOkResponse({ type: BusinessInfo })
  @ApiInternalServerErrorResponse()
  async getBusinessInfo(
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BusinessInfo> {
    return await this.queryBus.execute(
      new FetchBusinessInfoQuery(secureUser),
    );
  }

  @Patch('update-name')
  @ApiOkResponse({ type: BusinessInfo })
  @ApiInternalServerErrorResponse()
  async updateBusinessName(
    @Req() req: Request,
    @Body() body: UpdateBusinessNameDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BusinessInfo> {
    return await this.command.execute(
      new UpdateBusinessNameCommand(
        secureUser,
        body,
      ),
    );
  }

  @Patch('update-profile-image')
  @ApiOkResponse({ type: BusinessInfo })
  @ApiInternalServerErrorResponse()
  async updateBusinessProfileImage(
    @Req() req: Request,
    @Body() body: UpdateProfileImageDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BusinessInfo> {
    return await this.command.execute(
      new UpdateBusinessProfileImageCommand(
        secureUser,
        body,
      ),
    );
  }

  @Delete('delete-profile-image')
  @ApiOkResponse({ type: BusinessInfo })
  @ApiInternalServerErrorResponse()
  async deleteBusinessProfileImage(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BusinessInfo> {
    return await this.command.execute(
      new DeleteBusinessProfileImageCommand(
        secureUser,
      ),
    );
  }
}
