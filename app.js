import {
  buyerPriceForSellerAmount,
  sellerAmountForBuyerPrice,
} from './src/fees.js';

const form = document.querySelector('#calculator');
const mode = document.querySelector('#mode');
const amount = document.querySelector('#amount');
const steamRate = document.querySelector('#steam-rate');
const publisherRate = document.querySelector('#publisher-rate');
const output = document.querySelector('#result');

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function cents(value) {
  return Math.round(Number(value) * 100);
}

function render(result) {
  output.innerHTML = `
    <dl>
      <div><dt>Buyer pays</dt><dd>${money.format(result.buyerPays / 100)}</dd></div>
      <div><dt>Seller receives</dt><dd>${money.format(result.sellerReceives / 100)}</dd></div>
      <div><dt>Steam fee</dt><dd>${money.format(result.steamFee / 100)}</dd></div>
      <div><dt>Publisher fee</dt><dd>${money.format(result.publisherFee / 100)}</dd></div>
      <div><dt>Total fees</dt><dd>${money.format(result.totalFees / 100)}</dd></div>
    </dl>
  `;
}

function calculate() {
  const input = cents(amount.value);
  const options = {
    steamFeeRate: Number(steamRate.value) / 100,
    publisherFeeRate: Number(publisherRate.value) / 100,
  };

  if (!Number.isSafeInteger(input) || input < 0) {
    output.textContent = 'Enter a valid non-negative amount.';
    return;
  }

  const result =
    mode.value === 'buyer'
      ? sellerAmountForBuyerPrice(input, options)
      : buyerPriceForSellerAmount(input, options);
  render(result);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  calculate();
});

for (const control of [mode, amount, steamRate, publisherRate]) {
  control.addEventListener('input', calculate);
}

calculate();
