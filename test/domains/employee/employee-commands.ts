import { Type } from '@eveble/core';
import { Command } from '../../../src/components/command';
import { Guid } from '../../../src/domain/value-objects/guid';

/*
EMPLOYEE
*/
@Type()
export class CreateEmployee extends Command<CreateEmployee> {
  firstName: string;

  lastName: string;
}

@Type()
export class AssignTaskListToEmployee extends Command<AssignTaskListToEmployee> {
  taskListId: Guid;
}

@Type()
export class EstimateEmployeeProductivity extends Command<EstimateEmployeeProductivity> {
  estimatedPoints: number;
}

@Type()
export class TerminateEmployee extends Command<TerminateEmployee> {}

/*
CANCELING EMPLOYMENT
*/
@Type()
export class CancelEmployment extends Command<CancelEmployment> {
  employeeId: Guid;
}
