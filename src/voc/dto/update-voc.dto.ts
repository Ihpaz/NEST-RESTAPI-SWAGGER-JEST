import { PartialType } from '@nestjs/swagger';
import { CreateVocDto } from './create-voc.dto';

export class UpdateVocDto extends PartialType(CreateVocDto) {}
