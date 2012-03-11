var ccErrorNo = 0;
var ccErrors = new Array();
ccErrors[1] = "Unknown card type";
ccErrors[2] = "Credit card number has an inappropriate number of digits";
ccErrors[3] = "Credit card number is in invalid format";
ccErrors[4] = "Credit card number is invalid";
/**
 * Validate Credit Card
 * 
 * @param cardNumber
 *            numeric
 * @param cardName
 *            string
 * @return boolean
 */
function checkCreditCard(cardNumber, cardName){
  // Cards we support. You may add addtional card types as follows.
  // http://en.wikipedia.org/wiki/Bank_card_number#Issuer_Identification_Number_.28IIN.29
  // digits: List of possible valid lengths of the card number for the card
  // prefix: List of possible prefix for the card (Regex)
  // luhn: Validate using luhn algorithm
  var cards = {
    amex: {
      digits: [15],
      prefix: "3[47]",
      luhn: true
    },
    unionpay: {
      digits: [16, 17, 18, 19],
      prefix: "62",
      validate: false
    },
    carteblanche: {
      digits: [14],
      prefix: "30[0-5]",
      luhn: true
    },
    dinersclub: {
      digits: [14],
      prefix: "36",
      luhn: true
    },
    discover: {
      digits: [16],
      prefix: "(6011|622|64[4-9]|65)",
      luhn: true
    },
    instapayment: {
      digits: [16],
      prefix: "63[7-9]",
      luhn: true
    },
    jcb: {
      digits: [16],
      prefix: "35(2[89]|[3-8])",
      luhn: true
    },
    laser: {
      digits: [16, 17, 18, 19],
      prefix: "(6304|670[69]|6771)",
      luhn: true
    },
    maestro: {
      digits: [12, 13, 14, 15, 16, 17, 18, 19],
      prefix: "(5018|5020|5038|6304|6759|676[1-3])",
      luhn: true
    },
    mastercard: {
      digits: [16],
      prefix: "5[1-5]",
      luhn: true
    },
    visa: {
      digits: [16],
      prefix: "4",
      luhn: true
    },
    electron: {
      digits: [16],
      prefix: "(4026|417500|4508|4844|491[37])",
      luhn: true
    }
  };
  // Get card data
  var card = cards[cardName.toLowerCase()] || false;
  if(typeof card == "boolean"){
    // Unknown Card Type
    ccErrorNo = 1;
    return false;
  }
  // Sanitize credit card
  cardNumber = cardNumber.replace(/[^0-9]/g, "");
  // Check if the length was valid. We only check the length if all else was
  var cardLength = cardNumber.length;
  var lengthValid = false;
  for( var i in card.digits){
    if(i == cardLength){
      lengthValid = true;
      break;
    }
  }
  if(!lengthValid){
    // Card Length Not Valid
    ccErrorNo = 2;
    return false;
  }
  ;
  // Check for Card Prefix
  var exp = new RegExp("^" + card.prefix);
  if(!exp.test(cardNumber)){
    // Card Prefix Not Valid
    ccErrorNo = 3;
    return false;
  }
  // If CardType supports luhn algorith; check for it
  if(card.luhn){
    if(!checkLuhnAlgorithm(cardNumber)){
      // Luhn Check Failed
      ccErrorNo = 4;
      return false;
    }
  }
  // The credit card is OK.
  return true;
}
/**
 * Checks supplied number using Luhn Algorithm
 * http://en.wikipedia.org/wiki/Luhn_algorithm
 * 
 * @param luhnNumber
 *            numberic
 * @return boolean
 */
function checkLuhnAlgorithm(luhnNumber){
  var checksum = 0;
  var calc;
  var length = luhnNumber.length;
  var j = 1;
  for( var i = (length - 1); i >= 0; i--){
    if(j++ % 2 == 1){
      calc = Number(luhnNumber.charAt(i));
    }else{
      calc = Number(luhnNumber.charAt(i)) * 2;
      if(calc > 9){
        checksum++;
        calc -= 10;
      }
    }
    checksum += calc;
  }
  return(checksum % 10 == 0);
}
