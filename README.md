[![seguid-tests](https://github.com/seguid/seguid-javascript/actions/workflows/seguid-tests.yml/badge.svg)](https://github.com/seguid/seguid-javascript/actions/workflows/seguid-tests.yml)
[![npm](https://img.shields.io/npm/v/seguid)](https://www.npmjs.com/package/seguid)

# seguid-javascript

## Installation

The **seguid** Javascript package is available from
[NPM](https://www.npmjs.com/package/seguid) and can be installed as:

```sh
npm install seguid
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

```sh
npx seguid
```

## Testing

```sh
make
```


## Requirements

 * Node.js (>= 19)
