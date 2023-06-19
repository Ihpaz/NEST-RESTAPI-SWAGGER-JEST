import { PartialType } from '@nestjs/swagger';
import { CreateUserroleDto } from './create-userrole.dto';

export class UpdateUserroleDto extends PartialType(CreateUserroleDto) {}
