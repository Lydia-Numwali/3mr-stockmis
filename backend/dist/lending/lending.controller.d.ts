import { LendingService, CreateLendingDto, ReturnLendingDto } from './lending.service';
export declare class LendingController {
    private service;
    constructor(service: LendingService);
    create(dto: CreateLendingDto): Promise<import("../entities/lending.entity").Lending>;
    returnLending(id: number, dto: ReturnLendingDto): Promise<import("../entities/lending.entity").Lending>;
    findAll(query: any): Promise<{
        items: import("../entities/lending.entity").Lending[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOverdue(): Promise<import("../entities/lending.entity").Lending[]>;
}
