# Calculation model

## Why use integer minor units?

Binary floating-point numbers cannot exactly represent many decimal fractions. A fee calculation that repeatedly multiplies decimal currency values can therefore cross a rounding boundary because of a representation artifact rather than a marketplace rule.

This project converts amounts to integer minor units first. It applies each fee component to that integer amount, enforces the configured minimum, and floors the component in one explicit place.

With the default options, a desired seller receipt of 100 cents is calculated as follows:

| Component | Calculation | Result |
| --- | --- | ---: |
| Seller receives | Input | 100 cents |
| Marketplace fee | floor(max(100 × 5%, 1)) | 5 cents |
| Publisher fee | floor(max(100 × 10%, 1)) | 10 cents |
| Buyer pays | 100 + 5 + 10 | 115 cents |

## Forward quote

`buyerPriceForSellerAmount` validates the input, merges the caller's options with the defaults, and returns all components of the estimate.

```js
const quote = buyerPriceForSellerAmount(250, {
  steamFeeRate: 0.05,
  publisherFeeRate: 0.10,
  steamFeeMinimum: 1,
  publisherFeeMinimum: 1,
  steamFeeBase: 0,
});
```

Inputs must be non-negative safe integers. Rates must be non-negative finite numbers, and minimum or base fee values must also be non-negative integer minor units.

## Reverse quote

`sellerAmountForBuyerPrice` uses an integer-only binary search. It finds the largest seller amount whose forward quote does not exceed the exact buyer-facing price.

If the exact total contains a remainder that is not explained by the selected seller amount and normal fee components, the implementation assigns that remainder to the marketplace fee. This preserves the caller's exact buyer total while keeping every returned value in integer minor units.

## Boundary tests

The test suite should emphasize discontinuities instead of checking only round values:

1. Zero and one-cent inputs.
2. Values immediately below and above each minimum-fee boundary.
3. A zero publisher rate.
4. Custom component minimums and a custom base fee.
5. Forward/reverse round trips over a range of integer values.
6. Invalid decimals, negative values, unsafe integers, and non-finite rates.

Run the current tests with:

```sh
npm test
```

For a reverse result, verify that the returned components reconcile exactly to `buyerPays`. For a forward result, verify that `sellerReceives + totalFees === buyerPays`.

## User-interface requirements

A trustworthy interface should show the buyer total, marketplace fee, publisher fee, and seller proceeds separately. It should also keep the selected rates visible and label the output as an estimate. The final confirmation displayed by Steam remains the source of truth for an actual listing.
