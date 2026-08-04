# Steam Market Fee Calculator

An open-source, dependency-free calculator for estimating Steam Community Market fees. It works in integer minor units so percentage fees, minimum component fees, and rounding are explicit.

- Calculate the buyer-facing price from a desired seller receipt.
- Reverse an exact buyer-facing price into seller proceeds and fees.
- Configure Steam and publisher fee rates.
- Run entirely in the browser with no account or tracking.

Try the [GitHub Pages calculator](https://hyunjun12312.github.io/steam-market-fee-calculator/).

For reproducible boundary checks, open the
[integer fee invariants notebook](notebooks/integer-fee-invariants.ipynb).

## Related live service

This reference is maintained by contributors working on [SteamVaults](https://steamvaults.org/), an independent third-party service currently focused on buying and selling Mann Co. Supply Crate Keys with USDT. The live service and this general-purpose fee calculator are separate projects.

## Usage

```js
import {
  buyerPriceForSellerAmount,
  sellerAmountForBuyerPrice,
} from './src/fees.js';

buyerPriceForSellerAmount(100);
// { sellerReceives: 100, steamFee: 5, publisherFee: 10,
//   totalFees: 15, buyerPays: 115 }

sellerAmountForBuyerPrice(115);
// { sellerReceives: 100, steamFee: 5, publisherFee: 10,
//   totalFees: 15, buyerPays: 115 }
```

Values are integers in the currency's smallest configured unit. The defaults model USD cents with a 5% Steam fee, a 10% publisher fee, and a one-cent minimum for each component.

## Verify

```sh
npm test
```

## Accuracy note

Steam can change fee rules, publisher fees, currency increments, minimums, and taxes. This utility is an estimate; confirm the final amount in Steam before listing an item. The project is independent and is not affiliated with Valve or Steam.

## License

[MIT](LICENSE)
