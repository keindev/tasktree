import { Terminal } from 'stdout-update/lib/Terminal';
import stripAnsi from 'strip-ansi';

import { IProgressBarOptions } from '../ProgressBar';
import { Task, TaskStatus } from '../Task';
import { TaskTree } from '../TaskTree';
import { Theme, ThemeOptions } from '../Theme';

const title = 'task';
const themeOptions: ThemeOptions = { success: { symbol: '+' }, subtask: { symbol: '--' } };
const progressBarOptions: IProgressBarOptions = { completeChar: '*', incompleteChar: '_' };

describe('Task', (): void => {
  beforeAll((): void => {
    TaskTree.tree().start({ silent: true });
  });

  it('Default', (): void => {
    const task = new Task(title).complete();

    expect(task.isPending).toBeFalsy();
    expect(task.text).toBe(title);
    expect(task.status).toBe(TaskStatus.Completed);
  });

  it('Update', (): void => {
    const task = new Task(title).update('new title');

    expect(task.text).toBe('new title');
  });

  it('Check for errors or warnings in the task', (): void => {
    const task = new Task(title);
    const subtask = task.add(title);

    subtask.warn('warning');
    subtask.error('error');

    expect(task.haveWarnings).toBeTruthy();
    expect(task.haveErrors).toBeTruthy();
  });

  describe('Correct status changing', (): void => {
    let task: Task;

    beforeEach((): void => {
      task = new Task('pending task');
    });

    it('Completed', (): void => {
      task.complete(title);

      expect(task.status).toBe(TaskStatus.Completed);
      expect(task.isPending).toBeFalsy();
      expect(task.text).toBe(title);
    });

    it('Skipped', (): void => {
      task.skip(title);

      expect(task.status).toBe(TaskStatus.Skipped);
      expect(task.isPending).toBeFalsy();
      expect(task.text).toBe(title);
    });

    it('Failed', (): void => {
      let isThrowException = false;

      try {
        task.fail(title);
      } catch {
        isThrowException = true;
      } finally {
        expect(isThrowException).toBeTruthy();
        expect(task.status).toBe(TaskStatus.Failed);
        expect(task.isPending).toBeFalsy();
        expect(task.text).toBe(title);
      }
    });
  });

  describe('Incorrect status changes', (): void => {
    let tasks: Task[];

    beforeEach((): void => {
      tasks = [
        new Task(title, { status: TaskStatus.Completed }),
        new Task(title, { status: TaskStatus.Skipped }),
        new Task(title, { status: TaskStatus.Failed }),
      ];
    });

    it('Complete', (): void => {
      tasks.forEach((item): void => {
        item.complete();

        expect(item.status).toBe(TaskStatus.Failed);
        expect(item.isPending).toBeFalsy();
      });
    });

    it('Skip', (): void => {
      tasks.forEach((item): void => {
        item.skip();

        expect(item.status).toBe(TaskStatus.Failed);
        expect(item.isPending).toBeFalsy();
      });
    });

    it('Fail', (): void => {
      tasks.forEach((item): void => {
        let isThrowException = false;

        try {
          item.fail();
        } catch {
          isThrowException = true;
        } finally {
          expect(isThrowException).toBeTruthy();
          expect(item.status).toBe(TaskStatus.Failed);
          expect(item.isPending).toBeFalsy();
        }
      });
    });
  });

  describe('Subtasks', (): void => {
    it('Add to Pending task', (): void => {
      const task = new Task(title);

      expect(task.activeSubtask).toStrictEqual(task);
      expect(task.activeSubtask.id).toBe(task.id);

      const subtask = task.add(title);

      expect(subtask.isPending).toBeTruthy();
      expect(task.activeSubtask).toStrictEqual(subtask);
    });

    it('Add to Completed task', (): void => {
      const task = new Task(title).complete();
      let subtask: Task | undefined;

      try {
        subtask = task.add(title);
      } catch {
        // empty
      } finally {
        expect(subtask).toBeUndefined();
        expect(task.status).toBe(TaskStatus.Failed);
      }
    });

    it('Clear subtask', (): void => {
      const task = new Task(title);

      task.add(title).complete();
      task.bar().complete();
      task.complete().clear();

      expect(task.status).toBe(TaskStatus.Completed);
      expect(stripAnsi(task.render(new Theme(themeOptions)).join(Terminal.EOL))).toMatchSnapshot();
    });
  });

  it('Progress bar', (): void => {
    const task = new Task(title);

    task.bar(':bar :percent :etas', progressBarOptions).complete();
    task.complete();

    expect(task.status).toBe(TaskStatus.Completed);
    expect(stripAnsi(task.render(new Theme(themeOptions)).join(Terminal.EOL))).toMatchSnapshot();
  });
});
