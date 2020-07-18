import { Command } from '../../../src/components/command';
import { Guid } from '../../../src/domain/value-objects/guid';
import { define } from '../../../src/decorators/define';

/*
EMPLOYEE
*/
@define()
export class CreateEmployee extends Command<CreateEmployee> {
  firstName: string;

  lastName: string;
}

@define()
export class AssignTaskListToEmployee extends Command<
  AssignTaskListToEmployee
> {
  taskListId: Guid;
}

@define()
export class EstimateEmployeeProductivity extends Command<
  EstimateEmployeeProductivity
> {
  estimatedPoints: number;
}

@define()
export class TerminateEmployee extends Command<TerminateEmployee> {}

/*
CANCELING EMPLOYMENT
*/
@define()
export class CancelEmployment extends Command<CancelEmployment> {
  employeeId: Guid;
}
