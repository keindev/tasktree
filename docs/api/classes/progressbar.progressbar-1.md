# Class: ProgressBar

[ProgressBar](../modules/progressbar.md).ProgressBar

To add a Progress Bar to your task, use [Task.bar](task.task-1.md#bar)  method accepting the string pattern and progress bar parameters.

```javascript
const progress = new task.bar([template, options]);
```

## Implements

* *Required*<Omit<[*IProgressBarOptions*](../interfaces/progressbar.iprogressbaroptions.md), ``"current"``\>\>

## Table of contents

### Constructors

- [constructor](progressbar.progressbar-1.md#constructor)

### Properties

- [badges](progressbar.progressbar-1.md#badges)
- [clear](progressbar.progressbar-1.md#clear)
- [completeChar](progressbar.progressbar-1.md#completechar)
- [gradient](progressbar.progressbar-1.md#gradient)
- [incompleteChar](progressbar.progressbar-1.md#incompletechar)
- [template](progressbar.progressbar-1.md#template)
- [total](progressbar.progressbar-1.md#total)
- [width](progressbar.progressbar-1.md#width)
- [MAX\_PERCENT](progressbar.progressbar-1.md#max_percent)
- [MAX\_POINT\_POSITION](progressbar.progressbar-1.md#max_point_position)
- [MAX\_RATIO](progressbar.progressbar-1.md#max_ratio)
- [MIN\_PERCENT](progressbar.progressbar-1.md#min_percent)
- [MIN\_POINT\_POSITION](progressbar.progressbar-1.md#min_point_position)
- [MIN\_RATIO](progressbar.progressbar-1.md#min_ratio)
- [TICK](progressbar.progressbar-1.md#tick)
- [TIME\_DIMENSION](progressbar.progressbar-1.md#time_dimension)

### Accessors

- [ETA](progressbar.progressbar-1.md#eta)
- [elapsed](progressbar.progressbar-1.md#elapsed)
- [end](progressbar.progressbar-1.md#end)
- [isCompleted](progressbar.progressbar-1.md#iscompleted)
- [percent](progressbar.progressbar-1.md#percent)
- [rate](progressbar.progressbar-1.md#rate)
- [ratio](progressbar.progressbar-1.md#ratio)
- [start](progressbar.progressbar-1.md#start)

### Methods

- [complete](progressbar.progressbar-1.md#complete)
- [fail](progressbar.progressbar-1.md#fail)
- [render](progressbar.progressbar-1.md#render)
- [skip](progressbar.progressbar-1.md#skip)
- [tick](progressbar.progressbar-1.md#tick)

## Constructors

### constructor

\+ **new ProgressBar**(`template?`: *string*, `options?`: [*IProgressBarOptions*](../interfaces/progressbar.iprogressbaroptions.md)): [*ProgressBar*](progressbar.progressbar-1.md)

#### Parameters:

| Name | Type |
| :------ | :------ |
| `template?` | *string* |
| `options?` | [*IProgressBarOptions*](../interfaces/progressbar.iprogressbaroptions.md) |

**Returns:** [*ProgressBar*](progressbar.progressbar-1.md)

## Properties

### badges

• `Readonly` **badges**: *boolean*= true

Option to add badge

Implementation of: Required.badges

___

### clear

• `Readonly` **clear**: *boolean*= false

Option to clear the bar on completion

Implementation of: Required.clear

___

### completeChar

• `Readonly` **completeChar**: *string*

Completion character

Implementation of: Required.completeChar

___

### gradient

• `Readonly` **gradient**: *boolean*= true

Option to add gradient to pending bar

Implementation of: Required.gradient

___

### incompleteChar

• `Readonly` **incompleteChar**: *string*

Incomplete character

Implementation of: Required.incompleteChar

___

### template

• `Readonly` **template**: *string*

Output template

**`default`** `:bar :rate/bps :percent :eta/s`

___

### total

• `Readonly` **total**: [*End*](../enums/progressbar.progress.md#end)

Total number of ticks to complete

Implementation of: Required.total

___

### width

• `Readonly` **width**: *number*= 20

The displayed width of the progress bar defaulting to total

Implementation of: Required.width

___

### MAX\_PERCENT

▪ `Static` `Readonly` **MAX\_PERCENT**: ``100``= 100

___

### MAX\_POINT\_POSITION

▪ `Static` `Readonly` **MAX\_POINT\_POSITION**: ``1``= 1

___

### MAX\_RATIO

▪ `Static` `Readonly` **MAX\_RATIO**: ``1``= 1

___

### MIN\_PERCENT

▪ `Static` `Readonly` **MIN\_PERCENT**: ``0``= 0

___

### MIN\_POINT\_POSITION

▪ `Static` `Readonly` **MIN\_POINT\_POSITION**: ``0``= 0

___

### MIN\_RATIO

▪ `Static` `Readonly` **MIN\_RATIO**: ``0``= 0

___

### TICK

▪ `Static` `Readonly` **TICK**: ``1``= 1

___

### TIME\_DIMENSION

▪ `Static` `Readonly` **TIME\_DIMENSION**: ``1000``= 1000

## Accessors

### ETA

• get **ETA**(): *number*

Progress ETA (estimated time of arrival)

**Returns:** *number*

___

### elapsed

• get **elapsed**(): *number*

Elapsed time from the beginning of progress, in milliseconds

**Returns:** *number*

___

### end

• get **end**(): *undefined* \| *number*

End `Date` in milliseconds if progress is an ended

**Returns:** *undefined* \| *number*

___

### isCompleted

• get **isCompleted**(): *boolean*

`true` if progress is complete

**Returns:** *boolean*

___

### percent

• get **percent**(): *number*

Current percent of completion

**Returns:** *number*

___

### rate

• get **rate**(): *number*

Rate of progress

**Returns:** *number*

___

### ratio

• get **ratio**(): *number*

Ratio between `current` value and `total` value

**Returns:** *number*

___

### start

• get **start**(): *number*

Start `Date` in milliseconds

**Returns:** *number*

## Methods

### complete

▸ **complete**(): *void*

Completes progress and marks it as successful

**Returns:** *void*

___

### fail

▸ **fail**(): *void*

Stops the progress and marks it as failed

**Returns:** *void*

___

### render

▸ **render**(`theme`: *Theme*): *string*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `theme` | *Theme* |

**Returns:** *string*

___

### skip

▸ **skip**(): *void*

Stops the progress and marks it as skipped

**Returns:** *void*

___

### tick

▸ **tick**(`step?`: *number*, `tokens?`: [*IProgressBarToken*](../interfaces/progressbar.iprogressbartoken.md)): [*ProgressBar*](progressbar.progressbar-1.md)

Increases current progress on step value

**`example`** 
```javascript
const bar = new Progress(':bar template with custom :token');

bat.tick(10, { token: 100 });
```

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `step?` | *number* | Value by which the current progress will increase |
| `tokens?` | [*IProgressBarToken*](../interfaces/progressbar.iprogressbartoken.md) | Add custom tokens by adding a `{'name': value}` object parameter to your method |

**Returns:** [*ProgressBar*](progressbar.progressbar-1.md)
