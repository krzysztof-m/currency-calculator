//TODO
// - refactor API calls
// - improve validation (user types 12,9 instead of 12.9)
// - write tests
//https://css-tricks.com/multiple-simultaneous-ajax-requests-one-callback-jquery/
var $table = $('#exchange'),
    $form = $('#calc'),
    $amount = $('#amount'),
    $alertInfo = $('.alert-info'),
    $currencies = $('#currencies'),
    currencies = ['PLN','USD','EUR','GBP','CHF','NOK'],
    ratesArr = [],
    PLNArr,
    USDArr,
    EURArr;

function checkInput($field) {
  var input = $field.val();
  if (/^\d*\.*\d*$/g.test(input)) {
    $field.removeClass('alert');
    $alertInfo.hide();
    return true;
  } else {
    $field.addClass('alert');
    console.log('not digits');
    $alertInfo.show();
    return false;
  }
}

function showAlert() {
  //$form.append($('<p class="alert-info">Wrong input</p>'));
}

function calculateResult() {
  var amount = Number($amount.val());
  ratesArr.forEach(function(curr) {
    curr.$result.text(Math.round(curr.rate * amount * 1000) / 1000);
  });
}

$amount.on('input',function() {
  if (checkInput($(this)))
    calculateResult();
})

function createTable(rates) {
  $.each(rates,function(currency,rate) {
    if (currencies.indexOf(currency) !== -1) {
      var $tr = $('<tr />');
      $tr.append($('<td>' + currency + '</td>'));
      //$tr.append($('<td>' + (Math.round((1 / rate) * 10000) / 10000) + '</td>'));
      $tr.append($('<td>' + rate + '</td>'));
      $tr.append($('<td class="result">' + 0 + '</td>'));
      ratesArr.push({
        currency: currency,
        rate: rate,
        $result: $tr.find('.result')
      });
      $table.append($tr);
    }
  });
}
function clear() {
  $table.children().remove();
  ratesArr = [];
  $amount.val('');
}
$.when(
  $.getJSON("https://api.fixer.io/latest?base=PLN")
  .done(function(json) {
    //console.log('success');
    PLNArr = json.rates;
  }),
  $.getJSON("https://api.fixer.io/latest?base=USD")
  .done(function(json) {
    //console.log('success');
    USDArr = json.rates;
  }),
  $.getJSON("https://api.fixer.io/latest?base=EUR")
  .done(function(json) {
    //console.log('success');
    EURArr = json.rates;
  }),
  $.getJSON("https://api.fixer.io/latest?base=CHF")
  .done(function(json) {
    //console.log('success');
    CHFArr = json.rates;
  }),
  $.getJSON("https://api.fixer.io/latest?base=NOK")
  .done(function(json) {
    //console.log('success');
    NOKArr = json.rates;
  }),
  $.getJSON("https://api.fixer.io/latest?base=GBP")
  .done(function(json) {
    //console.log('success');
    GBPArr = json.rates;
  })
).then(function() {
  createTable(PLNArr);
});
$currencies.on('change',function() {
  clear();
  if ($(this).val() === 'PLN')
    createTable(PLNArr);
  else if ($(this).val() === 'USD')
    createTable(USDArr);
  else if ($(this).val() === 'EUR')
    createTable(EURArr);
  else if ($(this).val() === 'GBP')
    createTable(GBPArr);
  else if ($(this).val() === 'NOK')
    createTable(NOKArr);
  else if ($(this).val() === 'CHF')
    createTable(CHFArr);
});