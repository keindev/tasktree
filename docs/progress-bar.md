# Progress bar

## Usage

To add a Progress Bar to your task, use [Task](./task.md) the `.bar()` method accepting the string pattern and progress bar parameters.

```javascript
const progress = new task.bar([template, options]);
```

### Template

-   `:bar` - the progress bar itself.
-   `:current` - current tick number.
-   `:total` - total ticks.
-   `:elapsed` - time elapsed in seconds.
-   `:percent` - completion percentage.
-   `:eta` - estimated completion time in seconds.
-   `:rate` - rate of ticks per second.

### Options

#### current

Type: `number`

Default: `0`

Current completed index.

#### total

Type: `number`

Default: `1000`

Total number of ticks to complete.

#### width

Type: `number`

Default: `20`

The displayed width of the progress bar defaulting to total.

#### complete

Type: `string`

Default: `▇`

Completion character.

#### incomplete

Type: `string`

Default: `▇`

Incomplete character.

#### clear

Type: `boolean`

Default: `false`

Option to clear the bar on completion.

#### badges

Type: `boolean`

Default: `true`

Option to add badge.

#### gradient

Type: `boolean`

Default: `true`

Option to add a gradient to the pending bar.

## API

### getRatio()

Returns ratio between `current` value and `total` value.

### getPercent()

Returns current percent of completion.

### getElapsed()

Returns an elapsed time from the beginning of progress, in milliseconds.

### getRate()

Returns rate of progress.

### getETA()

Returns progress ETA (_estimated time of arrival_).

### getStart()

Returns start `Date` in milliseconds.

### getEnd()

Returns an end `Date` in milliseconds if progress is an ended.

### isCompleted()

Returns `true` if progress is complete.

### tick(\[step, tokens\]): Progress

Increases current progress on step value. Returns [self-object](#progress-bar).

Tick with custom tokens example:

```javascript
const bar = new Progress(':bar template with custom :token');

bat.tick(10, { token: 100 });
```

#### step

Type: `number`

Default: `1`

The value by which the current progress will increase.

#### tokens

Type: `object`

Default: `null`

Add custom tokens by adding a `{'name': value}` object parameter to your method.

### complete()

Completes progress and marks it as successful.

### skip()

Stops the progress and marks it as skipped.

### fail()

Stops the progress and marks it as failed.
