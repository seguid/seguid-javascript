[![seguid-tests](https://github.com/seguid/seguid-javascript/actions/workflows/seguid-tests.yml/badge.svg)](https://github.com/seguid/seguid-javascript/actions/workflows/seguid-tests.yml)

# seguid-javascript

# WARNING: This is a work in progress and is not yet ready for use.

Install with

```
npm install
```

Run with

```
npx seguid
```

Run tests with

```
make
```


## Requirements

 * Node.js (>= 19)



How to use:

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
