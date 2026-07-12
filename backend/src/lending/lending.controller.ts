import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LendingService, CreateLendingDto, ReturnLendingDto, InspectReturnDto, IssueReplacementDto } from './lending.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('lending')  // Keep endpoint for backward compatibility (can also be accessed as 'returns')
export class LendingController {
  constructor(private service: LendingService) {}

  // Process returned items
  @Post()
  create(@Body() dto: CreateLendingDto) {
    return this.service.create(dto);
  }

  // Backward compatibility: old lending return workflow
  @Put(':id/return')
  returnLending(@Param('id') id: number, @Body() dto: ReturnLendingDto) {
    return this.service.returnLending(+id, dto);
  }
  
  // Inspect returned item
  @Put(':id/inspect')
  inspectReturn(@Param('id') id: number, @Body() dto: InspectReturnDto) {
    return this.service.inspectReturn(+id, dto);
  }
  
  // Issue replacement for returned item
  @Post(':id/replacement')
  issueReplacement(@Param('id') id: number, @Body() dto: IssueReplacementDto) {
    return this.service.issueReplacement(+id, dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  // Get returns pending inspection
  @Get('pending-inspection')
  getPendingInspection() {
    return this.service.getPendingInspection();
  }
  
  // Get items under repair
  @Get('under-repair')
  getUnderRepair() {
    return this.service.getUnderRepair();
  }
  
  // Get damaged items
  @Get('damaged')
  getDamagedItems() {
    return this.service.getDamagedItems();
  }

  // Backward compatibility: overdue lending
  @Get('overdue')
  getOverdue() {
    return this.service.getOverdue();
  }
  
  // Get return summary
  @Get('summary')
  getReturnSummary() {
    return this.service.getReturnSummary();
  }
}

