import { Terminal } from 'stdout-update/lib/Terminal';
import stripAnsi from 'strip-ansi';

import { Task } from '../Task';
import { ITaskTreeOptions, TaskTree } from '../TaskTree';
import { Theme, ThemeOptions } from '../Theme';

describe('TaskTree', (): void => {
  const options: ITaskTreeOptions = { silent: true, autoClear: false };
  const themeOptions: ThemeOptions = {
    success: { symbol: '+' },
    skip: { symbol: '>>' },
    info: { symbol: 'i' },
    warning: { symbol: '!' },
  };
  const theme = new Theme(themeOptions);
  const tree = TaskTree.tree(themeOptions);
  const renderTree = (): string => stripAnsi(tree.render().join(Terminal.EOL));
  const renderTask = (task: Task): string => stripAnsi(task.render(theme).join(Terminal.EOL));
  let task: Task;

  beforeEach((): void => {
    tree.start(options);
  });

  afterEach((): void => {
    tree.stop();
  });

  describe('Static', (): void => {
    it('Add', (): void => {
      TaskTree.add('task').complete();

      expect(renderTree()).toMatchSnapshot();
    });
  });

  it('Default', (): void => {
    expect(tree).toBeDefined();
  });

  describe('Manage tasks', (): void => {
    beforeEach((): void => {
      task = tree.add('task');
      task.log('message').warn('warning');
    });

    it('Skip', (): void => {
      expect(renderTask(task.skip())).toMatchSnapshot();
    });

    it('Fail with string', (): void => {
      let msg = '';

      try {
        tree.fail('Something bad happened\nat X\nat Y\nat Z');
      } catch (error) {
        msg = (error as Error).message;
      } finally {
        expect(msg).toBe('Something bad happened\nat X\nat Y\nat Z');
      }
    });

    it('Fail with new Error()', (): void => {
      let msg = '';

      try {
        tree.fail(new Error('Something bad happened\nat X\nat Y\nat Z'));
      } catch (error) {
        msg = (error as Error).message;
      } finally {
        expect(msg).toBe('Something bad happened\nat X\nat Y\nat Z');
      }
    });

    it('Complete and render', (): void => {
      const output = renderTask(task.complete());

      expect(output).toBeTruthy();
      expect(output).toBe(renderTree());

      tree.stop();

      expect(renderTree()).toBe('');

      tree.start(options);
      tree.stop();

      expect(renderTree()).toBe('');
    });
  });
});
