
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { EntityManager, getConnection, QueryRunner, getManager,DataSource } from 'typeorm';




export interface IQHDatatable {
    query: string;
    params?: any;
    countBy: string
    fieldDef: any;
    defaultOrder: string;
    groupBy?: string;
    queryRunner?: QueryRunner;
}
@Injectable()
export class QueryHelper {
    constructor(private dataSource: DataSource) {}

    queryRunner() {
        return this.dataSource.createQueryRunner();
    }

    builder(queryRunner: QueryRunner = null) {
        let manager: EntityManager;
       
        if (queryRunner) {
            manager = queryRunner.manager;
        } else {
            manager = this.dataSource.createEntityManager();
        }
        return manager.createQueryBuilder();
        // return getManager().createQueryBuilder();
    }

    async execute(query: string, params: any = {}, queryRunner: QueryRunner = null) {
        try {
            let manager: EntityManager;
            if (queryRunner) {
                manager = queryRunner.manager;
            } else {
                manager = this.dataSource.manager;
            }

            const [rawQuery, parameters] = manager
                .connection
                .driver
                .escapeQueryWithParameters(
                    query,
                    params,
                    {}
                );

            const data = await manager.query(rawQuery, parameters);
          
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getOne(query: string, params: any = {}, queryRunner: QueryRunner = null) {
        try {
            const data: any[] = await this.execute(query, params, queryRunner);
            return data.length ? data[0] : null;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getMany(query: string, params: any = {}, queryRunner: QueryRunner = null) {
        try {
            const data: any[] = await this.execute(query, params, queryRunner);
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }


   

    
}
