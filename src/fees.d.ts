export interface FeeOptions {
  steamFeeRate?: number;
  publisherFeeRate?: number;
  steamFeeMinimum?: number;
  publisherFeeMinimum?: number;
  steamFeeBase?: number;
}

export interface FeeBreakdown {
  sellerReceives: number;
  steamFee: number;
  publisherFee: number;
  totalFees: number;
  buyerPays: number;
}

export function buyerPriceForSellerAmount(
  sellerReceives: number,
  options?: FeeOptions,
): FeeBreakdown;

export function sellerAmountForBuyerPrice(
  buyerPays: number,
  options?: FeeOptions,
): FeeBreakdown;

export const DEFAULT_OPTIONS: Readonly<Required<FeeOptions>>;
