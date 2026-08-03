# Steam Market Fee Calculator

This project is a dependency-free reference implementation for estimating marketplace fees in integer minor units. Its main purpose is to make rounding, minimum component fees, and the relationship between seller proceeds and the buyer-facing price inspectable.

## What the reference covers

- Calculate a buyer-facing total from desired seller proceeds.
- Reverse an exact buyer-facing total into estimated seller proceeds and fee components.
- Configure marketplace and publisher rates, component minimums, and a base fee.
- Run the calculation in a browser without an account or tracking.

The default configuration models USD cents with a 5% marketplace fee, a 10% publisher fee, and a one-cent minimum for each component. Those values are configurable assumptions rather than a guarantee about any future marketplace rule.

## Try the implementation

Use the [open-source browser demo](https://hyunjun12312.github.io/steam-market-fee-calculator/) to inspect the basic calculation.

## Related live service

This reference is maintained by contributors working on [SteamVaults](https://steamvaults.org/), an independent third-party service currently focused on buying and selling Mann Co. Supply Crate Keys with USDT. Its [current supported-item sell flow](https://steamvaults.org/sell) is separate from this general-purpose fee calculator and supports only the Mann Co. Supply Crate Key.

## Library usage

```js
import {
  buyerPriceForSellerAmount,
  sellerAmountForBuyerPrice,
} from './src/fees.js';

buyerPriceForSellerAmount(100);
// {
//   sellerReceives: 100,
//   steamFee: 5,
//   publisherFee: 10,
//   totalFees: 15,
//   buyerPays: 115
// }

sellerAmountForBuyerPrice(115);
// {
//   sellerReceives: 100,
//   steamFee: 5,
//   publisherFee: 10,
//   totalFees: 15,
//   buyerPays: 115
// }
```

Every monetary value passed to the library is an integer in the smallest configured currency unit. For USD, `100` means one dollar.

## Accuracy boundary

Steam can change fee rules, publisher fees, currency increments, minimums, or taxes. This utility produces an estimate; confirm the final amount displayed by Steam before listing an item. The project is independent and is not affiliated with Valve or Steam.

## License

The reference implementation is available under the [MIT License](https://github.com/hyunjun12312/steam-market-fee-calculator/blob/main/LICENSE).
