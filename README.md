[![seguid-tests](https://github.com/seguid/seguid-javascript/actions/workflows/seguid-tests.yml/badge.svg)](https://github.com/seguid/seguid-javascript/actions/workflows/seguid-tests.yml)
![npm](https://img.shields.io/npm/v/seguid)

# seguid-javascript

## Installation

```
npm install
```

web:

```js
<script src="https://rawcdn.githack.com/seguid/seguid-javascript/main/seguid.js"></script>
<script>
  const main = async () => {
    await lsseguid("ACGT");
  };

  main();
</script>
```

esm:

```js
import { lsseguid } from 'seguid.js';
await lsseguid("ACGT");
```

cjs:

```js
import seguid from 'seguid.js';
await seguid.lsseguid("ACGT");
```

## CLI

```
npx seguid
```

## Testing

```
make
```


## Requirements

 * Node.js (>= 19)
