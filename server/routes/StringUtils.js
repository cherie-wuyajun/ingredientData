// Set of utility functions to normalize and understand strings
const latinMap = require('./latinMap');

// Function to remove diatrics and normalize the string to latin encoding.
String.prototype.toLatin = function() {
  return this.replace(/[^A-Za-z0-9\[\] ]/g, function(c) {
    return latinMap[c] || c;
    })
};

// Funtion that normalize trailing spaces.
String.prototype.normalizeSpaces = function () {
   return this.trim().replace(/\s\s+/g, ' ');
}

// Funtion that remove quotes in a word.
String.prototype.removeQotes = function() {
  return this.replace(/["]+/g, '');
};

// Function to normalize txt to display text.
String.prototype.toDisplay = function () {
  return this.normalizeSpaces().toLowerCase();
}

// Function to normalize text so that it can be used as a hash key.
String.prototype.toHashKey = function () {
  return this.toLatin().removeQotes().replace(/\-/g, " - ").toDisplay();
}

// Function to generate plural variations of words.
function pluralVariations(text) {
  var out = [];
  if (Array.isArray(text)) {
    for (var i = 0; i < text.length; ++i) {
      out = out.concat(pluralVariations(text[i]));
    }
    return out;
  }
  if (!text || text.length < 3) return out;
  
  // Get the last 3 letters of the word.
  var c1 = text[text.length - 1];
  var c2 = text[text.length - 2];
  var c3 = text[text.length - 3];
  
  // Try general rule.
  var str = text;
  if (c1 == 's') {
    str = text.slice(0, text.length - 1);
  } else if (c1 != 's') {
    str = text + "s";
  }
  out.push(str);
  
  // Try special cases.
  if (c1 == 'y' && text.length > 4) {
    str = text.slice(0, text.length - 1) + "ies";
    out.push(str);
  } else if (c1 == 's' && c2 == 'e' && c3 == 'i' && text.length > 4) {
    str = text.slice(0, text.length - 3) + "y";
    out.push(str);
  } else if (c1 == 'h' && (c2 == 's' || c2 == 'c')) {
    str = text + "es";
    out.push(str);
  } else if (c1 == 'f') {
    str = text.slice(0, text.length - 1) + "ves";
    out.push(str);
  } else if (c1 == 's' && c2 == 'e' && c3 == 'v' && text.length > 4) {
    str = text.slice(0, text.length - 3) + "f";
    out.push(str);
  } else if (c1 == 's' && c2 == 'e' && (c3 == 's' || c3 == 'h' || c3 == 'x' || c3 == 'z' || c3 == 'o')) {
    str = text.slice(0, text.length - 2);
    out.push(str);
  } else if (c1 == 'o') {
    str = text + "es";
    out.push(str);
  } else if (c1 == 's' && c2 == 'i') {
    str = text.slice(0, text.length - 2) + "es";
    out.push(str);
  }
  
  // Super special cases.
  if (c1 == 's' && c2 == 'e') {
    str = text.slice(0, text.length - 2) + "is";
    out.push(str);
  } else if (c1 == 'i') {
    str = text.slice(0, text.length - 1) + "us";
    out.push(str);
  } else if (c1 == 's' && c2 == 'u') {
    str = text.slice(0, text.length - 2) + "i";
    out.push(str);
  } else if (c1 == 'n' && c2 == 'o' && text.length > 5) {
    str = text.slice(0, text.length - 2) + "a";
    out.push(str);
  } else if (c1 == 'a' && text.length > 4) {
    str = text.slice(0, text.length - 1) + "on";
    out.push(str);
  } else if (text == "woman") {
    str = "women";
    out.push(str);
  } else if (text == "women") {
    str = "woman";
    out.push(str);
  } else if (text == "man") {
    str = "men";
    out.push(str);
  } else if (text == "men") {
    str = "man";
    out.push(str);
  } else if (text == "child") {
    str = "children";
    out.push(str);
  } else if (text == "children") {
    str = "child";
    out.push(str);
  } else if (text == "person") {
    str = "people";
    out.push(str);
  } else if (text == "people") {
    str = "person";
    out.push(str);
  } else if (text == "goose") {
    str = "geese";
    out.push(str);
  } else if (text == "geese") {
    str = "goose";
    out.push(str);
  } else if (text == "mouse") {
    str = "mice";
    out.push(str);
  } else if (text == "mice") {
    str = "mouse";
    out.push(str);
  } else if (text == "foot") {
    str = "feet";
    out.push(str);
  } else if (text == "feet") {
    str = "foot";
    out.push(str);
  }
  
  return out;
}

function endWordVariations(text) {
  // Test if input it valid.
  var out = [];
  if (Array.isArray(text)) {
    for (var i = 0; i < text.length; ++i) {
      out = out.concat(pluralVariations(text[i]));
    }
    return out;
  }
  if (!text || text.length < 3) return out;
  
  var str = text + "e";
  out.push(str);
  
  var c1 = text[text.length - 1];
  var c2 = text[text.length - 2];
  if (c1 == "e") {
    str = text.substr(0, text.length - 1);
    out.push(str);
  } else if (c1 == "s" && c2 == "o") {
    str = text.substr(0, text.length - 1) + "e";
    out.push(str);
  }
  return out;
}

// Function to generate variation of words.
String.prototype.getVariations = function () {
  return pluralVariations(this).concat(endWordVariations(this));
}

// Functions to test if a string is a number.
String.prototype.isNaN = function () {
  return isNaN(this);
}

String.prototype.isNumeric = function () {
  return !isNaN(this);
}

// Function to test if string is a currency.
String.prototype.isCurrency = function () {
  const regex = /[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/g;
  return regex.test(this);
}

// Function to test if string is a special character.
String.prototype.isSpecialCharacter = function () {
  const regex = /[^A-Za-z0-9]/g;
  return regex.test(this);
}

// Function to test if string is a punctuation.
String.prototype.isPunctuation = function () {
  const regex = /[,;!?:]/g;
  return regex.test(this);
}

// Function to test if string is a math operator.
String.prototype.isMathOperator = function () {
  const regex = /[\+\-\*\%\~\u00F7]/g;
  return regex.test(this);
}

var methods = {
  toHashKey: function () {

  }
}

module.exports = String.prototype.toHashKey;