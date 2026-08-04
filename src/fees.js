/* @ts-self-types="./fees.d.ts" */

const DEFAULT_OPTIONS = Object.freeze({
  steamFeeRate: 0.05,
  publisherFeeRate: 0.1,
  steamFeeMinimum: 1,
  publisherFeeMinimum: 1,
  steamFeeBase: 0,
});

function assertCents(value, name) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new TypeError(`${name} must be a non-negative integer number of cents`);
  }
}

function normalizeOptions(options = {}) {
  const normalized = { ...DEFAULT_OPTIONS, ...options };

  for (const key of ['steamFeeRate', 'publisherFeeRate']) {
    if (!Number.isFinite(normalized[key]) || normalized[key] < 0) {
      throw new TypeError(`${key} must be a non-negative finite number`);
    }
  }

  for (const key of ['steamFeeMinimum', 'publisherFeeMinimum', 'steamFeeBase']) {
    assertCents(normalized[key], key);
  }

  return normalized;
}

/**
 * Calculate the buyer-facing price from the amount the seller wants to receive.
 * All monetary values are integer minor units, such as USD cents.
 */
export function buyerPriceForSellerAmount(sellerReceives, options = {}) {
  assertCents(sellerReceives, 'sellerReceives');
  const config = normalizeOptions(options);

  const steamFee = Math.floor(
    Math.max(sellerReceives * config.steamFeeRate, config.steamFeeMinimum) +
      config.steamFeeBase,
  );
  const publisherFee =
    config.publisherFeeRate > 0
      ? Math.floor(
          Math.max(
            sellerReceives * config.publisherFeeRate,
            config.publisherFeeMinimum,
          ),
        )
      : 0;

  return {
    sellerReceives,
    steamFee,
    publisherFee,
    totalFees: steamFee + publisherFee,
    buyerPays: sellerReceives + steamFee + publisherFee,
  };
}

/**
 * Estimate the amount the seller receives from an exact buyer-facing price.
 * The search is integer-only so rounding remains deterministic.
 */
export function sellerAmountForBuyerPrice(buyerPays, options = {}) {
  assertCents(buyerPays, 'buyerPays');
  const config = normalizeOptions(options);

  let low = 0;
  let high = buyerPays;
  let best = buyerPriceForSellerAmount(0, config);

  while (low <= high) {
    const midpoint = Math.floor((low + high) / 2);
    const candidate = buyerPriceForSellerAmount(midpoint, config);

    if (candidate.buyerPays <= buyerPays) {
      best = candidate;
      low = midpoint + 1;
    } else {
      high = midpoint - 1;
    }
  }

  const roundingRemainder = buyerPays - best.buyerPays;
  return {
    ...best,
    steamFee: best.steamFee + roundingRemainder,
    totalFees: best.totalFees + roundingRemainder,
    buyerPays,
  };
}

export { DEFAULT_OPTIONS };
