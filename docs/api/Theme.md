# Theme

Allows you to set a custom theme options for the tree display.

## Options

All theme options is object with several fields:

```typescript
{
  // status text badge to the task, will be added after the task is completed
  badge?: string;
  // indication color
  color?: string;
  // indication symbol
  symbol?: string
}
```

### Indication types

| Type    | `badge`  | `color`                       |  `symbol`   | Description                                  |
| :------ | :------: | :---------------------------- | :---------: | :------------------------------------------- |
| default |    ✖     | `[default]` - text            |     `-`     | default color                                |
| active  |    ✖     | `#4285f4` - symbol            | `frame (⠧)` | spinner, progress bar color                  |
| success |    ✖     | `#00c851` - symbol, text, bar |      ✔      | task symbol, progress bar color              |
| skip    | `[skip]` | `#ff8800` - symbol, text, bar |      ↓      | task symbol, progress bar color              |
| error   | `[fail]` | `#ff4444` - symbol, text, bar |      ✖      | task symbol, error title, progress bar color |
| message |    ✖     | `#2e2e2e` - symbol            |      ─      | dim pointer to task information              |
| info    |    ✖     | `#33b5e5` - symbol            |      ℹ      | information message symbol                   |
| warning |    ✖     | `#ffbb33` - symbol            |      ⚠      | warning message symbol                       |
| subtask |    ✖     | `#2e2e2e` - symbol, text      |      ›      | dim pointer to subtask                       |
| list    |    ✖     | `#4285f4` - symbol            |      ❯      | list symbol                                  |
| dim     |    ✖     | `#838584` - symbol, bar       |     `-`     | dim color                                    |

> If you use a gradient fill for the progress bar - the color will change from `active` to `success`

```javascript
const theme = {
  default: '#ffffff',
  success: ['#008000', '✔'],
  skip: {
    symbol: '↓',
  },
  error: ['#ff0000', '✖', '[error]'],
  ...
};
```
