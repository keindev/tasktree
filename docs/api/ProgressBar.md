# ProgressBar

To add a Progress Bar to your task, use [Task.bar](Task.md#bar) method accepting the string pattern and progress bar parameters.

```javascript
const progress = new task.bar([template, options]);
```

## Constructor

```typescript
new ProgressBar(template?: string, options?: IProgressBarOptions)
```

### IProgressBarOptions:

| Name              | Type      | Description                                                 |
| :---------------- | :-------- | :---------------------------------------------------------- |
| `badges?`         | _boolean_ | Option to add badge                                         |
| `clear?`          | _boolean_ | Option to clear the bar on completion                       |
| `completeChar?`   | _string_  | Completion character                                        |
| `current?`        | _number_  | Current completed index                                     |
| `gradient?`       | _boolean_ | Option to add gradient to pending bar                       |
| `incompleteChar?` | _string_  | Incomplete character                                        |
| `total?`          | _number_  | Total number of ticks to complete                           |
| `width?`          | _number_  | The displayed width of the progress bar defaulting to total |

### Template (ProgressBar output template)

| Name       | Description                          |
| :--------- | :----------------------------------- |
| `:bar`     | The progress bar itself              |
| `:current` | Current tick number                  |
| `:total`   | Total ticks                          |
| `:elapsed` | Time elapsed in seconds              |
| `:percent` | Completion percentage                |
| `:eta`     | Estimated completion time in seconds |
| `:rate`    | Rate of ticks per second             |

> default template: `:bar :rate/bps :percent :eta/s`

## Methods

### complete

Completes progress and marks it as successful

### fail

Stops the progress and marks it as failed

### render

Render output string with [Theme](Theme.md)

### skip

Stops the progress and marks it as skipped

### tick

Increases current progress on step value

#### Parameters

| Name      | Type                | Description                                                                             |
| :-------- | :------------------ | :-------------------------------------------------------------------------------------- |
| `step?`   | _number_            | Value by which the current progress will increase                                       |
| `tokens?` | _IProgressBarToken_ | Add custom tokens by adding a `{[key: string]: string}` object parameter to your method |

#### Example

```javascript
const bar = new Progress(':bar template with custom :token');

bar.tick(10, { token: `100` });
```
