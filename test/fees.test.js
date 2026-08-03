import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buyerPriceForSellerAmount,
  sellerAmountForBuyerPrice,
} from '../src/fees.js';

test('calculates the common 5% plus 10% fee example', () => {
  assert.deepEqual(buyerPriceForSellerAmount(100), {
    sellerReceives: 100,
    steamFee: 5,
    publisherFee: 10,
    totalFees: 15,
    buyerPays: 115,
  });
});

test('reverses an exact buyer-facing price', () => {
  assert.deepEqual(sellerAmountForBuyerPrice(115), {
    sellerReceives: 100,
    steamFee: 5,
    publisherFee: 10,
    totalFees: 15,
    buyerPays: 115,
  });
});

test('applies the minimum component fees at low prices', () => {
  assert.deepEqual(buyerPriceForSellerAmount(1), {
    sellerReceives: 1,
    steamFee: 1,
    publisherFee: 1,
    totalFees: 2,
    buyerPays: 3,
  });
});

test('supports a game with no publisher fee', () => {
  assert.deepEqual(
    buyerPriceForSellerAmount(100, { publisherFeeRate: 0 }),
    {
      sellerReceives: 100,
      steamFee: 5,
      publisherFee: 0,
      totalFees: 5,
      buyerPays: 105,
    },
  );
});

test('rejects fractional minor units', () => {
  assert.throws(() => buyerPriceForSellerAmount(10.5), TypeError);
});
