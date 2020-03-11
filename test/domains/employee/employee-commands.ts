import { Command } from '../../../src/components/command';
import { Guid } from '../../../src/domain/value-objects/guid';
import { define } from '../../../src/decorators/define';

/*
EMPLOYEE
*/
@define()
export class CreateEmployee extends Command {
  firstName: string;

  lastName: string;
}

@define()
export class AssignTaskListToEmployee extends Command {
  taskListId: Guid;
}

@define()
export class EstimateEmployeeProductivity extends Command {
  estimatedPoints: number;
}

@define()
export class TerminateEmployee extends Command {}

/*
CANCELING EMPLOYMENT
*/
@define()
export class CancelEmployment extends Command {
  employeeId: Guid;
}
