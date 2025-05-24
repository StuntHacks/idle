/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/bignumber.js/bignumber.js":
/*!************************************************!*\
  !*** ./node_modules/bignumber.js/bignumber.js ***!
  \************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;;(function (globalObject) {
  'use strict';

/*
 *      bignumber.js v9.3.0
 *      A JavaScript library for arbitrary-precision arithmetic.
 *      https://github.com/MikeMcl/bignumber.js
 *      Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
 *      MIT Licensed.
 *
 *      BigNumber.prototype methods     |  BigNumber methods
 *                                      |
 *      absoluteValue            abs    |  clone
 *      comparedTo                      |  config               set
 *      decimalPlaces            dp     |      DECIMAL_PLACES
 *      dividedBy                div    |      ROUNDING_MODE
 *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
 *      exponentiatedBy          pow    |      RANGE
 *      integerValue                    |      CRYPTO
 *      isEqualTo                eq     |      MODULO_MODE
 *      isFinite                        |      POW_PRECISION
 *      isGreaterThan            gt     |      FORMAT
 *      isGreaterThanOrEqualTo   gte    |      ALPHABET
 *      isInteger                       |  isBigNumber
 *      isLessThan               lt     |  maximum              max
 *      isLessThanOrEqualTo      lte    |  minimum              min
 *      isNaN                           |  random
 *      isNegative                      |  sum
 *      isPositive                      |
 *      isZero                          |
 *      minus                           |
 *      modulo                   mod    |
 *      multipliedBy             times  |
 *      negated                         |
 *      plus                            |
 *      precision                sd     |
 *      shiftedBy                       |
 *      squareRoot               sqrt   |
 *      toExponential                   |
 *      toFixed                         |
 *      toFormat                        |
 *      toFraction                      |
 *      toJSON                          |
 *      toNumber                        |
 *      toPrecision                     |
 *      toString                        |
 *      valueOf                         |
 *
 */


  var BigNumber,
    isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
    mathceil = Math.ceil,
    mathfloor = Math.floor,

    bignumberError = '[BigNumber Error] ',
    tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',

    BASE = 1e14,
    LOG_BASE = 14,
    MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
    // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
    POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
    SQRT_BASE = 1e7,

    // EDITABLE
    // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
    // the arguments to toExponential, toFixed, toFormat, and toPrecision.
    MAX = 1E9;                                   // 0 to MAX_INT32


  /*
   * Create and return a BigNumber constructor.
   */
  function clone(configObject) {
    var div, convertBase, parseNumeric,
      P = BigNumber.prototype = { constructor: BigNumber, toString: null, valueOf: null },
      ONE = new BigNumber(1),


      //----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------


      // The default values below must be integers within the inclusive ranges stated.
      // The values can also be changed at run-time using BigNumber.set.

      // The maximum number of decimal places for operations involving division.
      DECIMAL_PLACES = 20,                     // 0 to MAX

      // The rounding mode used when rounding to the above decimal places, and when using
      // toExponential, toFixed, toFormat and toPrecision, and round (default value).
      // UP         0 Away from zero.
      // DOWN       1 Towards zero.
      // CEIL       2 Towards +Infinity.
      // FLOOR      3 Towards -Infinity.
      // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
      // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
      // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
      // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
      // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
      ROUNDING_MODE = 4,                       // 0 to 8

      // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

      // The exponent value at and beneath which toString returns exponential notation.
      // Number type: -7
      TO_EXP_NEG = -7,                         // 0 to -MAX

      // The exponent value at and above which toString returns exponential notation.
      // Number type: 21
      TO_EXP_POS = 21,                         // 0 to MAX

      // RANGE : [MIN_EXP, MAX_EXP]

      // The minimum exponent value, beneath which underflow to zero occurs.
      // Number type: -324  (5e-324)
      MIN_EXP = -1e7,                          // -1 to -MAX

      // The maximum exponent value, above which overflow to Infinity occurs.
      // Number type:  308  (1.7976931348623157e+308)
      // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
      MAX_EXP = 1e7,                           // 1 to MAX

      // Whether to use cryptographically-secure random number generation, if available.
      CRYPTO = false,                          // true or false

      // The modulo mode used when calculating the modulus: a mod n.
      // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
      // The remainder (r) is calculated as: r = a - n * q.
      //
      // UP        0 The remainder is positive if the dividend is negative, else is negative.
      // DOWN      1 The remainder has the same sign as the dividend.
      //             This modulo mode is commonly known as 'truncated division' and is
      //             equivalent to (a % n) in JavaScript.
      // FLOOR     3 The remainder has the same sign as the divisor (Python %).
      // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
      // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
      //             The remainder is always positive.
      //
      // The truncated division, floored division, Euclidian division and IEEE 754 remainder
      // modes are commonly used for the modulus operation.
      // Although the other rounding modes can also be used, they may not give useful results.
      MODULO_MODE = 1,                         // 0 to 9

      // The maximum number of significant digits of the result of the exponentiatedBy operation.
      // If POW_PRECISION is 0, there will be unlimited significant digits.
      POW_PRECISION = 0,                       // 0 to MAX

      // The format specification used by the BigNumber.prototype.toFormat method.
      FORMAT = {
        prefix: '',
        groupSize: 3,
        secondaryGroupSize: 0,
        groupSeparator: ',',
        decimalSeparator: '.',
        fractionGroupSize: 0,
        fractionGroupSeparator: '\xA0',        // non-breaking space
        suffix: ''
      },

      // The alphabet used for base conversion. It must be at least 2 characters long, with no '+',
      // '-', '.', whitespace, or repeated character.
      // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
      ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz',
      alphabetHasNormalDecimalDigits = true;


    //------------------------------------------------------------------------------------------


    // CONSTRUCTOR


    /*
     * The BigNumber constructor and exported function.
     * Create and return a new instance of a BigNumber object.
     *
     * v {number|string|BigNumber} A numeric value.
     * [b] {number} The base of v. Integer, 2 to ALPHABET.length inclusive.
     */
    function BigNumber(v, b) {
      var alphabet, c, caseChanged, e, i, isNum, len, str,
        x = this;

      // Enable constructor call without `new`.
      if (!(x instanceof BigNumber)) return new BigNumber(v, b);

      if (b == null) {

        if (v && v._isBigNumber === true) {
          x.s = v.s;

          if (!v.c || v.e > MAX_EXP) {
            x.c = x.e = null;
          } else if (v.e < MIN_EXP) {
            x.c = [x.e = 0];
          } else {
            x.e = v.e;
            x.c = v.c.slice();
          }

          return;
        }

        if ((isNum = typeof v == 'number') && v * 0 == 0) {

          // Use `1 / n` to handle minus zero also.
          x.s = 1 / v < 0 ? (v = -v, -1) : 1;

          // Fast path for integers, where n < 2147483648 (2**31).
          if (v === ~~v) {
            for (e = 0, i = v; i >= 10; i /= 10, e++);

            if (e > MAX_EXP) {
              x.c = x.e = null;
            } else {
              x.e = e;
              x.c = [v];
            }

            return;
          }

          str = String(v);
        } else {

          if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);

          x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
        }

        // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

        // Exponential form?
        if ((i = str.search(/e/i)) > 0) {

          // Determine exponent.
          if (e < 0) e = i;
          e += +str.slice(i + 1);
          str = str.substring(0, i);
        } else if (e < 0) {

          // Integer.
          e = str.length;
        }

      } else {

        // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
        intCheck(b, 2, ALPHABET.length, 'Base');

        // Allow exponential notation to be used with base 10 argument, while
        // also rounding to DECIMAL_PLACES as with other bases.
        if (b == 10 && alphabetHasNormalDecimalDigits) {
          x = new BigNumber(v);
          return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
        }

        str = String(v);

        if (isNum = typeof v == 'number') {

          // Avoid potential interpretation of Infinity and NaN as base 44+ values.
          if (v * 0 != 0) return parseNumeric(x, str, isNum, b);

          x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;

          // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
          if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
            throw Error
             (tooManyDigits + v);
          }
        } else {
          x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
        }

        alphabet = ALPHABET.slice(0, b);
        e = i = 0;

        // Check that str is a valid base b number.
        // Don't use RegExp, so alphabet can contain special characters.
        for (len = str.length; i < len; i++) {
          if (alphabet.indexOf(c = str.charAt(i)) < 0) {
            if (c == '.') {

              // If '.' is not the first character and it has not be found before.
              if (i > e) {
                e = len;
                continue;
              }
            } else if (!caseChanged) {

              // Allow e.g. hexadecimal 'FF' as well as 'ff'.
              if (str == str.toUpperCase() && (str = str.toLowerCase()) ||
                  str == str.toLowerCase() && (str = str.toUpperCase())) {
                caseChanged = true;
                i = -1;
                e = 0;
                continue;
              }
            }

            return parseNumeric(x, String(v), isNum, b);
          }
        }

        // Prevent later check for length on converted number.
        isNum = false;
        str = convertBase(str, b, 10, x.s);

        // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');
        else e = str.length;
      }

      // Determine leading zeros.
      for (i = 0; str.charCodeAt(i) === 48; i++);

      // Determine trailing zeros.
      for (len = str.length; str.charCodeAt(--len) === 48;);

      if (str = str.slice(i, ++len)) {
        len -= i;

        // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
        if (isNum && BigNumber.DEBUG &&
          len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
            throw Error
             (tooManyDigits + (x.s * v));
        }

         // Overflow?
        if ((e = e - i - 1) > MAX_EXP) {

          // Infinity.
          x.c = x.e = null;

        // Underflow?
        } else if (e < MIN_EXP) {

          // Zero.
          x.c = [x.e = 0];
        } else {
          x.e = e;
          x.c = [];

          // Transform base

          // e is the base 10 exponent.
          // i is where to slice str to get the first element of the coefficient array.
          i = (e + 1) % LOG_BASE;
          if (e < 0) i += LOG_BASE;  // i < 1

          if (i < len) {
            if (i) x.c.push(+str.slice(0, i));

            for (len -= LOG_BASE; i < len;) {
              x.c.push(+str.slice(i, i += LOG_BASE));
            }

            i = LOG_BASE - (str = str.slice(i)).length;
          } else {
            i -= len;
          }

          for (; i--; str += '0');
          x.c.push(+str);
        }
      } else {

        // Zero.
        x.c = [x.e = 0];
      }
    }


    // CONSTRUCTOR PROPERTIES


    BigNumber.clone = clone;

    BigNumber.ROUND_UP = 0;
    BigNumber.ROUND_DOWN = 1;
    BigNumber.ROUND_CEIL = 2;
    BigNumber.ROUND_FLOOR = 3;
    BigNumber.ROUND_HALF_UP = 4;
    BigNumber.ROUND_HALF_DOWN = 5;
    BigNumber.ROUND_HALF_EVEN = 6;
    BigNumber.ROUND_HALF_CEIL = 7;
    BigNumber.ROUND_HALF_FLOOR = 8;
    BigNumber.EUCLID = 9;


    /*
     * Configure infrequently-changing library-wide settings.
     *
     * Accept an object with the following optional properties (if the value of a property is
     * a number, it must be an integer within the inclusive range stated):
     *
     *   DECIMAL_PLACES   {number}           0 to MAX
     *   ROUNDING_MODE    {number}           0 to 8
     *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
     *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
     *   CRYPTO           {boolean}          true or false
     *   MODULO_MODE      {number}           0 to 9
     *   POW_PRECISION       {number}           0 to MAX
     *   ALPHABET         {string}           A string of two or more unique characters which does
     *                                       not contain '.'.
     *   FORMAT           {object}           An object with some of the following properties:
     *     prefix                 {string}
     *     groupSize              {number}
     *     secondaryGroupSize     {number}
     *     groupSeparator         {string}
     *     decimalSeparator       {string}
     *     fractionGroupSize      {number}
     *     fractionGroupSeparator {string}
     *     suffix                 {string}
     *
     * (The values assigned to the above FORMAT object properties are not checked for validity.)
     *
     * E.g.
     * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
     *
     * Ignore properties/parameters set to null or undefined, except for ALPHABET.
     *
     * Return an object with the properties current values.
     */
    BigNumber.config = BigNumber.set = function (obj) {
      var p, v;

      if (obj != null) {

        if (typeof obj == 'object') {

          // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
          // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            DECIMAL_PLACES = v;
          }

          // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
          // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
            v = obj[p];
            intCheck(v, 0, 8, p);
            ROUNDING_MODE = v;
          }

          // EXPONENTIAL_AT {number|number[]}
          // Integer, -MAX to MAX inclusive or
          // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
          // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
            v = obj[p];
            if (v && v.pop) {
              intCheck(v[0], -MAX, 0, p);
              intCheck(v[1], 0, MAX, p);
              TO_EXP_NEG = v[0];
              TO_EXP_POS = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
            }
          }

          // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
          // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
          // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'
          if (obj.hasOwnProperty(p = 'RANGE')) {
            v = obj[p];
            if (v && v.pop) {
              intCheck(v[0], -MAX, -1, p);
              intCheck(v[1], 1, MAX, p);
              MIN_EXP = v[0];
              MAX_EXP = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              if (v) {
                MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
              } else {
                throw Error
                 (bignumberError + p + ' cannot be zero: ' + v);
              }
            }
          }

          // CRYPTO {boolean} true or false.
          // '[BigNumber Error] CRYPTO not true or false: {v}'
          // '[BigNumber Error] crypto unavailable'
          if (obj.hasOwnProperty(p = 'CRYPTO')) {
            v = obj[p];
            if (v === !!v) {
              if (v) {
                if (typeof crypto != 'undefined' && crypto &&
                 (crypto.getRandomValues || crypto.randomBytes)) {
                  CRYPTO = v;
                } else {
                  CRYPTO = !v;
                  throw Error
                   (bignumberError + 'crypto unavailable');
                }
              } else {
                CRYPTO = v;
              }
            } else {
              throw Error
               (bignumberError + p + ' not true or false: ' + v);
            }
          }

          // MODULO_MODE {number} Integer, 0 to 9 inclusive.
          // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
            v = obj[p];
            intCheck(v, 0, 9, p);
            MODULO_MODE = v;
          }

          // POW_PRECISION {number} Integer, 0 to MAX inclusive.
          // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            POW_PRECISION = v;
          }

          // FORMAT {object}
          // '[BigNumber Error] FORMAT not an object: {v}'
          if (obj.hasOwnProperty(p = 'FORMAT')) {
            v = obj[p];
            if (typeof v == 'object') FORMAT = v;
            else throw Error
             (bignumberError + p + ' not an object: ' + v);
          }

          // ALPHABET {string}
          // '[BigNumber Error] ALPHABET invalid: {v}'
          if (obj.hasOwnProperty(p = 'ALPHABET')) {
            v = obj[p];

            // Disallow if less than two characters,
            // or if it contains '+', '-', '.', whitespace, or a repeated character.
            if (typeof v == 'string' && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
              alphabetHasNormalDecimalDigits = v.slice(0, 10) == '0123456789';
              ALPHABET = v;
            } else {
              throw Error
               (bignumberError + p + ' invalid: ' + v);
            }
          }

        } else {

          // '[BigNumber Error] Object expected: {v}'
          throw Error
           (bignumberError + 'Object expected: ' + obj);
        }
      }

      return {
        DECIMAL_PLACES: DECIMAL_PLACES,
        ROUNDING_MODE: ROUNDING_MODE,
        EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
        RANGE: [MIN_EXP, MAX_EXP],
        CRYPTO: CRYPTO,
        MODULO_MODE: MODULO_MODE,
        POW_PRECISION: POW_PRECISION,
        FORMAT: FORMAT,
        ALPHABET: ALPHABET
      };
    };


    /*
     * Return true if v is a BigNumber instance, otherwise return false.
     *
     * If BigNumber.DEBUG is true, throw if a BigNumber instance is not well-formed.
     *
     * v {any}
     *
     * '[BigNumber Error] Invalid BigNumber: {v}'
     */
    BigNumber.isBigNumber = function (v) {
      if (!v || v._isBigNumber !== true) return false;
      if (!BigNumber.DEBUG) return true;

      var i, n,
        c = v.c,
        e = v.e,
        s = v.s;

      out: if ({}.toString.call(c) == '[object Array]') {

        if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {

          // If the first element is zero, the BigNumber value must be zero.
          if (c[0] === 0) {
            if (e === 0 && c.length === 1) return true;
            break out;
          }

          // Calculate number of digits that c[0] should have, based on the exponent.
          i = (e + 1) % LOG_BASE;
          if (i < 1) i += LOG_BASE;

          // Calculate number of digits of c[0].
          //if (Math.ceil(Math.log(c[0] + 1) / Math.LN10) == i) {
          if (String(c[0]).length == i) {

            for (i = 0; i < c.length; i++) {
              n = c[i];
              if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
            }

            // Last element cannot be zero, unless it is the only element.
            if (n !== 0) return true;
          }
        }

      // Infinity/NaN
      } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
        return true;
      }

      throw Error
        (bignumberError + 'Invalid BigNumber: ' + v);
    };


    /*
     * Return a new BigNumber whose value is the maximum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.maximum = BigNumber.max = function () {
      return maxOrMin(arguments, -1);
    };


    /*
     * Return a new BigNumber whose value is the minimum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.minimum = BigNumber.min = function () {
      return maxOrMin(arguments, 1);
    };


    /*
     * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
     * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
     * zeros are produced).
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
     * '[BigNumber Error] crypto unavailable'
     */
    BigNumber.random = (function () {
      var pow2_53 = 0x20000000000000;

      // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
      // Check if Math.random() produces more than 32 bits of randomness.
      // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
      // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
      var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
       ? function () { return mathfloor(Math.random() * pow2_53); }
       : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
         (Math.random() * 0x800000 | 0); };

      return function (dp) {
        var a, b, e, k, v,
          i = 0,
          c = [],
          rand = new BigNumber(ONE);

        if (dp == null) dp = DECIMAL_PLACES;
        else intCheck(dp, 0, MAX);

        k = mathceil(dp / LOG_BASE);

        if (CRYPTO) {

          // Browsers supporting crypto.getRandomValues.
          if (crypto.getRandomValues) {

            a = crypto.getRandomValues(new Uint32Array(k *= 2));

            for (; i < k;) {

              // 53 bits:
              // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
              // 11111 11111111 11111111 11111111 11100000 00000000 00000000
              // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
              //                                     11111 11111111 11111111
              // 0x20000 is 2^21.
              v = a[i] * 0x20000 + (a[i + 1] >>> 11);

              // Rejection sampling:
              // 0 <= v < 9007199254740992
              // Probability that v >= 9e15, is
              // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
              if (v >= 9e15) {
                b = crypto.getRandomValues(new Uint32Array(2));
                a[i] = b[0];
                a[i + 1] = b[1];
              } else {

                // 0 <= v <= 8999999999999999
                // 0 <= (v % 1e14) <= 99999999999999
                c.push(v % 1e14);
                i += 2;
              }
            }
            i = k / 2;

          // Node.js supporting crypto.randomBytes.
          } else if (crypto.randomBytes) {

            // buffer
            a = crypto.randomBytes(k *= 7);

            for (; i < k;) {

              // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
              // 0x100000000 is 2^32, 0x1000000 is 2^24
              // 11111 11111111 11111111 11111111 11111111 11111111 11111111
              // 0 <= v < 9007199254740992
              v = ((a[i] & 31) * 0x1000000000000) + (a[i + 1] * 0x10000000000) +
                 (a[i + 2] * 0x100000000) + (a[i + 3] * 0x1000000) +
                 (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];

              if (v >= 9e15) {
                crypto.randomBytes(7).copy(a, i);
              } else {

                // 0 <= (v % 1e14) <= 99999999999999
                c.push(v % 1e14);
                i += 7;
              }
            }
            i = k / 7;
          } else {
            CRYPTO = false;
            throw Error
             (bignumberError + 'crypto unavailable');
          }
        }

        // Use Math.random.
        if (!CRYPTO) {

          for (; i < k;) {
            v = random53bitInt();
            if (v < 9e15) c[i++] = v % 1e14;
          }
        }

        k = c[--i];
        dp %= LOG_BASE;

        // Convert trailing digits to zeros according to dp.
        if (k && dp) {
          v = POWS_TEN[LOG_BASE - dp];
          c[i] = mathfloor(k / v) * v;
        }

        // Remove trailing elements which are zero.
        for (; c[i] === 0; c.pop(), i--);

        // Zero?
        if (i < 0) {
          c = [e = 0];
        } else {

          // Remove leading elements which are zero and adjust exponent accordingly.
          for (e = -1 ; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);

          // Count the digits of the first element of c to determine leading zeros, and...
          for (i = 1, v = c[0]; v >= 10; v /= 10, i++);

          // adjust the exponent accordingly.
          if (i < LOG_BASE) e -= LOG_BASE - i;
        }

        rand.e = e;
        rand.c = c;
        return rand;
      };
    })();


    /*
     * Return a BigNumber whose value is the sum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.sum = function () {
      var i = 1,
        args = arguments,
        sum = new BigNumber(args[0]);
      for (; i < args.length;) sum = sum.plus(args[i++]);
      return sum;
    };


    // PRIVATE FUNCTIONS


    // Called by BigNumber and BigNumber.prototype.toString.
    convertBase = (function () {
      var decimal = '0123456789';

      /*
       * Convert string of baseIn to an array of numbers of baseOut.
       * Eg. toBaseOut('255', 10, 16) returns [15, 15].
       * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
       */
      function toBaseOut(str, baseIn, baseOut, alphabet) {
        var j,
          arr = [0],
          arrL,
          i = 0,
          len = str.length;

        for (; i < len;) {
          for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);

          arr[0] += alphabet.indexOf(str.charAt(i++));

          for (j = 0; j < arr.length; j++) {

            if (arr[j] > baseOut - 1) {
              if (arr[j + 1] == null) arr[j + 1] = 0;
              arr[j + 1] += arr[j] / baseOut | 0;
              arr[j] %= baseOut;
            }
          }
        }

        return arr.reverse();
      }

      // Convert a numeric string of baseIn to a numeric string of baseOut.
      // If the caller is toString, we are converting from base 10 to baseOut.
      // If the caller is BigNumber, we are converting from baseIn to base 10.
      return function (str, baseIn, baseOut, sign, callerIsToString) {
        var alphabet, d, e, k, r, x, xc, y,
          i = str.indexOf('.'),
          dp = DECIMAL_PLACES,
          rm = ROUNDING_MODE;

        // Non-integer.
        if (i >= 0) {
          k = POW_PRECISION;

          // Unlimited precision.
          POW_PRECISION = 0;
          str = str.replace('.', '');
          y = new BigNumber(baseIn);
          x = y.pow(str.length - i);
          POW_PRECISION = k;

          // Convert str as if an integer, then restore the fraction part by dividing the
          // result by its base raised to a power.

          y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'),
           10, baseOut, decimal);
          y.e = y.c.length;
        }

        // Convert the number as integer.

        xc = toBaseOut(str, baseIn, baseOut, callerIsToString
         ? (alphabet = ALPHABET, decimal)
         : (alphabet = decimal, ALPHABET));

        // xc now represents str as an integer and converted to baseOut. e is the exponent.
        e = k = xc.length;

        // Remove trailing zeros.
        for (; xc[--k] == 0; xc.pop());

        // Zero?
        if (!xc[0]) return alphabet.charAt(0);

        // Does str represent an integer? If so, no need for the division.
        if (i < 0) {
          --e;
        } else {
          x.c = xc;
          x.e = e;

          // The sign is needed for correct rounding.
          x.s = sign;
          x = div(x, y, dp, rm, baseOut);
          xc = x.c;
          r = x.r;
          e = x.e;
        }

        // xc now represents str converted to baseOut.

        // The index of the rounding digit.
        d = e + dp + 1;

        // The rounding digit: the digit to the right of the digit that may be rounded up.
        i = xc[d];

        // Look at the rounding digits and mode to determine whether to round up.

        k = baseOut / 2;
        r = r || d < 0 || xc[d + 1] != null;

        r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
              : i > k || i == k &&(rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
               rm == (x.s < 0 ? 8 : 7));

        // If the index of the rounding digit is not greater than zero, or xc represents
        // zero, then the result of the base conversion is zero or, if rounding up, a value
        // such as 0.00001.
        if (d < 1 || !xc[0]) {

          // 1^-dp or 0
          str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
        } else {

          // Truncate xc to the required number of decimal places.
          xc.length = d;

          // Round up?
          if (r) {

            // Rounding up may mean the previous digit has to be rounded up and so on.
            for (--baseOut; ++xc[--d] > baseOut;) {
              xc[d] = 0;

              if (!d) {
                ++e;
                xc = [1].concat(xc);
              }
            }
          }

          // Determine trailing zeros.
          for (k = xc.length; !xc[--k];);

          // E.g. [4, 11, 15] becomes 4bf.
          for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));

          // Add leading zeros, decimal point and trailing zeros as required.
          str = toFixedPoint(str, e, alphabet.charAt(0));
        }

        // The caller will add the sign.
        return str;
      };
    })();


    // Perform division in the specified base. Called by div and convertBase.
    div = (function () {

      // Assume non-zero x and k.
      function multiply(x, k, base) {
        var m, temp, xlo, xhi,
          carry = 0,
          i = x.length,
          klo = k % SQRT_BASE,
          khi = k / SQRT_BASE | 0;

        for (x = x.slice(); i--;) {
          xlo = x[i] % SQRT_BASE;
          xhi = x[i] / SQRT_BASE | 0;
          m = khi * xlo + xhi * klo;
          temp = klo * xlo + ((m % SQRT_BASE) * SQRT_BASE) + carry;
          carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
          x[i] = temp % base;
        }

        if (carry) x = [carry].concat(x);

        return x;
      }

      function compare(a, b, aL, bL) {
        var i, cmp;

        if (aL != bL) {
          cmp = aL > bL ? 1 : -1;
        } else {

          for (i = cmp = 0; i < aL; i++) {

            if (a[i] != b[i]) {
              cmp = a[i] > b[i] ? 1 : -1;
              break;
            }
          }
        }

        return cmp;
      }

      function subtract(a, b, aL, base) {
        var i = 0;

        // Subtract b from a.
        for (; aL--;) {
          a[aL] -= i;
          i = a[aL] < b[aL] ? 1 : 0;
          a[aL] = i * base + a[aL] - b[aL];
        }

        // Remove leading zeros.
        for (; !a[0] && a.length > 1; a.splice(0, 1));
      }

      // x: dividend, y: divisor.
      return function (x, y, dp, rm, base) {
        var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
          yL, yz,
          s = x.s == y.s ? 1 : -1,
          xc = x.c,
          yc = y.c;

        // Either NaN, Infinity or 0?
        if (!xc || !xc[0] || !yc || !yc[0]) {

          return new BigNumber(

           // Return NaN if either NaN, or both Infinity or 0.
           !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN :

            // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
            xc && xc[0] == 0 || !yc ? s * 0 : s / 0
         );
        }

        q = new BigNumber(s);
        qc = q.c = [];
        e = x.e - y.e;
        s = dp + e + 1;

        if (!base) {
          base = BASE;
          e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
          s = s / LOG_BASE | 0;
        }

        // Result exponent may be one less then the current value of e.
        // The coefficients of the BigNumbers from convertBase may have trailing zeros.
        for (i = 0; yc[i] == (xc[i] || 0); i++);

        if (yc[i] > (xc[i] || 0)) e--;

        if (s < 0) {
          qc.push(1);
          more = true;
        } else {
          xL = xc.length;
          yL = yc.length;
          i = 0;
          s += 2;

          // Normalise xc and yc so highest order digit of yc is >= base / 2.

          n = mathfloor(base / (yc[0] + 1));

          // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
          // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
          if (n > 1) {
            yc = multiply(yc, n, base);
            xc = multiply(xc, n, base);
            yL = yc.length;
            xL = xc.length;
          }

          xi = yL;
          rem = xc.slice(0, yL);
          remL = rem.length;

          // Add zeros to make remainder as long as divisor.
          for (; remL < yL; rem[remL++] = 0);
          yz = yc.slice();
          yz = [0].concat(yz);
          yc0 = yc[0];
          if (yc[1] >= base / 2) yc0++;
          // Not necessary, but to prevent trial digit n > base, when using base 3.
          // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;

          do {
            n = 0;

            // Compare divisor and remainder.
            cmp = compare(yc, rem, yL, remL);

            // If divisor < remainder.
            if (cmp < 0) {

              // Calculate trial digit, n.

              rem0 = rem[0];
              if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

              // n is how many times the divisor goes into the current remainder.
              n = mathfloor(rem0 / yc0);

              //  Algorithm:
              //  product = divisor multiplied by trial digit (n).
              //  Compare product and remainder.
              //  If product is greater than remainder:
              //    Subtract divisor from product, decrement trial digit.
              //  Subtract product from remainder.
              //  If product was less than remainder at the last compare:
              //    Compare new remainder and divisor.
              //    If remainder is greater than divisor:
              //      Subtract divisor from remainder, increment trial digit.

              if (n > 1) {

                // n may be > base only when base is 3.
                if (n >= base) n = base - 1;

                // product = divisor * trial digit.
                prod = multiply(yc, n, base);
                prodL = prod.length;
                remL = rem.length;

                // Compare product and remainder.
                // If product > remainder then trial digit n too high.
                // n is 1 too high about 5% of the time, and is not known to have
                // ever been more than 1 too high.
                while (compare(prod, rem, prodL, remL) == 1) {
                  n--;

                  // Subtract divisor from product.
                  subtract(prod, yL < prodL ? yz : yc, prodL, base);
                  prodL = prod.length;
                  cmp = 1;
                }
              } else {

                // n is 0 or 1, cmp is -1.
                // If n is 0, there is no need to compare yc and rem again below,
                // so change cmp to 1 to avoid it.
                // If n is 1, leave cmp as -1, so yc and rem are compared again.
                if (n == 0) {

                  // divisor < remainder, so n must be at least 1.
                  cmp = n = 1;
                }

                // product = divisor
                prod = yc.slice();
                prodL = prod.length;
              }

              if (prodL < remL) prod = [0].concat(prod);

              // Subtract product from remainder.
              subtract(rem, prod, remL, base);
              remL = rem.length;

               // If product was < remainder.
              if (cmp == -1) {

                // Compare divisor and new remainder.
                // If divisor < new remainder, subtract divisor from remainder.
                // Trial digit n too low.
                // n is 1 too low about 5% of the time, and very rarely 2 too low.
                while (compare(yc, rem, yL, remL) < 1) {
                  n++;

                  // Subtract divisor from remainder.
                  subtract(rem, yL < remL ? yz : yc, remL, base);
                  remL = rem.length;
                }
              }
            } else if (cmp === 0) {
              n++;
              rem = [0];
            } // else cmp === 1 and n will be 0

            // Add the next digit, n, to the result array.
            qc[i++] = n;

            // Update the remainder.
            if (rem[0]) {
              rem[remL++] = xc[xi] || 0;
            } else {
              rem = [xc[xi]];
              remL = 1;
            }
          } while ((xi++ < xL || rem[0] != null) && s--);

          more = rem[0] != null;

          // Leading zero?
          if (!qc[0]) qc.splice(0, 1);
        }

        if (base == BASE) {

          // To calculate q.e, first get the number of digits of qc[0].
          for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);

          round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);

        // Caller is convertBase.
        } else {
          q.e = e;
          q.r = +more;
        }

        return q;
      };
    })();


    /*
     * Return a string representing the value of BigNumber n in fixed-point or exponential
     * notation rounded to the specified decimal places or significant digits.
     *
     * n: a BigNumber.
     * i: the index of the last digit required (i.e. the digit that may be rounded up).
     * rm: the rounding mode.
     * id: 1 (toExponential) or 2 (toPrecision).
     */
    function format(n, i, rm, id) {
      var c0, e, ne, len, str;

      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);

      if (!n.c) return n.toString();

      c0 = n.c[0];
      ne = n.e;

      if (i == null) {
        str = coeffToString(n.c);
        str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS)
         ? toExponential(str, ne)
         : toFixedPoint(str, ne, '0');
      } else {
        n = round(new BigNumber(n), i, rm);

        // n.e may have changed if the value was rounded up.
        e = n.e;

        str = coeffToString(n.c);
        len = str.length;

        // toPrecision returns exponential notation if the number of significant digits
        // specified is less than the number of digits necessary to represent the integer
        // part of the value in fixed-point notation.

        // Exponential notation.
        if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {

          // Append zeros?
          for (; len < i; str += '0', len++);
          str = toExponential(str, e);

        // Fixed-point notation.
        } else {
          i -= ne;
          str = toFixedPoint(str, e, '0');

          // Append zeros?
          if (e + 1 > len) {
            if (--i > 0) for (str += '.'; i--; str += '0');
          } else {
            i += e - len;
            if (i > 0) {
              if (e + 1 == len) str += '.';
              for (; i--; str += '0');
            }
          }
        }
      }

      return n.s < 0 && c0 ? '-' + str : str;
    }


    // Handle BigNumber.max and BigNumber.min.
    // If any number is NaN, return NaN.
    function maxOrMin(args, n) {
      var k, y,
        i = 1,
        x = new BigNumber(args[0]);

      for (; i < args.length; i++) {
        y = new BigNumber(args[i]);
        if (!y.s || (k = compare(x, y)) === n || k === 0 && x.s === n) {
          x = y;
        }
      }

      return x;
    }


    /*
     * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
     * Called by minus, plus and times.
     */
    function normalise(n, c, e) {
      var i = 1,
        j = c.length;

       // Remove trailing zeros.
      for (; !c[--j]; c.pop());

      // Calculate the base 10 exponent. First get the number of digits of c[0].
      for (j = c[0]; j >= 10; j /= 10, i++);

      // Overflow?
      if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {

        // Infinity.
        n.c = n.e = null;

      // Underflow?
      } else if (e < MIN_EXP) {

        // Zero.
        n.c = [n.e = 0];
      } else {
        n.e = e;
        n.c = c;
      }

      return n;
    }


    // Handle values that fail the validity test in BigNumber.
    parseNumeric = (function () {
      var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
        dotAfter = /^([^.]+)\.$/,
        dotBefore = /^\.([^.]+)$/,
        isInfinityOrNaN = /^-?(Infinity|NaN)$/,
        whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;

      return function (x, str, isNum, b) {
        var base,
          s = isNum ? str : str.replace(whitespaceOrPlus, '');

        // No exception on ±Infinity or NaN.
        if (isInfinityOrNaN.test(s)) {
          x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
        } else {
          if (!isNum) {

            // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
            s = s.replace(basePrefix, function (m, p1, p2) {
              base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
              return !b || b == base ? p1 : m;
            });

            if (b) {
              base = b;

              // E.g. '1.' to '1', '.1' to '0.1'
              s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
            }

            if (str != s) return new BigNumber(s, base);
          }

          // '[BigNumber Error] Not a number: {n}'
          // '[BigNumber Error] Not a base {b} number: {n}'
          if (BigNumber.DEBUG) {
            throw Error
              (bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
          }

          // NaN
          x.s = null;
        }

        x.c = x.e = null;
      }
    })();


    /*
     * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
     * If r is truthy, it is known that there are more digits after the rounding digit.
     */
    function round(x, sd, rm, r) {
      var d, i, j, k, n, ni, rd,
        xc = x.c,
        pows10 = POWS_TEN;

      // if x is not Infinity or NaN...
      if (xc) {

        // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
        // n is a base 1e14 number, the value of the element of array x.c containing rd.
        // ni is the index of n within x.c.
        // d is the number of digits of n.
        // i is the index of rd within n including leading zeros.
        // j is the actual index of rd within n (if < 0, rd is a leading zero).
        out: {

          // Get the number of digits of the first element of xc.
          for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
          i = sd - d;

          // If the rounding digit is in the first element of xc...
          if (i < 0) {
            i += LOG_BASE;
            j = sd;
            n = xc[ni = 0];

            // Get the rounding digit at index j of n.
            rd = mathfloor(n / pows10[d - j - 1] % 10);
          } else {
            ni = mathceil((i + 1) / LOG_BASE);

            if (ni >= xc.length) {

              if (r) {

                // Needed by sqrt.
                for (; xc.length <= ni; xc.push(0));
                n = rd = 0;
                d = 1;
                i %= LOG_BASE;
                j = i - LOG_BASE + 1;
              } else {
                break out;
              }
            } else {
              n = k = xc[ni];

              // Get the number of digits of n.
              for (d = 1; k >= 10; k /= 10, d++);

              // Get the index of rd within n.
              i %= LOG_BASE;

              // Get the index of rd within n, adjusted for leading zeros.
              // The number of leading zeros of n is given by LOG_BASE - d.
              j = i - LOG_BASE + d;

              // Get the rounding digit at index j of n.
              rd = j < 0 ? 0 : mathfloor(n / pows10[d - j - 1] % 10);
            }
          }

          r = r || sd < 0 ||

          // Are there any non-zero digits after the rounding digit?
          // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
          // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
           xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);

          r = rm < 4
           ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
           : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 &&

            // Check whether the digit to the left of the rounding digit is odd.
            ((i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10) & 1 ||
             rm == (x.s < 0 ? 8 : 7));

          if (sd < 1 || !xc[0]) {
            xc.length = 0;

            if (r) {

              // Convert sd to decimal places.
              sd -= x.e + 1;

              // 1, 0.1, 0.01, 0.001, 0.0001 etc.
              xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
              x.e = -sd || 0;
            } else {

              // Zero.
              xc[0] = x.e = 0;
            }

            return x;
          }

          // Remove excess digits.
          if (i == 0) {
            xc.length = ni;
            k = 1;
            ni--;
          } else {
            xc.length = ni + 1;
            k = pows10[LOG_BASE - i];

            // E.g. 56700 becomes 56000 if 7 is the rounding digit.
            // j > 0 means i > number of leading zeros of n.
            xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
          }

          // Round up?
          if (r) {

            for (; ;) {

              // If the digit to be rounded up is in the first element of xc...
              if (ni == 0) {

                // i will be the length of xc[0] before k is added.
                for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
                j = xc[0] += k;
                for (k = 1; j >= 10; j /= 10, k++);

                // if i != k the length has increased.
                if (i != k) {
                  x.e++;
                  if (xc[0] == BASE) xc[0] = 1;
                }

                break;
              } else {
                xc[ni] += k;
                if (xc[ni] != BASE) break;
                xc[ni--] = 0;
                k = 1;
              }
            }
          }

          // Remove trailing zeros.
          for (i = xc.length; xc[--i] === 0; xc.pop());
        }

        // Overflow? Infinity.
        if (x.e > MAX_EXP) {
          x.c = x.e = null;

        // Underflow? Zero.
        } else if (x.e < MIN_EXP) {
          x.c = [x.e = 0];
        }
      }

      return x;
    }


    function valueOf(n) {
      var str,
        e = n.e;

      if (e === null) return n.toString();

      str = coeffToString(n.c);

      str = e <= TO_EXP_NEG || e >= TO_EXP_POS
        ? toExponential(str, e)
        : toFixedPoint(str, e, '0');

      return n.s < 0 ? '-' + str : str;
    }


    // PROTOTYPE/INSTANCE METHODS


    /*
     * Return a new BigNumber whose value is the absolute value of this BigNumber.
     */
    P.absoluteValue = P.abs = function () {
      var x = new BigNumber(this);
      if (x.s < 0) x.s = 1;
      return x;
    };


    /*
     * Return
     *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
     *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
     *   0 if they have the same value,
     *   or null if the value of either is NaN.
     */
    P.comparedTo = function (y, b) {
      return compare(this, new BigNumber(y, b));
    };


    /*
     * If dp is undefined or null or true or false, return the number of decimal places of the
     * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
     *
     * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
     * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
     * ROUNDING_MODE if rm is omitted.
     *
     * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.decimalPlaces = P.dp = function (dp, rm) {
      var c, n, v,
        x = this;

      if (dp != null) {
        intCheck(dp, 0, MAX);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        return round(new BigNumber(x), dp + x.e + 1, rm);
      }

      if (!(c = x.c)) return null;
      n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;

      // Subtract the number of trailing zeros of the last number.
      if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
      if (n < 0) n = 0;

      return n;
    };


    /*
     *  n / 0 = I
     *  n / N = N
     *  n / I = 0
     *  0 / n = 0
     *  0 / 0 = N
     *  0 / N = N
     *  0 / I = 0
     *  N / n = N
     *  N / 0 = N
     *  N / N = N
     *  N / I = N
     *  I / n = I
     *  I / 0 = I
     *  I / N = N
     *  I / I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
     * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P.dividedBy = P.div = function (y, b) {
      return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
    };


    /*
     * Return a new BigNumber whose value is the integer part of dividing the value of this
     * BigNumber by the value of BigNumber(y, b).
     */
    P.dividedToIntegerBy = P.idiv = function (y, b) {
      return div(this, new BigNumber(y, b), 0, 1);
    };


    /*
     * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
     *
     * If m is present, return the result modulo m.
     * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
     * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
     *
     * The modular power operation works efficiently when x, n, and m are integers, otherwise it
     * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
     *
     * n {number|string|BigNumber} The exponent. An integer.
     * [m] {number|string|BigNumber} The modulus.
     *
     * '[BigNumber Error] Exponent not an integer: {n}'
     */
    P.exponentiatedBy = P.pow = function (n, m) {
      var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y,
        x = this;

      n = new BigNumber(n);

      // Allow NaN and ±Infinity, but not other non-integers.
      if (n.c && !n.isInteger()) {
        throw Error
          (bignumberError + 'Exponent not an integer: ' + valueOf(n));
      }

      if (m != null) m = new BigNumber(m);

      // Exponent of MAX_SAFE_INTEGER is 15.
      nIsBig = n.e > 14;

      // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
      if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {

        // The sign of the result of pow when x is negative depends on the evenness of n.
        // If +n overflows to ±Infinity, the evenness of n would be not be known.
        y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
        return m ? y.mod(m) : y;
      }

      nIsNeg = n.s < 0;

      if (m) {

        // x % m returns NaN if abs(m) is zero, or m is NaN.
        if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);

        isModExp = !nIsNeg && x.isInteger() && m.isInteger();

        if (isModExp) x = x.mod(m);

      // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
      // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
      } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0
        // [1, 240000000]
        ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7
        // [80000000000000]  [99999750000000]
        : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {

        // If x is negative and n is odd, k = -0, else k = 0.
        k = x.s < 0 && isOdd(n) ? -0 : 0;

        // If x >= 1, k = ±Infinity.
        if (x.e > -1) k = 1 / k;

        // If n is negative return ±0, else return ±Infinity.
        return new BigNumber(nIsNeg ? 1 / k : k);

      } else if (POW_PRECISION) {

        // Truncating each coefficient array to a length of k after each multiplication
        // equates to truncating significant digits to POW_PRECISION + [28, 41],
        // i.e. there will be a minimum of 28 guard digits retained.
        k = mathceil(POW_PRECISION / LOG_BASE + 2);
      }

      if (nIsBig) {
        half = new BigNumber(0.5);
        if (nIsNeg) n.s = 1;
        nIsOdd = isOdd(n);
      } else {
        i = Math.abs(+valueOf(n));
        nIsOdd = i % 2;
      }

      y = new BigNumber(ONE);

      // Performs 54 loop iterations for n of 9007199254740991.
      for (; ;) {

        if (nIsOdd) {
          y = y.times(x);
          if (!y.c) break;

          if (k) {
            if (y.c.length > k) y.c.length = k;
          } else if (isModExp) {
            y = y.mod(m);    //y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
          }
        }

        if (i) {
          i = mathfloor(i / 2);
          if (i === 0) break;
          nIsOdd = i % 2;
        } else {
          n = n.times(half);
          round(n, n.e + 1, 1);

          if (n.e > 14) {
            nIsOdd = isOdd(n);
          } else {
            i = +valueOf(n);
            if (i === 0) break;
            nIsOdd = i % 2;
          }
        }

        x = x.times(x);

        if (k) {
          if (x.c && x.c.length > k) x.c.length = k;
        } else if (isModExp) {
          x = x.mod(m);    //x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
        }
      }

      if (isModExp) return y;
      if (nIsNeg) y = ONE.div(y);

      return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
     * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
     *
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
     */
    P.integerValue = function (rm) {
      var n = new BigNumber(this);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);
      return round(n, n.e + 1, rm);
    };


    /*
     * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isEqualTo = P.eq = function (y, b) {
      return compare(this, new BigNumber(y, b)) === 0;
    };


    /*
     * Return true if the value of this BigNumber is a finite number, otherwise return false.
     */
    P.isFinite = function () {
      return !!this.c;
    };


    /*
     * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isGreaterThan = P.gt = function (y, b) {
      return compare(this, new BigNumber(y, b)) > 0;
    };


    /*
     * Return true if the value of this BigNumber is greater than or equal to the value of
     * BigNumber(y, b), otherwise return false.
     */
    P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
      return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;

    };


    /*
     * Return true if the value of this BigNumber is an integer, otherwise return false.
     */
    P.isInteger = function () {
      return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
    };


    /*
     * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isLessThan = P.lt = function (y, b) {
      return compare(this, new BigNumber(y, b)) < 0;
    };


    /*
     * Return true if the value of this BigNumber is less than or equal to the value of
     * BigNumber(y, b), otherwise return false.
     */
    P.isLessThanOrEqualTo = P.lte = function (y, b) {
      return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
    };


    /*
     * Return true if the value of this BigNumber is NaN, otherwise return false.
     */
    P.isNaN = function () {
      return !this.s;
    };


    /*
     * Return true if the value of this BigNumber is negative, otherwise return false.
     */
    P.isNegative = function () {
      return this.s < 0;
    };


    /*
     * Return true if the value of this BigNumber is positive, otherwise return false.
     */
    P.isPositive = function () {
      return this.s > 0;
    };


    /*
     * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
     */
    P.isZero = function () {
      return !!this.c && this.c[0] == 0;
    };


    /*
     *  n - 0 = n
     *  n - N = N
     *  n - I = -I
     *  0 - n = -n
     *  0 - 0 = 0
     *  0 - N = N
     *  0 - I = -I
     *  N - n = N
     *  N - 0 = N
     *  N - N = N
     *  N - I = N
     *  I - n = I
     *  I - 0 = I
     *  I - N = N
     *  I - I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber minus the value of
     * BigNumber(y, b).
     */
    P.minus = function (y, b) {
      var i, j, t, xLTy,
        x = this,
        a = x.s;

      y = new BigNumber(y, b);
      b = y.s;

      // Either NaN?
      if (!a || !b) return new BigNumber(NaN);

      // Signs differ?
      if (a != b) {
        y.s = -b;
        return x.plus(y);
      }

      var xe = x.e / LOG_BASE,
        ye = y.e / LOG_BASE,
        xc = x.c,
        yc = y.c;

      if (!xe || !ye) {

        // Either Infinity?
        if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);

        // Either zero?
        if (!xc[0] || !yc[0]) {

          // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
          return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x :

           // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
           ROUNDING_MODE == 3 ? -0 : 0);
        }
      }

      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();

      // Determine which is the bigger number.
      if (a = xe - ye) {

        if (xLTy = a < 0) {
          a = -a;
          t = xc;
        } else {
          ye = xe;
          t = yc;
        }

        t.reverse();

        // Prepend zeros to equalise exponents.
        for (b = a; b--; t.push(0));
        t.reverse();
      } else {

        // Exponents equal. Check digit by digit.
        j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;

        for (a = b = 0; b < j; b++) {

          if (xc[b] != yc[b]) {
            xLTy = xc[b] < yc[b];
            break;
          }
        }
      }

      // x < y? Point xc to the array of the bigger number.
      if (xLTy) {
        t = xc;
        xc = yc;
        yc = t;
        y.s = -y.s;
      }

      b = (j = yc.length) - (i = xc.length);

      // Append zeros to xc if shorter.
      // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
      if (b > 0) for (; b--; xc[i++] = 0);
      b = BASE - 1;

      // Subtract yc from xc.
      for (; j > a;) {

        if (xc[--j] < yc[j]) {
          for (i = j; i && !xc[--i]; xc[i] = b);
          --xc[i];
          xc[j] += BASE;
        }

        xc[j] -= yc[j];
      }

      // Remove leading zeros and adjust exponent accordingly.
      for (; xc[0] == 0; xc.splice(0, 1), --ye);

      // Zero?
      if (!xc[0]) {

        // Following IEEE 754 (2008) 6.3,
        // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
        y.s = ROUNDING_MODE == 3 ? -1 : 1;
        y.c = [y.e = 0];
        return y;
      }

      // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
      // for finite x and y.
      return normalise(y, xc, ye);
    };


    /*
     *   n % 0 =  N
     *   n % N =  N
     *   n % I =  n
     *   0 % n =  0
     *  -0 % n = -0
     *   0 % 0 =  N
     *   0 % N =  N
     *   0 % I =  0
     *   N % n =  N
     *   N % 0 =  N
     *   N % N =  N
     *   N % I =  N
     *   I % n =  N
     *   I % 0 =  N
     *   I % N =  N
     *   I % I =  N
     *
     * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
     * BigNumber(y, b). The result depends on the value of MODULO_MODE.
     */
    P.modulo = P.mod = function (y, b) {
      var q, s,
        x = this;

      y = new BigNumber(y, b);

      // Return NaN if x is Infinity or NaN, or y is NaN or zero.
      if (!x.c || !y.s || y.c && !y.c[0]) {
        return new BigNumber(NaN);

      // Return x if y is Infinity or x is zero.
      } else if (!y.c || x.c && !x.c[0]) {
        return new BigNumber(x);
      }

      if (MODULO_MODE == 9) {

        // Euclidian division: q = sign(y) * floor(x / abs(y))
        // r = x - qy    where  0 <= r < abs(y)
        s = y.s;
        y.s = 1;
        q = div(x, y, 0, 3);
        y.s = s;
        q.s *= s;
      } else {
        q = div(x, y, 0, MODULO_MODE);
      }

      y = x.minus(q.times(y));

      // To match JavaScript %, ensure sign of zero is sign of dividend.
      if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;

      return y;
    };


    /*
     *  n * 0 = 0
     *  n * N = N
     *  n * I = I
     *  0 * n = 0
     *  0 * 0 = 0
     *  0 * N = N
     *  0 * I = N
     *  N * n = N
     *  N * 0 = N
     *  N * N = N
     *  N * I = N
     *  I * n = I
     *  I * 0 = N
     *  I * N = N
     *  I * I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
     * of BigNumber(y, b).
     */
    P.multipliedBy = P.times = function (y, b) {
      var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
        base, sqrtBase,
        x = this,
        xc = x.c,
        yc = (y = new BigNumber(y, b)).c;

      // Either NaN, ±Infinity or ±0?
      if (!xc || !yc || !xc[0] || !yc[0]) {

        // Return NaN if either is NaN, or one is 0 and the other is Infinity.
        if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
          y.c = y.e = y.s = null;
        } else {
          y.s *= x.s;

          // Return ±Infinity if either is ±Infinity.
          if (!xc || !yc) {
            y.c = y.e = null;

          // Return ±0 if either is ±0.
          } else {
            y.c = [0];
            y.e = 0;
          }
        }

        return y;
      }

      e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
      y.s *= x.s;
      xcL = xc.length;
      ycL = yc.length;

      // Ensure xc points to longer array and xcL to its length.
      if (xcL < ycL) {
        zc = xc;
        xc = yc;
        yc = zc;
        i = xcL;
        xcL = ycL;
        ycL = i;
      }

      // Initialise the result array with zeros.
      for (i = xcL + ycL, zc = []; i--; zc.push(0));

      base = BASE;
      sqrtBase = SQRT_BASE;

      for (i = ycL; --i >= 0;) {
        c = 0;
        ylo = yc[i] % sqrtBase;
        yhi = yc[i] / sqrtBase | 0;

        for (k = xcL, j = i + k; j > i;) {
          xlo = xc[--k] % sqrtBase;
          xhi = xc[k] / sqrtBase | 0;
          m = yhi * xlo + xhi * ylo;
          xlo = ylo * xlo + ((m % sqrtBase) * sqrtBase) + zc[j] + c;
          c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
          zc[j--] = xlo % base;
        }

        zc[j] = c;
      }

      if (c) {
        ++e;
      } else {
        zc.splice(0, 1);
      }

      return normalise(y, zc, e);
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber negated,
     * i.e. multiplied by -1.
     */
    P.negated = function () {
      var x = new BigNumber(this);
      x.s = -x.s || null;
      return x;
    };


    /*
     *  n + 0 = n
     *  n + N = N
     *  n + I = I
     *  0 + n = n
     *  0 + 0 = 0
     *  0 + N = N
     *  0 + I = I
     *  N + n = N
     *  N + 0 = N
     *  N + N = N
     *  N + I = N
     *  I + n = I
     *  I + 0 = I
     *  I + N = N
     *  I + I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber plus the value of
     * BigNumber(y, b).
     */
    P.plus = function (y, b) {
      var t,
        x = this,
        a = x.s;

      y = new BigNumber(y, b);
      b = y.s;

      // Either NaN?
      if (!a || !b) return new BigNumber(NaN);

      // Signs differ?
       if (a != b) {
        y.s = -b;
        return x.minus(y);
      }

      var xe = x.e / LOG_BASE,
        ye = y.e / LOG_BASE,
        xc = x.c,
        yc = y.c;

      if (!xe || !ye) {

        // Return ±Infinity if either ±Infinity.
        if (!xc || !yc) return new BigNumber(a / 0);

        // Either zero?
        // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
        if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
      }

      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();

      // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
      if (a = xe - ye) {
        if (a > 0) {
          ye = xe;
          t = yc;
        } else {
          a = -a;
          t = xc;
        }

        t.reverse();
        for (; a--; t.push(0));
        t.reverse();
      }

      a = xc.length;
      b = yc.length;

      // Point xc to the longer array, and b to the shorter length.
      if (a - b < 0) {
        t = yc;
        yc = xc;
        xc = t;
        b = a;
      }

      // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
      for (a = 0; b;) {
        a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
        xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
      }

      if (a) {
        xc = [a].concat(xc);
        ++ye;
      }

      // No need to check for zero, as +x + +y != 0 && -x + -y != 0
      // ye = MAX_EXP + 1 possible
      return normalise(y, xc, ye);
    };


    /*
     * If sd is undefined or null or true or false, return the number of significant digits of
     * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
     * If sd is true include integer-part trailing zeros in the count.
     *
     * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
     * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
     * ROUNDING_MODE if rm is omitted.
     *
     * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
     *                     boolean: whether to count integer-part trailing zeros: true or false.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
     */
    P.precision = P.sd = function (sd, rm) {
      var c, n, v,
        x = this;

      if (sd != null && sd !== !!sd) {
        intCheck(sd, 1, MAX);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        return round(new BigNumber(x), sd, rm);
      }

      if (!(c = x.c)) return null;
      v = c.length - 1;
      n = v * LOG_BASE + 1;

      if (v = c[v]) {

        // Subtract the number of trailing zeros of the last element.
        for (; v % 10 == 0; v /= 10, n--);

        // Add the number of digits of the first element.
        for (v = c[0]; v >= 10; v /= 10, n++);
      }

      if (sd && x.e + 1 > n) n = x.e + 1;

      return n;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
     * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
     *
     * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
     */
    P.shiftedBy = function (k) {
      intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
      return this.times('1e' + k);
    };


    /*
     *  sqrt(-n) =  N
     *  sqrt(N) =  N
     *  sqrt(-I) =  N
     *  sqrt(I) =  I
     *  sqrt(0) =  0
     *  sqrt(-0) = -0
     *
     * Return a new BigNumber whose value is the square root of the value of this BigNumber,
     * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P.squareRoot = P.sqrt = function () {
      var m, n, r, rep, t,
        x = this,
        c = x.c,
        s = x.s,
        e = x.e,
        dp = DECIMAL_PLACES + 4,
        half = new BigNumber('0.5');

      // Negative/NaN/Infinity/zero?
      if (s !== 1 || !c || !c[0]) {
        return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
      }

      // Initial estimate.
      s = Math.sqrt(+valueOf(x));

      // Math.sqrt underflow/overflow?
      // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
      if (s == 0 || s == 1 / 0) {
        n = coeffToString(c);
        if ((n.length + e) % 2 == 0) n += '0';
        s = Math.sqrt(+n);
        e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);

        if (s == 1 / 0) {
          n = '5e' + e;
        } else {
          n = s.toExponential();
          n = n.slice(0, n.indexOf('e') + 1) + e;
        }

        r = new BigNumber(n);
      } else {
        r = new BigNumber(s + '');
      }

      // Check for zero.
      // r could be zero if MIN_EXP is changed after the this value was created.
      // This would cause a division by zero (x/t) and hence Infinity below, which would cause
      // coeffToString to throw.
      if (r.c[0]) {
        e = r.e;
        s = e + dp;
        if (s < 3) s = 0;

        // Newton-Raphson iteration.
        for (; ;) {
          t = r;
          r = half.times(t.plus(div(x, t, dp, 1)));

          if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {

            // The exponent of r may here be one less than the final result exponent,
            // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
            // are indexed correctly.
            if (r.e < e) --s;
            n = n.slice(s - 3, s + 1);

            // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
            // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
            // iteration.
            if (n == '9999' || !rep && n == '4999') {

              // On the first iteration only, check to see if rounding up gives the
              // exact result as the nines may infinitely repeat.
              if (!rep) {
                round(t, t.e + DECIMAL_PLACES + 2, 0);

                if (t.times(t).eq(x)) {
                  r = t;
                  break;
                }
              }

              dp += 4;
              s += 4;
              rep = 1;
            } else {

              // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
              // result. If not, then there are further digits and m will be truthy.
              if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

                // Truncate to the first rounding digit.
                round(r, r.e + DECIMAL_PLACES + 2, 1);
                m = !r.times(r).eq(x);
              }

              break;
            }
          }
        }
      }

      return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
    };


    /*
     * Return a string representing the value of this BigNumber in exponential notation and
     * rounded using ROUNDING_MODE to dp fixed decimal places.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.toExponential = function (dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp++;
      }
      return format(this, dp, rm, 1);
    };


    /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounding
     * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
     *
     * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
     * but e.g. (-0.00001).toFixed(0) is '-0'.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.toFixed = function (dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp = dp + this.e + 1;
      }
      return format(this, dp, rm);
    };


    /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounded
     * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
     * of the format or FORMAT object (see BigNumber.set).
     *
     * The formatting object may contain some or all of the properties shown below.
     *
     * FORMAT = {
     *   prefix: '',
     *   groupSize: 3,
     *   secondaryGroupSize: 0,
     *   groupSeparator: ',',
     *   decimalSeparator: '.',
     *   fractionGroupSize: 0,
     *   fractionGroupSeparator: '\xA0',      // non-breaking space
     *   suffix: ''
     * };
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     * [format] {object} Formatting options. See FORMAT pbject above.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     * '[BigNumber Error] Argument not an object: {format}'
     */
    P.toFormat = function (dp, rm, format) {
      var str,
        x = this;

      if (format == null) {
        if (dp != null && rm && typeof rm == 'object') {
          format = rm;
          rm = null;
        } else if (dp && typeof dp == 'object') {
          format = dp;
          dp = rm = null;
        } else {
          format = FORMAT;
        }
      } else if (typeof format != 'object') {
        throw Error
          (bignumberError + 'Argument not an object: ' + format);
      }

      str = x.toFixed(dp, rm);

      if (x.c) {
        var i,
          arr = str.split('.'),
          g1 = +format.groupSize,
          g2 = +format.secondaryGroupSize,
          groupSeparator = format.groupSeparator || '',
          intPart = arr[0],
          fractionPart = arr[1],
          isNeg = x.s < 0,
          intDigits = isNeg ? intPart.slice(1) : intPart,
          len = intDigits.length;

        if (g2) {
          i = g1;
          g1 = g2;
          g2 = i;
          len -= i;
        }

        if (g1 > 0 && len > 0) {
          i = len % g1 || g1;
          intPart = intDigits.substr(0, i);
          for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
          if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
          if (isNeg) intPart = '-' + intPart;
        }

        str = fractionPart
         ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize)
          ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'),
           '$&' + (format.fractionGroupSeparator || ''))
          : fractionPart)
         : intPart;
      }

      return (format.prefix || '') + str + (format.suffix || '');
    };


    /*
     * Return an array of two BigNumbers representing the value of this BigNumber as a simple
     * fraction with an integer numerator and an integer denominator.
     * The denominator will be a positive non-zero value less than or equal to the specified
     * maximum denominator. If a maximum denominator is not specified, the denominator will be
     * the lowest value necessary to represent the number exactly.
     *
     * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
     *
     * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
     */
    P.toFraction = function (md) {
      var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s,
        x = this,
        xc = x.c;

      if (md != null) {
        n = new BigNumber(md);

        // Throw if md is less than one or is not an integer, unless it is Infinity.
        if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
          throw Error
            (bignumberError + 'Argument ' +
              (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n));
        }
      }

      if (!xc) return new BigNumber(x);

      d = new BigNumber(ONE);
      n1 = d0 = new BigNumber(ONE);
      d1 = n0 = new BigNumber(ONE);
      s = coeffToString(xc);

      // Determine initial denominator.
      // d is a power of 10 and the minimum max denominator that specifies the value exactly.
      e = d.e = s.length - x.e - 1;
      d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
      md = !md || n.comparedTo(d) > 0 ? (e > 0 ? d : n1) : n;

      exp = MAX_EXP;
      MAX_EXP = 1 / 0;
      n = new BigNumber(s);

      // n0 = d1 = 0
      n0.c[0] = 0;

      for (; ;)  {
        q = div(n, d, 0, 1);
        d2 = d0.plus(q.times(d1));
        if (d2.comparedTo(md) == 1) break;
        d0 = d1;
        d1 = d2;
        n1 = n0.plus(q.times(d2 = n1));
        n0 = d2;
        d = n.minus(q.times(d2 = d));
        n = d2;
      }

      d2 = div(md.minus(d0), d1, 0, 1);
      n0 = n0.plus(d2.times(n1));
      d0 = d0.plus(d2.times(d1));
      n0.s = n1.s = x.s;
      e = e * 2;

      // Determine which fraction is closer to x, n0/d0 or n1/d1
      r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
          div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];

      MAX_EXP = exp;

      return r;
    };


    /*
     * Return the value of this BigNumber converted to a number primitive.
     */
    P.toNumber = function () {
      return +valueOf(this);
    };


    /*
     * Return a string representing the value of this BigNumber rounded to sd significant digits
     * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
     * necessary to represent the integer part of the value in fixed-point notation, then use
     * exponential notation.
     *
     * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
     */
    P.toPrecision = function (sd, rm) {
      if (sd != null) intCheck(sd, 1, MAX);
      return format(this, sd, rm, 2);
    };


    /*
     * Return a string representing the value of this BigNumber in base b, or base 10 if b is
     * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
     * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
     * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
     * TO_EXP_NEG, return exponential notation.
     *
     * [b] {number} Integer, 2 to ALPHABET.length inclusive.
     *
     * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
     */
    P.toString = function (b) {
      var str,
        n = this,
        s = n.s,
        e = n.e;

      // Infinity or NaN?
      if (e === null) {
        if (s) {
          str = 'Infinity';
          if (s < 0) str = '-' + str;
        } else {
          str = 'NaN';
        }
      } else {
        if (b == null) {
          str = e <= TO_EXP_NEG || e >= TO_EXP_POS
           ? toExponential(coeffToString(n.c), e)
           : toFixedPoint(coeffToString(n.c), e, '0');
        } else if (b === 10 && alphabetHasNormalDecimalDigits) {
          n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
          str = toFixedPoint(coeffToString(n.c), n.e, '0');
        } else {
          intCheck(b, 2, ALPHABET.length, 'Base');
          str = convertBase(toFixedPoint(coeffToString(n.c), e, '0'), 10, b, s, true);
        }

        if (s < 0 && n.c[0]) str = '-' + str;
      }

      return str;
    };


    /*
     * Return as toString, but do not accept a base argument, and include the minus sign for
     * negative zero.
     */
    P.valueOf = P.toJSON = function () {
      return valueOf(this);
    };


    P._isBigNumber = true;

    if (configObject != null) BigNumber.set(configObject);

    return BigNumber;
  }


  // PRIVATE HELPER FUNCTIONS

  // These functions don't need access to variables,
  // e.g. DECIMAL_PLACES, in the scope of the `clone` function above.


  function bitFloor(n) {
    var i = n | 0;
    return n > 0 || n === i ? i : i - 1;
  }


  // Return a coefficient array as a string of base 10 digits.
  function coeffToString(a) {
    var s, z,
      i = 1,
      j = a.length,
      r = a[0] + '';

    for (; i < j;) {
      s = a[i++] + '';
      z = LOG_BASE - s.length;
      for (; z--; s = '0' + s);
      r += s;
    }

    // Determine trailing zeros.
    for (j = r.length; r.charCodeAt(--j) === 48;);

    return r.slice(0, j + 1 || 1);
  }


  // Compare the value of BigNumbers x and y.
  function compare(x, y) {
    var a, b,
      xc = x.c,
      yc = y.c,
      i = x.s,
      j = y.s,
      k = x.e,
      l = y.e;

    // Either NaN?
    if (!i || !j) return null;

    a = xc && !xc[0];
    b = yc && !yc[0];

    // Either zero?
    if (a || b) return a ? b ? 0 : -j : i;

    // Signs differ?
    if (i != j) return i;

    a = i < 0;
    b = k == l;

    // Either Infinity?
    if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;

    // Compare exponents.
    if (!b) return k > l ^ a ? 1 : -1;

    j = (k = xc.length) < (l = yc.length) ? k : l;

    // Compare digit by digit.
    for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;

    // Compare lengths.
    return k == l ? 0 : k > l ^ a ? 1 : -1;
  }


  /*
   * Check that n is a primitive number, an integer, and in range, otherwise throw.
   */
  function intCheck(n, min, max, name) {
    if (n < min || n > max || n !== mathfloor(n)) {
      throw Error
       (bignumberError + (name || 'Argument') + (typeof n == 'number'
         ? n < min || n > max ? ' out of range: ' : ' not an integer: '
         : ' not a primitive number: ') + String(n));
    }
  }


  // Assumes finite n.
  function isOdd(n) {
    var k = n.c.length - 1;
    return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
  }


  function toExponential(str, e) {
    return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) +
     (e < 0 ? 'e' : 'e+') + e;
  }


  function toFixedPoint(str, e, z) {
    var len, zs;

    // Negative exponent?
    if (e < 0) {

      // Prepend zeros.
      for (zs = z + '.'; ++e; zs += z);
      str = zs + str;

    // Positive exponent
    } else {
      len = str.length;

      // Append zeros.
      if (++e > len) {
        for (zs = z, e -= len; --e; zs += z);
        str += zs;
      } else if (e < len) {
        str = str.slice(0, e) + '.' + str.slice(e);
      }
    }

    return str;
  }


  // EXPORT


  BigNumber = clone();
  BigNumber['default'] = BigNumber.BigNumber = BigNumber;

  // AMD.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () { return BigNumber; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

  // Node.js and other environments that support module.exports.
  } else {}
})(this);


/***/ }),

/***/ "./src/ts/SaveHandler/SaveHandler.ts":
/*!*******************************************!*\
  !*** ./src/ts/SaveHandler/SaveHandler.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SaveHandler = void 0;
const Logger_1 = __webpack_require__(/*! ../utils/Logger */ "./src/ts/utils/Logger.ts");
const Settings_1 = __webpack_require__(/*! ../utils/Settings */ "./src/ts/utils/Settings.ts");
class SaveHandler {
    static loadData() {
        Logger_1.Logger.log("SaveHandler", "Loading save file...");
        let data = localStorage.getItem("saveFile");
        if (data === null) {
            Logger_1.Logger.log("SaveHandler", "No save data found!");
            return false;
        }
        this.save = JSON.parse(this.decode(data));
        return true;
    }
    static saveData() {
        let data = this.encode(JSON.stringify(this.save));
        localStorage.setItem("saveFile", data);
    }
    static getData() {
        return this.save;
    }
    static initialize() {
        Logger_1.Logger.log("SaveHandler", "Initializing new save file...");
        this.save = {
            settings: Settings_1.Settings.default(),
        };
        this.saveData();
        return this.save;
    }
    static encode(data) {
        Logger_1.Logger.log("SaveHandler", "Encoding save data...");
        return data;
    }
    static decode(data) {
        Logger_1.Logger.log("SaveHandler", "Decoding save data...");
        return data;
    }
}
exports.SaveHandler = SaveHandler;


/***/ }),

/***/ "./src/ts/game_logic/Currencies.ts":
/*!*****************************************!*\
  !*** ./src/ts/game_logic/Currencies.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Currencies = void 0;
const ResourceGainHandler_1 = __webpack_require__(/*! ../ui/ResourceGainHandler */ "./src/ts/ui/ResourceGainHandler.ts");
const Currencies_1 = __webpack_require__(/*! ../ui/Currencies */ "./src/ts/ui/Currencies.ts");
const bignumber_js_1 = __webpack_require__(/*! bignumber.js */ "./node_modules/bignumber.js/bignumber.js");
class Currencies {
    static initialize() {
        Currencies_1.Currencies.registerCurrency("currency-electron", "leptons-electron");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Lepton, flavor: ResourceGainHandler_1.ParticleFlavor.Electron, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "leptons-electron"
        });
        Currencies_1.Currencies.registerCurrency("currency-muon", "leptons-muon");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Lepton, flavor: ResourceGainHandler_1.ParticleFlavor.Electron, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "leptons-muon"
        });
        Currencies_1.Currencies.registerCurrency("currency-taus", "leptons-tau");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Lepton, flavor: ResourceGainHandler_1.ParticleFlavor.Electron, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "leptons-tau"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-up-red", "quarks-up-red");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Up, color: ResourceGainHandler_1.ParticleColor.Red, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-up-red"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-up-green", "quarks-up-green");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Up, color: ResourceGainHandler_1.ParticleColor.Green, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-up-green"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-up-blue", "quarks-up-blue");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Up, color: ResourceGainHandler_1.ParticleColor.Blue, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-up-blue"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-up-rgb", "quarks-up-rgb");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Up, color: ResourceGainHandler_1.ParticleColor.RGB, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-up-rgb"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-up", "quarks-up", ["quarks-up-red", "quarks-up-green", "quarks-up-blue"]);
        Currencies_1.Currencies.registerCurrency("currency-quarks-down-red", "quarks-down-red");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Down, color: ResourceGainHandler_1.ParticleColor.Red, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-down-red"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-down-green", "quarks-down-green");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Down, color: ResourceGainHandler_1.ParticleColor.Green, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-down-green"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-down-blue", "quarks-down-blue");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Down, color: ResourceGainHandler_1.ParticleColor.Blue, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-down-blue"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-down-rgb", "quarks-down-rgb");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Down, color: ResourceGainHandler_1.ParticleColor.RGB, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-down-rgb"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-down", "quarks-down", ["quarks-down-red", "quarks-down-green", "quarks-down-blue"]);
        Currencies_1.Currencies.registerCurrency("currency-quarks-strange-red", "quarks-strange-red");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Strange, color: ResourceGainHandler_1.ParticleColor.Red, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-strange-red"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-strange-green", "quarks-strange-green");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Strange, color: ResourceGainHandler_1.ParticleColor.Green, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-strange-green"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-strange-blue", "quarks-strange-blue");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Strange, color: ResourceGainHandler_1.ParticleColor.Blue, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-strange-blue"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-strange-rgb", "quarks-strange-rgb");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Strange, color: ResourceGainHandler_1.ParticleColor.RGB, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-strange-rgb"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-strange", "quarks-strange", ["quarks-strange-red", "quarks-strange-green", "quarks-strange-blue"]);
        Currencies_1.Currencies.registerCurrency("currency-quarks-charm-red", "quarks-charm-red");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Charm, color: ResourceGainHandler_1.ParticleColor.Red, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-charm-red"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-charm-green", "quarks-charm-green");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Charm, color: ResourceGainHandler_1.ParticleColor.Green, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-charm-green"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-charm-blue", "quarks-charm-blue");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Charm, color: ResourceGainHandler_1.ParticleColor.Blue, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-charm-blue"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-charm-rgb", "quarks-charm-rgb");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Charm, color: ResourceGainHandler_1.ParticleColor.RGB, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-charm-rgb"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-charm", "quarks-charm", ["quarks-charm-red", "quarks-charm-green", "quarks-charm-blue"]);
        Currencies_1.Currencies.registerCurrency("currency-quarks-top-red", "quarks-top-red");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Top, color: ResourceGainHandler_1.ParticleColor.Red, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-top-red"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-top-green", "quarks-top-green");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Top, color: ResourceGainHandler_1.ParticleColor.Green, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-top-green"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-top-blue", "quarks-top-blue");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Top, color: ResourceGainHandler_1.ParticleColor.Blue, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-top-blue"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-top-rgb", "quarks-top-rgb");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Top, color: ResourceGainHandler_1.ParticleColor.RGB, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-top-rgb"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-top", "quarks-top", ["quarks-top-red", "quarks-top-green", "quarks-top-blue"]);
        Currencies_1.Currencies.registerCurrency("currency-quarks-bottom-red", "quarks-bottom-red");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Bottom, color: ResourceGainHandler_1.ParticleColor.Red, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-bottom-red"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-bottom-green", "quarks-bottom-green");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Bottom, color: ResourceGainHandler_1.ParticleColor.Green, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-bottom-green"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-bottom-blue", "quarks-bottom-blue");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Bottom, color: ResourceGainHandler_1.ParticleColor.Blue, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-bottom-blue"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-bottom-rgb", "quarks-bottom-rgb");
        this.particles.push({
            type: ResourceGainHandler_1.ParticleType.Quark, flavor: ResourceGainHandler_1.ParticleFlavor.Bottom, color: ResourceGainHandler_1.ParticleColor.RGB, amount: new bignumber_js_1.BigNumber(0), reflection: "particle", hash: "quarks-bottom-rgb"
        });
        Currencies_1.Currencies.registerCurrency("currency-quarks-bottom", "quarks-bottom", ["quarks-bottom-red", "quarks-bottom-green", "quarks-bottom-blue"]);
    }
    static gainResource(resource) {
        switch (resource.reflection) {
            case "particle":
                let r = resource;
                let i = this.particles.findIndex(p => p.hash === r.hash);
                if (i > -1) {
                    this.particles[i].amount = r.amount.plus(this.particles[i].amount);
                }
                break;
        }
    }
}
exports.Currencies = Currencies;
Currencies.particles = [];


/***/ }),

/***/ "./src/ts/i18n/i18n.ts":
/*!*****************************!*\
  !*** ./src/ts/i18n/i18n.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.translations = void 0;
exports.translations = {
    "en": {
        settings: {
            general: {
                title: "General settings",
                noTabHistory: {
                    name: "Disable tab history",
                    description: "Doesn't save changing between tabs in the browser history, so the back button leaves this page instead"
                },
                language: {
                    name: "Language",
                    description: ""
                },
            },
            gameplay: {
                title: "Gameplay settings",
                noOfflineTime: {
                    name: "Disable offline time",
                    description: ""
                },
            },
            display: {
                title: "Display settings",
                darkNavigation: {
                    name: "Dark header & footer",
                    description: "Changes the color of header & footer to be the same as the theme background color"
                },
                stillFields: {
                    name: "Still Quantum Fields",
                    description: "Prevents the quantum fields from fluctuating visually unless clicked manually. You will still gain the resources"
                }
            },
            debug: {
                title: "Debug settings",
                logging: {
                    name: "Enable logging",
                    description: ""
                },
                verbose: {
                    name: "Verbose logging",
                    description: ""
                },
            },
        },
        ui: {
            header: {},
            footer: {
                fermions: "Fermions",
                generations: {
                    first: "Generation I",
                    second: "Generation II",
                    third: "Generation III",
                },
                quarks: {
                    up: {
                        name: "Up Quarks",
                        flavorText: "",
                    },
                    down: {
                        name: "Down Quarks",
                        flavorText: "",
                    },
                    charm: {
                        name: "Charm Quarks",
                        flavorText: "",
                    },
                    strange: {
                        name: "Strange Quarks",
                        flavorText: "",
                    },
                    top: {
                        name: "Top Quarks",
                        flavorText: "",
                    },
                    bottom: {
                        name: "Bottom Quarks",
                        flavorText: "",
                    },
                },
                leptons: {
                    electron: {
                        name: "Electrons",
                        flavorText: "",
                    },
                    muon: {
                        name: "Muons",
                        flavorText: "",
                    },
                    tau: {
                        name: "Taus",
                        flavorText: "",
                    },
                },
                bosons: {
                    name: "Bosons",
                    higgs: {
                        name: "Higgs Bosons",
                        flavorText: "",
                    },
                    gluon: {
                        name: "Gluons",
                        flavorText: "",
                    },
                    photon: {
                        name: "Photons",
                        flavorText: "",
                    },
                    w_plus: {
                        name: "W⁺ Bosons",
                        flavorText: "",
                    },
                    w_minus: {
                        name: "W⁻ Bosons",
                        flavorText: "",
                    },
                    z: {
                        name: "Z⁰ Bosons",
                        flavorText: "",
                    },
                }
            }
        }
    }
};


/***/ }),

/***/ "./src/ts/main.ts":
/*!************************!*\
  !*** ./src/ts/main.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.main = void 0;
const QuantumFieldElement_1 = __webpack_require__(/*! ./ui/custom_elements/QuantumFieldElement */ "./src/ts/ui/custom_elements/QuantumFieldElement.ts");
const TranslatedElement_1 = __webpack_require__(/*! ./ui/custom_elements/TranslatedElement */ "./src/ts/ui/custom_elements/TranslatedElement.ts");
const SaveHandler_1 = __webpack_require__(/*! ./SaveHandler/SaveHandler */ "./src/ts/SaveHandler/SaveHandler.ts");
const Settings_1 = __webpack_require__(/*! ./utils/Settings */ "./src/ts/utils/Settings.ts");
const ToolTip_1 = __webpack_require__(/*! ./ui/custom_elements/ToolTip */ "./src/ts/ui/custom_elements/ToolTip.ts");
const ResourceGainElement_1 = __webpack_require__(/*! ./ui/custom_elements/ResourceGainElement */ "./src/ts/ui/custom_elements/ResourceGainElement.ts");
const ResourceGainHandler_1 = __webpack_require__(/*! ./ui/ResourceGainHandler */ "./src/ts/ui/ResourceGainHandler.ts");
const bignumber_js_1 = __webpack_require__(/*! bignumber.js */ "./node_modules/bignumber.js/bignumber.js");
const UI_1 = __webpack_require__(/*! ./ui/UI */ "./src/ts/ui/UI.ts");
const Currencies_1 = __webpack_require__(/*! ./game_logic/Currencies */ "./src/ts/game_logic/Currencies.ts");
const main = () => {
    bignumber_js_1.BigNumber.config({ EXPONENTIAL_AT: 6, DECIMAL_PLACES: 1, ROUNDING_MODE: bignumber_js_1.BigNumber.ROUND_FLOOR });
    if (!SaveHandler_1.SaveHandler.loadData()) {
        SaveHandler_1.SaveHandler.initialize();
    }
    let data = SaveHandler_1.SaveHandler.getData();
    Settings_1.Settings.set(data.settings);
    customElements.define("translated-string", TranslatedElement_1.TranslatedElement);
    customElements.define("quantum-field", QuantumFieldElement_1.QuantumFieldElement);
    customElements.define("resource-gain", ResourceGainElement_1.ResourceGainElement);
    customElements.define("tool-tip", ToolTip_1.ToolTip);
    let mainContainer = document.getElementById("main");
    ResourceGainHandler_1.ResourceGainHandler.initialize("resource-gain-container");
    let fields = document.getElementsByTagName("quantum-field");
    for (let i = 0; i < fields.length; i++) {
        fields[i].addEventListener("ripple", function (e) {
            if (e.detail.manual && JSON.stringify(e.detail.particle)) {
                ResourceGainHandler_1.ResourceGainHandler.gainResource(ResourceGainHandler_1.ResourceGainHandler.getParticleResourceFromField(e.detail.particle, new bignumber_js_1.BigNumber("3847")), (e.detail.x - 10), (e.detail.y + 100));
            }
        });
    }
    Currencies_1.Currencies.initialize();
    window.requestAnimationFrame(UI_1.UI.animate);
    document.getElementsByTagName("body")[0].classList.remove("loading");
};
exports.main = main;


/***/ }),

/***/ "./src/ts/numbers/numbers.ts":
/*!***********************************!*\
  !*** ./src/ts/numbers/numbers.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Numbers = void 0;
const bignumber_js_1 = __webpack_require__(/*! bignumber.js */ "./node_modules/bignumber.js/bignumber.js");
var Numbers;
(function (Numbers) {
    Numbers.getFormatted = (num) => {
        if (num.toString().includes("e")) {
            let ret;
            let parts = num.toString().replace("+", "").split("e");
            parts[0] = parts[0].slice(0, 4);
            return parts.join("e");
        }
        else {
            return num.toString();
        }
    };
    Numbers.getFormattedFromString = (num) => {
        return Numbers.getFormatted((0, bignumber_js_1.BigNumber)(num));
    };
})(Numbers || (exports.Numbers = Numbers = {}));


/***/ }),

/***/ "./src/ts/ui/Currencies.ts":
/*!*********************************!*\
  !*** ./src/ts/ui/Currencies.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Currencies = void 0;
const Currencies_1 = __webpack_require__(/*! ../game_logic/Currencies */ "./src/ts/game_logic/Currencies.ts");
const numbers_1 = __webpack_require__(/*! ../numbers/numbers */ "./src/ts/numbers/numbers.ts");
const bignumber_js_1 = __webpack_require__(/*! bignumber.js */ "./node_modules/bignumber.js/bignumber.js");
class Currencies {
    static registerCurrency(element, id, consolidation = undefined) {
        this.currencies.push({
            element: document.querySelector(`#${element} span`),
            id,
            consolidation
        });
    }
    static updateCurrencies() {
        for (let currency of this.currencies) {
            if (currency.element) {
                if (currency.consolidation) {
                    let amount = new bignumber_js_1.BigNumber(0);
                    for (let r of currency.consolidation) {
                        let found = Currencies_1.Currencies.particles.find((p => p.hash === r));
                        if (found) {
                            amount = amount.plus(found.amount);
                        }
                    }
                    currency.element.innerText = numbers_1.Numbers.getFormatted(amount);
                }
                else {
                    currency.element.innerText = numbers_1.Numbers.getFormatted(Currencies_1.Currencies.particles.find((p => p.hash === currency.id)).amount);
                }
            }
        }
    }
}
exports.Currencies = Currencies;
Currencies.currencies = [];


/***/ }),

/***/ "./src/ts/ui/ResourceGainHandler.ts":
/*!******************************************!*\
  !*** ./src/ts/ui/ResourceGainHandler.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ParticleColor = exports.ParticleFlavor = exports.ParticleType = exports.ResourceGainHandler = void 0;
const Currencies_1 = __webpack_require__(/*! ../game_logic/Currencies */ "./src/ts/game_logic/Currencies.ts");
const numbers_1 = __webpack_require__(/*! ../numbers/numbers */ "./src/ts/numbers/numbers.ts");
class ResourceGainHandler {
    static initialize(id = "resource-gain-container") {
        this.container = document.getElementById(id);
    }
    static gainResource(resource, x, y) {
        let element = document.createElement("resource-gain");
        element.setAttribute("x", x + "");
        element.setAttribute("y", y + "");
        if (resource.reflection === "particle") {
            let r = resource;
            if (r.type) {
                element.setAttribute("type", r.type.toString());
            }
            if (r.color) {
                element.setAttribute("color", r.color.toString());
            }
            if (r.flavor) {
                element.setAttribute("flavor", r.flavor.toString());
            }
        }
        element.setAttribute("amount", numbers_1.Numbers.getFormatted(resource.amount));
        this.container.appendChild(element);
        Currencies_1.Currencies.gainResource(resource);
    }
    static getParticleResourceFromField(particle, amount) {
        let flavor = ParticleFlavor[particle.flavor];
        let color = ParticleColor[particle.color];
        let type = ParticleType[particle.type];
        if (particle.type === "Quark") {
            flavor = [ParticleFlavor.Up, ParticleFlavor.Down][Math.floor(Math.random() * 2)];
        }
        let hash = `${type}-${flavor}`;
        if (color) {
            hash += `-${color}`;
        }
        return { amount, type, flavor, color, reflection: "particle", hash };
    }
}
exports.ResourceGainHandler = ResourceGainHandler;
var ParticleType;
(function (ParticleType) {
    ParticleType["Quark"] = "quarks";
    ParticleType["Lepton"] = "leptons";
    ParticleType["Boson"] = "bosons";
})(ParticleType || (exports.ParticleType = ParticleType = {}));
var ParticleFlavor;
(function (ParticleFlavor) {
    ParticleFlavor["Electron"] = "electron";
    ParticleFlavor["Muon"] = "muon";
    ParticleFlavor["Tau"] = "tau";
    ParticleFlavor["Up"] = "up";
    ParticleFlavor["Down"] = "down";
    ParticleFlavor["Strange"] = "stange";
    ParticleFlavor["Charm"] = "charm";
    ParticleFlavor["Top"] = "top";
    ParticleFlavor["Bottom"] = "bottom";
    ParticleFlavor["Gluon"] = "gluon";
    ParticleFlavor["Photon"] = "photon";
    ParticleFlavor["WPlus"] = "w-plus";
    ParticleFlavor["WMinus"] = "w-minus";
    ParticleFlavor["Z"] = "z";
    ParticleFlavor["Higgs"] = "higgs";
})(ParticleFlavor || (exports.ParticleFlavor = ParticleFlavor = {}));
var ParticleColor;
(function (ParticleColor) {
    ParticleColor["Red"] = "red";
    ParticleColor["Green"] = "green";
    ParticleColor["Blue"] = "blue";
    ParticleColor["RGB"] = "rgb";
})(ParticleColor || (exports.ParticleColor = ParticleColor = {}));


/***/ }),

/***/ "./src/ts/ui/UI.ts":
/*!*************************!*\
  !*** ./src/ts/ui/UI.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UI = void 0;
const Currencies_1 = __webpack_require__(/*! ./Currencies */ "./src/ts/ui/Currencies.ts");
var UI;
(function (UI) {
    UI.animate = (timestamp) => {
        Currencies_1.Currencies.updateCurrencies();
        window.requestAnimationFrame(UI.animate);
    };
})(UI || (exports.UI = UI = {}));


/***/ }),

/***/ "./src/ts/ui/Wave.ts":
/*!***************************!*\
  !*** ./src/ts/ui/Wave.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Wave = void 0;
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/ts/utils/utils.ts");
class Wave {
    constructor(element, container, config, autoStart = true) {
        this.points = [];
        this.time = 0;
        this.hover = false;
        this.clicked = false;
        this.clickPos = 0;
        this.ripples = [];
        this.canvas = element;
        this.config = config;
        this.ctx = this.canvas.getContext('2d');
        container.addEventListener('mousemove', (e) => {
            if (this.checkHover(e.clientY)) {
                if (!this.hover) {
                    this.ripple(e.clientX, false, 20, 10, 0.05);
                }
                this.clickPos = e.clientX;
                this.hover = true;
                this.canvas.classList.add("hovered");
            }
            else {
                this.hover = false;
                this.canvas.classList.remove("hovered");
            }
        });
        container.addEventListener('mousedown', () => {
            this.clicked = true;
        });
        container.addEventListener('mouseup', () => {
            this.clicked = false;
        });
        if (!this.config.height) {
            this.config.height = container.clientHeight;
        }
        if (this.config.rippleDelay === undefined) {
            this.config.rippleDelay = 1500;
        }
        if (this.config.offset === undefined) {
            this.config.offset = this.config.height / 2;
        }
        this.handleResize();
        addEventListener('resize', this.handleResize.bind(this));
        this.initialize();
        if (autoStart) {
            this.start();
        }
    }
    checkHover(y) {
        return y > this.config.offset + 100 && y < this.config.offset + 150;
    }
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = this.config.height;
    }
    setConfig(config) {
        this.config = config;
    }
    setAmplitude(amplitude) {
        this.config.amplitude = amplitude;
    }
    getAmplitude() {
        return this.config.amplitude;
    }
    setFrequency(frequency) {
        this.config.frequency = frequency;
    }
    getFrequency() {
        return this.config.frequency;
    }
    setSpeed(speed) {
        this.config.speed = speed;
    }
    getSpeed() {
        return this.config.speed;
    }
    cleanupRipples() {
        const now = performance.now();
        const threshold = 0.0001;
        this.ripples = this.ripples.filter(r => {
            const age = (now - r.startTime) / 1000;
            const rampUpTime = 0.5;
            const ramp = Math.min(1, age / rampUpTime);
            const easedRamp = Math.sin((ramp * Math.PI) / 2);
            const propagation = age * r.speed;
            const falloff = Math.exp(-r.decay * Math.pow(0 - propagation, 2));
            const potentialAmplitude = r.strength * easedRamp * falloff;
            return potentialAmplitude > threshold;
        });
    }
    start() {
        var start = performance.now();
        var self = this;
        function animate(timestamp) {
            self.time = self.config.speed * ((timestamp - start) / 10);
            self.draw(self.time);
            self.cleanupRipples();
            if (self.hover && self.clicked) {
                self.ripple(self.clickPos, true, 160);
            }
            window.requestAnimationFrame(animate);
        }
        window.requestAnimationFrame(animate);
    }
    initialize() {
        this.points = [];
        for (let i = 0; i <= this.config.pointCount; i++) {
            this.points.push({
                x: i,
                offset: Math.random() * 1000,
            });
        }
    }
    getY(i, time) {
        const point = this.points[i];
        const baseNoise = Math.sin((point.offset + time) * this.config.frequency) * 0.6 +
            Math.sin((point.offset * 0.5 + time * 0.8) * this.config.frequency) * 0.4;
        let rippleOffset = 0;
        const now = performance.now();
        for (let r of this.ripples) {
            const age = (now - r.startTime) / 1000;
            const distance = Math.abs(i - r.index);
            const propagation = age * r.speed;
            const falloff = Math.exp(-r.decay * Math.pow(distance - propagation, 2));
            const rampUpTime = 0.5;
            const ramp = Math.min(1, age / rampUpTime);
            const easedRamp = Math.sin((ramp * Math.PI) / 2);
            const wave = Math.sin(distance - propagation);
            rippleOffset += r.strength * easedRamp * falloff * wave;
        }
        return this.config.offset + (baseNoise * this.config.amplitude + rippleOffset);
    }
    draw(time) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.config.color.start);
        gradient.addColorStop(1, this.config.color.end);
        this.ctx.shadowColor = utils_1.Utils.hexToRGB(this.hover ? this.config.color.hover : this.config.color.glow);
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = this.config.lineWidth;
        this.ctx.beginPath();
        const stepX = this.canvas.width / (this.config.pointCount - 1);
        let prevX = 0;
        let prevY = this.getY(0, time);
        this.ctx.moveTo(prevX, prevY);
        for (let i = 1; i < this.config.pointCount; i++) {
            const currX = i * stepX;
            const currY = this.getY(i, time);
            const midX = (prevX + currX) / 2;
            const midY = (prevY + currY) / 2;
            this.ctx.quadraticCurveTo(prevX, prevY, midX, midY);
            prevX = currX;
            prevY = currY;
        }
        this.ctx.lineTo(prevX, prevY);
        this.ctx.stroke();
    }
    ripple(x, manual = false, strength = 120, speed = 10, decay = 0.05) {
        const index = Math.floor((x / this.canvas.width) * this.config.pointCount);
        if (this.config.rippleCallback) {
            if (!this.config.rippleCallback(x, manual, this.config.particle, this.config.index)) {
                return false;
            }
        }
        this.ripples.push({
            index,
            startTime: performance.now(),
            strength,
            speed,
            decay,
            manual,
        });
        return true;
    }
}
exports.Wave = Wave;


/***/ }),

/***/ "./src/ts/ui/custom_elements/QuantumFieldElement.ts":
/*!**********************************************************!*\
  !*** ./src/ts/ui/custom_elements/QuantumFieldElement.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuantumFieldElement = void 0;
const Wave_1 = __webpack_require__(/*! ../Wave */ "./src/ts/ui/Wave.ts");
class QuantumFieldElement extends HTMLElement {
    constructor() {
        super();
        this.waves = [];
        this.canvases = [];
        this.particles = [];
        this.delay = 1000;
        this.lastClick = 0;
    }
    ripple(x, manual = false, strength = 120, speed = 10, decay = 0.05) {
        this.waves.forEach(wave => { wave.ripple(x, manual, strength, speed, decay); });
    }
    connectedCallback() {
        const amount = parseInt(this.parentElement.getAttribute("data-fields"));
        const offset = (this.parentElement.clientHeight / (amount + 1)) * parseInt(this.getAttribute("index"));
        this.getElementsByClassName("field-label")[0].style.top = (offset - 60) + "px";
        let width = 3;
        this.random = this.getAttribute("random") === "true";
        this.delay = parseInt(this.getAttribute("delay"));
        this.type = this.getAttribute("type");
        if (this.getAttribute("all") === "true") {
            this.all = {
                type: this.getAttribute("all-type"),
                flavor: this.getAttribute("all-flavor"),
                color: this.getAttribute("all-color"),
                all: true,
            };
        }
        const getNextDrop = () => {
            if (this.all) {
                if (Math.random() < 0.1) {
                    return this.all;
                }
            }
            return this.particles[Math.floor(Math.random() * this.particles.length)];
        };
        const handleRipple = (x, manual, particle, index) => {
            if (!manual) {
                return true;
            }
            let now = performance.now();
            if ((now - this.lastClick) < this.delay) {
                return false;
            }
            if (this.type === "triple") {
                if (index === (this.particles.length * 3) - 1) {
                    this.lastClick = now;
                    this.dispatchEvent(new CustomEvent("ripple", { detail: { x, y: offset, manual, particle } }));
                }
                return true;
            }
            if (index === this.particles.length - 1) {
                this.lastClick = now;
            }
            if (this.random) {
                if (index === 0) {
                    this.whichWave = getNextDrop();
                    this.dispatchEvent(new CustomEvent("ripple", { detail: { x, y: offset, manual, particle: this.whichWave } }));
                }
                if (JSON.stringify(particle) === JSON.stringify(this.whichWave) || this.whichWave.all) {
                    return true;
                }
                return false;
            }
            this.dispatchEvent(new CustomEvent("ripple", { detail: { x, y: offset, manual, particle } }));
            return true;
        };
        let copies = 1;
        this.type = this.getAttribute("type");
        if (this.type === "thick") {
            width = 20;
        }
        else if (this.type === "triple") {
            copies = 3;
        }
        let fields = this.getElementsByClassName("field");
        for (let i = 0; i < fields.length; i += copies) {
            let field = fields[i];
            let p = {
                type: field.getAttribute("data-type") || this.getAttribute("type"),
                flavor: field.getAttribute("data-flavor") || this.getAttribute("flavor"),
                color: field.getAttribute("data-color") || this.getAttribute("color"),
            };
            this.particles.push(p);
            for (let j = 0; j < copies; j++) {
                this.canvases.push(document.createElement("canvas"));
                this.appendChild(this.canvases[i + j]);
                this.waves.push(new Wave_1.Wave(this.canvases[i + j], this.parentElement, {
                    amplitude: 20,
                    frequency: 1,
                    speed: 0.02,
                    lineWidth: width,
                    color: {
                        start: field.getAttribute("data-color-start") || this.getAttribute("color-start"),
                        end: field.getAttribute("data-color-end") || this.getAttribute("color-end"),
                        glow: field.getAttribute("data-color-glow") || this.getAttribute("color-glow"),
                        hover: field.getAttribute("data-color-hover") || this.getAttribute("color-hover") || "#ffffff",
                    },
                    pointCount: 10,
                    offset: offset,
                    rippleCallback: handleRipple,
                    particle: p,
                    index: i + j,
                }));
            }
        }
    }
}
exports.QuantumFieldElement = QuantumFieldElement;


/***/ }),

/***/ "./src/ts/ui/custom_elements/ResourceGainElement.ts":
/*!**********************************************************!*\
  !*** ./src/ts/ui/custom_elements/ResourceGainElement.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResourceGainElement = void 0;
class ResourceGainElement extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.style.left = this.getAttribute("x") + "px";
        this.style.top = this.getAttribute("y") + "px";
        let type = this.getAttribute("type");
        let flavor = this.getAttribute("flavor");
        let color = this.getAttribute("color");
        let particle = document.createElement("div");
        particle.classList.add("particle");
        particle.classList.add(type);
        particle.classList.add(flavor);
        particle.classList.add(color);
        let amount = document.createElement("span");
        amount.innerText = ` + ${this.getAttribute("amount")}`;
        this.appendChild(particle);
        this.appendChild(amount);
        setTimeout(() => {
            this.remove();
        }, 2000);
    }
}
exports.ResourceGainElement = ResourceGainElement;


/***/ }),

/***/ "./src/ts/ui/custom_elements/ToolTip.ts":
/*!**********************************************!*\
  !*** ./src/ts/ui/custom_elements/ToolTip.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolTip = void 0;
class ToolTip extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.parentElement.style.position = "relative";
    }
}
exports.ToolTip = ToolTip;


/***/ }),

/***/ "./src/ts/ui/custom_elements/TranslatedElement.ts":
/*!********************************************************!*\
  !*** ./src/ts/ui/custom_elements/TranslatedElement.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TranslatedElement = void 0;
const i18n_1 = __webpack_require__(/*! ../../i18n/i18n */ "./src/ts/i18n/i18n.ts");
const Settings_1 = __webpack_require__(/*! ../../utils/Settings */ "./src/ts/utils/Settings.ts");
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/ts/utils/utils.ts");
class TranslatedElement extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        let lang = Settings_1.Settings.get().general.settings.language.value;
        let translated = utils_1.Utils.getNestedProperty(i18n_1.translations[lang], this.innerText.toLowerCase());
        if (translated) {
            this.innerText = translated;
        }
    }
}
exports.TranslatedElement = TranslatedElement;


/***/ }),

/***/ "./src/ts/utils/Logger.ts":
/*!********************************!*\
  !*** ./src/ts/utils/Logger.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Logger = void 0;
const Settings_1 = __webpack_require__(/*! ./Settings */ "./src/ts/utils/Settings.ts");
class Logger {
    static log(context, message, ...args) {
        if (Settings_1.Settings.get() && Settings_1.Settings.get().debug.settings.logging.value)
            console.log(`[${context}]`, message, ...args);
    }
    static error(context, message, ...args) {
        if (Settings_1.Settings.get() && Settings_1.Settings.get().debug.settings.logging.value)
            console.error(`[${context}]`, message, ...args);
    }
    static warning(context, message, ...args) {
        if (Settings_1.Settings.get() && Settings_1.Settings.get().debug.settings.logging.value)
            console.warn(`[${context}]`, message, ...args);
    }
    static debug(context, message, ...args) {
        if (Settings_1.Settings.get() && Settings_1.Settings.get().debug.settings.logging.value && Settings_1.Settings.get().debug.settings.verbose.value)
            console.debug(`[${context}]`, message, ...args);
    }
}
exports.Logger = Logger;


/***/ }),

/***/ "./src/ts/utils/Settings.ts":
/*!**********************************!*\
  !*** ./src/ts/utils/Settings.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Settings = void 0;
const SaveHandler_1 = __webpack_require__(/*! ../SaveHandler/SaveHandler */ "./src/ts/SaveHandler/SaveHandler.ts");
class Settings {
    static default() {
        return {
            general: {
                title: "settings.general.title",
                settings: {
                    language: {
                        value: "en",
                        default: "en",
                        name: "settings.general.language.name",
                        description: ""
                    },
                    noTabHistory: {
                        value: false,
                        default: false,
                        name: "settings.general.noTabHistory.name",
                        description: "settings.general.noTabHistory.description"
                    },
                }
            },
            gameplay: {
                title: "settings.gameplay.title",
                settings: {
                    noOfflineTime: {
                        value: false,
                        default: false,
                        name: "settings.gameplay.noOfflineTime.name"
                    },
                }
            },
            display: {
                title: "settings.display.title",
                settings: {
                    darkNavigation: {
                        value: false,
                        default: false,
                        name: "settings.display.darkNavigation.name",
                        description: "settings.display.darkNavigation.name"
                    },
                    stillFields: {
                        value: false,
                        default: false,
                        name: "settings.display.stillFields.name",
                        description: "settings.display.stillFields.name"
                    },
                }
            },
            debug: {
                title: "settings.debug.title",
                settings: {
                    logging: {
                        value: true,
                        default: true,
                        name: "settings.debug.logging.name",
                    },
                    verbose: {
                        value: false,
                        default: false,
                        name: "settings.debug.verbose.name",
                    }
                }
            }
        };
    }
    static get() {
        return this.settings;
    }
    static set(settings) {
        if (this.settings) {
            this.settings = Object.assign(Object.assign({}, this.settings), settings);
        }
        else {
            this.settings = settings;
        }
    }
    static reset() {
        this.settings = this.default();
        SaveHandler_1.SaveHandler.saveData();
    }
}
exports.Settings = Settings;


/***/ }),

/***/ "./src/ts/utils/utils.ts":
/*!*******************************!*\
  !*** ./src/ts/utils/utils.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Utils = void 0;
var Utils;
(function (Utils) {
    Utils.getNestedProperty = (obj, path) => {
        return path.split('.').reduce((acc, key) => acc === null || acc === void 0 ? void 0 : acc[key], obj);
    };
    Utils.hexToRGB = (hex, alpha) => {
        let noHash = hex.replace("#", "");
        let r = parseInt(noHash.slice(0, 2), 16), g = parseInt(noHash.slice(2, 4), 16), b = parseInt(noHash.slice(4, 6), 16);
        if (alpha) {
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        }
        else {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    };
})(Utils || (exports.Utils = Utils = {}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!*************************!*\
  !*** ./src/ts/index.ts ***!
  \*************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const main_1 = __webpack_require__(/*! ./main */ "./src/ts/main.ts");
window.addEventListener("load", main_1.main);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsY0FBYztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsb0JBQW9CO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLFNBQVM7QUFDdkM7QUFDQTtBQUNBLGdDQUFnQyxRQUFRO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsSUFBSTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSw0QkFBNEIsUUFBUTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLEtBQUs7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSx1QkFBdUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHVCQUF1QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixXQUFXO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxTQUFTO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxLQUFLO0FBQy9DLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsS0FBSztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsaUJBQWlCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQSxxQkFBcUIsU0FBUztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSx5QkFBeUI7QUFDbkMsWUFBWSx5QkFBeUI7QUFDckM7QUFDQSxvREFBb0QsRUFBRTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1osNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQSxvQ0FBb0MsbURBQW1ELEdBQUcsR0FBRztBQUM3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsS0FBSztBQUN6QjtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixPQUFPO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsS0FBSztBQUM3QjtBQUNBO0FBQ0E7QUFDQSxhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNBLHNCQUFzQixlQUFlO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFlBQVk7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsS0FBSztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLE1BQU07QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsS0FBSztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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RyxHQUFHLENBQUM7UUFDbEUsQ0FBQzthQUFNLENBQUM7WUFDSixPQUFPLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNsRCxDQUFDO0lBQ0wsQ0FBQztBQUNMLENBQUMsRUFqQmdCLEtBQUsscUJBQUwsS0FBSyxRQWlCckI7Ozs7Ozs7VUNqQkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7Ozs7OztBQ3RCQSxxRUFBOEI7QUFFOUIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxXQUFJLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iaWdudW1iZXIuanMvYmlnbnVtYmVyLmpzIiwid2VicGFjazovLy8uL3NyYy90cy9TYXZlSGFuZGxlci9TYXZlSGFuZGxlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvZ2FtZV9sb2dpYy9DdXJyZW5jaWVzLnRzIiwid2VicGFjazovLy8uL3NyYy90cy9pMThuL2kxOG4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL251bWJlcnMvbnVtYmVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdWkvQ3VycmVuY2llcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdWkvUmVzb3VyY2VHYWluSGFuZGxlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdWkvVUkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3VpL1dhdmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3VpL2N1c3RvbV9lbGVtZW50cy9RdWFudHVtRmllbGRFbGVtZW50LnRzIiwid2VicGFjazovLy8uL3NyYy90cy91aS9jdXN0b21fZWxlbWVudHMvUmVzb3VyY2VHYWluRWxlbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdWkvY3VzdG9tX2VsZW1lbnRzL1Rvb2xUaXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3VpL2N1c3RvbV9lbGVtZW50cy9UcmFuc2xhdGVkRWxlbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvTG9nZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy90cy91dGlscy9TZXR0aW5ncy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy90cy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uIChnbG9iYWxPYmplY3QpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4gKiAgICAgIGJpZ251bWJlci5qcyB2OS4zLjBcclxuICogICAgICBBIEphdmFTY3JpcHQgbGlicmFyeSBmb3IgYXJiaXRyYXJ5LXByZWNpc2lvbiBhcml0aG1ldGljLlxyXG4gKiAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWtlTWNsL2JpZ251bWJlci5qc1xyXG4gKiAgICAgIENvcHlyaWdodCAoYykgMjAyNSBNaWNoYWVsIE1jbGF1Z2hsaW4gPE04Y2g4OGxAZ21haWwuY29tPlxyXG4gKiAgICAgIE1JVCBMaWNlbnNlZC5cclxuICpcclxuICogICAgICBCaWdOdW1iZXIucHJvdG90eXBlIG1ldGhvZHMgICAgIHwgIEJpZ051bWJlciBtZXRob2RzXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgYWJzb2x1dGVWYWx1ZSAgICAgICAgICAgIGFicyAgICB8ICBjbG9uZVxyXG4gKiAgICAgIGNvbXBhcmVkVG8gICAgICAgICAgICAgICAgICAgICAgfCAgY29uZmlnICAgICAgICAgICAgICAgc2V0XHJcbiAqICAgICAgZGVjaW1hbFBsYWNlcyAgICAgICAgICAgIGRwICAgICB8ICAgICAgREVDSU1BTF9QTEFDRVNcclxuICogICAgICBkaXZpZGVkQnkgICAgICAgICAgICAgICAgZGl2ICAgIHwgICAgICBST1VORElOR19NT0RFXHJcbiAqICAgICAgZGl2aWRlZFRvSW50ZWdlckJ5ICAgICAgIGlkaXYgICB8ICAgICAgRVhQT05FTlRJQUxfQVRcclxuICogICAgICBleHBvbmVudGlhdGVkQnkgICAgICAgICAgcG93ICAgIHwgICAgICBSQU5HRVxyXG4gKiAgICAgIGludGVnZXJWYWx1ZSAgICAgICAgICAgICAgICAgICAgfCAgICAgIENSWVBUT1xyXG4gKiAgICAgIGlzRXF1YWxUbyAgICAgICAgICAgICAgICBlcSAgICAgfCAgICAgIE1PRFVMT19NT0RFXHJcbiAqICAgICAgaXNGaW5pdGUgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgUE9XX1BSRUNJU0lPTlxyXG4gKiAgICAgIGlzR3JlYXRlclRoYW4gICAgICAgICAgICBndCAgICAgfCAgICAgIEZPUk1BVFxyXG4gKiAgICAgIGlzR3JlYXRlclRoYW5PckVxdWFsVG8gICBndGUgICAgfCAgICAgIEFMUEhBQkVUXHJcbiAqICAgICAgaXNJbnRlZ2VyICAgICAgICAgICAgICAgICAgICAgICB8ICBpc0JpZ051bWJlclxyXG4gKiAgICAgIGlzTGVzc1RoYW4gICAgICAgICAgICAgICBsdCAgICAgfCAgbWF4aW11bSAgICAgICAgICAgICAgbWF4XHJcbiAqICAgICAgaXNMZXNzVGhhbk9yRXF1YWxUbyAgICAgIGx0ZSAgICB8ICBtaW5pbXVtICAgICAgICAgICAgICBtaW5cclxuICogICAgICBpc05hTiAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgIHJhbmRvbVxyXG4gKiAgICAgIGlzTmVnYXRpdmUgICAgICAgICAgICAgICAgICAgICAgfCAgc3VtXHJcbiAqICAgICAgaXNQb3NpdGl2ZSAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgaXNaZXJvICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgbWludXMgICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgbW9kdWxvICAgICAgICAgICAgICAgICAgIG1vZCAgICB8XHJcbiAqICAgICAgbXVsdGlwbGllZEJ5ICAgICAgICAgICAgIHRpbWVzICB8XHJcbiAqICAgICAgbmVnYXRlZCAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgcGx1cyAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgcHJlY2lzaW9uICAgICAgICAgICAgICAgIHNkICAgICB8XHJcbiAqICAgICAgc2hpZnRlZEJ5ICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgc3F1YXJlUm9vdCAgICAgICAgICAgICAgIHNxcnQgICB8XHJcbiAqICAgICAgdG9FeHBvbmVudGlhbCAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9GaXhlZCAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9Gb3JtYXQgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9GcmFjdGlvbiAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9KU09OICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9OdW1iZXIgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9QcmVjaXNpb24gICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9TdHJpbmcgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdmFsdWVPZiAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqXHJcbiAqL1xyXG5cclxuXHJcbiAgdmFyIEJpZ051bWJlcixcclxuICAgIGlzTnVtZXJpYyA9IC9eLT8oPzpcXGQrKD86XFwuXFxkKik/fFxcLlxcZCspKD86ZVsrLV0/XFxkKyk/JC9pLFxyXG4gICAgbWF0aGNlaWwgPSBNYXRoLmNlaWwsXHJcbiAgICBtYXRoZmxvb3IgPSBNYXRoLmZsb29yLFxyXG5cclxuICAgIGJpZ251bWJlckVycm9yID0gJ1tCaWdOdW1iZXIgRXJyb3JdICcsXHJcbiAgICB0b29NYW55RGlnaXRzID0gYmlnbnVtYmVyRXJyb3IgKyAnTnVtYmVyIHByaW1pdGl2ZSBoYXMgbW9yZSB0aGFuIDE1IHNpZ25pZmljYW50IGRpZ2l0czogJyxcclxuXHJcbiAgICBCQVNFID0gMWUxNCxcclxuICAgIExPR19CQVNFID0gMTQsXHJcbiAgICBNQVhfU0FGRV9JTlRFR0VSID0gMHgxZmZmZmZmZmZmZmZmZiwgICAgICAgICAvLyAyXjUzIC0gMVxyXG4gICAgLy8gTUFYX0lOVDMyID0gMHg3ZmZmZmZmZiwgICAgICAgICAgICAgICAgICAgLy8gMl4zMSAtIDFcclxuICAgIFBPV1NfVEVOID0gWzEsIDEwLCAxMDAsIDFlMywgMWU0LCAxZTUsIDFlNiwgMWU3LCAxZTgsIDFlOSwgMWUxMCwgMWUxMSwgMWUxMiwgMWUxM10sXHJcbiAgICBTUVJUX0JBU0UgPSAxZTcsXHJcblxyXG4gICAgLy8gRURJVEFCTEVcclxuICAgIC8vIFRoZSBsaW1pdCBvbiB0aGUgdmFsdWUgb2YgREVDSU1BTF9QTEFDRVMsIFRPX0VYUF9ORUcsIFRPX0VYUF9QT1MsIE1JTl9FWFAsIE1BWF9FWFAsIGFuZFxyXG4gICAgLy8gdGhlIGFyZ3VtZW50cyB0byB0b0V4cG9uZW50aWFsLCB0b0ZpeGVkLCB0b0Zvcm1hdCwgYW5kIHRvUHJlY2lzaW9uLlxyXG4gICAgTUFYID0gMUU5OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byBNQVhfSU5UMzJcclxuXHJcblxyXG4gIC8qXHJcbiAgICogQ3JlYXRlIGFuZCByZXR1cm4gYSBCaWdOdW1iZXIgY29uc3RydWN0b3IuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY2xvbmUoY29uZmlnT2JqZWN0KSB7XHJcbiAgICB2YXIgZGl2LCBjb252ZXJ0QmFzZSwgcGFyc2VOdW1lcmljLFxyXG4gICAgICBQID0gQmlnTnVtYmVyLnByb3RvdHlwZSA9IHsgY29uc3RydWN0b3I6IEJpZ051bWJlciwgdG9TdHJpbmc6IG51bGwsIHZhbHVlT2Y6IG51bGwgfSxcclxuICAgICAgT05FID0gbmV3IEJpZ051bWJlcigxKSxcclxuXHJcblxyXG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEVESVRBQkxFIENPTkZJRyBERUZBVUxUUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cclxuICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWVzIGJlbG93IG11c3QgYmUgaW50ZWdlcnMgd2l0aGluIHRoZSBpbmNsdXNpdmUgcmFuZ2VzIHN0YXRlZC5cclxuICAgICAgLy8gVGhlIHZhbHVlcyBjYW4gYWxzbyBiZSBjaGFuZ2VkIGF0IHJ1bi10aW1lIHVzaW5nIEJpZ051bWJlci5zZXQuXHJcblxyXG4gICAgICAvLyBUaGUgbWF4aW11bSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXMgZm9yIG9wZXJhdGlvbnMgaW52b2x2aW5nIGRpdmlzaW9uLlxyXG4gICAgICBERUNJTUFMX1BMQUNFUyA9IDIwLCAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gTUFYXHJcblxyXG4gICAgICAvLyBUaGUgcm91bmRpbmcgbW9kZSB1c2VkIHdoZW4gcm91bmRpbmcgdG8gdGhlIGFib3ZlIGRlY2ltYWwgcGxhY2VzLCBhbmQgd2hlbiB1c2luZ1xyXG4gICAgICAvLyB0b0V4cG9uZW50aWFsLCB0b0ZpeGVkLCB0b0Zvcm1hdCBhbmQgdG9QcmVjaXNpb24sIGFuZCByb3VuZCAoZGVmYXVsdCB2YWx1ZSkuXHJcbiAgICAgIC8vIFVQICAgICAgICAgMCBBd2F5IGZyb20gemVyby5cclxuICAgICAgLy8gRE9XTiAgICAgICAxIFRvd2FyZHMgemVyby5cclxuICAgICAgLy8gQ0VJTCAgICAgICAyIFRvd2FyZHMgK0luZmluaXR5LlxyXG4gICAgICAvLyBGTE9PUiAgICAgIDMgVG93YXJkcyAtSW5maW5pdHkuXHJcbiAgICAgIC8vIEhBTEZfVVAgICAgNCBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdXAuXHJcbiAgICAgIC8vIEhBTEZfRE9XTiAgNSBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgZG93bi5cclxuICAgICAgLy8gSEFMRl9FVkVOICA2IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB0b3dhcmRzIGV2ZW4gbmVpZ2hib3VyLlxyXG4gICAgICAvLyBIQUxGX0NFSUwgIDcgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgK0luZmluaXR5LlxyXG4gICAgICAvLyBIQUxGX0ZMT09SIDggVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgLUluZmluaXR5LlxyXG4gICAgICBST1VORElOR19NT0RFID0gNCwgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gOFxyXG5cclxuICAgICAgLy8gRVhQT05FTlRJQUxfQVQgOiBbVE9fRVhQX05FRyAsIFRPX0VYUF9QT1NdXHJcblxyXG4gICAgICAvLyBUaGUgZXhwb25lbnQgdmFsdWUgYXQgYW5kIGJlbmVhdGggd2hpY2ggdG9TdHJpbmcgcmV0dXJucyBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgICAgLy8gTnVtYmVyIHR5cGU6IC03XHJcbiAgICAgIFRPX0VYUF9ORUcgPSAtNywgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byAtTUFYXHJcblxyXG4gICAgICAvLyBUaGUgZXhwb25lbnQgdmFsdWUgYXQgYW5kIGFib3ZlIHdoaWNoIHRvU3RyaW5nIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAgIC8vIE51bWJlciB0eXBlOiAyMVxyXG4gICAgICBUT19FWFBfUE9TID0gMjEsICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gTUFYXHJcblxyXG4gICAgICAvLyBSQU5HRSA6IFtNSU5fRVhQLCBNQVhfRVhQXVxyXG5cclxuICAgICAgLy8gVGhlIG1pbmltdW0gZXhwb25lbnQgdmFsdWUsIGJlbmVhdGggd2hpY2ggdW5kZXJmbG93IHRvIHplcm8gb2NjdXJzLlxyXG4gICAgICAvLyBOdW1iZXIgdHlwZTogLTMyNCAgKDVlLTMyNClcclxuICAgICAgTUlOX0VYUCA9IC0xZTcsICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAtMSB0byAtTUFYXHJcblxyXG4gICAgICAvLyBUaGUgbWF4aW11bSBleHBvbmVudCB2YWx1ZSwgYWJvdmUgd2hpY2ggb3ZlcmZsb3cgdG8gSW5maW5pdHkgb2NjdXJzLlxyXG4gICAgICAvLyBOdW1iZXIgdHlwZTogIDMwOCAgKDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4KVxyXG4gICAgICAvLyBGb3IgTUFYX0VYUCA+IDFlNywgZS5nLiBuZXcgQmlnTnVtYmVyKCcxZTEwMDAwMDAwMCcpLnBsdXMoMSkgbWF5IGJlIHNsb3cuXHJcbiAgICAgIE1BWF9FWFAgPSAxZTcsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMSB0byBNQVhcclxuXHJcbiAgICAgIC8vIFdoZXRoZXIgdG8gdXNlIGNyeXB0b2dyYXBoaWNhbGx5LXNlY3VyZSByYW5kb20gbnVtYmVyIGdlbmVyYXRpb24sIGlmIGF2YWlsYWJsZS5cclxuICAgICAgQ1JZUFRPID0gZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0cnVlIG9yIGZhbHNlXHJcblxyXG4gICAgICAvLyBUaGUgbW9kdWxvIG1vZGUgdXNlZCB3aGVuIGNhbGN1bGF0aW5nIHRoZSBtb2R1bHVzOiBhIG1vZCBuLlxyXG4gICAgICAvLyBUaGUgcXVvdGllbnQgKHEgPSBhIC8gbikgaXMgY2FsY3VsYXRlZCBhY2NvcmRpbmcgdG8gdGhlIGNvcnJlc3BvbmRpbmcgcm91bmRpbmcgbW9kZS5cclxuICAgICAgLy8gVGhlIHJlbWFpbmRlciAocikgaXMgY2FsY3VsYXRlZCBhczogciA9IGEgLSBuICogcS5cclxuICAgICAgLy9cclxuICAgICAgLy8gVVAgICAgICAgIDAgVGhlIHJlbWFpbmRlciBpcyBwb3NpdGl2ZSBpZiB0aGUgZGl2aWRlbmQgaXMgbmVnYXRpdmUsIGVsc2UgaXMgbmVnYXRpdmUuXHJcbiAgICAgIC8vIERPV04gICAgICAxIFRoZSByZW1haW5kZXIgaGFzIHRoZSBzYW1lIHNpZ24gYXMgdGhlIGRpdmlkZW5kLlxyXG4gICAgICAvLyAgICAgICAgICAgICBUaGlzIG1vZHVsbyBtb2RlIGlzIGNvbW1vbmx5IGtub3duIGFzICd0cnVuY2F0ZWQgZGl2aXNpb24nIGFuZCBpc1xyXG4gICAgICAvLyAgICAgICAgICAgICBlcXVpdmFsZW50IHRvIChhICUgbikgaW4gSmF2YVNjcmlwdC5cclxuICAgICAgLy8gRkxPT1IgICAgIDMgVGhlIHJlbWFpbmRlciBoYXMgdGhlIHNhbWUgc2lnbiBhcyB0aGUgZGl2aXNvciAoUHl0aG9uICUpLlxyXG4gICAgICAvLyBIQUxGX0VWRU4gNiBUaGlzIG1vZHVsbyBtb2RlIGltcGxlbWVudHMgdGhlIElFRUUgNzU0IHJlbWFpbmRlciBmdW5jdGlvbi5cclxuICAgICAgLy8gRVVDTElEICAgIDkgRXVjbGlkaWFuIGRpdmlzaW9uLiBxID0gc2lnbihuKSAqIGZsb29yKGEgLyBhYnMobikpLlxyXG4gICAgICAvLyAgICAgICAgICAgICBUaGUgcmVtYWluZGVyIGlzIGFsd2F5cyBwb3NpdGl2ZS5cclxuICAgICAgLy9cclxuICAgICAgLy8gVGhlIHRydW5jYXRlZCBkaXZpc2lvbiwgZmxvb3JlZCBkaXZpc2lvbiwgRXVjbGlkaWFuIGRpdmlzaW9uIGFuZCBJRUVFIDc1NCByZW1haW5kZXJcclxuICAgICAgLy8gbW9kZXMgYXJlIGNvbW1vbmx5IHVzZWQgZm9yIHRoZSBtb2R1bHVzIG9wZXJhdGlvbi5cclxuICAgICAgLy8gQWx0aG91Z2ggdGhlIG90aGVyIHJvdW5kaW5nIG1vZGVzIGNhbiBhbHNvIGJlIHVzZWQsIHRoZXkgbWF5IG5vdCBnaXZlIHVzZWZ1bCByZXN1bHRzLlxyXG4gICAgICBNT0RVTE9fTU9ERSA9IDEsICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gOVxyXG5cclxuICAgICAgLy8gVGhlIG1heGltdW0gbnVtYmVyIG9mIHNpZ25pZmljYW50IGRpZ2l0cyBvZiB0aGUgcmVzdWx0IG9mIHRoZSBleHBvbmVudGlhdGVkQnkgb3BlcmF0aW9uLlxyXG4gICAgICAvLyBJZiBQT1dfUFJFQ0lTSU9OIGlzIDAsIHRoZXJlIHdpbGwgYmUgdW5saW1pdGVkIHNpZ25pZmljYW50IGRpZ2l0cy5cclxuICAgICAgUE9XX1BSRUNJU0lPTiA9IDAsICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIE1BWFxyXG5cclxuICAgICAgLy8gVGhlIGZvcm1hdCBzcGVjaWZpY2F0aW9uIHVzZWQgYnkgdGhlIEJpZ051bWJlci5wcm90b3R5cGUudG9Gb3JtYXQgbWV0aG9kLlxyXG4gICAgICBGT1JNQVQgPSB7XHJcbiAgICAgICAgcHJlZml4OiAnJyxcclxuICAgICAgICBncm91cFNpemU6IDMsXHJcbiAgICAgICAgc2Vjb25kYXJ5R3JvdXBTaXplOiAwLFxyXG4gICAgICAgIGdyb3VwU2VwYXJhdG9yOiAnLCcsXHJcbiAgICAgICAgZGVjaW1hbFNlcGFyYXRvcjogJy4nLFxyXG4gICAgICAgIGZyYWN0aW9uR3JvdXBTaXplOiAwLFxyXG4gICAgICAgIGZyYWN0aW9uR3JvdXBTZXBhcmF0b3I6ICdcXHhBMCcsICAgICAgICAvLyBub24tYnJlYWtpbmcgc3BhY2VcclxuICAgICAgICBzdWZmaXg6ICcnXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyBUaGUgYWxwaGFiZXQgdXNlZCBmb3IgYmFzZSBjb252ZXJzaW9uLiBJdCBtdXN0IGJlIGF0IGxlYXN0IDIgY2hhcmFjdGVycyBsb25nLCB3aXRoIG5vICcrJyxcclxuICAgICAgLy8gJy0nLCAnLicsIHdoaXRlc3BhY2UsIG9yIHJlcGVhdGVkIGNoYXJhY3Rlci5cclxuICAgICAgLy8gJzAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaJF8nXHJcbiAgICAgIEFMUEhBQkVUID0gJzAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicsXHJcbiAgICAgIGFscGhhYmV0SGFzTm9ybWFsRGVjaW1hbERpZ2l0cyA9IHRydWU7XHJcblxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cclxuICAgIC8vIENPTlNUUlVDVE9SXHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUaGUgQmlnTnVtYmVyIGNvbnN0cnVjdG9yIGFuZCBleHBvcnRlZCBmdW5jdGlvbi5cclxuICAgICAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgbmV3IGluc3RhbmNlIG9mIGEgQmlnTnVtYmVyIG9iamVjdC5cclxuICAgICAqXHJcbiAgICAgKiB2IHtudW1iZXJ8c3RyaW5nfEJpZ051bWJlcn0gQSBudW1lcmljIHZhbHVlLlxyXG4gICAgICogW2JdIHtudW1iZXJ9IFRoZSBiYXNlIG9mIHYuIEludGVnZXIsIDIgdG8gQUxQSEFCRVQubGVuZ3RoIGluY2x1c2l2ZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gQmlnTnVtYmVyKHYsIGIpIHtcclxuICAgICAgdmFyIGFscGhhYmV0LCBjLCBjYXNlQ2hhbmdlZCwgZSwgaSwgaXNOdW0sIGxlbiwgc3RyLFxyXG4gICAgICAgIHggPSB0aGlzO1xyXG5cclxuICAgICAgLy8gRW5hYmxlIGNvbnN0cnVjdG9yIGNhbGwgd2l0aG91dCBgbmV3YC5cclxuICAgICAgaWYgKCEoeCBpbnN0YW5jZW9mIEJpZ051bWJlcikpIHJldHVybiBuZXcgQmlnTnVtYmVyKHYsIGIpO1xyXG5cclxuICAgICAgaWYgKGIgPT0gbnVsbCkge1xyXG5cclxuICAgICAgICBpZiAodiAmJiB2Ll9pc0JpZ051bWJlciA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgeC5zID0gdi5zO1xyXG5cclxuICAgICAgICAgIGlmICghdi5jIHx8IHYuZSA+IE1BWF9FWFApIHtcclxuICAgICAgICAgICAgeC5jID0geC5lID0gbnVsbDtcclxuICAgICAgICAgIH0gZWxzZSBpZiAodi5lIDwgTUlOX0VYUCkge1xyXG4gICAgICAgICAgICB4LmMgPSBbeC5lID0gMF07XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4LmUgPSB2LmU7XHJcbiAgICAgICAgICAgIHguYyA9IHYuYy5zbGljZSgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgoaXNOdW0gPSB0eXBlb2YgdiA9PSAnbnVtYmVyJykgJiYgdiAqIDAgPT0gMCkge1xyXG5cclxuICAgICAgICAgIC8vIFVzZSBgMSAvIG5gIHRvIGhhbmRsZSBtaW51cyB6ZXJvIGFsc28uXHJcbiAgICAgICAgICB4LnMgPSAxIC8gdiA8IDAgPyAodiA9IC12LCAtMSkgOiAxO1xyXG5cclxuICAgICAgICAgIC8vIEZhc3QgcGF0aCBmb3IgaW50ZWdlcnMsIHdoZXJlIG4gPCAyMTQ3NDgzNjQ4ICgyKiozMSkuXHJcbiAgICAgICAgICBpZiAodiA9PT0gfn52KSB7XHJcbiAgICAgICAgICAgIGZvciAoZSA9IDAsIGkgPSB2OyBpID49IDEwOyBpIC89IDEwLCBlKyspO1xyXG5cclxuICAgICAgICAgICAgaWYgKGUgPiBNQVhfRVhQKSB7XHJcbiAgICAgICAgICAgICAgeC5jID0geC5lID0gbnVsbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB4LmUgPSBlO1xyXG4gICAgICAgICAgICAgIHguYyA9IFt2XTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHN0ciA9IFN0cmluZyh2KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIGlmICghaXNOdW1lcmljLnRlc3Qoc3RyID0gU3RyaW5nKHYpKSkgcmV0dXJuIHBhcnNlTnVtZXJpYyh4LCBzdHIsIGlzTnVtKTtcclxuXHJcbiAgICAgICAgICB4LnMgPSBzdHIuY2hhckNvZGVBdCgwKSA9PSA0NSA/IChzdHIgPSBzdHIuc2xpY2UoMSksIC0xKSA6IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBEZWNpbWFsIHBvaW50P1xyXG4gICAgICAgIGlmICgoZSA9IHN0ci5pbmRleE9mKCcuJykpID4gLTEpIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG5cclxuICAgICAgICAvLyBFeHBvbmVudGlhbCBmb3JtP1xyXG4gICAgICAgIGlmICgoaSA9IHN0ci5zZWFyY2goL2UvaSkpID4gMCkge1xyXG5cclxuICAgICAgICAgIC8vIERldGVybWluZSBleHBvbmVudC5cclxuICAgICAgICAgIGlmIChlIDwgMCkgZSA9IGk7XHJcbiAgICAgICAgICBlICs9ICtzdHIuc2xpY2UoaSArIDEpO1xyXG4gICAgICAgICAgc3RyID0gc3RyLnN1YnN0cmluZygwLCBpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGUgPCAwKSB7XHJcblxyXG4gICAgICAgICAgLy8gSW50ZWdlci5cclxuICAgICAgICAgIGUgPSBzdHIubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBCYXNlIHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHtifSdcclxuICAgICAgICBpbnRDaGVjayhiLCAyLCBBTFBIQUJFVC5sZW5ndGgsICdCYXNlJyk7XHJcblxyXG4gICAgICAgIC8vIEFsbG93IGV4cG9uZW50aWFsIG5vdGF0aW9uIHRvIGJlIHVzZWQgd2l0aCBiYXNlIDEwIGFyZ3VtZW50LCB3aGlsZVxyXG4gICAgICAgIC8vIGFsc28gcm91bmRpbmcgdG8gREVDSU1BTF9QTEFDRVMgYXMgd2l0aCBvdGhlciBiYXNlcy5cclxuICAgICAgICBpZiAoYiA9PSAxMCAmJiBhbHBoYWJldEhhc05vcm1hbERlY2ltYWxEaWdpdHMpIHtcclxuICAgICAgICAgIHggPSBuZXcgQmlnTnVtYmVyKHYpO1xyXG4gICAgICAgICAgcmV0dXJuIHJvdW5kKHgsIERFQ0lNQUxfUExBQ0VTICsgeC5lICsgMSwgUk9VTkRJTkdfTU9ERSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdHIgPSBTdHJpbmcodik7XHJcblxyXG4gICAgICAgIGlmIChpc051bSA9IHR5cGVvZiB2ID09ICdudW1iZXInKSB7XHJcblxyXG4gICAgICAgICAgLy8gQXZvaWQgcG90ZW50aWFsIGludGVycHJldGF0aW9uIG9mIEluZmluaXR5IGFuZCBOYU4gYXMgYmFzZSA0NCsgdmFsdWVzLlxyXG4gICAgICAgICAgaWYgKHYgKiAwICE9IDApIHJldHVybiBwYXJzZU51bWVyaWMoeCwgc3RyLCBpc051bSwgYik7XHJcblxyXG4gICAgICAgICAgeC5zID0gMSAvIHYgPCAwID8gKHN0ciA9IHN0ci5zbGljZSgxKSwgLTEpIDogMTtcclxuXHJcbiAgICAgICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gTnVtYmVyIHByaW1pdGl2ZSBoYXMgbW9yZSB0aGFuIDE1IHNpZ25pZmljYW50IGRpZ2l0czoge259J1xyXG4gICAgICAgICAgaWYgKEJpZ051bWJlci5ERUJVRyAmJiBzdHIucmVwbGFjZSgvXjBcXC4wKnxcXC4vLCAnJykubGVuZ3RoID4gMTUpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3JcclxuICAgICAgICAgICAgICh0b29NYW55RGlnaXRzICsgdik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHgucyA9IHN0ci5jaGFyQ29kZUF0KDApID09PSA0NSA/IChzdHIgPSBzdHIuc2xpY2UoMSksIC0xKSA6IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhbHBoYWJldCA9IEFMUEhBQkVULnNsaWNlKDAsIGIpO1xyXG4gICAgICAgIGUgPSBpID0gMDtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgdGhhdCBzdHIgaXMgYSB2YWxpZCBiYXNlIGIgbnVtYmVyLlxyXG4gICAgICAgIC8vIERvbid0IHVzZSBSZWdFeHAsIHNvIGFscGhhYmV0IGNhbiBjb250YWluIHNwZWNpYWwgY2hhcmFjdGVycy5cclxuICAgICAgICBmb3IgKGxlbiA9IHN0ci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgaWYgKGFscGhhYmV0LmluZGV4T2YoYyA9IHN0ci5jaGFyQXQoaSkpIDwgMCkge1xyXG4gICAgICAgICAgICBpZiAoYyA9PSAnLicpIHtcclxuXHJcbiAgICAgICAgICAgICAgLy8gSWYgJy4nIGlzIG5vdCB0aGUgZmlyc3QgY2hhcmFjdGVyIGFuZCBpdCBoYXMgbm90IGJlIGZvdW5kIGJlZm9yZS5cclxuICAgICAgICAgICAgICBpZiAoaSA+IGUpIHtcclxuICAgICAgICAgICAgICAgIGUgPSBsZW47XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWNhc2VDaGFuZ2VkKSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIEFsbG93IGUuZy4gaGV4YWRlY2ltYWwgJ0ZGJyBhcyB3ZWxsIGFzICdmZicuXHJcbiAgICAgICAgICAgICAgaWYgKHN0ciA9PSBzdHIudG9VcHBlckNhc2UoKSAmJiAoc3RyID0gc3RyLnRvTG93ZXJDYXNlKCkpIHx8XHJcbiAgICAgICAgICAgICAgICAgIHN0ciA9PSBzdHIudG9Mb3dlckNhc2UoKSAmJiAoc3RyID0gc3RyLnRvVXBwZXJDYXNlKCkpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpID0gLTE7XHJcbiAgICAgICAgICAgICAgICBlID0gMDtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlTnVtZXJpYyh4LCBTdHJpbmcodiksIGlzTnVtLCBiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFByZXZlbnQgbGF0ZXIgY2hlY2sgZm9yIGxlbmd0aCBvbiBjb252ZXJ0ZWQgbnVtYmVyLlxyXG4gICAgICAgIGlzTnVtID0gZmFsc2U7XHJcbiAgICAgICAgc3RyID0gY29udmVydEJhc2Uoc3RyLCBiLCAxMCwgeC5zKTtcclxuXHJcbiAgICAgICAgLy8gRGVjaW1hbCBwb2ludD9cclxuICAgICAgICBpZiAoKGUgPSBzdHIuaW5kZXhPZignLicpKSA+IC0xKSBzdHIgPSBzdHIucmVwbGFjZSgnLicsICcnKTtcclxuICAgICAgICBlbHNlIGUgPSBzdHIubGVuZ3RoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBEZXRlcm1pbmUgbGVhZGluZyB6ZXJvcy5cclxuICAgICAgZm9yIChpID0gMDsgc3RyLmNoYXJDb2RlQXQoaSkgPT09IDQ4OyBpKyspO1xyXG5cclxuICAgICAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgICBmb3IgKGxlbiA9IHN0ci5sZW5ndGg7IHN0ci5jaGFyQ29kZUF0KC0tbGVuKSA9PT0gNDg7KTtcclxuXHJcbiAgICAgIGlmIChzdHIgPSBzdHIuc2xpY2UoaSwgKytsZW4pKSB7XHJcbiAgICAgICAgbGVuIC09IGk7XHJcblxyXG4gICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBOdW1iZXIgcHJpbWl0aXZlIGhhcyBtb3JlIHRoYW4gMTUgc2lnbmlmaWNhbnQgZGlnaXRzOiB7bn0nXHJcbiAgICAgICAgaWYgKGlzTnVtICYmIEJpZ051bWJlci5ERUJVRyAmJlxyXG4gICAgICAgICAgbGVuID4gMTUgJiYgKHYgPiBNQVhfU0FGRV9JTlRFR0VSIHx8IHYgIT09IG1hdGhmbG9vcih2KSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3JcclxuICAgICAgICAgICAgICh0b29NYW55RGlnaXRzICsgKHgucyAqIHYpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICAvLyBPdmVyZmxvdz9cclxuICAgICAgICBpZiAoKGUgPSBlIC0gaSAtIDEpID4gTUFYX0VYUCkge1xyXG5cclxuICAgICAgICAgIC8vIEluZmluaXR5LlxyXG4gICAgICAgICAgeC5jID0geC5lID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8gVW5kZXJmbG93P1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZSA8IE1JTl9FWFApIHtcclxuXHJcbiAgICAgICAgICAvLyBaZXJvLlxyXG4gICAgICAgICAgeC5jID0gW3guZSA9IDBdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4LmUgPSBlO1xyXG4gICAgICAgICAgeC5jID0gW107XHJcblxyXG4gICAgICAgICAgLy8gVHJhbnNmb3JtIGJhc2VcclxuXHJcbiAgICAgICAgICAvLyBlIGlzIHRoZSBiYXNlIDEwIGV4cG9uZW50LlxyXG4gICAgICAgICAgLy8gaSBpcyB3aGVyZSB0byBzbGljZSBzdHIgdG8gZ2V0IHRoZSBmaXJzdCBlbGVtZW50IG9mIHRoZSBjb2VmZmljaWVudCBhcnJheS5cclxuICAgICAgICAgIGkgPSAoZSArIDEpICUgTE9HX0JBU0U7XHJcbiAgICAgICAgICBpZiAoZSA8IDApIGkgKz0gTE9HX0JBU0U7ICAvLyBpIDwgMVxyXG5cclxuICAgICAgICAgIGlmIChpIDwgbGVuKSB7XHJcbiAgICAgICAgICAgIGlmIChpKSB4LmMucHVzaCgrc3RyLnNsaWNlKDAsIGkpKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGVuIC09IExPR19CQVNFOyBpIDwgbGVuOykge1xyXG4gICAgICAgICAgICAgIHguYy5wdXNoKCtzdHIuc2xpY2UoaSwgaSArPSBMT0dfQkFTRSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpID0gTE9HX0JBU0UgLSAoc3RyID0gc3RyLnNsaWNlKGkpKS5sZW5ndGg7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpIC09IGxlbjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBmb3IgKDsgaS0tOyBzdHIgKz0gJzAnKTtcclxuICAgICAgICAgIHguYy5wdXNoKCtzdHIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gWmVyby5cclxuICAgICAgICB4LmMgPSBbeC5lID0gMF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gQ09OU1RSVUNUT1IgUFJPUEVSVElFU1xyXG5cclxuXHJcbiAgICBCaWdOdW1iZXIuY2xvbmUgPSBjbG9uZTtcclxuXHJcbiAgICBCaWdOdW1iZXIuUk9VTkRfVVAgPSAwO1xyXG4gICAgQmlnTnVtYmVyLlJPVU5EX0RPV04gPSAxO1xyXG4gICAgQmlnTnVtYmVyLlJPVU5EX0NFSUwgPSAyO1xyXG4gICAgQmlnTnVtYmVyLlJPVU5EX0ZMT09SID0gMztcclxuICAgIEJpZ051bWJlci5ST1VORF9IQUxGX1VQID0gNDtcclxuICAgIEJpZ051bWJlci5ST1VORF9IQUxGX0RPV04gPSA1O1xyXG4gICAgQmlnTnVtYmVyLlJPVU5EX0hBTEZfRVZFTiA9IDY7XHJcbiAgICBCaWdOdW1iZXIuUk9VTkRfSEFMRl9DRUlMID0gNztcclxuICAgIEJpZ051bWJlci5ST1VORF9IQUxGX0ZMT09SID0gODtcclxuICAgIEJpZ051bWJlci5FVUNMSUQgPSA5O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogQ29uZmlndXJlIGluZnJlcXVlbnRseS1jaGFuZ2luZyBsaWJyYXJ5LXdpZGUgc2V0dGluZ3MuXHJcbiAgICAgKlxyXG4gICAgICogQWNjZXB0IGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgb3B0aW9uYWwgcHJvcGVydGllcyAoaWYgdGhlIHZhbHVlIG9mIGEgcHJvcGVydHkgaXNcclxuICAgICAqIGEgbnVtYmVyLCBpdCBtdXN0IGJlIGFuIGludGVnZXIgd2l0aGluIHRoZSBpbmNsdXNpdmUgcmFuZ2Ugc3RhdGVkKTpcclxuICAgICAqXHJcbiAgICAgKiAgIERFQ0lNQUxfUExBQ0VTICAge251bWJlcn0gICAgICAgICAgIDAgdG8gTUFYXHJcbiAgICAgKiAgIFJPVU5ESU5HX01PREUgICAge251bWJlcn0gICAgICAgICAgIDAgdG8gOFxyXG4gICAgICogICBFWFBPTkVOVElBTF9BVCAgIHtudW1iZXJ8bnVtYmVyW119ICAtTUFYIHRvIE1BWCAgb3IgIFstTUFYIHRvIDAsIDAgdG8gTUFYXVxyXG4gICAgICogICBSQU5HRSAgICAgICAgICAgIHtudW1iZXJ8bnVtYmVyW119ICAtTUFYIHRvIE1BWCAobm90IHplcm8pICBvciAgWy1NQVggdG8gLTEsIDEgdG8gTUFYXVxyXG4gICAgICogICBDUllQVE8gICAgICAgICAgIHtib29sZWFufSAgICAgICAgICB0cnVlIG9yIGZhbHNlXHJcbiAgICAgKiAgIE1PRFVMT19NT0RFICAgICAge251bWJlcn0gICAgICAgICAgIDAgdG8gOVxyXG4gICAgICogICBQT1dfUFJFQ0lTSU9OICAgICAgIHtudW1iZXJ9ICAgICAgICAgICAwIHRvIE1BWFxyXG4gICAgICogICBBTFBIQUJFVCAgICAgICAgIHtzdHJpbmd9ICAgICAgICAgICBBIHN0cmluZyBvZiB0d28gb3IgbW9yZSB1bmlxdWUgY2hhcmFjdGVycyB3aGljaCBkb2VzXHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdCBjb250YWluICcuJy5cclxuICAgICAqICAgRk9STUFUICAgICAgICAgICB7b2JqZWN0fSAgICAgICAgICAgQW4gb2JqZWN0IHdpdGggc29tZSBvZiB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XHJcbiAgICAgKiAgICAgcHJlZml4ICAgICAgICAgICAgICAgICB7c3RyaW5nfVxyXG4gICAgICogICAgIGdyb3VwU2l6ZSAgICAgICAgICAgICAge251bWJlcn1cclxuICAgICAqICAgICBzZWNvbmRhcnlHcm91cFNpemUgICAgIHtudW1iZXJ9XHJcbiAgICAgKiAgICAgZ3JvdXBTZXBhcmF0b3IgICAgICAgICB7c3RyaW5nfVxyXG4gICAgICogICAgIGRlY2ltYWxTZXBhcmF0b3IgICAgICAge3N0cmluZ31cclxuICAgICAqICAgICBmcmFjdGlvbkdyb3VwU2l6ZSAgICAgIHtudW1iZXJ9XHJcbiAgICAgKiAgICAgZnJhY3Rpb25Hcm91cFNlcGFyYXRvciB7c3RyaW5nfVxyXG4gICAgICogICAgIHN1ZmZpeCAgICAgICAgICAgICAgICAge3N0cmluZ31cclxuICAgICAqXHJcbiAgICAgKiAoVGhlIHZhbHVlcyBhc3NpZ25lZCB0byB0aGUgYWJvdmUgRk9STUFUIG9iamVjdCBwcm9wZXJ0aWVzIGFyZSBub3QgY2hlY2tlZCBmb3IgdmFsaWRpdHkuKVxyXG4gICAgICpcclxuICAgICAqIEUuZy5cclxuICAgICAqIEJpZ051bWJlci5jb25maWcoeyBERUNJTUFMX1BMQUNFUyA6IDIwLCBST1VORElOR19NT0RFIDogNCB9KVxyXG4gICAgICpcclxuICAgICAqIElnbm9yZSBwcm9wZXJ0aWVzL3BhcmFtZXRlcnMgc2V0IHRvIG51bGwgb3IgdW5kZWZpbmVkLCBleGNlcHQgZm9yIEFMUEhBQkVULlxyXG4gICAgICpcclxuICAgICAqIFJldHVybiBhbiBvYmplY3Qgd2l0aCB0aGUgcHJvcGVydGllcyBjdXJyZW50IHZhbHVlcy5cclxuICAgICAqL1xyXG4gICAgQmlnTnVtYmVyLmNvbmZpZyA9IEJpZ051bWJlci5zZXQgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgIHZhciBwLCB2O1xyXG5cclxuICAgICAgaWYgKG9iaiAhPSBudWxsKSB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqID09ICdvYmplY3QnKSB7XHJcblxyXG4gICAgICAgICAgLy8gREVDSU1BTF9QTEFDRVMge251bWJlcn0gSW50ZWdlciwgMCB0byBNQVggaW5jbHVzaXZlLlxyXG4gICAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIERFQ0lNQUxfUExBQ0VTIHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHt2fSdcclxuICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCA9ICdERUNJTUFMX1BMQUNFUycpKSB7XHJcbiAgICAgICAgICAgIHYgPSBvYmpbcF07XHJcbiAgICAgICAgICAgIGludENoZWNrKHYsIDAsIE1BWCwgcCk7XHJcbiAgICAgICAgICAgIERFQ0lNQUxfUExBQ0VTID0gdjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBST1VORElOR19NT0RFIHtudW1iZXJ9IEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICAgICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gUk9VTkRJTkdfTU9ERSB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7dn0nXHJcbiAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHAgPSAnUk9VTkRJTkdfTU9ERScpKSB7XHJcbiAgICAgICAgICAgIHYgPSBvYmpbcF07XHJcbiAgICAgICAgICAgIGludENoZWNrKHYsIDAsIDgsIHApO1xyXG4gICAgICAgICAgICBST1VORElOR19NT0RFID0gdjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBFWFBPTkVOVElBTF9BVCB7bnVtYmVyfG51bWJlcltdfVxyXG4gICAgICAgICAgLy8gSW50ZWdlciwgLU1BWCB0byBNQVggaW5jbHVzaXZlIG9yXHJcbiAgICAgICAgICAvLyBbaW50ZWdlciAtTUFYIHRvIDAgaW5jbHVzaXZlLCAwIHRvIE1BWCBpbmNsdXNpdmVdLlxyXG4gICAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIEVYUE9ORU5USUFMX0FUIHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHt2fSdcclxuICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCA9ICdFWFBPTkVOVElBTF9BVCcpKSB7XHJcbiAgICAgICAgICAgIHYgPSBvYmpbcF07XHJcbiAgICAgICAgICAgIGlmICh2ICYmIHYucG9wKSB7XHJcbiAgICAgICAgICAgICAgaW50Q2hlY2sodlswXSwgLU1BWCwgMCwgcCk7XHJcbiAgICAgICAgICAgICAgaW50Q2hlY2sodlsxXSwgMCwgTUFYLCBwKTtcclxuICAgICAgICAgICAgICBUT19FWFBfTkVHID0gdlswXTtcclxuICAgICAgICAgICAgICBUT19FWFBfUE9TID0gdlsxXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBpbnRDaGVjayh2LCAtTUFYLCBNQVgsIHApO1xyXG4gICAgICAgICAgICAgIFRPX0VYUF9ORUcgPSAtKFRPX0VYUF9QT1MgPSB2IDwgMCA/IC12IDogdik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBSQU5HRSB7bnVtYmVyfG51bWJlcltdfSBOb24temVybyBpbnRlZ2VyLCAtTUFYIHRvIE1BWCBpbmNsdXNpdmUgb3JcclxuICAgICAgICAgIC8vIFtpbnRlZ2VyIC1NQVggdG8gLTEgaW5jbHVzaXZlLCBpbnRlZ2VyIDEgdG8gTUFYIGluY2x1c2l2ZV0uXHJcbiAgICAgICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gUkFOR0Uge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfGNhbm5vdCBiZSB6ZXJvfToge3Z9J1xyXG4gICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwID0gJ1JBTkdFJykpIHtcclxuICAgICAgICAgICAgdiA9IG9ialtwXTtcclxuICAgICAgICAgICAgaWYgKHYgJiYgdi5wb3ApIHtcclxuICAgICAgICAgICAgICBpbnRDaGVjayh2WzBdLCAtTUFYLCAtMSwgcCk7XHJcbiAgICAgICAgICAgICAgaW50Q2hlY2sodlsxXSwgMSwgTUFYLCBwKTtcclxuICAgICAgICAgICAgICBNSU5fRVhQID0gdlswXTtcclxuICAgICAgICAgICAgICBNQVhfRVhQID0gdlsxXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBpbnRDaGVjayh2LCAtTUFYLCBNQVgsIHApO1xyXG4gICAgICAgICAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgICAgICAgICBNSU5fRVhQID0gLShNQVhfRVhQID0gdiA8IDAgPyAtdiA6IHYpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvclxyXG4gICAgICAgICAgICAgICAgIChiaWdudW1iZXJFcnJvciArIHAgKyAnIGNhbm5vdCBiZSB6ZXJvOiAnICsgdik7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gQ1JZUFRPIHtib29sZWFufSB0cnVlIG9yIGZhbHNlLlxyXG4gICAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIENSWVBUTyBub3QgdHJ1ZSBvciBmYWxzZToge3Z9J1xyXG4gICAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIGNyeXB0byB1bmF2YWlsYWJsZSdcclxuICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCA9ICdDUllQVE8nKSkge1xyXG4gICAgICAgICAgICB2ID0gb2JqW3BdO1xyXG4gICAgICAgICAgICBpZiAodiA9PT0gISF2KSB7XHJcbiAgICAgICAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY3J5cHRvICE9ICd1bmRlZmluZWQnICYmIGNyeXB0byAmJlxyXG4gICAgICAgICAgICAgICAgIChjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzIHx8IGNyeXB0by5yYW5kb21CeXRlcykpIHtcclxuICAgICAgICAgICAgICAgICAgQ1JZUFRPID0gdjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIENSWVBUTyA9ICF2O1xyXG4gICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvclxyXG4gICAgICAgICAgICAgICAgICAgKGJpZ251bWJlckVycm9yICsgJ2NyeXB0byB1bmF2YWlsYWJsZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBDUllQVE8gPSB2O1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aHJvdyBFcnJvclxyXG4gICAgICAgICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyBwICsgJyBub3QgdHJ1ZSBvciBmYWxzZTogJyArIHYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gTU9EVUxPX01PREUge251bWJlcn0gSW50ZWdlciwgMCB0byA5IGluY2x1c2l2ZS5cclxuICAgICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBNT0RVTE9fTU9ERSB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7dn0nXHJcbiAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHAgPSAnTU9EVUxPX01PREUnKSkge1xyXG4gICAgICAgICAgICB2ID0gb2JqW3BdO1xyXG4gICAgICAgICAgICBpbnRDaGVjayh2LCAwLCA5LCBwKTtcclxuICAgICAgICAgICAgTU9EVUxPX01PREUgPSB2O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIFBPV19QUkVDSVNJT04ge251bWJlcn0gSW50ZWdlciwgMCB0byBNQVggaW5jbHVzaXZlLlxyXG4gICAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIFBPV19QUkVDSVNJT04ge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfToge3Z9J1xyXG4gICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwID0gJ1BPV19QUkVDSVNJT04nKSkge1xyXG4gICAgICAgICAgICB2ID0gb2JqW3BdO1xyXG4gICAgICAgICAgICBpbnRDaGVjayh2LCAwLCBNQVgsIHApO1xyXG4gICAgICAgICAgICBQT1dfUFJFQ0lTSU9OID0gdjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBGT1JNQVQge29iamVjdH1cclxuICAgICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBGT1JNQVQgbm90IGFuIG9iamVjdDoge3Z9J1xyXG4gICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwID0gJ0ZPUk1BVCcpKSB7XHJcbiAgICAgICAgICAgIHYgPSBvYmpbcF07XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdiA9PSAnb2JqZWN0JykgRk9STUFUID0gdjtcclxuICAgICAgICAgICAgZWxzZSB0aHJvdyBFcnJvclxyXG4gICAgICAgICAgICAgKGJpZ251bWJlckVycm9yICsgcCArICcgbm90IGFuIG9iamVjdDogJyArIHYpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIEFMUEhBQkVUIHtzdHJpbmd9XHJcbiAgICAgICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gQUxQSEFCRVQgaW52YWxpZDoge3Z9J1xyXG4gICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwID0gJ0FMUEhBQkVUJykpIHtcclxuICAgICAgICAgICAgdiA9IG9ialtwXTtcclxuXHJcbiAgICAgICAgICAgIC8vIERpc2FsbG93IGlmIGxlc3MgdGhhbiB0d28gY2hhcmFjdGVycyxcclxuICAgICAgICAgICAgLy8gb3IgaWYgaXQgY29udGFpbnMgJysnLCAnLScsICcuJywgd2hpdGVzcGFjZSwgb3IgYSByZXBlYXRlZCBjaGFyYWN0ZXIuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdiA9PSAnc3RyaW5nJyAmJiAhL14uPyR8WytcXC0uXFxzXXwoLikuKlxcMS8udGVzdCh2KSkge1xyXG4gICAgICAgICAgICAgIGFscGhhYmV0SGFzTm9ybWFsRGVjaW1hbERpZ2l0cyA9IHYuc2xpY2UoMCwgMTApID09ICcwMTIzNDU2Nzg5JztcclxuICAgICAgICAgICAgICBBTFBIQUJFVCA9IHY7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhyb3cgRXJyb3JcclxuICAgICAgICAgICAgICAgKGJpZ251bWJlckVycm9yICsgcCArICcgaW52YWxpZDogJyArIHYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIE9iamVjdCBleHBlY3RlZDoge3Z9J1xyXG4gICAgICAgICAgdGhyb3cgRXJyb3JcclxuICAgICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyAnT2JqZWN0IGV4cGVjdGVkOiAnICsgb2JqKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgREVDSU1BTF9QTEFDRVM6IERFQ0lNQUxfUExBQ0VTLFxyXG4gICAgICAgIFJPVU5ESU5HX01PREU6IFJPVU5ESU5HX01PREUsXHJcbiAgICAgICAgRVhQT05FTlRJQUxfQVQ6IFtUT19FWFBfTkVHLCBUT19FWFBfUE9TXSxcclxuICAgICAgICBSQU5HRTogW01JTl9FWFAsIE1BWF9FWFBdLFxyXG4gICAgICAgIENSWVBUTzogQ1JZUFRPLFxyXG4gICAgICAgIE1PRFVMT19NT0RFOiBNT0RVTE9fTU9ERSxcclxuICAgICAgICBQT1dfUFJFQ0lTSU9OOiBQT1dfUFJFQ0lTSU9OLFxyXG4gICAgICAgIEZPUk1BVDogRk9STUFULFxyXG4gICAgICAgIEFMUEhBQkVUOiBBTFBIQUJFVFxyXG4gICAgICB9O1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiB0cnVlIGlmIHYgaXMgYSBCaWdOdW1iZXIgaW5zdGFuY2UsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKlxyXG4gICAgICogSWYgQmlnTnVtYmVyLkRFQlVHIGlzIHRydWUsIHRocm93IGlmIGEgQmlnTnVtYmVyIGluc3RhbmNlIGlzIG5vdCB3ZWxsLWZvcm1lZC5cclxuICAgICAqXHJcbiAgICAgKiB2IHthbnl9XHJcbiAgICAgKlxyXG4gICAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEludmFsaWQgQmlnTnVtYmVyOiB7dn0nXHJcbiAgICAgKi9cclxuICAgIEJpZ051bWJlci5pc0JpZ051bWJlciA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgIGlmICghdiB8fCB2Ll9pc0JpZ051bWJlciAhPT0gdHJ1ZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZiAoIUJpZ051bWJlci5ERUJVRykgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICB2YXIgaSwgbixcclxuICAgICAgICBjID0gdi5jLFxyXG4gICAgICAgIGUgPSB2LmUsXHJcbiAgICAgICAgcyA9IHYucztcclxuXHJcbiAgICAgIG91dDogaWYgKHt9LnRvU3RyaW5nLmNhbGwoYykgPT0gJ1tvYmplY3QgQXJyYXldJykge1xyXG5cclxuICAgICAgICBpZiAoKHMgPT09IDEgfHwgcyA9PT0gLTEpICYmIGUgPj0gLU1BWCAmJiBlIDw9IE1BWCAmJiBlID09PSBtYXRoZmxvb3IoZSkpIHtcclxuXHJcbiAgICAgICAgICAvLyBJZiB0aGUgZmlyc3QgZWxlbWVudCBpcyB6ZXJvLCB0aGUgQmlnTnVtYmVyIHZhbHVlIG11c3QgYmUgemVyby5cclxuICAgICAgICAgIGlmIChjWzBdID09PSAwKSB7XHJcbiAgICAgICAgICAgIGlmIChlID09PSAwICYmIGMubGVuZ3RoID09PSAxKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgYnJlYWsgb3V0O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIENhbGN1bGF0ZSBudW1iZXIgb2YgZGlnaXRzIHRoYXQgY1swXSBzaG91bGQgaGF2ZSwgYmFzZWQgb24gdGhlIGV4cG9uZW50LlxyXG4gICAgICAgICAgaSA9IChlICsgMSkgJSBMT0dfQkFTRTtcclxuICAgICAgICAgIGlmIChpIDwgMSkgaSArPSBMT0dfQkFTRTtcclxuXHJcbiAgICAgICAgICAvLyBDYWxjdWxhdGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiBjWzBdLlxyXG4gICAgICAgICAgLy9pZiAoTWF0aC5jZWlsKE1hdGgubG9nKGNbMF0gKyAxKSAvIE1hdGguTE4xMCkgPT0gaSkge1xyXG4gICAgICAgICAgaWYgKFN0cmluZyhjWzBdKS5sZW5ndGggPT0gaSkge1xyXG5cclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICBuID0gY1tpXTtcclxuICAgICAgICAgICAgICBpZiAobiA8IDAgfHwgbiA+PSBCQVNFIHx8IG4gIT09IG1hdGhmbG9vcihuKSkgYnJlYWsgb3V0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBMYXN0IGVsZW1lbnQgY2Fubm90IGJlIHplcm8sIHVubGVzcyBpdCBpcyB0aGUgb25seSBlbGVtZW50LlxyXG4gICAgICAgICAgICBpZiAobiAhPT0gMCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgLy8gSW5maW5pdHkvTmFOXHJcbiAgICAgIH0gZWxzZSBpZiAoYyA9PT0gbnVsbCAmJiBlID09PSBudWxsICYmIChzID09PSBudWxsIHx8IHMgPT09IDEgfHwgcyA9PT0gLTEpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgKGJpZ251bWJlckVycm9yICsgJ0ludmFsaWQgQmlnTnVtYmVyOiAnICsgdik7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgbWF4aW11bSBvZiB0aGUgYXJndW1lbnRzLlxyXG4gICAgICpcclxuICAgICAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xCaWdOdW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIEJpZ051bWJlci5tYXhpbXVtID0gQmlnTnVtYmVyLm1heCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIG1heE9yTWluKGFyZ3VtZW50cywgLTEpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIG1pbmltdW0gb2YgdGhlIGFyZ3VtZW50cy5cclxuICAgICAqXHJcbiAgICAgKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8QmlnTnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBCaWdOdW1iZXIubWluaW11bSA9IEJpZ051bWJlci5taW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBtYXhPck1pbihhcmd1bWVudHMsIDEpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2l0aCBhIHJhbmRvbSB2YWx1ZSBlcXVhbCB0byBvciBncmVhdGVyIHRoYW4gMCBhbmQgbGVzcyB0aGFuIDEsXHJcbiAgICAgKiBhbmQgd2l0aCBkcCwgb3IgREVDSU1BTF9QTEFDRVMgaWYgZHAgaXMgb21pdHRlZCwgZGVjaW1hbCBwbGFjZXMgKG9yIGxlc3MgaWYgdHJhaWxpbmdcclxuICAgICAqIHplcm9zIGFyZSBwcm9kdWNlZCkuXHJcbiAgICAgKlxyXG4gICAgICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVggaW5jbHVzaXZlLlxyXG4gICAgICpcclxuICAgICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7ZHB9J1xyXG4gICAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIGNyeXB0byB1bmF2YWlsYWJsZSdcclxuICAgICAqL1xyXG4gICAgQmlnTnVtYmVyLnJhbmRvbSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBwb3cyXzUzID0gMHgyMDAwMDAwMDAwMDAwMDtcclxuXHJcbiAgICAgIC8vIFJldHVybiBhIDUzIGJpdCBpbnRlZ2VyIG4sIHdoZXJlIDAgPD0gbiA8IDkwMDcxOTkyNTQ3NDA5OTIuXHJcbiAgICAgIC8vIENoZWNrIGlmIE1hdGgucmFuZG9tKCkgcHJvZHVjZXMgbW9yZSB0aGFuIDMyIGJpdHMgb2YgcmFuZG9tbmVzcy5cclxuICAgICAgLy8gSWYgaXQgZG9lcywgYXNzdW1lIGF0IGxlYXN0IDUzIGJpdHMgYXJlIHByb2R1Y2VkLCBvdGhlcndpc2UgYXNzdW1lIGF0IGxlYXN0IDMwIGJpdHMuXHJcbiAgICAgIC8vIDB4NDAwMDAwMDAgaXMgMl4zMCwgMHg4MDAwMDAgaXMgMl4yMywgMHgxZmZmZmYgaXMgMl4yMSAtIDEuXHJcbiAgICAgIHZhciByYW5kb201M2JpdEludCA9IChNYXRoLnJhbmRvbSgpICogcG93Ml81MykgJiAweDFmZmZmZlxyXG4gICAgICAgPyBmdW5jdGlvbiAoKSB7IHJldHVybiBtYXRoZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvdzJfNTMpOyB9XHJcbiAgICAgICA6IGZ1bmN0aW9uICgpIHsgcmV0dXJuICgoTWF0aC5yYW5kb20oKSAqIDB4NDAwMDAwMDAgfCAwKSAqIDB4ODAwMDAwKSArXHJcbiAgICAgICAgIChNYXRoLnJhbmRvbSgpICogMHg4MDAwMDAgfCAwKTsgfTtcclxuXHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZHApIHtcclxuICAgICAgICB2YXIgYSwgYiwgZSwgaywgdixcclxuICAgICAgICAgIGkgPSAwLFxyXG4gICAgICAgICAgYyA9IFtdLFxyXG4gICAgICAgICAgcmFuZCA9IG5ldyBCaWdOdW1iZXIoT05FKTtcclxuXHJcbiAgICAgICAgaWYgKGRwID09IG51bGwpIGRwID0gREVDSU1BTF9QTEFDRVM7XHJcbiAgICAgICAgZWxzZSBpbnRDaGVjayhkcCwgMCwgTUFYKTtcclxuXHJcbiAgICAgICAgayA9IG1hdGhjZWlsKGRwIC8gTE9HX0JBU0UpO1xyXG5cclxuICAgICAgICBpZiAoQ1JZUFRPKSB7XHJcblxyXG4gICAgICAgICAgLy8gQnJvd3NlcnMgc3VwcG9ydGluZyBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLlxyXG4gICAgICAgICAgaWYgKGNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcclxuXHJcbiAgICAgICAgICAgIGEgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50MzJBcnJheShrICo9IDIpKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoOyBpIDwgazspIHtcclxuXHJcbiAgICAgICAgICAgICAgLy8gNTMgYml0czpcclxuICAgICAgICAgICAgICAvLyAoKE1hdGgucG93KDIsIDMyKSAtIDEpICogTWF0aC5wb3coMiwgMjEpKS50b1N0cmluZygyKVxyXG4gICAgICAgICAgICAgIC8vIDExMTExIDExMTExMTExIDExMTExMTExIDExMTExMTExIDExMTAwMDAwIDAwMDAwMDAwIDAwMDAwMDAwXHJcbiAgICAgICAgICAgICAgLy8gKChNYXRoLnBvdygyLCAzMikgLSAxKSA+Pj4gMTEpLnRvU3RyaW5nKDIpXHJcbiAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMTExMTEgMTExMTExMTEgMTExMTExMTFcclxuICAgICAgICAgICAgICAvLyAweDIwMDAwIGlzIDJeMjEuXHJcbiAgICAgICAgICAgICAgdiA9IGFbaV0gKiAweDIwMDAwICsgKGFbaSArIDFdID4+PiAxMSk7XHJcblxyXG4gICAgICAgICAgICAgIC8vIFJlamVjdGlvbiBzYW1wbGluZzpcclxuICAgICAgICAgICAgICAvLyAwIDw9IHYgPCA5MDA3MTk5MjU0NzQwOTkyXHJcbiAgICAgICAgICAgICAgLy8gUHJvYmFiaWxpdHkgdGhhdCB2ID49IDllMTUsIGlzXHJcbiAgICAgICAgICAgICAgLy8gNzE5OTI1NDc0MDk5MiAvIDkwMDcxOTkyNTQ3NDA5OTIgfj0gMC4wMDA4LCBpLmUuIDEgaW4gMTI1MVxyXG4gICAgICAgICAgICAgIGlmICh2ID49IDllMTUpIHtcclxuICAgICAgICAgICAgICAgIGIgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50MzJBcnJheSgyKSk7XHJcbiAgICAgICAgICAgICAgICBhW2ldID0gYlswXTtcclxuICAgICAgICAgICAgICAgIGFbaSArIDFdID0gYlsxXTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDAgPD0gdiA8PSA4OTk5OTk5OTk5OTk5OTk5XHJcbiAgICAgICAgICAgICAgICAvLyAwIDw9ICh2ICUgMWUxNCkgPD0gOTk5OTk5OTk5OTk5OTlcclxuICAgICAgICAgICAgICAgIGMucHVzaCh2ICUgMWUxNCk7XHJcbiAgICAgICAgICAgICAgICBpICs9IDI7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkgPSBrIC8gMjtcclxuXHJcbiAgICAgICAgICAvLyBOb2RlLmpzIHN1cHBvcnRpbmcgY3J5cHRvLnJhbmRvbUJ5dGVzLlxyXG4gICAgICAgICAgfSBlbHNlIGlmIChjcnlwdG8ucmFuZG9tQnl0ZXMpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGJ1ZmZlclxyXG4gICAgICAgICAgICBhID0gY3J5cHRvLnJhbmRvbUJ5dGVzKGsgKj0gNyk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKDsgaSA8IGs7KSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIDB4MTAwMDAwMDAwMDAwMCBpcyAyXjQ4LCAweDEwMDAwMDAwMDAwIGlzIDJeNDBcclxuICAgICAgICAgICAgICAvLyAweDEwMDAwMDAwMCBpcyAyXjMyLCAweDEwMDAwMDAgaXMgMl4yNFxyXG4gICAgICAgICAgICAgIC8vIDExMTExIDExMTExMTExIDExMTExMTExIDExMTExMTExIDExMTExMTExIDExMTExMTExIDExMTExMTExXHJcbiAgICAgICAgICAgICAgLy8gMCA8PSB2IDwgOTAwNzE5OTI1NDc0MDk5MlxyXG4gICAgICAgICAgICAgIHYgPSAoKGFbaV0gJiAzMSkgKiAweDEwMDAwMDAwMDAwMDApICsgKGFbaSArIDFdICogMHgxMDAwMDAwMDAwMCkgK1xyXG4gICAgICAgICAgICAgICAgIChhW2kgKyAyXSAqIDB4MTAwMDAwMDAwKSArIChhW2kgKyAzXSAqIDB4MTAwMDAwMCkgK1xyXG4gICAgICAgICAgICAgICAgIChhW2kgKyA0XSA8PCAxNikgKyAoYVtpICsgNV0gPDwgOCkgKyBhW2kgKyA2XTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHYgPj0gOWUxNSkge1xyXG4gICAgICAgICAgICAgICAgY3J5cHRvLnJhbmRvbUJ5dGVzKDcpLmNvcHkoYSwgaSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAwIDw9ICh2ICUgMWUxNCkgPD0gOTk5OTk5OTk5OTk5OTlcclxuICAgICAgICAgICAgICAgIGMucHVzaCh2ICUgMWUxNCk7XHJcbiAgICAgICAgICAgICAgICBpICs9IDc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkgPSBrIC8gNztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIENSWVBUTyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvclxyXG4gICAgICAgICAgICAgKGJpZ251bWJlckVycm9yICsgJ2NyeXB0byB1bmF2YWlsYWJsZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVXNlIE1hdGgucmFuZG9tLlxyXG4gICAgICAgIGlmICghQ1JZUFRPKSB7XHJcblxyXG4gICAgICAgICAgZm9yICg7IGkgPCBrOykge1xyXG4gICAgICAgICAgICB2ID0gcmFuZG9tNTNiaXRJbnQoKTtcclxuICAgICAgICAgICAgaWYgKHYgPCA5ZTE1KSBjW2krK10gPSB2ICUgMWUxNDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGsgPSBjWy0taV07XHJcbiAgICAgICAgZHAgJT0gTE9HX0JBU0U7XHJcblxyXG4gICAgICAgIC8vIENvbnZlcnQgdHJhaWxpbmcgZGlnaXRzIHRvIHplcm9zIGFjY29yZGluZyB0byBkcC5cclxuICAgICAgICBpZiAoayAmJiBkcCkge1xyXG4gICAgICAgICAgdiA9IFBPV1NfVEVOW0xPR19CQVNFIC0gZHBdO1xyXG4gICAgICAgICAgY1tpXSA9IG1hdGhmbG9vcihrIC8gdikgKiB2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIHRyYWlsaW5nIGVsZW1lbnRzIHdoaWNoIGFyZSB6ZXJvLlxyXG4gICAgICAgIGZvciAoOyBjW2ldID09PSAwOyBjLnBvcCgpLCBpLS0pO1xyXG5cclxuICAgICAgICAvLyBaZXJvP1xyXG4gICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgYyA9IFtlID0gMF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAvLyBSZW1vdmUgbGVhZGluZyBlbGVtZW50cyB3aGljaCBhcmUgemVybyBhbmQgYWRqdXN0IGV4cG9uZW50IGFjY29yZGluZ2x5LlxyXG4gICAgICAgICAgZm9yIChlID0gLTEgOyBjWzBdID09PSAwOyBjLnNwbGljZSgwLCAxKSwgZSAtPSBMT0dfQkFTRSk7XHJcblxyXG4gICAgICAgICAgLy8gQ291bnQgdGhlIGRpZ2l0cyBvZiB0aGUgZmlyc3QgZWxlbWVudCBvZiBjIHRvIGRldGVybWluZSBsZWFkaW5nIHplcm9zLCBhbmQuLi5cclxuICAgICAgICAgIGZvciAoaSA9IDEsIHYgPSBjWzBdOyB2ID49IDEwOyB2IC89IDEwLCBpKyspO1xyXG5cclxuICAgICAgICAgIC8vIGFkanVzdCB0aGUgZXhwb25lbnQgYWNjb3JkaW5nbHkuXHJcbiAgICAgICAgICBpZiAoaSA8IExPR19CQVNFKSBlIC09IExPR19CQVNFIC0gaTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJhbmQuZSA9IGU7XHJcbiAgICAgICAgcmFuZC5jID0gYztcclxuICAgICAgICByZXR1cm4gcmFuZDtcclxuICAgICAgfTtcclxuICAgIH0pKCk7XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHN1bSBvZiB0aGUgYXJndW1lbnRzLlxyXG4gICAgICpcclxuICAgICAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xCaWdOdW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIEJpZ051bWJlci5zdW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBpID0gMSxcclxuICAgICAgICBhcmdzID0gYXJndW1lbnRzLFxyXG4gICAgICAgIHN1bSA9IG5ldyBCaWdOdW1iZXIoYXJnc1swXSk7XHJcbiAgICAgIGZvciAoOyBpIDwgYXJncy5sZW5ndGg7KSBzdW0gPSBzdW0ucGx1cyhhcmdzW2krK10pO1xyXG4gICAgICByZXR1cm4gc3VtO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gUFJJVkFURSBGVU5DVElPTlNcclxuXHJcblxyXG4gICAgLy8gQ2FsbGVkIGJ5IEJpZ051bWJlciBhbmQgQmlnTnVtYmVyLnByb3RvdHlwZS50b1N0cmluZy5cclxuICAgIGNvbnZlcnRCYXNlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGRlY2ltYWwgPSAnMDEyMzQ1Njc4OSc7XHJcblxyXG4gICAgICAvKlxyXG4gICAgICAgKiBDb252ZXJ0IHN0cmluZyBvZiBiYXNlSW4gdG8gYW4gYXJyYXkgb2YgbnVtYmVycyBvZiBiYXNlT3V0LlxyXG4gICAgICAgKiBFZy4gdG9CYXNlT3V0KCcyNTUnLCAxMCwgMTYpIHJldHVybnMgWzE1LCAxNV0uXHJcbiAgICAgICAqIEVnLiB0b0Jhc2VPdXQoJ2ZmJywgMTYsIDEwKSByZXR1cm5zIFsyLCA1LCA1XS5cclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIHRvQmFzZU91dChzdHIsIGJhc2VJbiwgYmFzZU91dCwgYWxwaGFiZXQpIHtcclxuICAgICAgICB2YXIgaixcclxuICAgICAgICAgIGFyciA9IFswXSxcclxuICAgICAgICAgIGFyckwsXHJcbiAgICAgICAgICBpID0gMCxcclxuICAgICAgICAgIGxlbiA9IHN0ci5sZW5ndGg7XHJcblxyXG4gICAgICAgIGZvciAoOyBpIDwgbGVuOykge1xyXG4gICAgICAgICAgZm9yIChhcnJMID0gYXJyLmxlbmd0aDsgYXJyTC0tOyBhcnJbYXJyTF0gKj0gYmFzZUluKTtcclxuXHJcbiAgICAgICAgICBhcnJbMF0gKz0gYWxwaGFiZXQuaW5kZXhPZihzdHIuY2hhckF0KGkrKykpO1xyXG5cclxuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBhcnIubGVuZ3RoOyBqKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChhcnJbal0gPiBiYXNlT3V0IC0gMSkge1xyXG4gICAgICAgICAgICAgIGlmIChhcnJbaiArIDFdID09IG51bGwpIGFycltqICsgMV0gPSAwO1xyXG4gICAgICAgICAgICAgIGFycltqICsgMV0gKz0gYXJyW2pdIC8gYmFzZU91dCB8IDA7XHJcbiAgICAgICAgICAgICAgYXJyW2pdICU9IGJhc2VPdXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnIucmV2ZXJzZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDb252ZXJ0IGEgbnVtZXJpYyBzdHJpbmcgb2YgYmFzZUluIHRvIGEgbnVtZXJpYyBzdHJpbmcgb2YgYmFzZU91dC5cclxuICAgICAgLy8gSWYgdGhlIGNhbGxlciBpcyB0b1N0cmluZywgd2UgYXJlIGNvbnZlcnRpbmcgZnJvbSBiYXNlIDEwIHRvIGJhc2VPdXQuXHJcbiAgICAgIC8vIElmIHRoZSBjYWxsZXIgaXMgQmlnTnVtYmVyLCB3ZSBhcmUgY29udmVydGluZyBmcm9tIGJhc2VJbiB0byBiYXNlIDEwLlxyXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHN0ciwgYmFzZUluLCBiYXNlT3V0LCBzaWduLCBjYWxsZXJJc1RvU3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGFscGhhYmV0LCBkLCBlLCBrLCByLCB4LCB4YywgeSxcclxuICAgICAgICAgIGkgPSBzdHIuaW5kZXhPZignLicpLFxyXG4gICAgICAgICAgZHAgPSBERUNJTUFMX1BMQUNFUyxcclxuICAgICAgICAgIHJtID0gUk9VTkRJTkdfTU9ERTtcclxuXHJcbiAgICAgICAgLy8gTm9uLWludGVnZXIuXHJcbiAgICAgICAgaWYgKGkgPj0gMCkge1xyXG4gICAgICAgICAgayA9IFBPV19QUkVDSVNJT047XHJcblxyXG4gICAgICAgICAgLy8gVW5saW1pdGVkIHByZWNpc2lvbi5cclxuICAgICAgICAgIFBPV19QUkVDSVNJT04gPSAwO1xyXG4gICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoJy4nLCAnJyk7XHJcbiAgICAgICAgICB5ID0gbmV3IEJpZ051bWJlcihiYXNlSW4pO1xyXG4gICAgICAgICAgeCA9IHkucG93KHN0ci5sZW5ndGggLSBpKTtcclxuICAgICAgICAgIFBPV19QUkVDSVNJT04gPSBrO1xyXG5cclxuICAgICAgICAgIC8vIENvbnZlcnQgc3RyIGFzIGlmIGFuIGludGVnZXIsIHRoZW4gcmVzdG9yZSB0aGUgZnJhY3Rpb24gcGFydCBieSBkaXZpZGluZyB0aGVcclxuICAgICAgICAgIC8vIHJlc3VsdCBieSBpdHMgYmFzZSByYWlzZWQgdG8gYSBwb3dlci5cclxuXHJcbiAgICAgICAgICB5LmMgPSB0b0Jhc2VPdXQodG9GaXhlZFBvaW50KGNvZWZmVG9TdHJpbmcoeC5jKSwgeC5lLCAnMCcpLFxyXG4gICAgICAgICAgIDEwLCBiYXNlT3V0LCBkZWNpbWFsKTtcclxuICAgICAgICAgIHkuZSA9IHkuYy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDb252ZXJ0IHRoZSBudW1iZXIgYXMgaW50ZWdlci5cclxuXHJcbiAgICAgICAgeGMgPSB0b0Jhc2VPdXQoc3RyLCBiYXNlSW4sIGJhc2VPdXQsIGNhbGxlcklzVG9TdHJpbmdcclxuICAgICAgICAgPyAoYWxwaGFiZXQgPSBBTFBIQUJFVCwgZGVjaW1hbClcclxuICAgICAgICAgOiAoYWxwaGFiZXQgPSBkZWNpbWFsLCBBTFBIQUJFVCkpO1xyXG5cclxuICAgICAgICAvLyB4YyBub3cgcmVwcmVzZW50cyBzdHIgYXMgYW4gaW50ZWdlciBhbmQgY29udmVydGVkIHRvIGJhc2VPdXQuIGUgaXMgdGhlIGV4cG9uZW50LlxyXG4gICAgICAgIGUgPSBrID0geGMubGVuZ3RoO1xyXG5cclxuICAgICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgICAgZm9yICg7IHhjWy0ta10gPT0gMDsgeGMucG9wKCkpO1xyXG5cclxuICAgICAgICAvLyBaZXJvP1xyXG4gICAgICAgIGlmICgheGNbMF0pIHJldHVybiBhbHBoYWJldC5jaGFyQXQoMCk7XHJcblxyXG4gICAgICAgIC8vIERvZXMgc3RyIHJlcHJlc2VudCBhbiBpbnRlZ2VyPyBJZiBzbywgbm8gbmVlZCBmb3IgdGhlIGRpdmlzaW9uLlxyXG4gICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgLS1lO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4LmMgPSB4YztcclxuICAgICAgICAgIHguZSA9IGU7XHJcblxyXG4gICAgICAgICAgLy8gVGhlIHNpZ24gaXMgbmVlZGVkIGZvciBjb3JyZWN0IHJvdW5kaW5nLlxyXG4gICAgICAgICAgeC5zID0gc2lnbjtcclxuICAgICAgICAgIHggPSBkaXYoeCwgeSwgZHAsIHJtLCBiYXNlT3V0KTtcclxuICAgICAgICAgIHhjID0geC5jO1xyXG4gICAgICAgICAgciA9IHgucjtcclxuICAgICAgICAgIGUgPSB4LmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB4YyBub3cgcmVwcmVzZW50cyBzdHIgY29udmVydGVkIHRvIGJhc2VPdXQuXHJcblxyXG4gICAgICAgIC8vIFRoZSBpbmRleCBvZiB0aGUgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgICAgZCA9IGUgKyBkcCArIDE7XHJcblxyXG4gICAgICAgIC8vIFRoZSByb3VuZGluZyBkaWdpdDogdGhlIGRpZ2l0IHRvIHRoZSByaWdodCBvZiB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cC5cclxuICAgICAgICBpID0geGNbZF07XHJcblxyXG4gICAgICAgIC8vIExvb2sgYXQgdGhlIHJvdW5kaW5nIGRpZ2l0cyBhbmQgbW9kZSB0byBkZXRlcm1pbmUgd2hldGhlciB0byByb3VuZCB1cC5cclxuXHJcbiAgICAgICAgayA9IGJhc2VPdXQgLyAyO1xyXG4gICAgICAgIHIgPSByIHx8IGQgPCAwIHx8IHhjW2QgKyAxXSAhPSBudWxsO1xyXG5cclxuICAgICAgICByID0gcm0gPCA0ID8gKGkgIT0gbnVsbCB8fCByKSAmJiAocm0gPT0gMCB8fCBybSA9PSAoeC5zIDwgMCA/IDMgOiAyKSlcclxuICAgICAgICAgICAgICA6IGkgPiBrIHx8IGkgPT0gayAmJihybSA9PSA0IHx8IHIgfHwgcm0gPT0gNiAmJiB4Y1tkIC0gMV0gJiAxIHx8XHJcbiAgICAgICAgICAgICAgIHJtID09ICh4LnMgPCAwID8gOCA6IDcpKTtcclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIGluZGV4IG9mIHRoZSByb3VuZGluZyBkaWdpdCBpcyBub3QgZ3JlYXRlciB0aGFuIHplcm8sIG9yIHhjIHJlcHJlc2VudHNcclxuICAgICAgICAvLyB6ZXJvLCB0aGVuIHRoZSByZXN1bHQgb2YgdGhlIGJhc2UgY29udmVyc2lvbiBpcyB6ZXJvIG9yLCBpZiByb3VuZGluZyB1cCwgYSB2YWx1ZVxyXG4gICAgICAgIC8vIHN1Y2ggYXMgMC4wMDAwMS5cclxuICAgICAgICBpZiAoZCA8IDEgfHwgIXhjWzBdKSB7XHJcblxyXG4gICAgICAgICAgLy8gMV4tZHAgb3IgMFxyXG4gICAgICAgICAgc3RyID0gciA/IHRvRml4ZWRQb2ludChhbHBoYWJldC5jaGFyQXQoMSksIC1kcCwgYWxwaGFiZXQuY2hhckF0KDApKSA6IGFscGhhYmV0LmNoYXJBdCgwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIC8vIFRydW5jYXRlIHhjIHRvIHRoZSByZXF1aXJlZCBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXMuXHJcbiAgICAgICAgICB4Yy5sZW5ndGggPSBkO1xyXG5cclxuICAgICAgICAgIC8vIFJvdW5kIHVwP1xyXG4gICAgICAgICAgaWYgKHIpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFJvdW5kaW5nIHVwIG1heSBtZWFuIHRoZSBwcmV2aW91cyBkaWdpdCBoYXMgdG8gYmUgcm91bmRlZCB1cCBhbmQgc28gb24uXHJcbiAgICAgICAgICAgIGZvciAoLS1iYXNlT3V0OyArK3hjWy0tZF0gPiBiYXNlT3V0Oykge1xyXG4gICAgICAgICAgICAgIHhjW2RdID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKCFkKSB7XHJcbiAgICAgICAgICAgICAgICArK2U7XHJcbiAgICAgICAgICAgICAgICB4YyA9IFsxXS5jb25jYXQoeGMpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIERldGVybWluZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgICAgIGZvciAoayA9IHhjLmxlbmd0aDsgIXhjWy0ta107KTtcclxuXHJcbiAgICAgICAgICAvLyBFLmcuIFs0LCAxMSwgMTVdIGJlY29tZXMgNGJmLlxyXG4gICAgICAgICAgZm9yIChpID0gMCwgc3RyID0gJyc7IGkgPD0gazsgc3RyICs9IGFscGhhYmV0LmNoYXJBdCh4Y1tpKytdKSk7XHJcblxyXG4gICAgICAgICAgLy8gQWRkIGxlYWRpbmcgemVyb3MsIGRlY2ltYWwgcG9pbnQgYW5kIHRyYWlsaW5nIHplcm9zIGFzIHJlcXVpcmVkLlxyXG4gICAgICAgICAgc3RyID0gdG9GaXhlZFBvaW50KHN0ciwgZSwgYWxwaGFiZXQuY2hhckF0KDApKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRoZSBjYWxsZXIgd2lsbCBhZGQgdGhlIHNpZ24uXHJcbiAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgICAgfTtcclxuICAgIH0pKCk7XHJcblxyXG5cclxuICAgIC8vIFBlcmZvcm0gZGl2aXNpb24gaW4gdGhlIHNwZWNpZmllZCBiYXNlLiBDYWxsZWQgYnkgZGl2IGFuZCBjb252ZXJ0QmFzZS5cclxuICAgIGRpdiA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAvLyBBc3N1bWUgbm9uLXplcm8geCBhbmQgay5cclxuICAgICAgZnVuY3Rpb24gbXVsdGlwbHkoeCwgaywgYmFzZSkge1xyXG4gICAgICAgIHZhciBtLCB0ZW1wLCB4bG8sIHhoaSxcclxuICAgICAgICAgIGNhcnJ5ID0gMCxcclxuICAgICAgICAgIGkgPSB4Lmxlbmd0aCxcclxuICAgICAgICAgIGtsbyA9IGsgJSBTUVJUX0JBU0UsXHJcbiAgICAgICAgICBraGkgPSBrIC8gU1FSVF9CQVNFIHwgMDtcclxuXHJcbiAgICAgICAgZm9yICh4ID0geC5zbGljZSgpOyBpLS07KSB7XHJcbiAgICAgICAgICB4bG8gPSB4W2ldICUgU1FSVF9CQVNFO1xyXG4gICAgICAgICAgeGhpID0geFtpXSAvIFNRUlRfQkFTRSB8IDA7XHJcbiAgICAgICAgICBtID0ga2hpICogeGxvICsgeGhpICoga2xvO1xyXG4gICAgICAgICAgdGVtcCA9IGtsbyAqIHhsbyArICgobSAlIFNRUlRfQkFTRSkgKiBTUVJUX0JBU0UpICsgY2Fycnk7XHJcbiAgICAgICAgICBjYXJyeSA9ICh0ZW1wIC8gYmFzZSB8IDApICsgKG0gLyBTUVJUX0JBU0UgfCAwKSArIGtoaSAqIHhoaTtcclxuICAgICAgICAgIHhbaV0gPSB0ZW1wICUgYmFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjYXJyeSkgeCA9IFtjYXJyeV0uY29uY2F0KHgpO1xyXG5cclxuICAgICAgICByZXR1cm4geDtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gY29tcGFyZShhLCBiLCBhTCwgYkwpIHtcclxuICAgICAgICB2YXIgaSwgY21wO1xyXG5cclxuICAgICAgICBpZiAoYUwgIT0gYkwpIHtcclxuICAgICAgICAgIGNtcCA9IGFMID4gYkwgPyAxIDogLTE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICBmb3IgKGkgPSBjbXAgPSAwOyBpIDwgYUw7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKGFbaV0gIT0gYltpXSkge1xyXG4gICAgICAgICAgICAgIGNtcCA9IGFbaV0gPiBiW2ldID8gMSA6IC0xO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY21wO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBzdWJ0cmFjdChhLCBiLCBhTCwgYmFzZSkge1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuXHJcbiAgICAgICAgLy8gU3VidHJhY3QgYiBmcm9tIGEuXHJcbiAgICAgICAgZm9yICg7IGFMLS07KSB7XHJcbiAgICAgICAgICBhW2FMXSAtPSBpO1xyXG4gICAgICAgICAgaSA9IGFbYUxdIDwgYlthTF0gPyAxIDogMDtcclxuICAgICAgICAgIGFbYUxdID0gaSAqIGJhc2UgKyBhW2FMXSAtIGJbYUxdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIGxlYWRpbmcgemVyb3MuXHJcbiAgICAgICAgZm9yICg7ICFhWzBdICYmIGEubGVuZ3RoID4gMTsgYS5zcGxpY2UoMCwgMSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyB4OiBkaXZpZGVuZCwgeTogZGl2aXNvci5cclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICh4LCB5LCBkcCwgcm0sIGJhc2UpIHtcclxuICAgICAgICB2YXIgY21wLCBlLCBpLCBtb3JlLCBuLCBwcm9kLCBwcm9kTCwgcSwgcWMsIHJlbSwgcmVtTCwgcmVtMCwgeGksIHhMLCB5YzAsXHJcbiAgICAgICAgICB5TCwgeXosXHJcbiAgICAgICAgICBzID0geC5zID09IHkucyA/IDEgOiAtMSxcclxuICAgICAgICAgIHhjID0geC5jLFxyXG4gICAgICAgICAgeWMgPSB5LmM7XHJcblxyXG4gICAgICAgIC8vIEVpdGhlciBOYU4sIEluZmluaXR5IG9yIDA/XHJcbiAgICAgICAgaWYgKCF4YyB8fCAheGNbMF0gfHwgIXljIHx8ICF5Y1swXSkge1xyXG5cclxuICAgICAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKFxyXG5cclxuICAgICAgICAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBOYU4sIG9yIGJvdGggSW5maW5pdHkgb3IgMC5cclxuICAgICAgICAgICAheC5zIHx8ICF5LnMgfHwgKHhjID8geWMgJiYgeGNbMF0gPT0geWNbMF0gOiAheWMpID8gTmFOIDpcclxuXHJcbiAgICAgICAgICAgIC8vIFJldHVybiDCsTAgaWYgeCBpcyDCsTAgb3IgeSBpcyDCsUluZmluaXR5LCBvciByZXR1cm4gwrFJbmZpbml0eSBhcyB5IGlzIMKxMC5cclxuICAgICAgICAgICAgeGMgJiYgeGNbMF0gPT0gMCB8fCAheWMgPyBzICogMCA6IHMgLyAwXHJcbiAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBxID0gbmV3IEJpZ051bWJlcihzKTtcclxuICAgICAgICBxYyA9IHEuYyA9IFtdO1xyXG4gICAgICAgIGUgPSB4LmUgLSB5LmU7XHJcbiAgICAgICAgcyA9IGRwICsgZSArIDE7XHJcblxyXG4gICAgICAgIGlmICghYmFzZSkge1xyXG4gICAgICAgICAgYmFzZSA9IEJBU0U7XHJcbiAgICAgICAgICBlID0gYml0Rmxvb3IoeC5lIC8gTE9HX0JBU0UpIC0gYml0Rmxvb3IoeS5lIC8gTE9HX0JBU0UpO1xyXG4gICAgICAgICAgcyA9IHMgLyBMT0dfQkFTRSB8IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSZXN1bHQgZXhwb25lbnQgbWF5IGJlIG9uZSBsZXNzIHRoZW4gdGhlIGN1cnJlbnQgdmFsdWUgb2YgZS5cclxuICAgICAgICAvLyBUaGUgY29lZmZpY2llbnRzIG9mIHRoZSBCaWdOdW1iZXJzIGZyb20gY29udmVydEJhc2UgbWF5IGhhdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgICAgZm9yIChpID0gMDsgeWNbaV0gPT0gKHhjW2ldIHx8IDApOyBpKyspO1xyXG5cclxuICAgICAgICBpZiAoeWNbaV0gPiAoeGNbaV0gfHwgMCkpIGUtLTtcclxuXHJcbiAgICAgICAgaWYgKHMgPCAwKSB7XHJcbiAgICAgICAgICBxYy5wdXNoKDEpO1xyXG4gICAgICAgICAgbW9yZSA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHhMID0geGMubGVuZ3RoO1xyXG4gICAgICAgICAgeUwgPSB5Yy5sZW5ndGg7XHJcbiAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgIHMgKz0gMjtcclxuXHJcbiAgICAgICAgICAvLyBOb3JtYWxpc2UgeGMgYW5kIHljIHNvIGhpZ2hlc3Qgb3JkZXIgZGlnaXQgb2YgeWMgaXMgPj0gYmFzZSAvIDIuXHJcblxyXG4gICAgICAgICAgbiA9IG1hdGhmbG9vcihiYXNlIC8gKHljWzBdICsgMSkpO1xyXG5cclxuICAgICAgICAgIC8vIE5vdCBuZWNlc3NhcnksIGJ1dCB0byBoYW5kbGUgb2RkIGJhc2VzIHdoZXJlIHljWzBdID09IChiYXNlIC8gMikgLSAxLlxyXG4gICAgICAgICAgLy8gaWYgKG4gPiAxIHx8IG4rKyA9PSAxICYmIHljWzBdIDwgYmFzZSAvIDIpIHtcclxuICAgICAgICAgIGlmIChuID4gMSkge1xyXG4gICAgICAgICAgICB5YyA9IG11bHRpcGx5KHljLCBuLCBiYXNlKTtcclxuICAgICAgICAgICAgeGMgPSBtdWx0aXBseSh4YywgbiwgYmFzZSk7XHJcbiAgICAgICAgICAgIHlMID0geWMubGVuZ3RoO1xyXG4gICAgICAgICAgICB4TCA9IHhjLmxlbmd0aDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB4aSA9IHlMO1xyXG4gICAgICAgICAgcmVtID0geGMuc2xpY2UoMCwgeUwpO1xyXG4gICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgLy8gQWRkIHplcm9zIHRvIG1ha2UgcmVtYWluZGVyIGFzIGxvbmcgYXMgZGl2aXNvci5cclxuICAgICAgICAgIGZvciAoOyByZW1MIDwgeUw7IHJlbVtyZW1MKytdID0gMCk7XHJcbiAgICAgICAgICB5eiA9IHljLnNsaWNlKCk7XHJcbiAgICAgICAgICB5eiA9IFswXS5jb25jYXQoeXopO1xyXG4gICAgICAgICAgeWMwID0geWNbMF07XHJcbiAgICAgICAgICBpZiAoeWNbMV0gPj0gYmFzZSAvIDIpIHljMCsrO1xyXG4gICAgICAgICAgLy8gTm90IG5lY2Vzc2FyeSwgYnV0IHRvIHByZXZlbnQgdHJpYWwgZGlnaXQgbiA+IGJhc2UsIHdoZW4gdXNpbmcgYmFzZSAzLlxyXG4gICAgICAgICAgLy8gZWxzZSBpZiAoYmFzZSA9PSAzICYmIHljMCA9PSAxKSB5YzAgPSAxICsgMWUtMTU7XHJcblxyXG4gICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBuID0gMDtcclxuXHJcbiAgICAgICAgICAgIC8vIENvbXBhcmUgZGl2aXNvciBhbmQgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICBjbXAgPSBjb21wYXJlKHljLCByZW0sIHlMLCByZW1MKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIGRpdmlzb3IgPCByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIGlmIChjbXAgPCAwKSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSB0cmlhbCBkaWdpdCwgbi5cclxuXHJcbiAgICAgICAgICAgICAgcmVtMCA9IHJlbVswXTtcclxuICAgICAgICAgICAgICBpZiAoeUwgIT0gcmVtTCkgcmVtMCA9IHJlbTAgKiBiYXNlICsgKHJlbVsxXSB8fCAwKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gbiBpcyBob3cgbWFueSB0aW1lcyB0aGUgZGl2aXNvciBnb2VzIGludG8gdGhlIGN1cnJlbnQgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgIG4gPSBtYXRoZmxvb3IocmVtMCAvIHljMCk7XHJcblxyXG4gICAgICAgICAgICAgIC8vICBBbGdvcml0aG06XHJcbiAgICAgICAgICAgICAgLy8gIHByb2R1Y3QgPSBkaXZpc29yIG11bHRpcGxpZWQgYnkgdHJpYWwgZGlnaXQgKG4pLlxyXG4gICAgICAgICAgICAgIC8vICBDb21wYXJlIHByb2R1Y3QgYW5kIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAvLyAgSWYgcHJvZHVjdCBpcyBncmVhdGVyIHRoYW4gcmVtYWluZGVyOlxyXG4gICAgICAgICAgICAgIC8vICAgIFN1YnRyYWN0IGRpdmlzb3IgZnJvbSBwcm9kdWN0LCBkZWNyZW1lbnQgdHJpYWwgZGlnaXQuXHJcbiAgICAgICAgICAgICAgLy8gIFN1YnRyYWN0IHByb2R1Y3QgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgLy8gIElmIHByb2R1Y3Qgd2FzIGxlc3MgdGhhbiByZW1haW5kZXIgYXQgdGhlIGxhc3QgY29tcGFyZTpcclxuICAgICAgICAgICAgICAvLyAgICBDb21wYXJlIG5ldyByZW1haW5kZXIgYW5kIGRpdmlzb3IuXHJcbiAgICAgICAgICAgICAgLy8gICAgSWYgcmVtYWluZGVyIGlzIGdyZWF0ZXIgdGhhbiBkaXZpc29yOlxyXG4gICAgICAgICAgICAgIC8vICAgICAgU3VidHJhY3QgZGl2aXNvciBmcm9tIHJlbWFpbmRlciwgaW5jcmVtZW50IHRyaWFsIGRpZ2l0LlxyXG5cclxuICAgICAgICAgICAgICBpZiAobiA+IDEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBuIG1heSBiZSA+IGJhc2Ugb25seSB3aGVuIGJhc2UgaXMgMy5cclxuICAgICAgICAgICAgICAgIGlmIChuID49IGJhc2UpIG4gPSBiYXNlIC0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBwcm9kdWN0ID0gZGl2aXNvciAqIHRyaWFsIGRpZ2l0LlxyXG4gICAgICAgICAgICAgICAgcHJvZCA9IG11bHRpcGx5KHljLCBuLCBiYXNlKTtcclxuICAgICAgICAgICAgICAgIHByb2RMID0gcHJvZC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDb21wYXJlIHByb2R1Y3QgYW5kIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAgIC8vIElmIHByb2R1Y3QgPiByZW1haW5kZXIgdGhlbiB0cmlhbCBkaWdpdCBuIHRvbyBoaWdoLlxyXG4gICAgICAgICAgICAgICAgLy8gbiBpcyAxIHRvbyBoaWdoIGFib3V0IDUlIG9mIHRoZSB0aW1lLCBhbmQgaXMgbm90IGtub3duIHRvIGhhdmVcclxuICAgICAgICAgICAgICAgIC8vIGV2ZXIgYmVlbiBtb3JlIHRoYW4gMSB0b28gaGlnaC5cclxuICAgICAgICAgICAgICAgIHdoaWxlIChjb21wYXJlKHByb2QsIHJlbSwgcHJvZEwsIHJlbUwpID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgbi0tO1xyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgZGl2aXNvciBmcm9tIHByb2R1Y3QuXHJcbiAgICAgICAgICAgICAgICAgIHN1YnRyYWN0KHByb2QsIHlMIDwgcHJvZEwgPyB5eiA6IHljLCBwcm9kTCwgYmFzZSk7XHJcbiAgICAgICAgICAgICAgICAgIHByb2RMID0gcHJvZC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgIGNtcCA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBuIGlzIDAgb3IgMSwgY21wIGlzIC0xLlxyXG4gICAgICAgICAgICAgICAgLy8gSWYgbiBpcyAwLCB0aGVyZSBpcyBubyBuZWVkIHRvIGNvbXBhcmUgeWMgYW5kIHJlbSBhZ2FpbiBiZWxvdyxcclxuICAgICAgICAgICAgICAgIC8vIHNvIGNoYW5nZSBjbXAgdG8gMSB0byBhdm9pZCBpdC5cclxuICAgICAgICAgICAgICAgIC8vIElmIG4gaXMgMSwgbGVhdmUgY21wIGFzIC0xLCBzbyB5YyBhbmQgcmVtIGFyZSBjb21wYXJlZCBhZ2Fpbi5cclxuICAgICAgICAgICAgICAgIGlmIChuID09IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIGRpdmlzb3IgPCByZW1haW5kZXIsIHNvIG4gbXVzdCBiZSBhdCBsZWFzdCAxLlxyXG4gICAgICAgICAgICAgICAgICBjbXAgPSBuID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBwcm9kdWN0ID0gZGl2aXNvclxyXG4gICAgICAgICAgICAgICAgcHJvZCA9IHljLnNsaWNlKCk7XHJcbiAgICAgICAgICAgICAgICBwcm9kTCA9IHByb2QubGVuZ3RoO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKHByb2RMIDwgcmVtTCkgcHJvZCA9IFswXS5jb25jYXQocHJvZCk7XHJcblxyXG4gICAgICAgICAgICAgIC8vIFN1YnRyYWN0IHByb2R1Y3QgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgc3VidHJhY3QocmVtLCBwcm9kLCByZW1MLCBiYXNlKTtcclxuICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgIC8vIElmIHByb2R1Y3Qgd2FzIDwgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgIGlmIChjbXAgPT0gLTEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDb21wYXJlIGRpdmlzb3IgYW5kIG5ldyByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiBkaXZpc29yIDwgbmV3IHJlbWFpbmRlciwgc3VidHJhY3QgZGl2aXNvciBmcm9tIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAgIC8vIFRyaWFsIGRpZ2l0IG4gdG9vIGxvdy5cclxuICAgICAgICAgICAgICAgIC8vIG4gaXMgMSB0b28gbG93IGFib3V0IDUlIG9mIHRoZSB0aW1lLCBhbmQgdmVyeSByYXJlbHkgMiB0b28gbG93LlxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvbXBhcmUoeWMsIHJlbSwgeUwsIHJlbUwpIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgICBuKys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBkaXZpc29yIGZyb20gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgICAgICBzdWJ0cmFjdChyZW0sIHlMIDwgcmVtTCA/IHl6IDogeWMsIHJlbUwsIGJhc2UpO1xyXG4gICAgICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY21wID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgbisrO1xyXG4gICAgICAgICAgICAgIHJlbSA9IFswXTtcclxuICAgICAgICAgICAgfSAvLyBlbHNlIGNtcCA9PT0gMSBhbmQgbiB3aWxsIGJlIDBcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCB0aGUgbmV4dCBkaWdpdCwgbiwgdG8gdGhlIHJlc3VsdCBhcnJheS5cclxuICAgICAgICAgICAgcWNbaSsrXSA9IG47XHJcblxyXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgaWYgKHJlbVswXSkge1xyXG4gICAgICAgICAgICAgIHJlbVtyZW1MKytdID0geGNbeGldIHx8IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVtID0gW3hjW3hpXV07XHJcbiAgICAgICAgICAgICAgcmVtTCA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gd2hpbGUgKCh4aSsrIDwgeEwgfHwgcmVtWzBdICE9IG51bGwpICYmIHMtLSk7XHJcblxyXG4gICAgICAgICAgbW9yZSA9IHJlbVswXSAhPSBudWxsO1xyXG5cclxuICAgICAgICAgIC8vIExlYWRpbmcgemVybz9cclxuICAgICAgICAgIGlmICghcWNbMF0pIHFjLnNwbGljZSgwLCAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChiYXNlID09IEJBU0UpIHtcclxuXHJcbiAgICAgICAgICAvLyBUbyBjYWxjdWxhdGUgcS5lLCBmaXJzdCBnZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgcWNbMF0uXHJcbiAgICAgICAgICBmb3IgKGkgPSAxLCBzID0gcWNbMF07IHMgPj0gMTA7IHMgLz0gMTAsIGkrKyk7XHJcblxyXG4gICAgICAgICAgcm91bmQocSwgZHAgKyAocS5lID0gaSArIGUgKiBMT0dfQkFTRSAtIDEpICsgMSwgcm0sIG1vcmUpO1xyXG5cclxuICAgICAgICAvLyBDYWxsZXIgaXMgY29udmVydEJhc2UuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHEuZSA9IGU7XHJcbiAgICAgICAgICBxLnIgPSArbW9yZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBxO1xyXG4gICAgICB9O1xyXG4gICAgfSkoKTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIEJpZ051bWJlciBuIGluIGZpeGVkLXBvaW50IG9yIGV4cG9uZW50aWFsXHJcbiAgICAgKiBub3RhdGlvbiByb3VuZGVkIHRvIHRoZSBzcGVjaWZpZWQgZGVjaW1hbCBwbGFjZXMgb3Igc2lnbmlmaWNhbnQgZGlnaXRzLlxyXG4gICAgICpcclxuICAgICAqIG46IGEgQmlnTnVtYmVyLlxyXG4gICAgICogaTogdGhlIGluZGV4IG9mIHRoZSBsYXN0IGRpZ2l0IHJlcXVpcmVkIChpLmUuIHRoZSBkaWdpdCB0aGF0IG1heSBiZSByb3VuZGVkIHVwKS5cclxuICAgICAqIHJtOiB0aGUgcm91bmRpbmcgbW9kZS5cclxuICAgICAqIGlkOiAxICh0b0V4cG9uZW50aWFsKSBvciAyICh0b1ByZWNpc2lvbikuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGZvcm1hdChuLCBpLCBybSwgaWQpIHtcclxuICAgICAgdmFyIGMwLCBlLCBuZSwgbGVuLCBzdHI7XHJcblxyXG4gICAgICBpZiAocm0gPT0gbnVsbCkgcm0gPSBST1VORElOR19NT0RFO1xyXG4gICAgICBlbHNlIGludENoZWNrKHJtLCAwLCA4KTtcclxuXHJcbiAgICAgIGlmICghbi5jKSByZXR1cm4gbi50b1N0cmluZygpO1xyXG5cclxuICAgICAgYzAgPSBuLmNbMF07XHJcbiAgICAgIG5lID0gbi5lO1xyXG5cclxuICAgICAgaWYgKGkgPT0gbnVsbCkge1xyXG4gICAgICAgIHN0ciA9IGNvZWZmVG9TdHJpbmcobi5jKTtcclxuICAgICAgICBzdHIgPSBpZCA9PSAxIHx8IGlkID09IDIgJiYgKG5lIDw9IFRPX0VYUF9ORUcgfHwgbmUgPj0gVE9fRVhQX1BPUylcclxuICAgICAgICAgPyB0b0V4cG9uZW50aWFsKHN0ciwgbmUpXHJcbiAgICAgICAgIDogdG9GaXhlZFBvaW50KHN0ciwgbmUsICcwJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbiA9IHJvdW5kKG5ldyBCaWdOdW1iZXIobiksIGksIHJtKTtcclxuXHJcbiAgICAgICAgLy8gbi5lIG1heSBoYXZlIGNoYW5nZWQgaWYgdGhlIHZhbHVlIHdhcyByb3VuZGVkIHVwLlxyXG4gICAgICAgIGUgPSBuLmU7XHJcblxyXG4gICAgICAgIHN0ciA9IGNvZWZmVG9TdHJpbmcobi5jKTtcclxuICAgICAgICBsZW4gPSBzdHIubGVuZ3RoO1xyXG5cclxuICAgICAgICAvLyB0b1ByZWNpc2lvbiByZXR1cm5zIGV4cG9uZW50aWFsIG5vdGF0aW9uIGlmIHRoZSBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzXHJcbiAgICAgICAgLy8gc3BlY2lmaWVkIGlzIGxlc3MgdGhhbiB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBuZWNlc3NhcnkgdG8gcmVwcmVzZW50IHRoZSBpbnRlZ2VyXHJcbiAgICAgICAgLy8gcGFydCBvZiB0aGUgdmFsdWUgaW4gZml4ZWQtcG9pbnQgbm90YXRpb24uXHJcblxyXG4gICAgICAgIC8vIEV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAgICAgIGlmIChpZCA9PSAxIHx8IGlkID09IDIgJiYgKGkgPD0gZSB8fCBlIDw9IFRPX0VYUF9ORUcpKSB7XHJcblxyXG4gICAgICAgICAgLy8gQXBwZW5kIHplcm9zP1xyXG4gICAgICAgICAgZm9yICg7IGxlbiA8IGk7IHN0ciArPSAnMCcsIGxlbisrKTtcclxuICAgICAgICAgIHN0ciA9IHRvRXhwb25lbnRpYWwoc3RyLCBlKTtcclxuXHJcbiAgICAgICAgLy8gRml4ZWQtcG9pbnQgbm90YXRpb24uXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGkgLT0gbmU7XHJcbiAgICAgICAgICBzdHIgPSB0b0ZpeGVkUG9pbnQoc3RyLCBlLCAnMCcpO1xyXG5cclxuICAgICAgICAgIC8vIEFwcGVuZCB6ZXJvcz9cclxuICAgICAgICAgIGlmIChlICsgMSA+IGxlbikge1xyXG4gICAgICAgICAgICBpZiAoLS1pID4gMCkgZm9yIChzdHIgKz0gJy4nOyBpLS07IHN0ciArPSAnMCcpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaSArPSBlIC0gbGVuO1xyXG4gICAgICAgICAgICBpZiAoaSA+IDApIHtcclxuICAgICAgICAgICAgICBpZiAoZSArIDEgPT0gbGVuKSBzdHIgKz0gJy4nO1xyXG4gICAgICAgICAgICAgIGZvciAoOyBpLS07IHN0ciArPSAnMCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbi5zIDwgMCAmJiBjMCA/ICctJyArIHN0ciA6IHN0cjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gSGFuZGxlIEJpZ051bWJlci5tYXggYW5kIEJpZ051bWJlci5taW4uXHJcbiAgICAvLyBJZiBhbnkgbnVtYmVyIGlzIE5hTiwgcmV0dXJuIE5hTi5cclxuICAgIGZ1bmN0aW9uIG1heE9yTWluKGFyZ3MsIG4pIHtcclxuICAgICAgdmFyIGssIHksXHJcbiAgICAgICAgaSA9IDEsXHJcbiAgICAgICAgeCA9IG5ldyBCaWdOdW1iZXIoYXJnc1swXSk7XHJcblxyXG4gICAgICBmb3IgKDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB5ID0gbmV3IEJpZ051bWJlcihhcmdzW2ldKTtcclxuICAgICAgICBpZiAoIXkucyB8fCAoayA9IGNvbXBhcmUoeCwgeSkpID09PSBuIHx8IGsgPT09IDAgJiYgeC5zID09PSBuKSB7XHJcbiAgICAgICAgICB4ID0geTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB4O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogU3RyaXAgdHJhaWxpbmcgemVyb3MsIGNhbGN1bGF0ZSBiYXNlIDEwIGV4cG9uZW50IGFuZCBjaGVjayBhZ2FpbnN0IE1JTl9FWFAgYW5kIE1BWF9FWFAuXHJcbiAgICAgKiBDYWxsZWQgYnkgbWludXMsIHBsdXMgYW5kIHRpbWVzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBub3JtYWxpc2UobiwgYywgZSkge1xyXG4gICAgICB2YXIgaSA9IDEsXHJcbiAgICAgICAgaiA9IGMubGVuZ3RoO1xyXG5cclxuICAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgZm9yICg7ICFjWy0tal07IGMucG9wKCkpO1xyXG5cclxuICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBiYXNlIDEwIGV4cG9uZW50LiBGaXJzdCBnZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgY1swXS5cclxuICAgICAgZm9yIChqID0gY1swXTsgaiA+PSAxMDsgaiAvPSAxMCwgaSsrKTtcclxuXHJcbiAgICAgIC8vIE92ZXJmbG93P1xyXG4gICAgICBpZiAoKGUgPSBpICsgZSAqIExPR19CQVNFIC0gMSkgPiBNQVhfRVhQKSB7XHJcblxyXG4gICAgICAgIC8vIEluZmluaXR5LlxyXG4gICAgICAgIG4uYyA9IG4uZSA9IG51bGw7XHJcblxyXG4gICAgICAvLyBVbmRlcmZsb3c/XHJcbiAgICAgIH0gZWxzZSBpZiAoZSA8IE1JTl9FWFApIHtcclxuXHJcbiAgICAgICAgLy8gWmVyby5cclxuICAgICAgICBuLmMgPSBbbi5lID0gMF07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbi5lID0gZTtcclxuICAgICAgICBuLmMgPSBjO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gSGFuZGxlIHZhbHVlcyB0aGF0IGZhaWwgdGhlIHZhbGlkaXR5IHRlc3QgaW4gQmlnTnVtYmVyLlxyXG4gICAgcGFyc2VOdW1lcmljID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGJhc2VQcmVmaXggPSAvXigtPykwKFt4Ym9dKSg/PVxcd1tcXHcuXSokKS9pLFxyXG4gICAgICAgIGRvdEFmdGVyID0gL14oW14uXSspXFwuJC8sXHJcbiAgICAgICAgZG90QmVmb3JlID0gL15cXC4oW14uXSspJC8sXHJcbiAgICAgICAgaXNJbmZpbml0eU9yTmFOID0gL14tPyhJbmZpbml0eXxOYU4pJC8sXHJcbiAgICAgICAgd2hpdGVzcGFjZU9yUGx1cyA9IC9eXFxzKlxcKyg/PVtcXHcuXSl8Xlxccyt8XFxzKyQvZztcclxuXHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoeCwgc3RyLCBpc051bSwgYikge1xyXG4gICAgICAgIHZhciBiYXNlLFxyXG4gICAgICAgICAgcyA9IGlzTnVtID8gc3RyIDogc3RyLnJlcGxhY2Uod2hpdGVzcGFjZU9yUGx1cywgJycpO1xyXG5cclxuICAgICAgICAvLyBObyBleGNlcHRpb24gb24gwrFJbmZpbml0eSBvciBOYU4uXHJcbiAgICAgICAgaWYgKGlzSW5maW5pdHlPck5hTi50ZXN0KHMpKSB7XHJcbiAgICAgICAgICB4LnMgPSBpc05hTihzKSA/IG51bGwgOiBzIDwgMCA/IC0xIDogMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKCFpc051bSkge1xyXG5cclxuICAgICAgICAgICAgLy8gYmFzZVByZWZpeCA9IC9eKC0/KTAoW3hib10pKD89XFx3W1xcdy5dKiQpL2lcclxuICAgICAgICAgICAgcyA9IHMucmVwbGFjZShiYXNlUHJlZml4LCBmdW5jdGlvbiAobSwgcDEsIHAyKSB7XHJcbiAgICAgICAgICAgICAgYmFzZSA9IChwMiA9IHAyLnRvTG93ZXJDYXNlKCkpID09ICd4JyA/IDE2IDogcDIgPT0gJ2InID8gMiA6IDg7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICFiIHx8IGIgPT0gYmFzZSA/IHAxIDogbTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYikge1xyXG4gICAgICAgICAgICAgIGJhc2UgPSBiO1xyXG5cclxuICAgICAgICAgICAgICAvLyBFLmcuICcxLicgdG8gJzEnLCAnLjEnIHRvICcwLjEnXHJcbiAgICAgICAgICAgICAgcyA9IHMucmVwbGFjZShkb3RBZnRlciwgJyQxJykucmVwbGFjZShkb3RCZWZvcmUsICcwLiQxJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChzdHIgIT0gcykgcmV0dXJuIG5ldyBCaWdOdW1iZXIocywgYmFzZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIE5vdCBhIG51bWJlcjoge259J1xyXG4gICAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIE5vdCBhIGJhc2Uge2J9IG51bWJlcjoge259J1xyXG4gICAgICAgICAgaWYgKEJpZ051bWJlci5ERUJVRykge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvclxyXG4gICAgICAgICAgICAgIChiaWdudW1iZXJFcnJvciArICdOb3QgYScgKyAoYiA/ICcgYmFzZSAnICsgYiA6ICcnKSArICcgbnVtYmVyOiAnICsgc3RyKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBOYU5cclxuICAgICAgICAgIHgucyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB4LmMgPSB4LmUgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9KSgpO1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUm91bmQgeCB0byBzZCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBybS4gQ2hlY2sgZm9yIG92ZXIvdW5kZXItZmxvdy5cclxuICAgICAqIElmIHIgaXMgdHJ1dGh5LCBpdCBpcyBrbm93biB0aGF0IHRoZXJlIGFyZSBtb3JlIGRpZ2l0cyBhZnRlciB0aGUgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJvdW5kKHgsIHNkLCBybSwgcikge1xyXG4gICAgICB2YXIgZCwgaSwgaiwgaywgbiwgbmksIHJkLFxyXG4gICAgICAgIHhjID0geC5jLFxyXG4gICAgICAgIHBvd3MxMCA9IFBPV1NfVEVOO1xyXG5cclxuICAgICAgLy8gaWYgeCBpcyBub3QgSW5maW5pdHkgb3IgTmFOLi4uXHJcbiAgICAgIGlmICh4Yykge1xyXG5cclxuICAgICAgICAvLyByZCBpcyB0aGUgcm91bmRpbmcgZGlnaXQsIGkuZS4gdGhlIGRpZ2l0IGFmdGVyIHRoZSBkaWdpdCB0aGF0IG1heSBiZSByb3VuZGVkIHVwLlxyXG4gICAgICAgIC8vIG4gaXMgYSBiYXNlIDFlMTQgbnVtYmVyLCB0aGUgdmFsdWUgb2YgdGhlIGVsZW1lbnQgb2YgYXJyYXkgeC5jIGNvbnRhaW5pbmcgcmQuXHJcbiAgICAgICAgLy8gbmkgaXMgdGhlIGluZGV4IG9mIG4gd2l0aGluIHguYy5cclxuICAgICAgICAvLyBkIGlzIHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIG4uXHJcbiAgICAgICAgLy8gaSBpcyB0aGUgaW5kZXggb2YgcmQgd2l0aGluIG4gaW5jbHVkaW5nIGxlYWRpbmcgemVyb3MuXHJcbiAgICAgICAgLy8gaiBpcyB0aGUgYWN0dWFsIGluZGV4IG9mIHJkIHdpdGhpbiBuIChpZiA8IDAsIHJkIGlzIGEgbGVhZGluZyB6ZXJvKS5cclxuICAgICAgICBvdXQ6IHtcclxuXHJcbiAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgdGhlIGZpcnN0IGVsZW1lbnQgb2YgeGMuXHJcbiAgICAgICAgICBmb3IgKGQgPSAxLCBrID0geGNbMF07IGsgPj0gMTA7IGsgLz0gMTAsIGQrKyk7XHJcbiAgICAgICAgICBpID0gc2QgLSBkO1xyXG5cclxuICAgICAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdCBpcyBpbiB0aGUgZmlyc3QgZWxlbWVudCBvZiB4Yy4uLlxyXG4gICAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICAgIGkgKz0gTE9HX0JBU0U7XHJcbiAgICAgICAgICAgIGogPSBzZDtcclxuICAgICAgICAgICAgbiA9IHhjW25pID0gMF07XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHJvdW5kaW5nIGRpZ2l0IGF0IGluZGV4IGogb2Ygbi5cclxuICAgICAgICAgICAgcmQgPSBtYXRoZmxvb3IobiAvIHBvd3MxMFtkIC0gaiAtIDFdICUgMTApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmkgPSBtYXRoY2VpbCgoaSArIDEpIC8gTE9HX0JBU0UpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5pID49IHhjLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgICBpZiAocikge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIE5lZWRlZCBieSBzcXJ0LlxyXG4gICAgICAgICAgICAgICAgZm9yICg7IHhjLmxlbmd0aCA8PSBuaTsgeGMucHVzaCgwKSk7XHJcbiAgICAgICAgICAgICAgICBuID0gcmQgPSAwO1xyXG4gICAgICAgICAgICAgICAgZCA9IDE7XHJcbiAgICAgICAgICAgICAgICBpICU9IExPR19CQVNFO1xyXG4gICAgICAgICAgICAgICAgaiA9IGkgLSBMT0dfQkFTRSArIDE7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrIG91dDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbiA9IGsgPSB4Y1tuaV07XHJcblxyXG4gICAgICAgICAgICAgIC8vIEdldCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiBuLlxyXG4gICAgICAgICAgICAgIGZvciAoZCA9IDE7IGsgPj0gMTA7IGsgLz0gMTAsIGQrKyk7XHJcblxyXG4gICAgICAgICAgICAgIC8vIEdldCB0aGUgaW5kZXggb2YgcmQgd2l0aGluIG4uXHJcbiAgICAgICAgICAgICAgaSAlPSBMT0dfQkFTRTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gR2V0IHRoZSBpbmRleCBvZiByZCB3aXRoaW4gbiwgYWRqdXN0ZWQgZm9yIGxlYWRpbmcgemVyb3MuXHJcbiAgICAgICAgICAgICAgLy8gVGhlIG51bWJlciBvZiBsZWFkaW5nIHplcm9zIG9mIG4gaXMgZ2l2ZW4gYnkgTE9HX0JBU0UgLSBkLlxyXG4gICAgICAgICAgICAgIGogPSBpIC0gTE9HX0JBU0UgKyBkO1xyXG5cclxuICAgICAgICAgICAgICAvLyBHZXQgdGhlIHJvdW5kaW5nIGRpZ2l0IGF0IGluZGV4IGogb2Ygbi5cclxuICAgICAgICAgICAgICByZCA9IGogPCAwID8gMCA6IG1hdGhmbG9vcihuIC8gcG93czEwW2QgLSBqIC0gMV0gJSAxMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByID0gciB8fCBzZCA8IDAgfHxcclxuXHJcbiAgICAgICAgICAvLyBBcmUgdGhlcmUgYW55IG5vbi16ZXJvIGRpZ2l0cyBhZnRlciB0aGUgcm91bmRpbmcgZGlnaXQ/XHJcbiAgICAgICAgICAvLyBUaGUgZXhwcmVzc2lvbiAgbiAlIHBvd3MxMFtkIC0gaiAtIDFdICByZXR1cm5zIGFsbCBkaWdpdHMgb2YgbiB0byB0aGUgcmlnaHRcclxuICAgICAgICAgIC8vIG9mIHRoZSBkaWdpdCBhdCBqLCBlLmcuIGlmIG4gaXMgOTA4NzE0IGFuZCBqIGlzIDIsIHRoZSBleHByZXNzaW9uIGdpdmVzIDcxNC5cclxuICAgICAgICAgICB4Y1tuaSArIDFdICE9IG51bGwgfHwgKGogPCAwID8gbiA6IG4gJSBwb3dzMTBbZCAtIGogLSAxXSk7XHJcblxyXG4gICAgICAgICAgciA9IHJtIDwgNFxyXG4gICAgICAgICAgID8gKHJkIHx8IHIpICYmIChybSA9PSAwIHx8IHJtID09ICh4LnMgPCAwID8gMyA6IDIpKVxyXG4gICAgICAgICAgIDogcmQgPiA1IHx8IHJkID09IDUgJiYgKHJtID09IDQgfHwgciB8fCBybSA9PSA2ICYmXHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayB3aGV0aGVyIHRoZSBkaWdpdCB0byB0aGUgbGVmdCBvZiB0aGUgcm91bmRpbmcgZGlnaXQgaXMgb2RkLlxyXG4gICAgICAgICAgICAoKGkgPiAwID8gaiA+IDAgPyBuIC8gcG93czEwW2QgLSBqXSA6IDAgOiB4Y1tuaSAtIDFdKSAlIDEwKSAmIDEgfHxcclxuICAgICAgICAgICAgIHJtID09ICh4LnMgPCAwID8gOCA6IDcpKTtcclxuXHJcbiAgICAgICAgICBpZiAoc2QgPCAxIHx8ICF4Y1swXSkge1xyXG4gICAgICAgICAgICB4Yy5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHIpIHtcclxuXHJcbiAgICAgICAgICAgICAgLy8gQ29udmVydCBzZCB0byBkZWNpbWFsIHBsYWNlcy5cclxuICAgICAgICAgICAgICBzZCAtPSB4LmUgKyAxO1xyXG5cclxuICAgICAgICAgICAgICAvLyAxLCAwLjEsIDAuMDEsIDAuMDAxLCAwLjAwMDEgZXRjLlxyXG4gICAgICAgICAgICAgIHhjWzBdID0gcG93czEwWyhMT0dfQkFTRSAtIHNkICUgTE9HX0JBU0UpICUgTE9HX0JBU0VdO1xyXG4gICAgICAgICAgICAgIHguZSA9IC1zZCB8fCAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAvLyBaZXJvLlxyXG4gICAgICAgICAgICAgIHhjWzBdID0geC5lID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gUmVtb3ZlIGV4Y2VzcyBkaWdpdHMuXHJcbiAgICAgICAgICBpZiAoaSA9PSAwKSB7XHJcbiAgICAgICAgICAgIHhjLmxlbmd0aCA9IG5pO1xyXG4gICAgICAgICAgICBrID0gMTtcclxuICAgICAgICAgICAgbmktLTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHhjLmxlbmd0aCA9IG5pICsgMTtcclxuICAgICAgICAgICAgayA9IHBvd3MxMFtMT0dfQkFTRSAtIGldO1xyXG5cclxuICAgICAgICAgICAgLy8gRS5nLiA1NjcwMCBiZWNvbWVzIDU2MDAwIGlmIDcgaXMgdGhlIHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgICAgICAvLyBqID4gMCBtZWFucyBpID4gbnVtYmVyIG9mIGxlYWRpbmcgemVyb3Mgb2Ygbi5cclxuICAgICAgICAgICAgeGNbbmldID0gaiA+IDAgPyBtYXRoZmxvb3IobiAvIHBvd3MxMFtkIC0gal0gJSBwb3dzMTBbal0pICogayA6IDA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gUm91bmQgdXA/XHJcbiAgICAgICAgICBpZiAocikge1xyXG5cclxuICAgICAgICAgICAgZm9yICg7IDspIHtcclxuXHJcbiAgICAgICAgICAgICAgLy8gSWYgdGhlIGRpZ2l0IHRvIGJlIHJvdW5kZWQgdXAgaXMgaW4gdGhlIGZpcnN0IGVsZW1lbnQgb2YgeGMuLi5cclxuICAgICAgICAgICAgICBpZiAobmkgPT0gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGkgd2lsbCBiZSB0aGUgbGVuZ3RoIG9mIHhjWzBdIGJlZm9yZSBrIGlzIGFkZGVkLlxyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMSwgaiA9IHhjWzBdOyBqID49IDEwOyBqIC89IDEwLCBpKyspO1xyXG4gICAgICAgICAgICAgICAgaiA9IHhjWzBdICs9IGs7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGsgPSAxOyBqID49IDEwOyBqIC89IDEwLCBrKyspO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGlmIGkgIT0gayB0aGUgbGVuZ3RoIGhhcyBpbmNyZWFzZWQuXHJcbiAgICAgICAgICAgICAgICBpZiAoaSAhPSBrKSB7XHJcbiAgICAgICAgICAgICAgICAgIHguZSsrO1xyXG4gICAgICAgICAgICAgICAgICBpZiAoeGNbMF0gPT0gQkFTRSkgeGNbMF0gPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB4Y1tuaV0gKz0gaztcclxuICAgICAgICAgICAgICAgIGlmICh4Y1tuaV0gIT0gQkFTRSkgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB4Y1tuaS0tXSA9IDA7XHJcbiAgICAgICAgICAgICAgICBrID0gMTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgICAgICBmb3IgKGkgPSB4Yy5sZW5ndGg7IHhjWy0taV0gPT09IDA7IHhjLnBvcCgpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE92ZXJmbG93PyBJbmZpbml0eS5cclxuICAgICAgICBpZiAoeC5lID4gTUFYX0VYUCkge1xyXG4gICAgICAgICAgeC5jID0geC5lID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8gVW5kZXJmbG93PyBaZXJvLlxyXG4gICAgICAgIH0gZWxzZSBpZiAoeC5lIDwgTUlOX0VYUCkge1xyXG4gICAgICAgICAgeC5jID0gW3guZSA9IDBdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHZhbHVlT2Yobikge1xyXG4gICAgICB2YXIgc3RyLFxyXG4gICAgICAgIGUgPSBuLmU7XHJcblxyXG4gICAgICBpZiAoZSA9PT0gbnVsbCkgcmV0dXJuIG4udG9TdHJpbmcoKTtcclxuXHJcbiAgICAgIHN0ciA9IGNvZWZmVG9TdHJpbmcobi5jKTtcclxuXHJcbiAgICAgIHN0ciA9IGUgPD0gVE9fRVhQX05FRyB8fCBlID49IFRPX0VYUF9QT1NcclxuICAgICAgICA/IHRvRXhwb25lbnRpYWwoc3RyLCBlKVxyXG4gICAgICAgIDogdG9GaXhlZFBvaW50KHN0ciwgZSwgJzAnKTtcclxuXHJcbiAgICAgIHJldHVybiBuLnMgPCAwID8gJy0nICsgc3RyIDogc3RyO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyBQUk9UT1RZUEUvSU5TVEFOQ0UgTUVUSE9EU1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIuXHJcbiAgICAgKi9cclxuICAgIFAuYWJzb2x1dGVWYWx1ZSA9IFAuYWJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgeCA9IG5ldyBCaWdOdW1iZXIodGhpcyk7XHJcbiAgICAgIGlmICh4LnMgPCAwKSB4LnMgPSAxO1xyXG4gICAgICByZXR1cm4geDtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5cclxuICAgICAqICAgMSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBCaWdOdW1iZXIoeSwgYiksXHJcbiAgICAgKiAgIC0xIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBsZXNzIHRoYW4gdGhlIHZhbHVlIG9mIEJpZ051bWJlcih5LCBiKSxcclxuICAgICAqICAgMCBpZiB0aGV5IGhhdmUgdGhlIHNhbWUgdmFsdWUsXHJcbiAgICAgKiAgIG9yIG51bGwgaWYgdGhlIHZhbHVlIG9mIGVpdGhlciBpcyBOYU4uXHJcbiAgICAgKi9cclxuICAgIFAuY29tcGFyZWRUbyA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICAgIHJldHVybiBjb21wYXJlKHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYikpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIElmIGRwIGlzIHVuZGVmaW5lZCBvciBudWxsIG9yIHRydWUgb3IgZmFsc2UsIHJldHVybiB0aGUgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzIG9mIHRoZVxyXG4gICAgICogdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIsIG9yIG51bGwgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIMKxSW5maW5pdHkgb3IgTmFOLlxyXG4gICAgICpcclxuICAgICAqIE90aGVyd2lzZSwgaWYgZHAgaXMgYSBudW1iZXIsIHJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXNcclxuICAgICAqIEJpZ051bWJlciByb3VuZGVkIHRvIGEgbWF4aW11bSBvZiBkcCBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIHJtLCBvclxyXG4gICAgICogUk9VTkRJTkdfTU9ERSBpZiBybSBpcyBvbWl0dGVkLlxyXG4gICAgICpcclxuICAgICAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXM6IGludGVnZXIsIDAgdG8gTUFYIGluY2x1c2l2ZS5cclxuICAgICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgICAqXHJcbiAgICAgKiAnW0JpZ051bWJlciBFcnJvcl0gQXJndW1lbnQge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfToge2RwfHJtfSdcclxuICAgICAqL1xyXG4gICAgUC5kZWNpbWFsUGxhY2VzID0gUC5kcCA9IGZ1bmN0aW9uIChkcCwgcm0pIHtcclxuICAgICAgdmFyIGMsIG4sIHYsXHJcbiAgICAgICAgeCA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAoZHAgIT0gbnVsbCkge1xyXG4gICAgICAgIGludENoZWNrKGRwLCAwLCBNQVgpO1xyXG4gICAgICAgIGlmIChybSA9PSBudWxsKSBybSA9IFJPVU5ESU5HX01PREU7XHJcbiAgICAgICAgZWxzZSBpbnRDaGVjayhybSwgMCwgOCk7XHJcblxyXG4gICAgICAgIHJldHVybiByb3VuZChuZXcgQmlnTnVtYmVyKHgpLCBkcCArIHguZSArIDEsIHJtKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCEoYyA9IHguYykpIHJldHVybiBudWxsO1xyXG4gICAgICBuID0gKCh2ID0gYy5sZW5ndGggLSAxKSAtIGJpdEZsb29yKHRoaXMuZSAvIExPR19CQVNFKSkgKiBMT0dfQkFTRTtcclxuXHJcbiAgICAgIC8vIFN1YnRyYWN0IHRoZSBudW1iZXIgb2YgdHJhaWxpbmcgemVyb3Mgb2YgdGhlIGxhc3QgbnVtYmVyLlxyXG4gICAgICBpZiAodiA9IGNbdl0pIGZvciAoOyB2ICUgMTAgPT0gMDsgdiAvPSAxMCwgbi0tKTtcclxuICAgICAgaWYgKG4gPCAwKSBuID0gMDtcclxuXHJcbiAgICAgIHJldHVybiBuO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqICBuIC8gMCA9IElcclxuICAgICAqICBuIC8gTiA9IE5cclxuICAgICAqICBuIC8gSSA9IDBcclxuICAgICAqICAwIC8gbiA9IDBcclxuICAgICAqICAwIC8gMCA9IE5cclxuICAgICAqICAwIC8gTiA9IE5cclxuICAgICAqICAwIC8gSSA9IDBcclxuICAgICAqICBOIC8gbiA9IE5cclxuICAgICAqICBOIC8gMCA9IE5cclxuICAgICAqICBOIC8gTiA9IE5cclxuICAgICAqICBOIC8gSSA9IE5cclxuICAgICAqICBJIC8gbiA9IElcclxuICAgICAqICBJIC8gMCA9IElcclxuICAgICAqICBJIC8gTiA9IE5cclxuICAgICAqICBJIC8gSSA9IE5cclxuICAgICAqXHJcbiAgICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBkaXZpZGVkIGJ5IHRoZSB2YWx1ZSBvZlxyXG4gICAgICogQmlnTnVtYmVyKHksIGIpLCByb3VuZGVkIGFjY29yZGluZyB0byBERUNJTUFMX1BMQUNFUyBhbmQgUk9VTkRJTkdfTU9ERS5cclxuICAgICAqL1xyXG4gICAgUC5kaXZpZGVkQnkgPSBQLmRpdiA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICAgIHJldHVybiBkaXYodGhpcywgbmV3IEJpZ051bWJlcih5LCBiKSwgREVDSU1BTF9QTEFDRVMsIFJPVU5ESU5HX01PREUpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIGludGVnZXIgcGFydCBvZiBkaXZpZGluZyB0aGUgdmFsdWUgb2YgdGhpc1xyXG4gICAgICogQmlnTnVtYmVyIGJ5IHRoZSB2YWx1ZSBvZiBCaWdOdW1iZXIoeSwgYikuXHJcbiAgICAgKi9cclxuICAgIFAuZGl2aWRlZFRvSW50ZWdlckJ5ID0gUC5pZGl2ID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgICAgcmV0dXJuIGRpdih0aGlzLCBuZXcgQmlnTnVtYmVyKHksIGIpLCAwLCAxKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGV4cG9uZW50aWF0ZWQgYnkgbi5cclxuICAgICAqXHJcbiAgICAgKiBJZiBtIGlzIHByZXNlbnQsIHJldHVybiB0aGUgcmVzdWx0IG1vZHVsbyBtLlxyXG4gICAgICogSWYgbiBpcyBuZWdhdGl2ZSByb3VuZCBhY2NvcmRpbmcgdG8gREVDSU1BTF9QTEFDRVMgYW5kIFJPVU5ESU5HX01PREUuXHJcbiAgICAgKiBJZiBQT1dfUFJFQ0lTSU9OIGlzIG5vbi16ZXJvIGFuZCBtIGlzIG5vdCBwcmVzZW50LCByb3VuZCB0byBQT1dfUFJFQ0lTSU9OIHVzaW5nIFJPVU5ESU5HX01PREUuXHJcbiAgICAgKlxyXG4gICAgICogVGhlIG1vZHVsYXIgcG93ZXIgb3BlcmF0aW9uIHdvcmtzIGVmZmljaWVudGx5IHdoZW4geCwgbiwgYW5kIG0gYXJlIGludGVnZXJzLCBvdGhlcndpc2UgaXRcclxuICAgICAqIGlzIGVxdWl2YWxlbnQgdG8gY2FsY3VsYXRpbmcgeC5leHBvbmVudGlhdGVkQnkobikubW9kdWxvKG0pIHdpdGggYSBQT1dfUFJFQ0lTSU9OIG9mIDAuXHJcbiAgICAgKlxyXG4gICAgICogbiB7bnVtYmVyfHN0cmluZ3xCaWdOdW1iZXJ9IFRoZSBleHBvbmVudC4gQW4gaW50ZWdlci5cclxuICAgICAqIFttXSB7bnVtYmVyfHN0cmluZ3xCaWdOdW1iZXJ9IFRoZSBtb2R1bHVzLlxyXG4gICAgICpcclxuICAgICAqICdbQmlnTnVtYmVyIEVycm9yXSBFeHBvbmVudCBub3QgYW4gaW50ZWdlcjoge259J1xyXG4gICAgICovXHJcbiAgICBQLmV4cG9uZW50aWF0ZWRCeSA9IFAucG93ID0gZnVuY3Rpb24gKG4sIG0pIHtcclxuICAgICAgdmFyIGhhbGYsIGlzTW9kRXhwLCBpLCBrLCBtb3JlLCBuSXNCaWcsIG5Jc05lZywgbklzT2RkLCB5LFxyXG4gICAgICAgIHggPSB0aGlzO1xyXG5cclxuICAgICAgbiA9IG5ldyBCaWdOdW1iZXIobik7XHJcblxyXG4gICAgICAvLyBBbGxvdyBOYU4gYW5kIMKxSW5maW5pdHksIGJ1dCBub3Qgb3RoZXIgbm9uLWludGVnZXJzLlxyXG4gICAgICBpZiAobi5jICYmICFuLmlzSW50ZWdlcigpKSB7XHJcbiAgICAgICAgdGhyb3cgRXJyb3JcclxuICAgICAgICAgIChiaWdudW1iZXJFcnJvciArICdFeHBvbmVudCBub3QgYW4gaW50ZWdlcjogJyArIHZhbHVlT2YobikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobSAhPSBudWxsKSBtID0gbmV3IEJpZ051bWJlcihtKTtcclxuXHJcbiAgICAgIC8vIEV4cG9uZW50IG9mIE1BWF9TQUZFX0lOVEVHRVIgaXMgMTUuXHJcbiAgICAgIG5Jc0JpZyA9IG4uZSA+IDE0O1xyXG5cclxuICAgICAgLy8gSWYgeCBpcyBOYU4sIMKxSW5maW5pdHksIMKxMCBvciDCsTEsIG9yIG4gaXMgwrFJbmZpbml0eSwgTmFOIG9yIMKxMC5cclxuICAgICAgaWYgKCF4LmMgfHwgIXguY1swXSB8fCB4LmNbMF0gPT0gMSAmJiAheC5lICYmIHguYy5sZW5ndGggPT0gMSB8fCAhbi5jIHx8ICFuLmNbMF0pIHtcclxuXHJcbiAgICAgICAgLy8gVGhlIHNpZ24gb2YgdGhlIHJlc3VsdCBvZiBwb3cgd2hlbiB4IGlzIG5lZ2F0aXZlIGRlcGVuZHMgb24gdGhlIGV2ZW5uZXNzIG9mIG4uXHJcbiAgICAgICAgLy8gSWYgK24gb3ZlcmZsb3dzIHRvIMKxSW5maW5pdHksIHRoZSBldmVubmVzcyBvZiBuIHdvdWxkIGJlIG5vdCBiZSBrbm93bi5cclxuICAgICAgICB5ID0gbmV3IEJpZ051bWJlcihNYXRoLnBvdygrdmFsdWVPZih4KSwgbklzQmlnID8gbi5zICogKDIgLSBpc09kZChuKSkgOiArdmFsdWVPZihuKSkpO1xyXG4gICAgICAgIHJldHVybiBtID8geS5tb2QobSkgOiB5O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBuSXNOZWcgPSBuLnMgPCAwO1xyXG5cclxuICAgICAgaWYgKG0pIHtcclxuXHJcbiAgICAgICAgLy8geCAlIG0gcmV0dXJucyBOYU4gaWYgYWJzKG0pIGlzIHplcm8sIG9yIG0gaXMgTmFOLlxyXG4gICAgICAgIGlmIChtLmMgPyAhbS5jWzBdIDogIW0ucykgcmV0dXJuIG5ldyBCaWdOdW1iZXIoTmFOKTtcclxuXHJcbiAgICAgICAgaXNNb2RFeHAgPSAhbklzTmVnICYmIHguaXNJbnRlZ2VyKCkgJiYgbS5pc0ludGVnZXIoKTtcclxuXHJcbiAgICAgICAgaWYgKGlzTW9kRXhwKSB4ID0geC5tb2QobSk7XHJcblxyXG4gICAgICAvLyBPdmVyZmxvdyB0byDCsUluZmluaXR5OiA+PTIqKjFlMTAgb3IgPj0xLjAwMDAwMjQqKjFlMTUuXHJcbiAgICAgIC8vIFVuZGVyZmxvdyB0byDCsTA6IDw9MC43OSoqMWUxMCBvciA8PTAuOTk5OTk3NSoqMWUxNS5cclxuICAgICAgfSBlbHNlIGlmIChuLmUgPiA5ICYmICh4LmUgPiAwIHx8IHguZSA8IC0xIHx8ICh4LmUgPT0gMFxyXG4gICAgICAgIC8vIFsxLCAyNDAwMDAwMDBdXHJcbiAgICAgICAgPyB4LmNbMF0gPiAxIHx8IG5Jc0JpZyAmJiB4LmNbMV0gPj0gMjRlN1xyXG4gICAgICAgIC8vIFs4MDAwMDAwMDAwMDAwMF0gIFs5OTk5OTc1MDAwMDAwMF1cclxuICAgICAgICA6IHguY1swXSA8IDhlMTMgfHwgbklzQmlnICYmIHguY1swXSA8PSA5OTk5OTc1ZTcpKSkge1xyXG5cclxuICAgICAgICAvLyBJZiB4IGlzIG5lZ2F0aXZlIGFuZCBuIGlzIG9kZCwgayA9IC0wLCBlbHNlIGsgPSAwLlxyXG4gICAgICAgIGsgPSB4LnMgPCAwICYmIGlzT2RkKG4pID8gLTAgOiAwO1xyXG5cclxuICAgICAgICAvLyBJZiB4ID49IDEsIGsgPSDCsUluZmluaXR5LlxyXG4gICAgICAgIGlmICh4LmUgPiAtMSkgayA9IDEgLyBrO1xyXG5cclxuICAgICAgICAvLyBJZiBuIGlzIG5lZ2F0aXZlIHJldHVybiDCsTAsIGVsc2UgcmV0dXJuIMKxSW5maW5pdHkuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIobklzTmVnID8gMSAvIGsgOiBrKTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoUE9XX1BSRUNJU0lPTikge1xyXG5cclxuICAgICAgICAvLyBUcnVuY2F0aW5nIGVhY2ggY29lZmZpY2llbnQgYXJyYXkgdG8gYSBsZW5ndGggb2YgayBhZnRlciBlYWNoIG11bHRpcGxpY2F0aW9uXHJcbiAgICAgICAgLy8gZXF1YXRlcyB0byB0cnVuY2F0aW5nIHNpZ25pZmljYW50IGRpZ2l0cyB0byBQT1dfUFJFQ0lTSU9OICsgWzI4LCA0MV0sXHJcbiAgICAgICAgLy8gaS5lLiB0aGVyZSB3aWxsIGJlIGEgbWluaW11bSBvZiAyOCBndWFyZCBkaWdpdHMgcmV0YWluZWQuXHJcbiAgICAgICAgayA9IG1hdGhjZWlsKFBPV19QUkVDSVNJT04gLyBMT0dfQkFTRSArIDIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobklzQmlnKSB7XHJcbiAgICAgICAgaGFsZiA9IG5ldyBCaWdOdW1iZXIoMC41KTtcclxuICAgICAgICBpZiAobklzTmVnKSBuLnMgPSAxO1xyXG4gICAgICAgIG5Jc09kZCA9IGlzT2RkKG4pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGkgPSBNYXRoLmFicygrdmFsdWVPZihuKSk7XHJcbiAgICAgICAgbklzT2RkID0gaSAlIDI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHkgPSBuZXcgQmlnTnVtYmVyKE9ORSk7XHJcblxyXG4gICAgICAvLyBQZXJmb3JtcyA1NCBsb29wIGl0ZXJhdGlvbnMgZm9yIG4gb2YgOTAwNzE5OTI1NDc0MDk5MS5cclxuICAgICAgZm9yICg7IDspIHtcclxuXHJcbiAgICAgICAgaWYgKG5Jc09kZCkge1xyXG4gICAgICAgICAgeSA9IHkudGltZXMoeCk7XHJcbiAgICAgICAgICBpZiAoIXkuYykgYnJlYWs7XHJcblxyXG4gICAgICAgICAgaWYgKGspIHtcclxuICAgICAgICAgICAgaWYgKHkuYy5sZW5ndGggPiBrKSB5LmMubGVuZ3RoID0gaztcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaXNNb2RFeHApIHtcclxuICAgICAgICAgICAgeSA9IHkubW9kKG0pOyAgICAvL3kgPSB5Lm1pbnVzKGRpdih5LCBtLCAwLCBNT0RVTE9fTU9ERSkudGltZXMobSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGkpIHtcclxuICAgICAgICAgIGkgPSBtYXRoZmxvb3IoaSAvIDIpO1xyXG4gICAgICAgICAgaWYgKGkgPT09IDApIGJyZWFrO1xyXG4gICAgICAgICAgbklzT2RkID0gaSAlIDI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG4gPSBuLnRpbWVzKGhhbGYpO1xyXG4gICAgICAgICAgcm91bmQobiwgbi5lICsgMSwgMSk7XHJcblxyXG4gICAgICAgICAgaWYgKG4uZSA+IDE0KSB7XHJcbiAgICAgICAgICAgIG5Jc09kZCA9IGlzT2RkKG4pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaSA9ICt2YWx1ZU9mKG4pO1xyXG4gICAgICAgICAgICBpZiAoaSA9PT0gMCkgYnJlYWs7XHJcbiAgICAgICAgICAgIG5Jc09kZCA9IGkgJSAyO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgeCA9IHgudGltZXMoeCk7XHJcblxyXG4gICAgICAgIGlmIChrKSB7XHJcbiAgICAgICAgICBpZiAoeC5jICYmIHguYy5sZW5ndGggPiBrKSB4LmMubGVuZ3RoID0gaztcclxuICAgICAgICB9IGVsc2UgaWYgKGlzTW9kRXhwKSB7XHJcbiAgICAgICAgICB4ID0geC5tb2QobSk7ICAgIC8veCA9IHgubWludXMoZGl2KHgsIG0sIDAsIE1PRFVMT19NT0RFKS50aW1lcyhtKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNNb2RFeHApIHJldHVybiB5O1xyXG4gICAgICBpZiAobklzTmVnKSB5ID0gT05FLmRpdih5KTtcclxuXHJcbiAgICAgIHJldHVybiBtID8geS5tb2QobSkgOiBrID8gcm91bmQoeSwgUE9XX1BSRUNJU0lPTiwgUk9VTkRJTkdfTU9ERSwgbW9yZSkgOiB5O1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIHJvdW5kZWQgdG8gYW4gaW50ZWdlclxyXG4gICAgICogdXNpbmcgcm91bmRpbmcgbW9kZSBybSwgb3IgUk9VTkRJTkdfTU9ERSBpZiBybSBpcyBvbWl0dGVkLlxyXG4gICAgICpcclxuICAgICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgICAqXHJcbiAgICAgKiAnW0JpZ051bWJlciBFcnJvcl0gQXJndW1lbnQge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfToge3JtfSdcclxuICAgICAqL1xyXG4gICAgUC5pbnRlZ2VyVmFsdWUgPSBmdW5jdGlvbiAocm0pIHtcclxuICAgICAgdmFyIG4gPSBuZXcgQmlnTnVtYmVyKHRoaXMpO1xyXG4gICAgICBpZiAocm0gPT0gbnVsbCkgcm0gPSBST1VORElOR19NT0RFO1xyXG4gICAgICBlbHNlIGludENoZWNrKHJtLCAwLCA4KTtcclxuICAgICAgcmV0dXJuIHJvdW5kKG4sIG4uZSArIDEsIHJtKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIEJpZ051bWJlcih5LCBiKSxcclxuICAgICAqIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAuaXNFcXVhbFRvID0gUC5lcSA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICAgIHJldHVybiBjb21wYXJlKHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYikpID09PSAwO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBhIGZpbml0ZSBudW1iZXIsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAuaXNGaW5pdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiAhIXRoaXMuYztcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBCaWdOdW1iZXIoeSwgYiksXHJcbiAgICAgKiBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBQLmlzR3JlYXRlclRoYW4gPSBQLmd0ID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgICAgcmV0dXJuIGNvbXBhcmUodGhpcywgbmV3IEJpZ051bWJlcih5LCBiKSkgPiAwO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlIG9mXHJcbiAgICAgKiBCaWdOdW1iZXIoeSwgYiksIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAuaXNHcmVhdGVyVGhhbk9yRXF1YWxUbyA9IFAuZ3RlID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgICAgcmV0dXJuIChiID0gY29tcGFyZSh0aGlzLCBuZXcgQmlnTnVtYmVyKHksIGIpKSkgPT09IDEgfHwgYiA9PT0gMDtcclxuXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIGFuIGludGVnZXIsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAuaXNJbnRlZ2VyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gISF0aGlzLmMgJiYgYml0Rmxvb3IodGhpcy5lIC8gTE9HX0JBU0UpID4gdGhpcy5jLmxlbmd0aCAtIDI7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIGxlc3MgdGhhbiB0aGUgdmFsdWUgb2YgQmlnTnVtYmVyKHksIGIpLFxyXG4gICAgICogb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgUC5pc0xlc3NUaGFuID0gUC5sdCA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICAgIHJldHVybiBjb21wYXJlKHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYikpIDwgMDtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZlxyXG4gICAgICogQmlnTnVtYmVyKHksIGIpLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBQLmlzTGVzc1RoYW5PckVxdWFsVG8gPSBQLmx0ZSA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICAgIHJldHVybiAoYiA9IGNvbXBhcmUodGhpcywgbmV3IEJpZ051bWJlcih5LCBiKSkpID09PSAtMSB8fCBiID09PSAwO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBOYU4sIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAuaXNOYU4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiAhdGhpcy5zO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBuZWdhdGl2ZSwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgUC5pc05lZ2F0aXZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zIDwgMDtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgcG9zaXRpdmUsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAuaXNQb3NpdGl2ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucyA+IDA7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIDAgb3IgLTAsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAuaXNaZXJvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gISF0aGlzLmMgJiYgdGhpcy5jWzBdID09IDA7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogIG4gLSAwID0gblxyXG4gICAgICogIG4gLSBOID0gTlxyXG4gICAgICogIG4gLSBJID0gLUlcclxuICAgICAqICAwIC0gbiA9IC1uXHJcbiAgICAgKiAgMCAtIDAgPSAwXHJcbiAgICAgKiAgMCAtIE4gPSBOXHJcbiAgICAgKiAgMCAtIEkgPSAtSVxyXG4gICAgICogIE4gLSBuID0gTlxyXG4gICAgICogIE4gLSAwID0gTlxyXG4gICAgICogIE4gLSBOID0gTlxyXG4gICAgICogIE4gLSBJID0gTlxyXG4gICAgICogIEkgLSBuID0gSVxyXG4gICAgICogIEkgLSAwID0gSVxyXG4gICAgICogIEkgLSBOID0gTlxyXG4gICAgICogIEkgLSBJID0gTlxyXG4gICAgICpcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIG1pbnVzIHRoZSB2YWx1ZSBvZlxyXG4gICAgICogQmlnTnVtYmVyKHksIGIpLlxyXG4gICAgICovXHJcbiAgICBQLm1pbnVzID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgICAgdmFyIGksIGosIHQsIHhMVHksXHJcbiAgICAgICAgeCA9IHRoaXMsXHJcbiAgICAgICAgYSA9IHgucztcclxuXHJcbiAgICAgIHkgPSBuZXcgQmlnTnVtYmVyKHksIGIpO1xyXG4gICAgICBiID0geS5zO1xyXG5cclxuICAgICAgLy8gRWl0aGVyIE5hTj9cclxuICAgICAgaWYgKCFhIHx8ICFiKSByZXR1cm4gbmV3IEJpZ051bWJlcihOYU4pO1xyXG5cclxuICAgICAgLy8gU2lnbnMgZGlmZmVyP1xyXG4gICAgICBpZiAoYSAhPSBiKSB7XHJcbiAgICAgICAgeS5zID0gLWI7XHJcbiAgICAgICAgcmV0dXJuIHgucGx1cyh5KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHhlID0geC5lIC8gTE9HX0JBU0UsXHJcbiAgICAgICAgeWUgPSB5LmUgLyBMT0dfQkFTRSxcclxuICAgICAgICB4YyA9IHguYyxcclxuICAgICAgICB5YyA9IHkuYztcclxuXHJcbiAgICAgIGlmICgheGUgfHwgIXllKSB7XHJcblxyXG4gICAgICAgIC8vIEVpdGhlciBJbmZpbml0eT9cclxuICAgICAgICBpZiAoIXhjIHx8ICF5YykgcmV0dXJuIHhjID8gKHkucyA9IC1iLCB5KSA6IG5ldyBCaWdOdW1iZXIoeWMgPyB4IDogTmFOKTtcclxuXHJcbiAgICAgICAgLy8gRWl0aGVyIHplcm8/XHJcbiAgICAgICAgaWYgKCF4Y1swXSB8fCAheWNbMF0pIHtcclxuXHJcbiAgICAgICAgICAvLyBSZXR1cm4geSBpZiB5IGlzIG5vbi16ZXJvLCB4IGlmIHggaXMgbm9uLXplcm8sIG9yIHplcm8gaWYgYm90aCBhcmUgemVyby5cclxuICAgICAgICAgIHJldHVybiB5Y1swXSA/ICh5LnMgPSAtYiwgeSkgOiBuZXcgQmlnTnVtYmVyKHhjWzBdID8geCA6XHJcblxyXG4gICAgICAgICAgIC8vIElFRUUgNzU0ICgyMDA4KSA2LjM6IG4gLSBuID0gLTAgd2hlbiByb3VuZGluZyB0byAtSW5maW5pdHlcclxuICAgICAgICAgICBST1VORElOR19NT0RFID09IDMgPyAtMCA6IDApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgeGUgPSBiaXRGbG9vcih4ZSk7XHJcbiAgICAgIHllID0gYml0Rmxvb3IoeWUpO1xyXG4gICAgICB4YyA9IHhjLnNsaWNlKCk7XHJcblxyXG4gICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggaXMgdGhlIGJpZ2dlciBudW1iZXIuXHJcbiAgICAgIGlmIChhID0geGUgLSB5ZSkge1xyXG5cclxuICAgICAgICBpZiAoeExUeSA9IGEgPCAwKSB7XHJcbiAgICAgICAgICBhID0gLWE7XHJcbiAgICAgICAgICB0ID0geGM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHllID0geGU7XHJcbiAgICAgICAgICB0ID0geWM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0LnJldmVyc2UoKTtcclxuXHJcbiAgICAgICAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuXHJcbiAgICAgICAgZm9yIChiID0gYTsgYi0tOyB0LnB1c2goMCkpO1xyXG4gICAgICAgIHQucmV2ZXJzZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBFeHBvbmVudHMgZXF1YWwuIENoZWNrIGRpZ2l0IGJ5IGRpZ2l0LlxyXG4gICAgICAgIGogPSAoeExUeSA9IChhID0geGMubGVuZ3RoKSA8IChiID0geWMubGVuZ3RoKSkgPyBhIDogYjtcclxuXHJcbiAgICAgICAgZm9yIChhID0gYiA9IDA7IGIgPCBqOyBiKyspIHtcclxuXHJcbiAgICAgICAgICBpZiAoeGNbYl0gIT0geWNbYl0pIHtcclxuICAgICAgICAgICAgeExUeSA9IHhjW2JdIDwgeWNbYl07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8geCA8IHk/IFBvaW50IHhjIHRvIHRoZSBhcnJheSBvZiB0aGUgYmlnZ2VyIG51bWJlci5cclxuICAgICAgaWYgKHhMVHkpIHtcclxuICAgICAgICB0ID0geGM7XHJcbiAgICAgICAgeGMgPSB5YztcclxuICAgICAgICB5YyA9IHQ7XHJcbiAgICAgICAgeS5zID0gLXkucztcclxuICAgICAgfVxyXG5cclxuICAgICAgYiA9IChqID0geWMubGVuZ3RoKSAtIChpID0geGMubGVuZ3RoKTtcclxuXHJcbiAgICAgIC8vIEFwcGVuZCB6ZXJvcyB0byB4YyBpZiBzaG9ydGVyLlxyXG4gICAgICAvLyBObyBuZWVkIHRvIGFkZCB6ZXJvcyB0byB5YyBpZiBzaG9ydGVyIGFzIHN1YnRyYWN0IG9ubHkgbmVlZHMgdG8gc3RhcnQgYXQgeWMubGVuZ3RoLlxyXG4gICAgICBpZiAoYiA+IDApIGZvciAoOyBiLS07IHhjW2krK10gPSAwKTtcclxuICAgICAgYiA9IEJBU0UgLSAxO1xyXG5cclxuICAgICAgLy8gU3VidHJhY3QgeWMgZnJvbSB4Yy5cclxuICAgICAgZm9yICg7IGogPiBhOykge1xyXG5cclxuICAgICAgICBpZiAoeGNbLS1qXSA8IHljW2pdKSB7XHJcbiAgICAgICAgICBmb3IgKGkgPSBqOyBpICYmICF4Y1stLWldOyB4Y1tpXSA9IGIpO1xyXG4gICAgICAgICAgLS14Y1tpXTtcclxuICAgICAgICAgIHhjW2pdICs9IEJBU0U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB4Y1tqXSAtPSB5Y1tqXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUmVtb3ZlIGxlYWRpbmcgemVyb3MgYW5kIGFkanVzdCBleHBvbmVudCBhY2NvcmRpbmdseS5cclxuICAgICAgZm9yICg7IHhjWzBdID09IDA7IHhjLnNwbGljZSgwLCAxKSwgLS15ZSk7XHJcblxyXG4gICAgICAvLyBaZXJvP1xyXG4gICAgICBpZiAoIXhjWzBdKSB7XHJcblxyXG4gICAgICAgIC8vIEZvbGxvd2luZyBJRUVFIDc1NCAoMjAwOCkgNi4zLFxyXG4gICAgICAgIC8vIG4gLSBuID0gKzAgIGJ1dCAgbiAtIG4gPSAtMCAgd2hlbiByb3VuZGluZyB0b3dhcmRzIC1JbmZpbml0eS5cclxuICAgICAgICB5LnMgPSBST1VORElOR19NT0RFID09IDMgPyAtMSA6IDE7XHJcbiAgICAgICAgeS5jID0gW3kuZSA9IDBdO1xyXG4gICAgICAgIHJldHVybiB5O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBObyBuZWVkIHRvIGNoZWNrIGZvciBJbmZpbml0eSBhcyAreCAtICt5ICE9IEluZmluaXR5ICYmIC14IC0gLXkgIT0gSW5maW5pdHlcclxuICAgICAgLy8gZm9yIGZpbml0ZSB4IGFuZCB5LlxyXG4gICAgICByZXR1cm4gbm9ybWFsaXNlKHksIHhjLCB5ZSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogICBuICUgMCA9ICBOXHJcbiAgICAgKiAgIG4gJSBOID0gIE5cclxuICAgICAqICAgbiAlIEkgPSAgblxyXG4gICAgICogICAwICUgbiA9ICAwXHJcbiAgICAgKiAgLTAgJSBuID0gLTBcclxuICAgICAqICAgMCAlIDAgPSAgTlxyXG4gICAgICogICAwICUgTiA9ICBOXHJcbiAgICAgKiAgIDAgJSBJID0gIDBcclxuICAgICAqICAgTiAlIG4gPSAgTlxyXG4gICAgICogICBOICUgMCA9ICBOXHJcbiAgICAgKiAgIE4gJSBOID0gIE5cclxuICAgICAqICAgTiAlIEkgPSAgTlxyXG4gICAgICogICBJICUgbiA9ICBOXHJcbiAgICAgKiAgIEkgJSAwID0gIE5cclxuICAgICAqICAgSSAlIE4gPSAgTlxyXG4gICAgICogICBJICUgSSA9ICBOXHJcbiAgICAgKlxyXG4gICAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgbW9kdWxvIHRoZSB2YWx1ZSBvZlxyXG4gICAgICogQmlnTnVtYmVyKHksIGIpLiBUaGUgcmVzdWx0IGRlcGVuZHMgb24gdGhlIHZhbHVlIG9mIE1PRFVMT19NT0RFLlxyXG4gICAgICovXHJcbiAgICBQLm1vZHVsbyA9IFAubW9kID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgICAgdmFyIHEsIHMsXHJcbiAgICAgICAgeCA9IHRoaXM7XHJcblxyXG4gICAgICB5ID0gbmV3IEJpZ051bWJlcih5LCBiKTtcclxuXHJcbiAgICAgIC8vIFJldHVybiBOYU4gaWYgeCBpcyBJbmZpbml0eSBvciBOYU4sIG9yIHkgaXMgTmFOIG9yIHplcm8uXHJcbiAgICAgIGlmICgheC5jIHx8ICF5LnMgfHwgeS5jICYmICF5LmNbMF0pIHtcclxuICAgICAgICByZXR1cm4gbmV3IEJpZ051bWJlcihOYU4pO1xyXG5cclxuICAgICAgLy8gUmV0dXJuIHggaWYgeSBpcyBJbmZpbml0eSBvciB4IGlzIHplcm8uXHJcbiAgICAgIH0gZWxzZSBpZiAoIXkuYyB8fCB4LmMgJiYgIXguY1swXSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKHgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoTU9EVUxPX01PREUgPT0gOSkge1xyXG5cclxuICAgICAgICAvLyBFdWNsaWRpYW4gZGl2aXNpb246IHEgPSBzaWduKHkpICogZmxvb3IoeCAvIGFicyh5KSlcclxuICAgICAgICAvLyByID0geCAtIHF5ICAgIHdoZXJlICAwIDw9IHIgPCBhYnMoeSlcclxuICAgICAgICBzID0geS5zO1xyXG4gICAgICAgIHkucyA9IDE7XHJcbiAgICAgICAgcSA9IGRpdih4LCB5LCAwLCAzKTtcclxuICAgICAgICB5LnMgPSBzO1xyXG4gICAgICAgIHEucyAqPSBzO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHEgPSBkaXYoeCwgeSwgMCwgTU9EVUxPX01PREUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB5ID0geC5taW51cyhxLnRpbWVzKHkpKTtcclxuXHJcbiAgICAgIC8vIFRvIG1hdGNoIEphdmFTY3JpcHQgJSwgZW5zdXJlIHNpZ24gb2YgemVybyBpcyBzaWduIG9mIGRpdmlkZW5kLlxyXG4gICAgICBpZiAoIXkuY1swXSAmJiBNT0RVTE9fTU9ERSA9PSAxKSB5LnMgPSB4LnM7XHJcblxyXG4gICAgICByZXR1cm4geTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiAgbiAqIDAgPSAwXHJcbiAgICAgKiAgbiAqIE4gPSBOXHJcbiAgICAgKiAgbiAqIEkgPSBJXHJcbiAgICAgKiAgMCAqIG4gPSAwXHJcbiAgICAgKiAgMCAqIDAgPSAwXHJcbiAgICAgKiAgMCAqIE4gPSBOXHJcbiAgICAgKiAgMCAqIEkgPSBOXHJcbiAgICAgKiAgTiAqIG4gPSBOXHJcbiAgICAgKiAgTiAqIDAgPSBOXHJcbiAgICAgKiAgTiAqIE4gPSBOXHJcbiAgICAgKiAgTiAqIEkgPSBOXHJcbiAgICAgKiAgSSAqIG4gPSBJXHJcbiAgICAgKiAgSSAqIDAgPSBOXHJcbiAgICAgKiAgSSAqIE4gPSBOXHJcbiAgICAgKiAgSSAqIEkgPSBJXHJcbiAgICAgKlxyXG4gICAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgbXVsdGlwbGllZCBieSB0aGUgdmFsdWVcclxuICAgICAqIG9mIEJpZ051bWJlcih5LCBiKS5cclxuICAgICAqL1xyXG4gICAgUC5tdWx0aXBsaWVkQnkgPSBQLnRpbWVzID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgICAgdmFyIGMsIGUsIGksIGosIGssIG0sIHhjTCwgeGxvLCB4aGksIHljTCwgeWxvLCB5aGksIHpjLFxyXG4gICAgICAgIGJhc2UsIHNxcnRCYXNlLFxyXG4gICAgICAgIHggPSB0aGlzLFxyXG4gICAgICAgIHhjID0geC5jLFxyXG4gICAgICAgIHljID0gKHkgPSBuZXcgQmlnTnVtYmVyKHksIGIpKS5jO1xyXG5cclxuICAgICAgLy8gRWl0aGVyIE5hTiwgwrFJbmZpbml0eSBvciDCsTA/XHJcbiAgICAgIGlmICgheGMgfHwgIXljIHx8ICF4Y1swXSB8fCAheWNbMF0pIHtcclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIE5hTiBpZiBlaXRoZXIgaXMgTmFOLCBvciBvbmUgaXMgMCBhbmQgdGhlIG90aGVyIGlzIEluZmluaXR5LlxyXG4gICAgICAgIGlmICgheC5zIHx8ICF5LnMgfHwgeGMgJiYgIXhjWzBdICYmICF5YyB8fCB5YyAmJiAheWNbMF0gJiYgIXhjKSB7XHJcbiAgICAgICAgICB5LmMgPSB5LmUgPSB5LnMgPSBudWxsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB5LnMgKj0geC5zO1xyXG5cclxuICAgICAgICAgIC8vIFJldHVybiDCsUluZmluaXR5IGlmIGVpdGhlciBpcyDCsUluZmluaXR5LlxyXG4gICAgICAgICAgaWYgKCF4YyB8fCAheWMpIHtcclxuICAgICAgICAgICAgeS5jID0geS5lID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAvLyBSZXR1cm4gwrEwIGlmIGVpdGhlciBpcyDCsTAuXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB5LmMgPSBbMF07XHJcbiAgICAgICAgICAgIHkuZSA9IDA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4geTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZSA9IGJpdEZsb29yKHguZSAvIExPR19CQVNFKSArIGJpdEZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuICAgICAgeS5zICo9IHgucztcclxuICAgICAgeGNMID0geGMubGVuZ3RoO1xyXG4gICAgICB5Y0wgPSB5Yy5sZW5ndGg7XHJcblxyXG4gICAgICAvLyBFbnN1cmUgeGMgcG9pbnRzIHRvIGxvbmdlciBhcnJheSBhbmQgeGNMIHRvIGl0cyBsZW5ndGguXHJcbiAgICAgIGlmICh4Y0wgPCB5Y0wpIHtcclxuICAgICAgICB6YyA9IHhjO1xyXG4gICAgICAgIHhjID0geWM7XHJcbiAgICAgICAgeWMgPSB6YztcclxuICAgICAgICBpID0geGNMO1xyXG4gICAgICAgIHhjTCA9IHljTDtcclxuICAgICAgICB5Y0wgPSBpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBJbml0aWFsaXNlIHRoZSByZXN1bHQgYXJyYXkgd2l0aCB6ZXJvcy5cclxuICAgICAgZm9yIChpID0geGNMICsgeWNMLCB6YyA9IFtdOyBpLS07IHpjLnB1c2goMCkpO1xyXG5cclxuICAgICAgYmFzZSA9IEJBU0U7XHJcbiAgICAgIHNxcnRCYXNlID0gU1FSVF9CQVNFO1xyXG5cclxuICAgICAgZm9yIChpID0geWNMOyAtLWkgPj0gMDspIHtcclxuICAgICAgICBjID0gMDtcclxuICAgICAgICB5bG8gPSB5Y1tpXSAlIHNxcnRCYXNlO1xyXG4gICAgICAgIHloaSA9IHljW2ldIC8gc3FydEJhc2UgfCAwO1xyXG5cclxuICAgICAgICBmb3IgKGsgPSB4Y0wsIGogPSBpICsgazsgaiA+IGk7KSB7XHJcbiAgICAgICAgICB4bG8gPSB4Y1stLWtdICUgc3FydEJhc2U7XHJcbiAgICAgICAgICB4aGkgPSB4Y1trXSAvIHNxcnRCYXNlIHwgMDtcclxuICAgICAgICAgIG0gPSB5aGkgKiB4bG8gKyB4aGkgKiB5bG87XHJcbiAgICAgICAgICB4bG8gPSB5bG8gKiB4bG8gKyAoKG0gJSBzcXJ0QmFzZSkgKiBzcXJ0QmFzZSkgKyB6Y1tqXSArIGM7XHJcbiAgICAgICAgICBjID0gKHhsbyAvIGJhc2UgfCAwKSArIChtIC8gc3FydEJhc2UgfCAwKSArIHloaSAqIHhoaTtcclxuICAgICAgICAgIHpjW2otLV0gPSB4bG8gJSBiYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgemNbal0gPSBjO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoYykge1xyXG4gICAgICAgICsrZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB6Yy5zcGxpY2UoMCwgMSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBub3JtYWxpc2UoeSwgemMsIGUpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIG5lZ2F0ZWQsXHJcbiAgICAgKiBpLmUuIG11bHRpcGxpZWQgYnkgLTEuXHJcbiAgICAgKi9cclxuICAgIFAubmVnYXRlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHggPSBuZXcgQmlnTnVtYmVyKHRoaXMpO1xyXG4gICAgICB4LnMgPSAteC5zIHx8IG51bGw7XHJcbiAgICAgIHJldHVybiB4O1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqICBuICsgMCA9IG5cclxuICAgICAqICBuICsgTiA9IE5cclxuICAgICAqICBuICsgSSA9IElcclxuICAgICAqICAwICsgbiA9IG5cclxuICAgICAqICAwICsgMCA9IDBcclxuICAgICAqICAwICsgTiA9IE5cclxuICAgICAqICAwICsgSSA9IElcclxuICAgICAqICBOICsgbiA9IE5cclxuICAgICAqICBOICsgMCA9IE5cclxuICAgICAqICBOICsgTiA9IE5cclxuICAgICAqICBOICsgSSA9IE5cclxuICAgICAqICBJICsgbiA9IElcclxuICAgICAqICBJICsgMCA9IElcclxuICAgICAqICBJICsgTiA9IE5cclxuICAgICAqICBJICsgSSA9IElcclxuICAgICAqXHJcbiAgICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBwbHVzIHRoZSB2YWx1ZSBvZlxyXG4gICAgICogQmlnTnVtYmVyKHksIGIpLlxyXG4gICAgICovXHJcbiAgICBQLnBsdXMgPSBmdW5jdGlvbiAoeSwgYikge1xyXG4gICAgICB2YXIgdCxcclxuICAgICAgICB4ID0gdGhpcyxcclxuICAgICAgICBhID0geC5zO1xyXG5cclxuICAgICAgeSA9IG5ldyBCaWdOdW1iZXIoeSwgYik7XHJcbiAgICAgIGIgPSB5LnM7XHJcblxyXG4gICAgICAvLyBFaXRoZXIgTmFOP1xyXG4gICAgICBpZiAoIWEgfHwgIWIpIHJldHVybiBuZXcgQmlnTnVtYmVyKE5hTik7XHJcblxyXG4gICAgICAvLyBTaWducyBkaWZmZXI/XHJcbiAgICAgICBpZiAoYSAhPSBiKSB7XHJcbiAgICAgICAgeS5zID0gLWI7XHJcbiAgICAgICAgcmV0dXJuIHgubWludXMoeSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciB4ZSA9IHguZSAvIExPR19CQVNFLFxyXG4gICAgICAgIHllID0geS5lIC8gTE9HX0JBU0UsXHJcbiAgICAgICAgeGMgPSB4LmMsXHJcbiAgICAgICAgeWMgPSB5LmM7XHJcblxyXG4gICAgICBpZiAoIXhlIHx8ICF5ZSkge1xyXG5cclxuICAgICAgICAvLyBSZXR1cm4gwrFJbmZpbml0eSBpZiBlaXRoZXIgwrFJbmZpbml0eS5cclxuICAgICAgICBpZiAoIXhjIHx8ICF5YykgcmV0dXJuIG5ldyBCaWdOdW1iZXIoYSAvIDApO1xyXG5cclxuICAgICAgICAvLyBFaXRoZXIgemVybz9cclxuICAgICAgICAvLyBSZXR1cm4geSBpZiB5IGlzIG5vbi16ZXJvLCB4IGlmIHggaXMgbm9uLXplcm8sIG9yIHplcm8gaWYgYm90aCBhcmUgemVyby5cclxuICAgICAgICBpZiAoIXhjWzBdIHx8ICF5Y1swXSkgcmV0dXJuIHljWzBdID8geSA6IG5ldyBCaWdOdW1iZXIoeGNbMF0gPyB4IDogYSAqIDApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB4ZSA9IGJpdEZsb29yKHhlKTtcclxuICAgICAgeWUgPSBiaXRGbG9vcih5ZSk7XHJcbiAgICAgIHhjID0geGMuc2xpY2UoKTtcclxuXHJcbiAgICAgIC8vIFByZXBlbmQgemVyb3MgdG8gZXF1YWxpc2UgZXhwb25lbnRzLiBGYXN0ZXIgdG8gdXNlIHJldmVyc2UgdGhlbiBkbyB1bnNoaWZ0cy5cclxuICAgICAgaWYgKGEgPSB4ZSAtIHllKSB7XHJcbiAgICAgICAgaWYgKGEgPiAwKSB7XHJcbiAgICAgICAgICB5ZSA9IHhlO1xyXG4gICAgICAgICAgdCA9IHljO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhID0gLWE7XHJcbiAgICAgICAgICB0ID0geGM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0LnJldmVyc2UoKTtcclxuICAgICAgICBmb3IgKDsgYS0tOyB0LnB1c2goMCkpO1xyXG4gICAgICAgIHQucmV2ZXJzZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBhID0geGMubGVuZ3RoO1xyXG4gICAgICBiID0geWMubGVuZ3RoO1xyXG5cclxuICAgICAgLy8gUG9pbnQgeGMgdG8gdGhlIGxvbmdlciBhcnJheSwgYW5kIGIgdG8gdGhlIHNob3J0ZXIgbGVuZ3RoLlxyXG4gICAgICBpZiAoYSAtIGIgPCAwKSB7XHJcbiAgICAgICAgdCA9IHljO1xyXG4gICAgICAgIHljID0geGM7XHJcbiAgICAgICAgeGMgPSB0O1xyXG4gICAgICAgIGIgPSBhO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBPbmx5IHN0YXJ0IGFkZGluZyBhdCB5Yy5sZW5ndGggLSAxIGFzIHRoZSBmdXJ0aGVyIGRpZ2l0cyBvZiB4YyBjYW4gYmUgaWdub3JlZC5cclxuICAgICAgZm9yIChhID0gMDsgYjspIHtcclxuICAgICAgICBhID0gKHhjWy0tYl0gPSB4Y1tiXSArIHljW2JdICsgYSkgLyBCQVNFIHwgMDtcclxuICAgICAgICB4Y1tiXSA9IEJBU0UgPT09IHhjW2JdID8gMCA6IHhjW2JdICUgQkFTRTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGEpIHtcclxuICAgICAgICB4YyA9IFthXS5jb25jYXQoeGMpO1xyXG4gICAgICAgICsreWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE5vIG5lZWQgdG8gY2hlY2sgZm9yIHplcm8sIGFzICt4ICsgK3kgIT0gMCAmJiAteCArIC15ICE9IDBcclxuICAgICAgLy8geWUgPSBNQVhfRVhQICsgMSBwb3NzaWJsZVxyXG4gICAgICByZXR1cm4gbm9ybWFsaXNlKHksIHhjLCB5ZSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogSWYgc2QgaXMgdW5kZWZpbmVkIG9yIG51bGwgb3IgdHJ1ZSBvciBmYWxzZSwgcmV0dXJuIHRoZSBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzIG9mXHJcbiAgICAgKiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIsIG9yIG51bGwgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIMKxSW5maW5pdHkgb3IgTmFOLlxyXG4gICAgICogSWYgc2QgaXMgdHJ1ZSBpbmNsdWRlIGludGVnZXItcGFydCB0cmFpbGluZyB6ZXJvcyBpbiB0aGUgY291bnQuXHJcbiAgICAgKlxyXG4gICAgICogT3RoZXJ3aXNlLCBpZiBzZCBpcyBhIG51bWJlciwgcmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpc1xyXG4gICAgICogQmlnTnVtYmVyIHJvdW5kZWQgdG8gYSBtYXhpbXVtIG9mIHNkIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIHJtLCBvclxyXG4gICAgICogUk9VTkRJTkdfTU9ERSBpZiBybSBpcyBvbWl0dGVkLlxyXG4gICAgICpcclxuICAgICAqIHNkIHtudW1iZXJ8Ym9vbGVhbn0gbnVtYmVyOiBzaWduaWZpY2FudCBkaWdpdHM6IGludGVnZXIsIDEgdG8gTUFYIGluY2x1c2l2ZS5cclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgYm9vbGVhbjogd2hldGhlciB0byBjb3VudCBpbnRlZ2VyLXBhcnQgdHJhaWxpbmcgemVyb3M6IHRydWUgb3IgZmFsc2UuXHJcbiAgICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICAgKlxyXG4gICAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEFyZ3VtZW50IHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHtzZHxybX0nXHJcbiAgICAgKi9cclxuICAgIFAucHJlY2lzaW9uID0gUC5zZCA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICAgICAgdmFyIGMsIG4sIHYsXHJcbiAgICAgICAgeCA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAoc2QgIT0gbnVsbCAmJiBzZCAhPT0gISFzZCkge1xyXG4gICAgICAgIGludENoZWNrKHNkLCAxLCBNQVgpO1xyXG4gICAgICAgIGlmIChybSA9PSBudWxsKSBybSA9IFJPVU5ESU5HX01PREU7XHJcbiAgICAgICAgZWxzZSBpbnRDaGVjayhybSwgMCwgOCk7XHJcblxyXG4gICAgICAgIHJldHVybiByb3VuZChuZXcgQmlnTnVtYmVyKHgpLCBzZCwgcm0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIShjID0geC5jKSkgcmV0dXJuIG51bGw7XHJcbiAgICAgIHYgPSBjLmxlbmd0aCAtIDE7XHJcbiAgICAgIG4gPSB2ICogTE9HX0JBU0UgKyAxO1xyXG5cclxuICAgICAgaWYgKHYgPSBjW3ZdKSB7XHJcblxyXG4gICAgICAgIC8vIFN1YnRyYWN0IHRoZSBudW1iZXIgb2YgdHJhaWxpbmcgemVyb3Mgb2YgdGhlIGxhc3QgZWxlbWVudC5cclxuICAgICAgICBmb3IgKDsgdiAlIDEwID09IDA7IHYgLz0gMTAsIG4tLSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiB0aGUgZmlyc3QgZWxlbWVudC5cclxuICAgICAgICBmb3IgKHYgPSBjWzBdOyB2ID49IDEwOyB2IC89IDEwLCBuKyspO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc2QgJiYgeC5lICsgMSA+IG4pIG4gPSB4LmUgKyAxO1xyXG5cclxuICAgICAgcmV0dXJuIG47XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgc2hpZnRlZCBieSBrIHBsYWNlc1xyXG4gICAgICogKHBvd2VycyBvZiAxMCkuIFNoaWZ0IHRvIHRoZSByaWdodCBpZiBuID4gMCwgYW5kIHRvIHRoZSBsZWZ0IGlmIG4gPCAwLlxyXG4gICAgICpcclxuICAgICAqIGsge251bWJlcn0gSW50ZWdlciwgLU1BWF9TQUZFX0lOVEVHRVIgdG8gTUFYX1NBRkVfSU5URUdFUiBpbmNsdXNpdmUuXHJcbiAgICAgKlxyXG4gICAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEFyZ3VtZW50IHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHtrfSdcclxuICAgICAqL1xyXG4gICAgUC5zaGlmdGVkQnkgPSBmdW5jdGlvbiAoaykge1xyXG4gICAgICBpbnRDaGVjayhrLCAtTUFYX1NBRkVfSU5URUdFUiwgTUFYX1NBRkVfSU5URUdFUik7XHJcbiAgICAgIHJldHVybiB0aGlzLnRpbWVzKCcxZScgKyBrKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiAgc3FydCgtbikgPSAgTlxyXG4gICAgICogIHNxcnQoTikgPSAgTlxyXG4gICAgICogIHNxcnQoLUkpID0gIE5cclxuICAgICAqICBzcXJ0KEkpID0gIElcclxuICAgICAqICBzcXJ0KDApID0gIDBcclxuICAgICAqICBzcXJ0KC0wKSA9IC0wXHJcbiAgICAgKlxyXG4gICAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyLFxyXG4gICAgICogcm91bmRlZCBhY2NvcmRpbmcgdG8gREVDSU1BTF9QTEFDRVMgYW5kIFJPVU5ESU5HX01PREUuXHJcbiAgICAgKi9cclxuICAgIFAuc3F1YXJlUm9vdCA9IFAuc3FydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIG0sIG4sIHIsIHJlcCwgdCxcclxuICAgICAgICB4ID0gdGhpcyxcclxuICAgICAgICBjID0geC5jLFxyXG4gICAgICAgIHMgPSB4LnMsXHJcbiAgICAgICAgZSA9IHguZSxcclxuICAgICAgICBkcCA9IERFQ0lNQUxfUExBQ0VTICsgNCxcclxuICAgICAgICBoYWxmID0gbmV3IEJpZ051bWJlcignMC41Jyk7XHJcblxyXG4gICAgICAvLyBOZWdhdGl2ZS9OYU4vSW5maW5pdHkvemVybz9cclxuICAgICAgaWYgKHMgIT09IDEgfHwgIWMgfHwgIWNbMF0pIHtcclxuICAgICAgICByZXR1cm4gbmV3IEJpZ051bWJlcighcyB8fCBzIDwgMCAmJiAoIWMgfHwgY1swXSkgPyBOYU4gOiBjID8geCA6IDEgLyAwKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSW5pdGlhbCBlc3RpbWF0ZS5cclxuICAgICAgcyA9IE1hdGguc3FydCgrdmFsdWVPZih4KSk7XHJcblxyXG4gICAgICAvLyBNYXRoLnNxcnQgdW5kZXJmbG93L292ZXJmbG93P1xyXG4gICAgICAvLyBQYXNzIHggdG8gTWF0aC5zcXJ0IGFzIGludGVnZXIsIHRoZW4gYWRqdXN0IHRoZSBleHBvbmVudCBvZiB0aGUgcmVzdWx0LlxyXG4gICAgICBpZiAocyA9PSAwIHx8IHMgPT0gMSAvIDApIHtcclxuICAgICAgICBuID0gY29lZmZUb1N0cmluZyhjKTtcclxuICAgICAgICBpZiAoKG4ubGVuZ3RoICsgZSkgJSAyID09IDApIG4gKz0gJzAnO1xyXG4gICAgICAgIHMgPSBNYXRoLnNxcnQoK24pO1xyXG4gICAgICAgIGUgPSBiaXRGbG9vcigoZSArIDEpIC8gMikgLSAoZSA8IDAgfHwgZSAlIDIpO1xyXG5cclxuICAgICAgICBpZiAocyA9PSAxIC8gMCkge1xyXG4gICAgICAgICAgbiA9ICc1ZScgKyBlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuID0gcy50b0V4cG9uZW50aWFsKCk7XHJcbiAgICAgICAgICBuID0gbi5zbGljZSgwLCBuLmluZGV4T2YoJ2UnKSArIDEpICsgZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHIgPSBuZXcgQmlnTnVtYmVyKG4pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHIgPSBuZXcgQmlnTnVtYmVyKHMgKyAnJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENoZWNrIGZvciB6ZXJvLlxyXG4gICAgICAvLyByIGNvdWxkIGJlIHplcm8gaWYgTUlOX0VYUCBpcyBjaGFuZ2VkIGFmdGVyIHRoZSB0aGlzIHZhbHVlIHdhcyBjcmVhdGVkLlxyXG4gICAgICAvLyBUaGlzIHdvdWxkIGNhdXNlIGEgZGl2aXNpb24gYnkgemVybyAoeC90KSBhbmQgaGVuY2UgSW5maW5pdHkgYmVsb3csIHdoaWNoIHdvdWxkIGNhdXNlXHJcbiAgICAgIC8vIGNvZWZmVG9TdHJpbmcgdG8gdGhyb3cuXHJcbiAgICAgIGlmIChyLmNbMF0pIHtcclxuICAgICAgICBlID0gci5lO1xyXG4gICAgICAgIHMgPSBlICsgZHA7XHJcbiAgICAgICAgaWYgKHMgPCAzKSBzID0gMDtcclxuXHJcbiAgICAgICAgLy8gTmV3dG9uLVJhcGhzb24gaXRlcmF0aW9uLlxyXG4gICAgICAgIGZvciAoOyA7KSB7XHJcbiAgICAgICAgICB0ID0gcjtcclxuICAgICAgICAgIHIgPSBoYWxmLnRpbWVzKHQucGx1cyhkaXYoeCwgdCwgZHAsIDEpKSk7XHJcblxyXG4gICAgICAgICAgaWYgKGNvZWZmVG9TdHJpbmcodC5jKS5zbGljZSgwLCBzKSA9PT0gKG4gPSBjb2VmZlRvU3RyaW5nKHIuYykpLnNsaWNlKDAsIHMpKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBUaGUgZXhwb25lbnQgb2YgciBtYXkgaGVyZSBiZSBvbmUgbGVzcyB0aGFuIHRoZSBmaW5hbCByZXN1bHQgZXhwb25lbnQsXHJcbiAgICAgICAgICAgIC8vIGUuZyAwLjAwMDk5OTkgKGUtNCkgLS0+IDAuMDAxIChlLTMpLCBzbyBhZGp1c3QgcyBzbyB0aGUgcm91bmRpbmcgZGlnaXRzXHJcbiAgICAgICAgICAgIC8vIGFyZSBpbmRleGVkIGNvcnJlY3RseS5cclxuICAgICAgICAgICAgaWYgKHIuZSA8IGUpIC0tcztcclxuICAgICAgICAgICAgbiA9IG4uc2xpY2UocyAtIDMsIHMgKyAxKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoZSA0dGggcm91bmRpbmcgZGlnaXQgbWF5IGJlIGluIGVycm9yIGJ5IC0xIHNvIGlmIHRoZSA0IHJvdW5kaW5nIGRpZ2l0c1xyXG4gICAgICAgICAgICAvLyBhcmUgOTk5OSBvciA0OTk5IChpLmUuIGFwcHJvYWNoaW5nIGEgcm91bmRpbmcgYm91bmRhcnkpIGNvbnRpbnVlIHRoZVxyXG4gICAgICAgICAgICAvLyBpdGVyYXRpb24uXHJcbiAgICAgICAgICAgIGlmIChuID09ICc5OTk5JyB8fCAhcmVwICYmIG4gPT0gJzQ5OTknKSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIE9uIHRoZSBmaXJzdCBpdGVyYXRpb24gb25seSwgY2hlY2sgdG8gc2VlIGlmIHJvdW5kaW5nIHVwIGdpdmVzIHRoZVxyXG4gICAgICAgICAgICAgIC8vIGV4YWN0IHJlc3VsdCBhcyB0aGUgbmluZXMgbWF5IGluZmluaXRlbHkgcmVwZWF0LlxyXG4gICAgICAgICAgICAgIGlmICghcmVwKSB7XHJcbiAgICAgICAgICAgICAgICByb3VuZCh0LCB0LmUgKyBERUNJTUFMX1BMQUNFUyArIDIsIDApO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0LnRpbWVzKHQpLmVxKHgpKSB7XHJcbiAgICAgICAgICAgICAgICAgIHIgPSB0O1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGRwICs9IDQ7XHJcbiAgICAgICAgICAgICAgcyArPSA0O1xyXG4gICAgICAgICAgICAgIHJlcCA9IDE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIElmIHJvdW5kaW5nIGRpZ2l0cyBhcmUgbnVsbCwgMHswLDR9IG9yIDUwezAsM30sIGNoZWNrIGZvciBleGFjdFxyXG4gICAgICAgICAgICAgIC8vIHJlc3VsdC4gSWYgbm90LCB0aGVuIHRoZXJlIGFyZSBmdXJ0aGVyIGRpZ2l0cyBhbmQgbSB3aWxsIGJlIHRydXRoeS5cclxuICAgICAgICAgICAgICBpZiAoIStuIHx8ICErbi5zbGljZSgxKSAmJiBuLmNoYXJBdCgwKSA9PSAnNScpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUcnVuY2F0ZSB0byB0aGUgZmlyc3Qgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgICAgICAgICAgICByb3VuZChyLCByLmUgKyBERUNJTUFMX1BMQUNFUyArIDIsIDEpO1xyXG4gICAgICAgICAgICAgICAgbSA9ICFyLnRpbWVzKHIpLmVxKHgpO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByb3VuZChyLCByLmUgKyBERUNJTUFMX1BMQUNFUyArIDEsIFJPVU5ESU5HX01PREUsIG0pO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGluIGV4cG9uZW50aWFsIG5vdGF0aW9uIGFuZFxyXG4gICAgICogcm91bmRlZCB1c2luZyBST1VORElOR19NT0RFIHRvIGRwIGZpeGVkIGRlY2ltYWwgcGxhY2VzLlxyXG4gICAgICpcclxuICAgICAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXMuIEludGVnZXIsIDAgdG8gTUFYIGluY2x1c2l2ZS5cclxuICAgICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgICAqXHJcbiAgICAgKiAnW0JpZ051bWJlciBFcnJvcl0gQXJndW1lbnQge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfToge2RwfHJtfSdcclxuICAgICAqL1xyXG4gICAgUC50b0V4cG9uZW50aWFsID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gICAgICBpZiAoZHAgIT0gbnVsbCkge1xyXG4gICAgICAgIGludENoZWNrKGRwLCAwLCBNQVgpO1xyXG4gICAgICAgIGRwKys7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGZvcm1hdCh0aGlzLCBkcCwgcm0sIDEpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGluIGZpeGVkLXBvaW50IG5vdGF0aW9uIHJvdW5kaW5nXHJcbiAgICAgKiB0byBkcCBmaXhlZCBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIHJtLCBvciBST1VORElOR19NT0RFIGlmIHJtIGlzIG9taXR0ZWQuXHJcbiAgICAgKlxyXG4gICAgICogTm90ZTogYXMgd2l0aCBKYXZhU2NyaXB0J3MgbnVtYmVyIHR5cGUsICgtMCkudG9GaXhlZCgwKSBpcyAnMCcsXHJcbiAgICAgKiBidXQgZS5nLiAoLTAuMDAwMDEpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICAgICAqXHJcbiAgICAgKiBbZHBdIHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzLiBJbnRlZ2VyLCAwIHRvIE1BWCBpbmNsdXNpdmUuXHJcbiAgICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICAgKlxyXG4gICAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEFyZ3VtZW50IHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHtkcHxybX0nXHJcbiAgICAgKi9cclxuICAgIFAudG9GaXhlZCA9IGZ1bmN0aW9uIChkcCwgcm0pIHtcclxuICAgICAgaWYgKGRwICE9IG51bGwpIHtcclxuICAgICAgICBpbnRDaGVjayhkcCwgMCwgTUFYKTtcclxuICAgICAgICBkcCA9IGRwICsgdGhpcy5lICsgMTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZm9ybWF0KHRoaXMsIGRwLCBybSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaW4gZml4ZWQtcG9pbnQgbm90YXRpb24gcm91bmRlZFxyXG4gICAgICogdXNpbmcgcm0gb3IgUk9VTkRJTkdfTU9ERSB0byBkcCBkZWNpbWFsIHBsYWNlcywgYW5kIGZvcm1hdHRlZCBhY2NvcmRpbmcgdG8gdGhlIHByb3BlcnRpZXNcclxuICAgICAqIG9mIHRoZSBmb3JtYXQgb3IgRk9STUFUIG9iamVjdCAoc2VlIEJpZ051bWJlci5zZXQpLlxyXG4gICAgICpcclxuICAgICAqIFRoZSBmb3JtYXR0aW5nIG9iamVjdCBtYXkgY29udGFpbiBzb21lIG9yIGFsbCBvZiB0aGUgcHJvcGVydGllcyBzaG93biBiZWxvdy5cclxuICAgICAqXHJcbiAgICAgKiBGT1JNQVQgPSB7XHJcbiAgICAgKiAgIHByZWZpeDogJycsXHJcbiAgICAgKiAgIGdyb3VwU2l6ZTogMyxcclxuICAgICAqICAgc2Vjb25kYXJ5R3JvdXBTaXplOiAwLFxyXG4gICAgICogICBncm91cFNlcGFyYXRvcjogJywnLFxyXG4gICAgICogICBkZWNpbWFsU2VwYXJhdG9yOiAnLicsXHJcbiAgICAgKiAgIGZyYWN0aW9uR3JvdXBTaXplOiAwLFxyXG4gICAgICogICBmcmFjdGlvbkdyb3VwU2VwYXJhdG9yOiAnXFx4QTAnLCAgICAgIC8vIG5vbi1icmVha2luZyBzcGFjZVxyXG4gICAgICogICBzdWZmaXg6ICcnXHJcbiAgICAgKiB9O1xyXG4gICAgICpcclxuICAgICAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXMuIEludGVnZXIsIDAgdG8gTUFYIGluY2x1c2l2ZS5cclxuICAgICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgICAqIFtmb3JtYXRdIHtvYmplY3R9IEZvcm1hdHRpbmcgb3B0aW9ucy4gU2VlIEZPUk1BVCBwYmplY3QgYWJvdmUuXHJcbiAgICAgKlxyXG4gICAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEFyZ3VtZW50IHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHtkcHxybX0nXHJcbiAgICAgKiAnW0JpZ051bWJlciBFcnJvcl0gQXJndW1lbnQgbm90IGFuIG9iamVjdDoge2Zvcm1hdH0nXHJcbiAgICAgKi9cclxuICAgIFAudG9Gb3JtYXQgPSBmdW5jdGlvbiAoZHAsIHJtLCBmb3JtYXQpIHtcclxuICAgICAgdmFyIHN0cixcclxuICAgICAgICB4ID0gdGhpcztcclxuXHJcbiAgICAgIGlmIChmb3JtYXQgPT0gbnVsbCkge1xyXG4gICAgICAgIGlmIChkcCAhPSBudWxsICYmIHJtICYmIHR5cGVvZiBybSA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgZm9ybWF0ID0gcm07XHJcbiAgICAgICAgICBybSA9IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkcCAmJiB0eXBlb2YgZHAgPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgIGZvcm1hdCA9IGRwO1xyXG4gICAgICAgICAgZHAgPSBybSA9IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZvcm1hdCA9IEZPUk1BVDtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGZvcm1hdCAhPSAnb2JqZWN0Jykge1xyXG4gICAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyAnQXJndW1lbnQgbm90IGFuIG9iamVjdDogJyArIGZvcm1hdCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN0ciA9IHgudG9GaXhlZChkcCwgcm0pO1xyXG5cclxuICAgICAgaWYgKHguYykge1xyXG4gICAgICAgIHZhciBpLFxyXG4gICAgICAgICAgYXJyID0gc3RyLnNwbGl0KCcuJyksXHJcbiAgICAgICAgICBnMSA9ICtmb3JtYXQuZ3JvdXBTaXplLFxyXG4gICAgICAgICAgZzIgPSArZm9ybWF0LnNlY29uZGFyeUdyb3VwU2l6ZSxcclxuICAgICAgICAgIGdyb3VwU2VwYXJhdG9yID0gZm9ybWF0Lmdyb3VwU2VwYXJhdG9yIHx8ICcnLFxyXG4gICAgICAgICAgaW50UGFydCA9IGFyclswXSxcclxuICAgICAgICAgIGZyYWN0aW9uUGFydCA9IGFyclsxXSxcclxuICAgICAgICAgIGlzTmVnID0geC5zIDwgMCxcclxuICAgICAgICAgIGludERpZ2l0cyA9IGlzTmVnID8gaW50UGFydC5zbGljZSgxKSA6IGludFBhcnQsXHJcbiAgICAgICAgICBsZW4gPSBpbnREaWdpdHMubGVuZ3RoO1xyXG5cclxuICAgICAgICBpZiAoZzIpIHtcclxuICAgICAgICAgIGkgPSBnMTtcclxuICAgICAgICAgIGcxID0gZzI7XHJcbiAgICAgICAgICBnMiA9IGk7XHJcbiAgICAgICAgICBsZW4gLT0gaTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChnMSA+IDAgJiYgbGVuID4gMCkge1xyXG4gICAgICAgICAgaSA9IGxlbiAlIGcxIHx8IGcxO1xyXG4gICAgICAgICAgaW50UGFydCA9IGludERpZ2l0cy5zdWJzdHIoMCwgaSk7XHJcbiAgICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSArPSBnMSkgaW50UGFydCArPSBncm91cFNlcGFyYXRvciArIGludERpZ2l0cy5zdWJzdHIoaSwgZzEpO1xyXG4gICAgICAgICAgaWYgKGcyID4gMCkgaW50UGFydCArPSBncm91cFNlcGFyYXRvciArIGludERpZ2l0cy5zbGljZShpKTtcclxuICAgICAgICAgIGlmIChpc05lZykgaW50UGFydCA9ICctJyArIGludFBhcnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdHIgPSBmcmFjdGlvblBhcnRcclxuICAgICAgICAgPyBpbnRQYXJ0ICsgKGZvcm1hdC5kZWNpbWFsU2VwYXJhdG9yIHx8ICcnKSArICgoZzIgPSArZm9ybWF0LmZyYWN0aW9uR3JvdXBTaXplKVxyXG4gICAgICAgICAgPyBmcmFjdGlvblBhcnQucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcZHsnICsgZzIgKyAnfVxcXFxCJywgJ2cnKSxcclxuICAgICAgICAgICAnJCYnICsgKGZvcm1hdC5mcmFjdGlvbkdyb3VwU2VwYXJhdG9yIHx8ICcnKSlcclxuICAgICAgICAgIDogZnJhY3Rpb25QYXJ0KVxyXG4gICAgICAgICA6IGludFBhcnQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAoZm9ybWF0LnByZWZpeCB8fCAnJykgKyBzdHIgKyAoZm9ybWF0LnN1ZmZpeCB8fCAnJyk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGFuIGFycmF5IG9mIHR3byBCaWdOdW1iZXJzIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgYXMgYSBzaW1wbGVcclxuICAgICAqIGZyYWN0aW9uIHdpdGggYW4gaW50ZWdlciBudW1lcmF0b3IgYW5kIGFuIGludGVnZXIgZGVub21pbmF0b3IuXHJcbiAgICAgKiBUaGUgZGVub21pbmF0b3Igd2lsbCBiZSBhIHBvc2l0aXZlIG5vbi16ZXJvIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgc3BlY2lmaWVkXHJcbiAgICAgKiBtYXhpbXVtIGRlbm9taW5hdG9yLiBJZiBhIG1heGltdW0gZGVub21pbmF0b3IgaXMgbm90IHNwZWNpZmllZCwgdGhlIGRlbm9taW5hdG9yIHdpbGwgYmVcclxuICAgICAqIHRoZSBsb3dlc3QgdmFsdWUgbmVjZXNzYXJ5IHRvIHJlcHJlc2VudCB0aGUgbnVtYmVyIGV4YWN0bHkuXHJcbiAgICAgKlxyXG4gICAgICogW21kXSB7bnVtYmVyfHN0cmluZ3xCaWdOdW1iZXJ9IEludGVnZXIgPj0gMSwgb3IgSW5maW5pdHkuIFRoZSBtYXhpbXVtIGRlbm9taW5hdG9yLlxyXG4gICAgICpcclxuICAgICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfSA6IHttZH0nXHJcbiAgICAgKi9cclxuICAgIFAudG9GcmFjdGlvbiA9IGZ1bmN0aW9uIChtZCkge1xyXG4gICAgICB2YXIgZCwgZDAsIGQxLCBkMiwgZSwgZXhwLCBuLCBuMCwgbjEsIHEsIHIsIHMsXHJcbiAgICAgICAgeCA9IHRoaXMsXHJcbiAgICAgICAgeGMgPSB4LmM7XHJcblxyXG4gICAgICBpZiAobWQgIT0gbnVsbCkge1xyXG4gICAgICAgIG4gPSBuZXcgQmlnTnVtYmVyKG1kKTtcclxuXHJcbiAgICAgICAgLy8gVGhyb3cgaWYgbWQgaXMgbGVzcyB0aGFuIG9uZSBvciBpcyBub3QgYW4gaW50ZWdlciwgdW5sZXNzIGl0IGlzIEluZmluaXR5LlxyXG4gICAgICAgIGlmICghbi5pc0ludGVnZXIoKSAmJiAobi5jIHx8IG4ucyAhPT0gMSkgfHwgbi5sdChPTkUpKSB7XHJcbiAgICAgICAgICB0aHJvdyBFcnJvclxyXG4gICAgICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyAnQXJndW1lbnQgJyArXHJcbiAgICAgICAgICAgICAgKG4uaXNJbnRlZ2VyKCkgPyAnb3V0IG9mIHJhbmdlOiAnIDogJ25vdCBhbiBpbnRlZ2VyOiAnKSArIHZhbHVlT2YobikpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF4YykgcmV0dXJuIG5ldyBCaWdOdW1iZXIoeCk7XHJcblxyXG4gICAgICBkID0gbmV3IEJpZ051bWJlcihPTkUpO1xyXG4gICAgICBuMSA9IGQwID0gbmV3IEJpZ051bWJlcihPTkUpO1xyXG4gICAgICBkMSA9IG4wID0gbmV3IEJpZ051bWJlcihPTkUpO1xyXG4gICAgICBzID0gY29lZmZUb1N0cmluZyh4Yyk7XHJcblxyXG4gICAgICAvLyBEZXRlcm1pbmUgaW5pdGlhbCBkZW5vbWluYXRvci5cclxuICAgICAgLy8gZCBpcyBhIHBvd2VyIG9mIDEwIGFuZCB0aGUgbWluaW11bSBtYXggZGVub21pbmF0b3IgdGhhdCBzcGVjaWZpZXMgdGhlIHZhbHVlIGV4YWN0bHkuXHJcbiAgICAgIGUgPSBkLmUgPSBzLmxlbmd0aCAtIHguZSAtIDE7XHJcbiAgICAgIGQuY1swXSA9IFBPV1NfVEVOWyhleHAgPSBlICUgTE9HX0JBU0UpIDwgMCA/IExPR19CQVNFICsgZXhwIDogZXhwXTtcclxuICAgICAgbWQgPSAhbWQgfHwgbi5jb21wYXJlZFRvKGQpID4gMCA/IChlID4gMCA/IGQgOiBuMSkgOiBuO1xyXG5cclxuICAgICAgZXhwID0gTUFYX0VYUDtcclxuICAgICAgTUFYX0VYUCA9IDEgLyAwO1xyXG4gICAgICBuID0gbmV3IEJpZ051bWJlcihzKTtcclxuXHJcbiAgICAgIC8vIG4wID0gZDEgPSAwXHJcbiAgICAgIG4wLmNbMF0gPSAwO1xyXG5cclxuICAgICAgZm9yICg7IDspICB7XHJcbiAgICAgICAgcSA9IGRpdihuLCBkLCAwLCAxKTtcclxuICAgICAgICBkMiA9IGQwLnBsdXMocS50aW1lcyhkMSkpO1xyXG4gICAgICAgIGlmIChkMi5jb21wYXJlZFRvKG1kKSA9PSAxKSBicmVhaztcclxuICAgICAgICBkMCA9IGQxO1xyXG4gICAgICAgIGQxID0gZDI7XHJcbiAgICAgICAgbjEgPSBuMC5wbHVzKHEudGltZXMoZDIgPSBuMSkpO1xyXG4gICAgICAgIG4wID0gZDI7XHJcbiAgICAgICAgZCA9IG4ubWludXMocS50aW1lcyhkMiA9IGQpKTtcclxuICAgICAgICBuID0gZDI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGQyID0gZGl2KG1kLm1pbnVzKGQwKSwgZDEsIDAsIDEpO1xyXG4gICAgICBuMCA9IG4wLnBsdXMoZDIudGltZXMobjEpKTtcclxuICAgICAgZDAgPSBkMC5wbHVzKGQyLnRpbWVzKGQxKSk7XHJcbiAgICAgIG4wLnMgPSBuMS5zID0geC5zO1xyXG4gICAgICBlID0gZSAqIDI7XHJcblxyXG4gICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggZnJhY3Rpb24gaXMgY2xvc2VyIHRvIHgsIG4wL2QwIG9yIG4xL2QxXHJcbiAgICAgIHIgPSBkaXYobjEsIGQxLCBlLCBST1VORElOR19NT0RFKS5taW51cyh4KS5hYnMoKS5jb21wYXJlZFRvKFxyXG4gICAgICAgICAgZGl2KG4wLCBkMCwgZSwgUk9VTkRJTkdfTU9ERSkubWludXMoeCkuYWJzKCkpIDwgMSA/IFtuMSwgZDFdIDogW24wLCBkMF07XHJcblxyXG4gICAgICBNQVhfRVhQID0gZXhwO1xyXG5cclxuICAgICAgcmV0dXJuIHI7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBjb252ZXJ0ZWQgdG8gYSBudW1iZXIgcHJpbWl0aXZlLlxyXG4gICAgICovXHJcbiAgICBQLnRvTnVtYmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gK3ZhbHVlT2YodGhpcyk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgcm91bmRlZCB0byBzZCBzaWduaWZpY2FudCBkaWdpdHNcclxuICAgICAqIHVzaW5nIHJvdW5kaW5nIG1vZGUgcm0gb3IgUk9VTkRJTkdfTU9ERS4gSWYgc2QgaXMgbGVzcyB0aGFuIHRoZSBudW1iZXIgb2YgZGlnaXRzXHJcbiAgICAgKiBuZWNlc3NhcnkgdG8gcmVwcmVzZW50IHRoZSBpbnRlZ2VyIHBhcnQgb2YgdGhlIHZhbHVlIGluIGZpeGVkLXBvaW50IG5vdGF0aW9uLCB0aGVuIHVzZVxyXG4gICAgICogZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDEgdG8gTUFYIGluY2x1c2l2ZS5cclxuICAgICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgICAqXHJcbiAgICAgKiAnW0JpZ051bWJlciBFcnJvcl0gQXJndW1lbnQge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfToge3NkfHJtfSdcclxuICAgICAqL1xyXG4gICAgUC50b1ByZWNpc2lvbiA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICAgICAgaWYgKHNkICE9IG51bGwpIGludENoZWNrKHNkLCAxLCBNQVgpO1xyXG4gICAgICByZXR1cm4gZm9ybWF0KHRoaXMsIHNkLCBybSwgMik7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaW4gYmFzZSBiLCBvciBiYXNlIDEwIGlmIGIgaXNcclxuICAgICAqIG9taXR0ZWQuIElmIGEgYmFzZSBpcyBzcGVjaWZpZWQsIGluY2x1ZGluZyBiYXNlIDEwLCByb3VuZCBhY2NvcmRpbmcgdG8gREVDSU1BTF9QTEFDRVMgYW5kXHJcbiAgICAgKiBST1VORElOR19NT0RFLiBJZiBhIGJhc2UgaXMgbm90IHNwZWNpZmllZCwgYW5kIHRoaXMgQmlnTnVtYmVyIGhhcyBhIHBvc2l0aXZlIGV4cG9uZW50XHJcbiAgICAgKiB0aGF0IGlzIGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhbiBUT19FWFBfUE9TLCBvciBhIG5lZ2F0aXZlIGV4cG9uZW50IGVxdWFsIHRvIG9yIGxlc3MgdGhhblxyXG4gICAgICogVE9fRVhQX05FRywgcmV0dXJuIGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFtiXSB7bnVtYmVyfSBJbnRlZ2VyLCAyIHRvIEFMUEhBQkVULmxlbmd0aCBpbmNsdXNpdmUuXHJcbiAgICAgKlxyXG4gICAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEJhc2Uge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfToge2J9J1xyXG4gICAgICovXHJcbiAgICBQLnRvU3RyaW5nID0gZnVuY3Rpb24gKGIpIHtcclxuICAgICAgdmFyIHN0cixcclxuICAgICAgICBuID0gdGhpcyxcclxuICAgICAgICBzID0gbi5zLFxyXG4gICAgICAgIGUgPSBuLmU7XHJcblxyXG4gICAgICAvLyBJbmZpbml0eSBvciBOYU4/XHJcbiAgICAgIGlmIChlID09PSBudWxsKSB7XHJcbiAgICAgICAgaWYgKHMpIHtcclxuICAgICAgICAgIHN0ciA9ICdJbmZpbml0eSc7XHJcbiAgICAgICAgICBpZiAocyA8IDApIHN0ciA9ICctJyArIHN0cjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3RyID0gJ05hTic7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChiID09IG51bGwpIHtcclxuICAgICAgICAgIHN0ciA9IGUgPD0gVE9fRVhQX05FRyB8fCBlID49IFRPX0VYUF9QT1NcclxuICAgICAgICAgICA/IHRvRXhwb25lbnRpYWwoY29lZmZUb1N0cmluZyhuLmMpLCBlKVxyXG4gICAgICAgICAgIDogdG9GaXhlZFBvaW50KGNvZWZmVG9TdHJpbmcobi5jKSwgZSwgJzAnKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGIgPT09IDEwICYmIGFscGhhYmV0SGFzTm9ybWFsRGVjaW1hbERpZ2l0cykge1xyXG4gICAgICAgICAgbiA9IHJvdW5kKG5ldyBCaWdOdW1iZXIobiksIERFQ0lNQUxfUExBQ0VTICsgZSArIDEsIFJPVU5ESU5HX01PREUpO1xyXG4gICAgICAgICAgc3RyID0gdG9GaXhlZFBvaW50KGNvZWZmVG9TdHJpbmcobi5jKSwgbi5lLCAnMCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpbnRDaGVjayhiLCAyLCBBTFBIQUJFVC5sZW5ndGgsICdCYXNlJyk7XHJcbiAgICAgICAgICBzdHIgPSBjb252ZXJ0QmFzZSh0b0ZpeGVkUG9pbnQoY29lZmZUb1N0cmluZyhuLmMpLCBlLCAnMCcpLCAxMCwgYiwgcywgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocyA8IDAgJiYgbi5jWzBdKSBzdHIgPSAnLScgKyBzdHI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBzdHI7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGFzIHRvU3RyaW5nLCBidXQgZG8gbm90IGFjY2VwdCBhIGJhc2UgYXJndW1lbnQsIGFuZCBpbmNsdWRlIHRoZSBtaW51cyBzaWduIGZvclxyXG4gICAgICogbmVnYXRpdmUgemVyby5cclxuICAgICAqL1xyXG4gICAgUC52YWx1ZU9mID0gUC50b0pTT04gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB2YWx1ZU9mKHRoaXMpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgUC5faXNCaWdOdW1iZXIgPSB0cnVlO1xyXG5cclxuICAgIGlmIChjb25maWdPYmplY3QgIT0gbnVsbCkgQmlnTnVtYmVyLnNldChjb25maWdPYmplY3QpO1xyXG5cclxuICAgIHJldHVybiBCaWdOdW1iZXI7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gUFJJVkFURSBIRUxQRVIgRlVOQ1RJT05TXHJcblxyXG4gIC8vIFRoZXNlIGZ1bmN0aW9ucyBkb24ndCBuZWVkIGFjY2VzcyB0byB2YXJpYWJsZXMsXHJcbiAgLy8gZS5nLiBERUNJTUFMX1BMQUNFUywgaW4gdGhlIHNjb3BlIG9mIHRoZSBgY2xvbmVgIGZ1bmN0aW9uIGFib3ZlLlxyXG5cclxuXHJcbiAgZnVuY3Rpb24gYml0Rmxvb3Iobikge1xyXG4gICAgdmFyIGkgPSBuIHwgMDtcclxuICAgIHJldHVybiBuID4gMCB8fCBuID09PSBpID8gaSA6IGkgLSAxO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIFJldHVybiBhIGNvZWZmaWNpZW50IGFycmF5IGFzIGEgc3RyaW5nIG9mIGJhc2UgMTAgZGlnaXRzLlxyXG4gIGZ1bmN0aW9uIGNvZWZmVG9TdHJpbmcoYSkge1xyXG4gICAgdmFyIHMsIHosXHJcbiAgICAgIGkgPSAxLFxyXG4gICAgICBqID0gYS5sZW5ndGgsXHJcbiAgICAgIHIgPSBhWzBdICsgJyc7XHJcblxyXG4gICAgZm9yICg7IGkgPCBqOykge1xyXG4gICAgICBzID0gYVtpKytdICsgJyc7XHJcbiAgICAgIHogPSBMT0dfQkFTRSAtIHMubGVuZ3RoO1xyXG4gICAgICBmb3IgKDsgei0tOyBzID0gJzAnICsgcyk7XHJcbiAgICAgIHIgKz0gcztcclxuICAgIH1cclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKGogPSByLmxlbmd0aDsgci5jaGFyQ29kZUF0KC0taikgPT09IDQ4Oyk7XHJcblxyXG4gICAgcmV0dXJuIHIuc2xpY2UoMCwgaiArIDEgfHwgMSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gQ29tcGFyZSB0aGUgdmFsdWUgb2YgQmlnTnVtYmVycyB4IGFuZCB5LlxyXG4gIGZ1bmN0aW9uIGNvbXBhcmUoeCwgeSkge1xyXG4gICAgdmFyIGEsIGIsXHJcbiAgICAgIHhjID0geC5jLFxyXG4gICAgICB5YyA9IHkuYyxcclxuICAgICAgaSA9IHgucyxcclxuICAgICAgaiA9IHkucyxcclxuICAgICAgayA9IHguZSxcclxuICAgICAgbCA9IHkuZTtcclxuXHJcbiAgICAvLyBFaXRoZXIgTmFOP1xyXG4gICAgaWYgKCFpIHx8ICFqKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICBhID0geGMgJiYgIXhjWzBdO1xyXG4gICAgYiA9IHljICYmICF5Y1swXTtcclxuXHJcbiAgICAvLyBFaXRoZXIgemVybz9cclxuICAgIGlmIChhIHx8IGIpIHJldHVybiBhID8gYiA/IDAgOiAtaiA6IGk7XHJcblxyXG4gICAgLy8gU2lnbnMgZGlmZmVyP1xyXG4gICAgaWYgKGkgIT0gaikgcmV0dXJuIGk7XHJcblxyXG4gICAgYSA9IGkgPCAwO1xyXG4gICAgYiA9IGsgPT0gbDtcclxuXHJcbiAgICAvLyBFaXRoZXIgSW5maW5pdHk/XHJcbiAgICBpZiAoIXhjIHx8ICF5YykgcmV0dXJuIGIgPyAwIDogIXhjIF4gYSA/IDEgOiAtMTtcclxuXHJcbiAgICAvLyBDb21wYXJlIGV4cG9uZW50cy5cclxuICAgIGlmICghYikgcmV0dXJuIGsgPiBsIF4gYSA/IDEgOiAtMTtcclxuXHJcbiAgICBqID0gKGsgPSB4Yy5sZW5ndGgpIDwgKGwgPSB5Yy5sZW5ndGgpID8gayA6IGw7XHJcblxyXG4gICAgLy8gQ29tcGFyZSBkaWdpdCBieSBkaWdpdC5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBqOyBpKyspIGlmICh4Y1tpXSAhPSB5Y1tpXSkgcmV0dXJuIHhjW2ldID4geWNbaV0gXiBhID8gMSA6IC0xO1xyXG5cclxuICAgIC8vIENvbXBhcmUgbGVuZ3Rocy5cclxuICAgIHJldHVybiBrID09IGwgPyAwIDogayA+IGwgXiBhID8gMSA6IC0xO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogQ2hlY2sgdGhhdCBuIGlzIGEgcHJpbWl0aXZlIG51bWJlciwgYW4gaW50ZWdlciwgYW5kIGluIHJhbmdlLCBvdGhlcndpc2UgdGhyb3cuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gaW50Q2hlY2sobiwgbWluLCBtYXgsIG5hbWUpIHtcclxuICAgIGlmIChuIDwgbWluIHx8IG4gPiBtYXggfHwgbiAhPT0gbWF0aGZsb29yKG4pKSB7XHJcbiAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyAobmFtZSB8fCAnQXJndW1lbnQnKSArICh0eXBlb2YgbiA9PSAnbnVtYmVyJ1xyXG4gICAgICAgICA/IG4gPCBtaW4gfHwgbiA+IG1heCA/ICcgb3V0IG9mIHJhbmdlOiAnIDogJyBub3QgYW4gaW50ZWdlcjogJ1xyXG4gICAgICAgICA6ICcgbm90IGEgcHJpbWl0aXZlIG51bWJlcjogJykgKyBTdHJpbmcobikpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8vIEFzc3VtZXMgZmluaXRlIG4uXHJcbiAgZnVuY3Rpb24gaXNPZGQobikge1xyXG4gICAgdmFyIGsgPSBuLmMubGVuZ3RoIC0gMTtcclxuICAgIHJldHVybiBiaXRGbG9vcihuLmUgLyBMT0dfQkFTRSkgPT0gayAmJiBuLmNba10gJSAyICE9IDA7XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gdG9FeHBvbmVudGlhbChzdHIsIGUpIHtcclxuICAgIHJldHVybiAoc3RyLmxlbmd0aCA+IDEgPyBzdHIuY2hhckF0KDApICsgJy4nICsgc3RyLnNsaWNlKDEpIDogc3RyKSArXHJcbiAgICAgKGUgPCAwID8gJ2UnIDogJ2UrJykgKyBlO1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIHRvRml4ZWRQb2ludChzdHIsIGUsIHopIHtcclxuICAgIHZhciBsZW4sIHpzO1xyXG5cclxuICAgIC8vIE5lZ2F0aXZlIGV4cG9uZW50P1xyXG4gICAgaWYgKGUgPCAwKSB7XHJcblxyXG4gICAgICAvLyBQcmVwZW5kIHplcm9zLlxyXG4gICAgICBmb3IgKHpzID0geiArICcuJzsgKytlOyB6cyArPSB6KTtcclxuICAgICAgc3RyID0genMgKyBzdHI7XHJcblxyXG4gICAgLy8gUG9zaXRpdmUgZXhwb25lbnRcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxlbiA9IHN0ci5sZW5ndGg7XHJcblxyXG4gICAgICAvLyBBcHBlbmQgemVyb3MuXHJcbiAgICAgIGlmICgrK2UgPiBsZW4pIHtcclxuICAgICAgICBmb3IgKHpzID0geiwgZSAtPSBsZW47IC0tZTsgenMgKz0geik7XHJcbiAgICAgICAgc3RyICs9IHpzO1xyXG4gICAgICB9IGVsc2UgaWYgKGUgPCBsZW4pIHtcclxuICAgICAgICBzdHIgPSBzdHIuc2xpY2UoMCwgZSkgKyAnLicgKyBzdHIuc2xpY2UoZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3RyO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIEVYUE9SVFxyXG5cclxuXHJcbiAgQmlnTnVtYmVyID0gY2xvbmUoKTtcclxuICBCaWdOdW1iZXJbJ2RlZmF1bHQnXSA9IEJpZ051bWJlci5CaWdOdW1iZXIgPSBCaWdOdW1iZXI7XHJcblxyXG4gIC8vIEFNRC5cclxuICBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7IHJldHVybiBCaWdOdW1iZXI7IH0pO1xyXG5cclxuICAvLyBOb2RlLmpzIGFuZCBvdGhlciBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLlxyXG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBCaWdOdW1iZXI7XHJcblxyXG4gIC8vIEJyb3dzZXIuXHJcbiAgfSBlbHNlIHtcclxuICAgIGlmICghZ2xvYmFsT2JqZWN0KSB7XHJcbiAgICAgIGdsb2JhbE9iamVjdCA9IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYgPyBzZWxmIDogd2luZG93O1xyXG4gICAgfVxyXG5cclxuICAgIGdsb2JhbE9iamVjdC5CaWdOdW1iZXIgPSBCaWdOdW1iZXI7XHJcbiAgfVxyXG59KSh0aGlzKTtcclxuIiwiaW1wb3J0IHsgU2F2ZUZpbGUgfSBmcm9tIFwiLi4vdHlwZXMvU2F2ZUZpbGVcIjtcclxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4uL3V0aWxzL0xvZ2dlclwiO1xyXG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuLi91dGlscy9TZXR0aW5nc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNhdmVIYW5kbGVyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIHNhdmU6IFNhdmVGaWxlO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZERhdGEoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgTG9nZ2VyLmxvZyhcIlNhdmVIYW5kbGVyXCIsIFwiTG9hZGluZyBzYXZlIGZpbGUuLi5cIik7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdmVGaWxlXCIpO1xyXG4gICAgICAgIGlmIChkYXRhID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIExvZ2dlci5sb2coXCJTYXZlSGFuZGxlclwiLCBcIk5vIHNhdmUgZGF0YSBmb3VuZCFcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zYXZlID0gSlNPTi5wYXJzZSh0aGlzLmRlY29kZShkYXRhKSlcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNhdmVEYXRhKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5lbmNvZGUoSlNPTi5zdHJpbmdpZnkodGhpcy5zYXZlKSk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzYXZlRmlsZVwiLCBkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldERhdGEoKTogU2F2ZUZpbGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNhdmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbml0aWFsaXplKCk6IFNhdmVGaWxlIHtcclxuICAgICAgICBMb2dnZXIubG9nKFwiU2F2ZUhhbmRsZXJcIiwgXCJJbml0aWFsaXppbmcgbmV3IHNhdmUgZmlsZS4uLlwiKTtcclxuICAgICAgICB0aGlzLnNhdmUgPSB7XHJcbiAgICAgICAgICAgIHNldHRpbmdzOiBTZXR0aW5ncy5kZWZhdWx0KCksXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnNhdmVEYXRhKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBlbmNvZGUoZGF0YTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBMb2dnZXIubG9nKFwiU2F2ZUhhbmRsZXJcIiwgXCJFbmNvZGluZyBzYXZlIGRhdGEuLi5cIik7XHJcbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGVuY29kaW5nIGxvZ2ljXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZGVjb2RlKGRhdGE6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgTG9nZ2VyLmxvZyhcIlNhdmVIYW5kbGVyXCIsIFwiRGVjb2Rpbmcgc2F2ZSBkYXRhLi4uXCIpO1xyXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkZWNvZGluZyBsb2dpY1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFBhcnRpY2xlUmVzb3VyY2UsIFJlc291cmNlLCBQYXJ0aWNsZUNvbG9yIGFzIENvbG9yLCBQYXJ0aWNsZUZsYXZvciBhcyBGbGF2b3IsIFBhcnRpY2xlVHlwZSBhcyBUeXBlIH0gZnJvbSBcIi4uL3VpL1Jlc291cmNlR2FpbkhhbmRsZXJcIjtcclxuaW1wb3J0IHsgQ3VycmVuY2llcyBhcyBVSUN1cnJlbmNpZXMgfSBmcm9tIFwiLi4vdWkvQ3VycmVuY2llc1wiXHJcbmltcG9ydCB7IEJpZ051bWJlciB9IGZyb20gXCJiaWdudW1iZXIuanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIEN1cnJlbmNpZXMge1xyXG4gICAgcHVibGljIHN0YXRpYyBwYXJ0aWNsZXM6IFBhcnRpY2xlUmVzb3VyY2VbXSA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICBVSUN1cnJlbmNpZXMucmVnaXN0ZXJDdXJyZW5jeShcImN1cnJlbmN5LWVsZWN0cm9uXCIsIFwibGVwdG9ucy1lbGVjdHJvblwiKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHtcclxuICAgICAgICAgICAgdHlwZTogVHlwZS5MZXB0b24sIGZsYXZvcjogRmxhdm9yLkVsZWN0cm9uLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJsZXB0b25zLWVsZWN0cm9uXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBVSUN1cnJlbmNpZXMucmVnaXN0ZXJDdXJyZW5jeShcImN1cnJlbmN5LW11b25cIiwgXCJsZXB0b25zLW11b25cIik7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFR5cGUuTGVwdG9uLCBmbGF2b3I6IEZsYXZvci5FbGVjdHJvbiwgYW1vdW50OiBuZXcgQmlnTnVtYmVyKDApLCByZWZsZWN0aW9uOiBcInBhcnRpY2xlXCIsIGhhc2g6IFwibGVwdG9ucy1tdW9uXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBVSUN1cnJlbmNpZXMucmVnaXN0ZXJDdXJyZW5jeShcImN1cnJlbmN5LXRhdXNcIiwgXCJsZXB0b25zLXRhdVwiKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHtcclxuICAgICAgICAgICAgdHlwZTogVHlwZS5MZXB0b24sIGZsYXZvcjogRmxhdm9yLkVsZWN0cm9uLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJsZXB0b25zLXRhdVwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLXVwLXJlZFwiLCBcInF1YXJrcy11cC1yZWRcIik7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFR5cGUuUXVhcmssIGZsYXZvcjogRmxhdm9yLlVwLCBjb2xvcjogQ29sb3IuUmVkLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJxdWFya3MtdXAtcmVkXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBVSUN1cnJlbmNpZXMucmVnaXN0ZXJDdXJyZW5jeShcImN1cnJlbmN5LXF1YXJrcy11cC1ncmVlblwiLCBcInF1YXJrcy11cC1ncmVlblwiKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHtcclxuICAgICAgICAgICAgdHlwZTogVHlwZS5RdWFyaywgZmxhdm9yOiBGbGF2b3IuVXAsIGNvbG9yOiBDb2xvci5HcmVlbiwgYW1vdW50OiBuZXcgQmlnTnVtYmVyKDApLCByZWZsZWN0aW9uOiBcInBhcnRpY2xlXCIsIGhhc2g6IFwicXVhcmtzLXVwLWdyZWVuXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBVSUN1cnJlbmNpZXMucmVnaXN0ZXJDdXJyZW5jeShcImN1cnJlbmN5LXF1YXJrcy11cC1ibHVlXCIsIFwicXVhcmtzLXVwLWJsdWVcIik7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFR5cGUuUXVhcmssIGZsYXZvcjogRmxhdm9yLlVwLCBjb2xvcjogQ29sb3IuQmx1ZSwgYW1vdW50OiBuZXcgQmlnTnVtYmVyKDApLCByZWZsZWN0aW9uOiBcInBhcnRpY2xlXCIsIGhhc2g6IFwicXVhcmtzLXVwLWJsdWVcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLXVwLXJnYlwiLCBcInF1YXJrcy11cC1yZ2JcIik7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFR5cGUuUXVhcmssIGZsYXZvcjogRmxhdm9yLlVwLCBjb2xvcjogQ29sb3IuUkdCLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJxdWFya3MtdXAtcmdiXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBVSUN1cnJlbmNpZXMucmVnaXN0ZXJDdXJyZW5jeShcImN1cnJlbmN5LXF1YXJrcy11cFwiLCBcInF1YXJrcy11cFwiLCBbIFwicXVhcmtzLXVwLXJlZFwiLCBcInF1YXJrcy11cC1ncmVlblwiLCBcInF1YXJrcy11cC1ibHVlXCIgXSk7XHJcblxyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLWRvd24tcmVkXCIsIFwicXVhcmtzLWRvd24tcmVkXCIpO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVzLnB1c2goe1xyXG4gICAgICAgICAgICB0eXBlOiBUeXBlLlF1YXJrLCBmbGF2b3I6IEZsYXZvci5Eb3duLCBjb2xvcjogQ29sb3IuUmVkLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJxdWFya3MtZG93bi1yZWRcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLWRvd24tZ3JlZW5cIiwgXCJxdWFya3MtZG93bi1ncmVlblwiKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHtcclxuICAgICAgICAgICAgdHlwZTogVHlwZS5RdWFyaywgZmxhdm9yOiBGbGF2b3IuRG93biwgY29sb3I6IENvbG9yLkdyZWVuLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJxdWFya3MtZG93bi1ncmVlblwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgVUlDdXJyZW5jaWVzLnJlZ2lzdGVyQ3VycmVuY3koXCJjdXJyZW5jeS1xdWFya3MtZG93bi1ibHVlXCIsIFwicXVhcmtzLWRvd24tYmx1ZVwiKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHtcclxuICAgICAgICAgICAgdHlwZTogVHlwZS5RdWFyaywgZmxhdm9yOiBGbGF2b3IuRG93biwgY29sb3I6IENvbG9yLkJsdWUsIGFtb3VudDogbmV3IEJpZ051bWJlcigwKSwgcmVmbGVjdGlvbjogXCJwYXJ0aWNsZVwiLCBoYXNoOiBcInF1YXJrcy1kb3duLWJsdWVcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLWRvd24tcmdiXCIsIFwicXVhcmtzLWRvd24tcmdiXCIpO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVzLnB1c2goe1xyXG4gICAgICAgICAgICB0eXBlOiBUeXBlLlF1YXJrLCBmbGF2b3I6IEZsYXZvci5Eb3duLCBjb2xvcjogQ29sb3IuUkdCLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJxdWFya3MtZG93bi1yZ2JcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLWRvd25cIiwgXCJxdWFya3MtZG93blwiLCBbIFwicXVhcmtzLWRvd24tcmVkXCIsIFwicXVhcmtzLWRvd24tZ3JlZW5cIiwgXCJxdWFya3MtZG93bi1ibHVlXCIgXSk7XHJcblxyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLXN0cmFuZ2UtcmVkXCIsIFwicXVhcmtzLXN0cmFuZ2UtcmVkXCIpO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVzLnB1c2goe1xyXG4gICAgICAgICAgICB0eXBlOiBUeXBlLlF1YXJrLCBmbGF2b3I6IEZsYXZvci5TdHJhbmdlLCBjb2xvcjogQ29sb3IuUmVkLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJxdWFya3Mtc3RyYW5nZS1yZWRcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLXN0cmFuZ2UtZ3JlZW5cIiwgXCJxdWFya3Mtc3RyYW5nZS1ncmVlblwiKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHtcclxuICAgICAgICAgICAgdHlwZTogVHlwZS5RdWFyaywgZmxhdm9yOiBGbGF2b3IuU3RyYW5nZSwgY29sb3I6IENvbG9yLkdyZWVuLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJxdWFya3Mtc3RyYW5nZS1ncmVlblwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgVUlDdXJyZW5jaWVzLnJlZ2lzdGVyQ3VycmVuY3koXCJjdXJyZW5jeS1xdWFya3Mtc3RyYW5nZS1ibHVlXCIsIFwicXVhcmtzLXN0cmFuZ2UtYmx1ZVwiKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHtcclxuICAgICAgICAgICAgdHlwZTogVHlwZS5RdWFyaywgZmxhdm9yOiBGbGF2b3IuU3RyYW5nZSwgY29sb3I6IENvbG9yLkJsdWUsIGFtb3VudDogbmV3IEJpZ051bWJlcigwKSwgcmVmbGVjdGlvbjogXCJwYXJ0aWNsZVwiLCBoYXNoOiBcInF1YXJrcy1zdHJhbmdlLWJsdWVcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLXN0cmFuZ2UtcmdiXCIsIFwicXVhcmtzLXN0cmFuZ2UtcmdiXCIpO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVzLnB1c2goe1xyXG4gICAgICAgICAgICB0eXBlOiBUeXBlLlF1YXJrLCBmbGF2b3I6IEZsYXZvci5TdHJhbmdlLCBjb2xvcjogQ29sb3IuUkdCLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJxdWFya3Mtc3RyYW5nZS1yZ2JcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLXN0cmFuZ2VcIiwgXCJxdWFya3Mtc3RyYW5nZVwiLCBbIFwicXVhcmtzLXN0cmFuZ2UtcmVkXCIsIFwicXVhcmtzLXN0cmFuZ2UtZ3JlZW5cIiwgXCJxdWFya3Mtc3RyYW5nZS1ibHVlXCIgXSk7XHJcblxyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLWNoYXJtLXJlZFwiLCBcInF1YXJrcy1jaGFybS1yZWRcIik7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFR5cGUuUXVhcmssIGZsYXZvcjogRmxhdm9yLkNoYXJtLCBjb2xvcjogQ29sb3IuUmVkLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJxdWFya3MtY2hhcm0tcmVkXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBVSUN1cnJlbmNpZXMucmVnaXN0ZXJDdXJyZW5jeShcImN1cnJlbmN5LXF1YXJrcy1jaGFybS1ncmVlblwiLCBcInF1YXJrcy1jaGFybS1ncmVlblwiKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHtcclxuICAgICAgICAgICAgdHlwZTogVHlwZS5RdWFyaywgZmxhdm9yOiBGbGF2b3IuQ2hhcm0sIGNvbG9yOiBDb2xvci5HcmVlbiwgYW1vdW50OiBuZXcgQmlnTnVtYmVyKDApLCByZWZsZWN0aW9uOiBcInBhcnRpY2xlXCIsIGhhc2g6IFwicXVhcmtzLWNoYXJtLWdyZWVuXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBVSUN1cnJlbmNpZXMucmVnaXN0ZXJDdXJyZW5jeShcImN1cnJlbmN5LXF1YXJrcy1jaGFybS1ibHVlXCIsIFwicXVhcmtzLWNoYXJtLWJsdWVcIik7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFR5cGUuUXVhcmssIGZsYXZvcjogRmxhdm9yLkNoYXJtLCBjb2xvcjogQ29sb3IuQmx1ZSwgYW1vdW50OiBuZXcgQmlnTnVtYmVyKDApLCByZWZsZWN0aW9uOiBcInBhcnRpY2xlXCIsIGhhc2g6IFwicXVhcmtzLWNoYXJtLWJsdWVcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLWNoYXJtLXJnYlwiLCBcInF1YXJrcy1jaGFybS1yZ2JcIik7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFR5cGUuUXVhcmssIGZsYXZvcjogRmxhdm9yLkNoYXJtLCBjb2xvcjogQ29sb3IuUkdCLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJxdWFya3MtY2hhcm0tcmdiXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBVSUN1cnJlbmNpZXMucmVnaXN0ZXJDdXJyZW5jeShcImN1cnJlbmN5LXF1YXJrcy1jaGFybVwiLCBcInF1YXJrcy1jaGFybVwiLCBbIFwicXVhcmtzLWNoYXJtLXJlZFwiLCBcInF1YXJrcy1jaGFybS1ncmVlblwiLCBcInF1YXJrcy1jaGFybS1ibHVlXCIgXSk7XHJcblxyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLXRvcC1yZWRcIiwgXCJxdWFya3MtdG9wLXJlZFwiKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHtcclxuICAgICAgICAgICAgdHlwZTogVHlwZS5RdWFyaywgZmxhdm9yOiBGbGF2b3IuVG9wLCBjb2xvcjogQ29sb3IuUmVkLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJxdWFya3MtdG9wLXJlZFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgVUlDdXJyZW5jaWVzLnJlZ2lzdGVyQ3VycmVuY3koXCJjdXJyZW5jeS1xdWFya3MtdG9wLWdyZWVuXCIsIFwicXVhcmtzLXRvcC1ncmVlblwiKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHtcclxuICAgICAgICAgICAgdHlwZTogVHlwZS5RdWFyaywgZmxhdm9yOiBGbGF2b3IuVG9wLCBjb2xvcjogQ29sb3IuR3JlZW4sIGFtb3VudDogbmV3IEJpZ051bWJlcigwKSwgcmVmbGVjdGlvbjogXCJwYXJ0aWNsZVwiLCBoYXNoOiBcInF1YXJrcy10b3AtZ3JlZW5cIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLXRvcC1ibHVlXCIsIFwicXVhcmtzLXRvcC1ibHVlXCIpO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVzLnB1c2goe1xyXG4gICAgICAgICAgICB0eXBlOiBUeXBlLlF1YXJrLCBmbGF2b3I6IEZsYXZvci5Ub3AsIGNvbG9yOiBDb2xvci5CbHVlLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJxdWFya3MtdG9wLWJsdWVcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLXRvcC1yZ2JcIiwgXCJxdWFya3MtdG9wLXJnYlwiKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHtcclxuICAgICAgICAgICAgdHlwZTogVHlwZS5RdWFyaywgZmxhdm9yOiBGbGF2b3IuVG9wLCBjb2xvcjogQ29sb3IuUkdCLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJxdWFya3MtdG9wLXJnYlwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgVUlDdXJyZW5jaWVzLnJlZ2lzdGVyQ3VycmVuY3koXCJjdXJyZW5jeS1xdWFya3MtdG9wXCIsIFwicXVhcmtzLXRvcFwiLCBbIFwicXVhcmtzLXRvcC1yZWRcIiwgXCJxdWFya3MtdG9wLWdyZWVuXCIsIFwicXVhcmtzLXRvcC1ibHVlXCIgXSk7XHJcblxyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLWJvdHRvbS1yZWRcIiwgXCJxdWFya3MtYm90dG9tLXJlZFwiKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHtcclxuICAgICAgICAgICAgdHlwZTogVHlwZS5RdWFyaywgZmxhdm9yOiBGbGF2b3IuQm90dG9tLCBjb2xvcjogQ29sb3IuUmVkLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJxdWFya3MtYm90dG9tLXJlZFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgVUlDdXJyZW5jaWVzLnJlZ2lzdGVyQ3VycmVuY3koXCJjdXJyZW5jeS1xdWFya3MtYm90dG9tLWdyZWVuXCIsIFwicXVhcmtzLWJvdHRvbS1ncmVlblwiKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHtcclxuICAgICAgICAgICAgdHlwZTogVHlwZS5RdWFyaywgZmxhdm9yOiBGbGF2b3IuQm90dG9tLCBjb2xvcjogQ29sb3IuR3JlZW4sIGFtb3VudDogbmV3IEJpZ051bWJlcigwKSwgcmVmbGVjdGlvbjogXCJwYXJ0aWNsZVwiLCBoYXNoOiBcInF1YXJrcy1ib3R0b20tZ3JlZW5cIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLWJvdHRvbS1ibHVlXCIsIFwicXVhcmtzLWJvdHRvbS1ibHVlXCIpO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVzLnB1c2goe1xyXG4gICAgICAgICAgICB0eXBlOiBUeXBlLlF1YXJrLCBmbGF2b3I6IEZsYXZvci5Cb3R0b20sIGNvbG9yOiBDb2xvci5CbHVlLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJxdWFya3MtYm90dG9tLWJsdWVcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFVJQ3VycmVuY2llcy5yZWdpc3RlckN1cnJlbmN5KFwiY3VycmVuY3ktcXVhcmtzLWJvdHRvbS1yZ2JcIiwgXCJxdWFya3MtYm90dG9tLXJnYlwiKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHtcclxuICAgICAgICAgICAgdHlwZTogVHlwZS5RdWFyaywgZmxhdm9yOiBGbGF2b3IuQm90dG9tLCBjb2xvcjogQ29sb3IuUkdCLCBhbW91bnQ6IG5ldyBCaWdOdW1iZXIoMCksIHJlZmxlY3Rpb246IFwicGFydGljbGVcIiwgaGFzaDogXCJxdWFya3MtYm90dG9tLXJnYlwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgVUlDdXJyZW5jaWVzLnJlZ2lzdGVyQ3VycmVuY3koXCJjdXJyZW5jeS1xdWFya3MtYm90dG9tXCIsIFwicXVhcmtzLWJvdHRvbVwiLCBbIFwicXVhcmtzLWJvdHRvbS1yZWRcIiwgXCJxdWFya3MtYm90dG9tLWdyZWVuXCIsIFwicXVhcmtzLWJvdHRvbS1ibHVlXCIgXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnYWluUmVzb3VyY2UocmVzb3VyY2U6IFJlc291cmNlKSB7XHJcbiAgICAgICAgc3dpdGNoIChyZXNvdXJjZS5yZWZsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJwYXJ0aWNsZVwiOlxyXG4gICAgICAgICAgICAgICAgbGV0IHIgPSByZXNvdXJjZSBhcyBQYXJ0aWNsZVJlc291cmNlO1xyXG4gICAgICAgICAgICAgICAgbGV0IGkgPSB0aGlzLnBhcnRpY2xlcy5maW5kSW5kZXgocCA9PiBwLmhhc2ggPT09IHIuaGFzaCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXNbaV0uYW1vdW50ID0gci5hbW91bnQucGx1cyh0aGlzLnBhcnRpY2xlc1tpXS5hbW91bnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFRyYW5zbGF0aW9uTWFwIH0gZnJvbSBcIi4uL3R5cGVzL1RyYW5zbGF0aW9uc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25NYXAgPSB7XHJcbiAgICBcImVuXCI6IHtcclxuICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICBnZW5lcmFsOiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJHZW5lcmFsIHNldHRpbmdzXCIsXHJcbiAgICAgICAgICAgICAgICBub1RhYkhpc3Rvcnk6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkRpc2FibGUgdGFiIGhpc3RvcnlcIixcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJEb2Vzbid0IHNhdmUgY2hhbmdpbmcgYmV0d2VlbiB0YWJzIGluIHRoZSBicm93c2VyIGhpc3RvcnksIHNvIHRoZSBiYWNrIGJ1dHRvbiBsZWF2ZXMgdGhpcyBwYWdlIGluc3RlYWRcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGxhbmd1YWdlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJMYW5ndWFnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnYW1lcGxheToge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiR2FtZXBsYXkgc2V0dGluZ3NcIixcclxuICAgICAgICAgICAgICAgIG5vT2ZmbGluZVRpbWU6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkRpc2FibGUgb2ZmbGluZSB0aW1lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRpc3BsYXkgc2V0dGluZ3NcIixcclxuICAgICAgICAgICAgICAgIGRhcmtOYXZpZ2F0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJEYXJrIGhlYWRlciAmIGZvb3RlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkNoYW5nZXMgdGhlIGNvbG9yIG9mIGhlYWRlciAmIGZvb3RlciB0byBiZSB0aGUgc2FtZSBhcyB0aGUgdGhlbWUgYmFja2dyb3VuZCBjb2xvclwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3RpbGxGaWVsZHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlN0aWxsIFF1YW50dW0gRmllbGRzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiUHJldmVudHMgdGhlIHF1YW50dW0gZmllbGRzIGZyb20gZmx1Y3R1YXRpbmcgdmlzdWFsbHkgdW5sZXNzIGNsaWNrZWQgbWFudWFsbHkuIFlvdSB3aWxsIHN0aWxsIGdhaW4gdGhlIHJlc291cmNlc1wiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRlYnVnOiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJEZWJ1ZyBzZXR0aW5nc1wiLFxyXG4gICAgICAgICAgICAgICAgbG9nZ2luZzoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiRW5hYmxlIGxvZ2dpbmdcIixcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZlcmJvc2U6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlZlcmJvc2UgbG9nZ2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdWk6IHtcclxuICAgICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9vdGVyOiB7XHJcbiAgICAgICAgICAgICAgICBmZXJtaW9uczogXCJGZXJtaW9uc1wiLFxyXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdDogXCJHZW5lcmF0aW9uIElcIixcclxuICAgICAgICAgICAgICAgICAgICBzZWNvbmQ6IFwiR2VuZXJhdGlvbiBJSVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXJkOiBcIkdlbmVyYXRpb24gSUlJXCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcXVhcmtzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJVcCBRdWFya3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGRvd246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJEb3duIFF1YXJrc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhcm06IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJDaGFybSBRdWFya3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0cmFuZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJTdHJhbmdlIFF1YXJrc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiVG9wIFF1YXJrc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYm90dG9tOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiQm90dG9tIFF1YXJrc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbGVwdG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZWN0cm9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiRWxlY3Ryb25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtdW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiTXVvbnNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRhdToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlRhdXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJvc29uczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiQm9zb25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaGlnZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJIaWdncyBCb3NvbnNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGdsdW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiR2x1b25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBwaG90b246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJQaG90b25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB3X3BsdXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJX4oG6IEJvc29uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF2b3JUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgd19taW51czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlfigbsgQm9zb25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB6OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiWuKBsCBCb3NvbnNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdm9yVGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5pbXBvcnQgeyBRdWFudHVtRmllbGRFbGVtZW50LCBSaXBwbGVFdmVudCB9IGZyb20gXCIuL3VpL2N1c3RvbV9lbGVtZW50cy9RdWFudHVtRmllbGRFbGVtZW50XCI7XHJcbmltcG9ydCB7IFRyYW5zbGF0ZWRFbGVtZW50IH0gZnJvbSBcIi4vdWkvY3VzdG9tX2VsZW1lbnRzL1RyYW5zbGF0ZWRFbGVtZW50XCI7XHJcbmltcG9ydCB7IHRyYW5zbGF0aW9ucyB9IGZyb20gXCIuL2kxOG4vaTE4blwiO1xyXG5pbXBvcnQgeyBTYXZlSGFuZGxlciB9IGZyb20gXCIuL1NhdmVIYW5kbGVyL1NhdmVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFdhdmUgfSBmcm9tIFwiLi91aS9XYXZlXCI7XHJcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4vdXRpbHMvU2V0dGluZ3NcIjtcclxuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi91dGlscy91dGlsc1wiO1xyXG5pbXBvcnQgeyBUb29sVGlwIH0gZnJvbSBcIi4vdWkvY3VzdG9tX2VsZW1lbnRzL1Rvb2xUaXBcIjtcclxuaW1wb3J0IHsgUmVzb3VyY2VHYWluRWxlbWVudCB9IGZyb20gXCIuL3VpL2N1c3RvbV9lbGVtZW50cy9SZXNvdXJjZUdhaW5FbGVtZW50XCI7XHJcbmltcG9ydCB7IFJlc291cmNlR2FpbkhhbmRsZXIgfSBmcm9tIFwiLi91aS9SZXNvdXJjZUdhaW5IYW5kbGVyXCI7XHJcbmltcG9ydCB7IEJpZ051bWJlciB9IGZyb20gXCJiaWdudW1iZXIuanNcIlxyXG5pbXBvcnQgeyBVSSB9IGZyb20gXCIuL3VpL1VJXCI7XHJcbmltcG9ydCB7IEN1cnJlbmNpZXMgfSBmcm9tIFwiLi9nYW1lX2xvZ2ljL0N1cnJlbmNpZXNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBtYWluID0gKCkgPT4ge1xyXG4gICAgQmlnTnVtYmVyLmNvbmZpZyh7IEVYUE9ORU5USUFMX0FUOiA2LCBERUNJTUFMX1BMQUNFUzogMSwgUk9VTkRJTkdfTU9ERTogQmlnTnVtYmVyLlJPVU5EX0ZMT09SIH0pO1xyXG5cclxuICAgIGlmICghU2F2ZUhhbmRsZXIubG9hZERhdGEoKSkge1xyXG4gICAgICAgIFNhdmVIYW5kbGVyLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZGF0YSA9IFNhdmVIYW5kbGVyLmdldERhdGEoKTtcclxuICAgIFNldHRpbmdzLnNldChkYXRhLnNldHRpbmdzKTtcclxuXHJcbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ0cmFuc2xhdGVkLXN0cmluZ1wiLCBUcmFuc2xhdGVkRWxlbWVudCk7XHJcbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJxdWFudHVtLWZpZWxkXCIsIFF1YW50dW1GaWVsZEVsZW1lbnQpO1xyXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwicmVzb3VyY2UtZ2FpblwiLCBSZXNvdXJjZUdhaW5FbGVtZW50KTtcclxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInRvb2wtdGlwXCIsIFRvb2xUaXApO1xyXG5cclxuICAgIGxldCBtYWluQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluXCIpO1xyXG5cclxuICAgIFJlc291cmNlR2FpbkhhbmRsZXIuaW5pdGlhbGl6ZShcInJlc291cmNlLWdhaW4tY29udGFpbmVyXCIpO1xyXG4gICAgbGV0IGZpZWxkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicXVhbnR1bS1maWVsZFwiKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmllbGRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZmllbGRzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJyaXBwbGVcIiwgZnVuY3Rpb24gKGU6IEN1c3RvbUV2ZW50SW5pdDxSaXBwbGVFdmVudD4pIHtcclxuICAgICAgICAgICAgaWYgKGUuZGV0YWlsLm1hbnVhbCAmJiBKU09OLnN0cmluZ2lmeShlLmRldGFpbC5wYXJ0aWNsZSkpIHtcclxuICAgICAgICAgICAgICAgIFJlc291cmNlR2FpbkhhbmRsZXIuZ2FpblJlc291cmNlKFJlc291cmNlR2FpbkhhbmRsZXIuZ2V0UGFydGljbGVSZXNvdXJjZUZyb21GaWVsZChlLmRldGFpbC5wYXJ0aWNsZSwgbmV3IEJpZ051bWJlcihcIjM4NDdcIikpLCAoZS5kZXRhaWwueCAtIDEwKSwgKGUuZGV0YWlsLnkgKyAxMDApKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVnaXN0ZXIgY3VycmVuY2llc1xyXG4gICAgQ3VycmVuY2llcy5pbml0aWFsaXplKCk7XHJcblxyXG4gICAgLy8gcmVhZHlcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoVUkuYW5pbWF0ZSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF0uY2xhc3NMaXN0LnJlbW92ZShcImxvYWRpbmdcIik7XHJcbn1cclxuIiwiaW1wb3J0IHsgQmlnTnVtYmVyIH0gZnJvbSBcImJpZ251bWJlci5qc1wiXHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIE51bWJlcnMge1xyXG4gICAgZXhwb3J0IGNvbnN0IGdldEZvcm1hdHRlZCA9IChudW06IEJpZ051bWJlcik6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgaWYgKG51bS50b1N0cmluZygpLmluY2x1ZGVzKFwiZVwiKSkge1xyXG4gICAgICAgICAgICBsZXQgcmV0O1xyXG5cclxuICAgICAgICAgICAgbGV0IHBhcnRzID0gbnVtLnRvU3RyaW5nKCkucmVwbGFjZShcIitcIiwgXCJcIikuc3BsaXQoXCJlXCIpO1xyXG4gICAgICAgICAgICBwYXJ0c1swXSA9IHBhcnRzWzBdLnNsaWNlKDAsIDQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oXCJlXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudW0udG9TdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBjb25zdCBnZXRGb3JtYXR0ZWRGcm9tU3RyaW5nID0gKG51bTogc3RyaW5nKTogc3RyaW5nID0+IHtcclxuICAgICAgICByZXR1cm4gZ2V0Rm9ybWF0dGVkKEJpZ051bWJlcihudW0pKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDdXJyZW5jaWVzIGFzIEN1cnJlbmN5TG9naWMgfSBmcm9tIFwiLi4vZ2FtZV9sb2dpYy9DdXJyZW5jaWVzXCJcclxuaW1wb3J0IHsgTnVtYmVycyB9IGZyb20gXCIuLi9udW1iZXJzL251bWJlcnNcIjtcclxuaW1wb3J0IHsgQmlnTnVtYmVyIH0gZnJvbSBcImJpZ251bWJlci5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgQ3VycmVuY2llcyB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXJyZW5jaWVzOiBDdXJyZW5jeVtdID0gW107XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZWdpc3RlckN1cnJlbmN5KGVsZW1lbnQ6IHN0cmluZywgaWQ6IHN0cmluZywgY29uc29saWRhdGlvbjogc3RyaW5nW10gPSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbmNpZXMucHVzaCh7XHJcbiAgICAgICAgICAgIGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke2VsZW1lbnR9IHNwYW5gKSBhcyBIVE1MRGl2RWxlbWVudCxcclxuICAgICAgICAgICAgaWQsXHJcbiAgICAgICAgICAgIGNvbnNvbGlkYXRpb25cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgdXBkYXRlQ3VycmVuY2llcygpIHtcclxuICAgICAgICBmb3IgKGxldCBjdXJyZW5jeSBvZiB0aGlzLmN1cnJlbmNpZXMpIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbmN5LmVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW5jeS5jb25zb2xpZGF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFtb3VudCA9IG5ldyBCaWdOdW1iZXIoMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgciBvZiBjdXJyZW5jeS5jb25zb2xpZGF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmb3VuZCA9IEN1cnJlbmN5TG9naWMucGFydGljbGVzLmZpbmQoKHAgPT4gcC5oYXNoID09PSByKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW1vdW50ID0gYW1vdW50LnBsdXMoZm91bmQuYW1vdW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeS5lbGVtZW50LmlubmVyVGV4dCA9IE51bWJlcnMuZ2V0Rm9ybWF0dGVkKGFtb3VudCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbmN5LmVsZW1lbnQuaW5uZXJUZXh0ID0gTnVtYmVycy5nZXRGb3JtYXR0ZWQoQ3VycmVuY3lMb2dpYy5wYXJ0aWNsZXMuZmluZCgocCA9PiBwLmhhc2ggPT09IGN1cnJlbmN5LmlkKSkuYW1vdW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIEN1cnJlbmN5IHtcclxuICAgIGVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIGNvbnNvbGlkYXRpb24/OiBzdHJpbmdbXTtcclxufVxyXG4iLCJpbXBvcnQgeyBDdXJyZW5jaWVzIH0gZnJvbSBcIi4uL2dhbWVfbG9naWMvQ3VycmVuY2llc1wiO1xyXG5pbXBvcnQgeyBOdW1iZXJzIH0gZnJvbSBcIi4uL251bWJlcnMvbnVtYmVyc1wiO1xyXG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuLi91dGlscy91dGlsc1wiO1xyXG5pbXBvcnQgeyBXYXZlUGFydGljbGVJbmZvIH0gZnJvbSBcIi4vV2F2ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlc291cmNlR2FpbkhhbmRsZXIge1xyXG4gICAgcHVibGljIHN0YXRpYyBjb250YWluZXI6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdGlhbGl6ZShpZDogc3RyaW5nID0gXCJyZXNvdXJjZS1nYWluLWNvbnRhaW5lclwiKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnYWluUmVzb3VyY2UocmVzb3VyY2U6IFJlc291cmNlLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInJlc291cmNlLWdhaW5cIik7XHJcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIHggKyBcIlwiKTtcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcInlcIiwgeSArIFwiXCIpO1xyXG5cclxuICAgICAgICBpZiAocmVzb3VyY2UucmVmbGVjdGlvbiA9PT0gXCJwYXJ0aWNsZVwiKSB7XHJcbiAgICAgICAgICAgIGxldCByID0gcmVzb3VyY2UgYXMgUGFydGljbGVSZXNvdXJjZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCByLnR5cGUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHIuY29sb3IpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiY29sb3JcIiwgci5jb2xvci50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoci5mbGF2b3IpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZmxhdm9yXCIsIHIuZmxhdm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImFtb3VudFwiLCBOdW1iZXJzLmdldEZvcm1hdHRlZChyZXNvdXJjZS5hbW91bnQpKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuXHJcbiAgICAgICAgQ3VycmVuY2llcy5nYWluUmVzb3VyY2UocmVzb3VyY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UGFydGljbGVSZXNvdXJjZUZyb21GaWVsZChwYXJ0aWNsZTogV2F2ZVBhcnRpY2xlSW5mbywgYW1vdW50OiBCaWdOdW1iZXIpOiBQYXJ0aWNsZVJlc291cmNlIHtcclxuICAgICAgICBsZXQgZmxhdm9yID0gUGFydGljbGVGbGF2b3JbcGFydGljbGUuZmxhdm9yIGFzIGtleW9mIHR5cGVvZiBQYXJ0aWNsZUZsYXZvcl07XHJcbiAgICAgICAgbGV0IGNvbG9yID0gUGFydGljbGVDb2xvcltwYXJ0aWNsZS5jb2xvciBhcyBrZXlvZiB0eXBlb2YgUGFydGljbGVDb2xvcl07XHJcbiAgICAgICAgbGV0IHR5cGUgPSBQYXJ0aWNsZVR5cGVbcGFydGljbGUudHlwZSBhcyBrZXlvZiB0eXBlb2YgUGFydGljbGVUeXBlXTtcclxuXHJcbiAgICAgICAgaWYgKHBhcnRpY2xlLnR5cGUgPT09IFwiUXVhcmtcIikge1xyXG4gICAgICAgICAgICBmbGF2b3IgPSBbUGFydGljbGVGbGF2b3IuVXAsIFBhcnRpY2xlRmxhdm9yLkRvd25dW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBoYXNoID0gYCR7dHlwZX0tJHtmbGF2b3J9YDtcclxuICAgICAgICBpZiAoY29sb3IpIHtcclxuICAgICAgICAgICAgaGFzaCArPSBgLSR7Y29sb3J9YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHsgYW1vdW50LCB0eXBlLCBmbGF2b3IsIGNvbG9yLCByZWZsZWN0aW9uOiBcInBhcnRpY2xlXCIsIGhhc2ggfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlc291cmNlIHtcclxuICAgIGFtb3VudDogQmlnTnVtYmVyO1xyXG4gICAgcmVmbGVjdGlvbjogXCJwYXJ0aWNsZVwiO1xyXG4gICAgaGFzaDogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBhcnRpY2xlUmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZXtcclxuICAgIHR5cGU6IFBhcnRpY2xlVHlwZTtcclxuICAgIGZsYXZvcjogUGFydGljbGVGbGF2b3I7XHJcbiAgICBjb2xvcj86IFBhcnRpY2xlQ29sb3I7XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIFBhcnRpY2xlVHlwZSB7XHJcbiAgICBRdWFyayA9IFwicXVhcmtzXCIsXHJcbiAgICBMZXB0b24gPSBcImxlcHRvbnNcIixcclxuICAgIEJvc29uID0gXCJib3NvbnNcIixcclxufVxyXG5cclxuZXhwb3J0IGVudW0gUGFydGljbGVGbGF2b3Ige1xyXG4gICAgRWxlY3Ryb24gPSBcImVsZWN0cm9uXCIsXHJcbiAgICBNdW9uID0gXCJtdW9uXCIsXHJcbiAgICBUYXUgPSBcInRhdVwiLFxyXG4gICAgVXAgPSBcInVwXCIsXHJcbiAgICBEb3duID0gXCJkb3duXCIsXHJcbiAgICBTdHJhbmdlID0gXCJzdGFuZ2VcIixcclxuICAgIENoYXJtID0gXCJjaGFybVwiLFxyXG4gICAgVG9wID0gXCJ0b3BcIixcclxuICAgIEJvdHRvbSA9IFwiYm90dG9tXCIsXHJcbiAgICBHbHVvbiA9IFwiZ2x1b25cIixcclxuICAgIFBob3RvbiA9IFwicGhvdG9uXCIsXHJcbiAgICBXUGx1cyA9IFwidy1wbHVzXCIsXHJcbiAgICBXTWludXMgPSBcInctbWludXNcIixcclxuICAgIFogPSBcInpcIixcclxuICAgIEhpZ2dzID0gXCJoaWdnc1wiLFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBQYXJ0aWNsZUNvbG9yIHtcclxuICAgIFJlZCA9IFwicmVkXCIsXHJcbiAgICBHcmVlbiA9IFwiZ3JlZW5cIixcclxuICAgIEJsdWUgPSBcImJsdWVcIixcclxuICAgIFJHQiA9IFwicmdiXCIsXHJcbn1cclxuIiwiaW1wb3J0IHsgQ3VycmVuY2llcyB9IGZyb20gXCIuL0N1cnJlbmNpZXNcIjtcclxuXHJcbmV4cG9ydCBuYW1lc3BhY2UgVUkge1xyXG4gICAgZXhwb3J0IGNvbnN0IGFuaW1hdGUgPSAodGltZXN0YW1wOiBudW1iZXIpID0+IHtcclxuICAgICAgICBDdXJyZW5jaWVzLnVwZGF0ZUN1cnJlbmNpZXMoKTtcclxuXHJcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShVSS5hbmltYXRlKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuLi91dGlscy91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdhdmUge1xyXG4gICAgcHJpdmF0ZSBjb25maWc6IFdhdmVDb25maWc7XHJcbiAgICBwcml2YXRlIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHBvaW50czogV2F2ZVBvaW50W10gPSBbXTtcclxuICAgIHByaXZhdGUgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICBwcml2YXRlIHRpbWU6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIGhvdmVyOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGNsaWNrZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgY2xpY2tQb3M6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHJpcHBsZXM6IFJpcHBsZVtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQsIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIGNvbmZpZzogV2F2ZUNvbmZpZywgYXV0b1N0YXJ0OiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0hvdmVyKGUuY2xpZW50WSkpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5ob3Zlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmlwcGxlKGUuY2xpZW50WCwgZmFsc2UsIDIwLCAxMCwgMC4wNSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGlja1BvcyA9IGUuY2xpZW50WDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaG92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuY2xhc3NMaXN0LmFkZChcImhvdmVyZWRcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNsaWNrZWQgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jbGlja2VkID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcuaGVpZ2h0ID0gY29udGFpbmVyLmNsaWVudEhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJpcHBsZURlbGF5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcucmlwcGxlRGVsYXkgPSAxNTAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLm9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLm9mZnNldCA9IHRoaXMuY29uZmlnLmhlaWdodCAvIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSgpO1xyXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuaGFuZGxlUmVzaXplLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuXHJcbiAgICAgICAgaWYgKGF1dG9TdGFydCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tIb3Zlcih5OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4geSA+IHRoaXMuY29uZmlnLm9mZnNldCArIDEwMCAmJiB5IDwgdGhpcy5jb25maWcub2Zmc2V0ICsgMTUwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlUmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jb25maWcuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb25maWcoY29uZmlnOiBXYXZlQ29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEFtcGxpdHVkZShhbXBsaXR1ZGU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY29uZmlnLmFtcGxpdHVkZSA9IGFtcGxpdHVkZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QW1wbGl0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmFtcGxpdHVkZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RnJlcXVlbmN5KGZyZXF1ZW5jeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcuZnJlcXVlbmN5ID0gZnJlcXVlbmN5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRGcmVxdWVuY3koKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuZnJlcXVlbmN5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRTcGVlZChzcGVlZDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcuc3BlZWQgPSBzcGVlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U3BlZWQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuc3BlZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGVhbnVwUmlwcGxlcygpIHtcclxuICAgICAgICBjb25zdCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICBjb25zdCB0aHJlc2hvbGQgPSAwLjAwMDE7XHJcblxyXG4gICAgICAgIHRoaXMucmlwcGxlcyA9IHRoaXMucmlwcGxlcy5maWx0ZXIociA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFnZSA9IChub3cgLSByLnN0YXJ0VGltZSkgLyAxMDAwO1xyXG4gICAgICAgICAgICBjb25zdCByYW1wVXBUaW1lID0gMC41O1xyXG4gICAgICAgICAgICBjb25zdCByYW1wID0gTWF0aC5taW4oMSwgYWdlIC8gcmFtcFVwVGltZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVhc2VkUmFtcCA9IE1hdGguc2luKChyYW1wICogTWF0aC5QSSkgLyAyKTtcclxuICAgICAgICAgICAgY29uc3QgcHJvcGFnYXRpb24gPSBhZ2UgKiByLnNwZWVkO1xyXG4gICAgICAgICAgICBjb25zdCBmYWxsb2ZmID0gTWF0aC5leHAoLXIuZGVjYXkgKiBNYXRoLnBvdygwIC0gcHJvcGFnYXRpb24sIDIpKTtcclxuICAgICAgICAgICAgY29uc3QgcG90ZW50aWFsQW1wbGl0dWRlID0gci5zdHJlbmd0aCAqIGVhc2VkUmFtcCAqIGZhbGxvZmY7XHJcbiAgICAgICAgICAgIHJldHVybiBwb3RlbnRpYWxBbXBsaXR1ZGUgPiB0aHJlc2hvbGQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0KCkge1xyXG4gICAgICAgIHZhciBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZSh0aW1lc3RhbXA6IG51bWJlcikge1xyXG4gICAgICAgICAgICBzZWxmLnRpbWUgPSBzZWxmLmNvbmZpZy5zcGVlZCAqICgodGltZXN0YW1wIC0gc3RhcnQpIC8gMTApO1xyXG4gICAgICAgICAgICBzZWxmLmRyYXcoc2VsZi50aW1lKTtcclxuICAgICAgICAgICAgc2VsZi5jbGVhbnVwUmlwcGxlcygpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5ob3ZlciAmJiBzZWxmLmNsaWNrZWQpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucmlwcGxlKHNlbGYuY2xpY2tQb3MsIHRydWUsIDE2MCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIHRoaXMucG9pbnRzID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHRoaXMuY29uZmlnLnBvaW50Q291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHg6IGksXHJcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IE1hdGgucmFuZG9tKCkgKiAxMDAwLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRZKGk6IG51bWJlciwgdGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLnBvaW50c1tpXTtcclxuICAgICAgICBjb25zdCBiYXNlTm9pc2UgPVxyXG4gICAgICAgICAgICBNYXRoLnNpbigocG9pbnQub2Zmc2V0ICsgdGltZSkgKiB0aGlzLmNvbmZpZy5mcmVxdWVuY3kpICogMC42ICtcclxuICAgICAgICAgICAgTWF0aC5zaW4oKHBvaW50Lm9mZnNldCAqIDAuNSArIHRpbWUgKiAwLjgpICogdGhpcy5jb25maWcuZnJlcXVlbmN5KSAqIDAuNDtcclxuXHJcbiAgICAgICAgbGV0IHJpcHBsZU9mZnNldCA9IDA7XHJcbiAgICAgICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHIgb2YgdGhpcy5yaXBwbGVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFnZSA9IChub3cgLSByLnN0YXJ0VGltZSkgLyAxMDAwO1xyXG4gICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguYWJzKGkgLSByLmluZGV4KTtcclxuICAgICAgICAgICAgY29uc3QgcHJvcGFnYXRpb24gPSBhZ2UgKiByLnNwZWVkO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZmFsbG9mZiA9IE1hdGguZXhwKC1yLmRlY2F5ICogTWF0aC5wb3coZGlzdGFuY2UgLSBwcm9wYWdhdGlvbiwgMikpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmFtcFVwVGltZSA9IDAuNTtcclxuICAgICAgICAgICAgY29uc3QgcmFtcCA9IE1hdGgubWluKDEsIGFnZSAvIHJhbXBVcFRpbWUpOyBcclxuICAgICAgICAgICAgY29uc3QgZWFzZWRSYW1wID0gTWF0aC5zaW4oKHJhbXAgKiBNYXRoLlBJKSAvIDIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgd2F2ZSA9IE1hdGguc2luKGRpc3RhbmNlIC0gcHJvcGFnYXRpb24pO1xyXG4gICAgICAgICAgICByaXBwbGVPZmZzZXQgKz0gci5zdHJlbmd0aCAqIGVhc2VkUmFtcCAqIGZhbGxvZmYgKiB3YXZlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLm9mZnNldCArIChiYXNlTm9pc2UgKiB0aGlzLmNvbmZpZy5hbXBsaXR1ZGUgKyByaXBwbGVPZmZzZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhdyh0aW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAwLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCB0aGlzLmNvbmZpZy5jb2xvci5zdGFydCk7XHJcbiAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsIHRoaXMuY29uZmlnLmNvbG9yLmVuZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jdHguc2hhZG93Q29sb3IgPSBVdGlscy5oZXhUb1JHQih0aGlzLmhvdmVyID8gdGhpcy5jb25maWcuY29sb3IuaG92ZXIgOiB0aGlzLmNvbmZpZy5jb2xvci5nbG93KTtcclxuICAgICAgICB0aGlzLmN0eC5zaGFkb3dCbHVyID0gMTA7XHJcbiAgICAgICAgdGhpcy5jdHguc2hhZG93T2Zmc2V0WCA9IDA7XHJcbiAgICAgICAgdGhpcy5jdHguc2hhZG93T2Zmc2V0WSA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gZ3JhZGllbnQ7XHJcbiAgICAgICAgdGhpcy5jdHgubGluZVdpZHRoID0gdGhpcy5jb25maWcubGluZVdpZHRoO1xyXG4gICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwWCA9IHRoaXMuY2FudmFzLndpZHRoIC8gKHRoaXMuY29uZmlnLnBvaW50Q291bnQgLSAxKTtcclxuXHJcbiAgICAgICAgbGV0IHByZXZYID0gMDtcclxuICAgICAgICBsZXQgcHJldlkgPSB0aGlzLmdldFkoMCwgdGltZSk7XHJcbiAgICAgICAgdGhpcy5jdHgubW92ZVRvKHByZXZYLCBwcmV2WSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5jb25maWcucG9pbnRDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJYID0gaSAqIHN0ZXBYO1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyWSA9IHRoaXMuZ2V0WShpLCB0aW1lKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1pZFggPSAocHJldlggKyBjdXJyWCkgLyAyO1xyXG4gICAgICAgICAgICBjb25zdCBtaWRZID0gKHByZXZZICsgY3VyclkpIC8gMjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY3R4LnF1YWRyYXRpY0N1cnZlVG8ocHJldlgsIHByZXZZLCBtaWRYLCBtaWRZKTtcclxuXHJcbiAgICAgICAgICAgIHByZXZYID0gY3Vyclg7XHJcbiAgICAgICAgICAgIHByZXZZID0gY3Vyclk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmN0eC5saW5lVG8ocHJldlgsIHByZXZZKTtcclxuICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmlwcGxlKHg6IG51bWJlciwgbWFudWFsOiBib29sZWFuID0gZmFsc2UsIHN0cmVuZ3RoOiBudW1iZXIgPSAxMjAsIHNwZWVkOiBudW1iZXIgPSAxMCwgZGVjYXk6IG51bWJlciA9IDAuMDUpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IE1hdGguZmxvb3IoKHggLyB0aGlzLmNhbnZhcy53aWR0aCkgKiB0aGlzLmNvbmZpZy5wb2ludENvdW50KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJpcHBsZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb25maWcucmlwcGxlQ2FsbGJhY2soeCwgbWFudWFsLCB0aGlzLmNvbmZpZy5wYXJ0aWNsZSwgdGhpcy5jb25maWcuaW5kZXgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmlwcGxlcy5wdXNoKHtcclxuICAgICAgICAgICAgaW5kZXgsXHJcbiAgICAgICAgICAgIHN0YXJ0VGltZTogcGVyZm9ybWFuY2Uubm93KCksXHJcbiAgICAgICAgICAgIHN0cmVuZ3RoLFxyXG4gICAgICAgICAgICBzcGVlZCxcclxuICAgICAgICAgICAgZGVjYXksXHJcbiAgICAgICAgICAgIG1hbnVhbCxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgV2F2ZUNvbmZpZyB7XHJcbiAgICBwYXJ0aWNsZTogV2F2ZVBhcnRpY2xlSW5mbztcclxuICAgIGFtcGxpdHVkZTogbnVtYmVyO1xyXG4gICAgZnJlcXVlbmN5OiBudW1iZXI7XHJcbiAgICBzcGVlZDogbnVtYmVyO1xyXG4gICAgbGluZVdpZHRoOiBudW1iZXI7XHJcbiAgICBjb2xvcjogV2F2ZUNvbG9yO1xyXG4gICAgcG9pbnRDb3VudDogbnVtYmVyO1xyXG4gICAgaGVpZ2h0PzogbnVtYmVyO1xyXG4gICAgb2Zmc2V0PzogbnVtYmVyO1xyXG4gICAgcmlwcGxlRGVsYXk/OiBudW1iZXI7XHJcbiAgICByaXBwbGVDYWxsYmFjaz86ICh4OiBudW1iZXIsIG1hbnVhbDogYm9vbGVhbiwgcGFydGljbGU6IFdhdmVQYXJ0aWNsZUluZm8sIGluZGV4OiBudW1iZXIpID0+IGJvb2xlYW47XHJcbiAgICBpbmRleDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFdhdmVQYXJ0aWNsZUluZm8ge1xyXG4gICAgdHlwZT86IHN0cmluZztcclxuICAgIGZsYXZvcj86IHN0cmluZztcclxuICAgIGNvbG9yPzogc3RyaW5nO1xyXG4gICAgYWxsPzogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXYXZlQ29sb3Ige1xyXG4gICAgc3RhcnQ6IHN0cmluZztcclxuICAgIGVuZDogc3RyaW5nO1xyXG4gICAgZ2xvdzogc3RyaW5nO1xyXG4gICAgaG92ZXI6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFdhdmVQb2ludCB7XHJcbiAgICB4OiBudW1iZXI7XHJcbiAgICBvZmZzZXQ6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFJpcHBsZSB7XHJcbiAgICBpbmRleDogbnVtYmVyO1xyXG4gICAgc3RhcnRUaW1lOiBudW1iZXI7XHJcbiAgICBzdHJlbmd0aDogbnVtYmVyO1xyXG4gICAgc3BlZWQ6IG51bWJlcjtcclxuICAgIGRlY2F5OiBudW1iZXI7XHJcbiAgICBtYW51YWw6IGJvb2xlYW47XHJcbn1cclxuIiwiaW1wb3J0IHsgV2F2ZSwgV2F2ZUNvbG9yLCBXYXZlUGFydGljbGVJbmZvIH0gZnJvbSBcIi4uL1dhdmVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWFudHVtRmllbGRFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgcHJpdmF0ZSB3YXZlczogV2F2ZVtdID0gW107XHJcbiAgICBwcml2YXRlIGNhbnZhc2VzOiBIVE1MQ2FudmFzRWxlbWVudFtdID0gW107XHJcbiAgICBwcml2YXRlIHdoaWNoV2F2ZTogV2F2ZVBhcnRpY2xlSW5mbztcclxuICAgIHByaXZhdGUgcGFydGljbGVzOiBXYXZlUGFydGljbGVJbmZvW10gPSBbXTtcclxuICAgIHByaXZhdGUgYWxsOiBXYXZlUGFydGljbGVJbmZvO1xyXG4gICAgcHJpdmF0ZSByYW5kb206IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIHR5cGU/OiBcInRoaWNrXCIgfCBcInRyaXBsZVwiO1xyXG4gICAgcHJpdmF0ZSBkZWxheTogbnVtYmVyID0gMTAwMDtcclxuICAgIHByaXZhdGUgbGFzdENsaWNrOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmlwcGxlKHg6IG51bWJlciwgbWFudWFsOiBib29sZWFuID0gZmFsc2UsIHN0cmVuZ3RoOiBudW1iZXIgPSAxMjAsIHNwZWVkOiBudW1iZXIgPSAxMCwgZGVjYXk6IG51bWJlciA9IDAuMDUpIHtcclxuICAgICAgICB0aGlzLndhdmVzLmZvckVhY2god2F2ZSA9PiB7IHdhdmUucmlwcGxlKHgsIG1hbnVhbCwgc3RyZW5ndGgsIHNwZWVkLCBkZWNheSkgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XHJcbiAgICAgICAgY29uc3QgYW1vdW50ID0gcGFyc2VJbnQodGhpcy5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtZmllbGRzXCIpKTtcclxuICAgICAgICBjb25zdCBvZmZzZXQgPSAodGhpcy5wYXJlbnRFbGVtZW50LmNsaWVudEhlaWdodCAvIChhbW91bnQgKyAxKSkgKiBwYXJzZUludCh0aGlzLmdldEF0dHJpYnV0ZShcImluZGV4XCIpKTtcclxuICAgICAgICAodGhpcy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZmllbGQtbGFiZWxcIilbMF0gYXMgSFRNTERpdkVsZW1lbnQpLnN0eWxlLnRvcCA9IChvZmZzZXQgLSA2MCkgKyBcInB4XCI7XHJcbiAgICAgICAgbGV0IHdpZHRoID0gMztcclxuICAgICAgICB0aGlzLnJhbmRvbSA9IHRoaXMuZ2V0QXR0cmlidXRlKFwicmFuZG9tXCIpID09PSBcInRydWVcIjtcclxuICAgICAgICB0aGlzLmRlbGF5ID0gcGFyc2VJbnQodGhpcy5nZXRBdHRyaWJ1dGUoXCJkZWxheVwiKSk7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpIGFzIFwidGhpY2tcIiB8IFwidHJpcGxlXCIgfCBudWxsO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRBdHRyaWJ1dGUoXCJhbGxcIikgPT09IFwidHJ1ZVwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWxsID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRBdHRyaWJ1dGUoXCJhbGwtdHlwZVwiKSxcclxuICAgICAgICAgICAgICAgIGZsYXZvcjogdGhpcy5nZXRBdHRyaWJ1dGUoXCJhbGwtZmxhdm9yXCIpLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0QXR0cmlidXRlKFwiYWxsLWNvbG9yXCIpLFxyXG4gICAgICAgICAgICAgICAgYWxsOiB0cnVlLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBnZXROZXh0RHJvcCA9ICgpOiBXYXZlUGFydGljbGVJbmZvID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFydGljbGVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMucGFydGljbGVzLmxlbmd0aCldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlUmlwcGxlID0gKHg6IG51bWJlciwgbWFudWFsOiBib29sZWFuLCBwYXJ0aWNsZTogV2F2ZVBhcnRpY2xlSW5mbywgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIW1hbnVhbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICAgICAgaWYgKChub3cgLSB0aGlzLmxhc3RDbGljaykgPCB0aGlzLmRlbGF5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09IFwidHJpcGxlXCIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gKHRoaXMucGFydGljbGVzLmxlbmd0aCAqIDMpIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdENsaWNrID0gbm93O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQ8UmlwcGxlRXZlbnQ+KFwicmlwcGxlXCIsIHsgZGV0YWlsOiB7IHgsIHk6IG9mZnNldCwgbWFudWFsLCBwYXJ0aWNsZSB9IH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSB0aGlzLnBhcnRpY2xlcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RDbGljayA9IG5vdztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucmFuZG9tKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndoaWNoV2F2ZSA9IGdldE5leHREcm9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudDxSaXBwbGVFdmVudD4oXCJyaXBwbGVcIiwgeyBkZXRhaWw6IHsgeCwgeTogb2Zmc2V0LCBtYW51YWwsIHBhcnRpY2xlOiB0aGlzLndoaWNoV2F2ZSB9IH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoSlNPTi5zdHJpbmdpZnkocGFydGljbGUpID09PSBKU09OLnN0cmluZ2lmeSh0aGlzLndoaWNoV2F2ZSkgfHwgdGhpcy53aGljaFdhdmUuYWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50PFJpcHBsZUV2ZW50PihcInJpcHBsZVwiLCB7IGRldGFpbDogeyB4LCB5OiBvZmZzZXQsIG1hbnVhbCwgcGFydGljbGUgfSB9KSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBjb3BpZXMgPSAxO1xyXG5cclxuICAgICAgICB0aGlzLnR5cGUgPSB0aGlzLmdldEF0dHJpYnV0ZShcInR5cGVcIikgYXMgXCJ0aGlja1wiIHwgXCJ0cmlwbGVcIiB8IG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gXCJ0aGlja1wiKSB7XHJcbiAgICAgICAgICAgIHdpZHRoID0gMjA7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnR5cGUgPT09IFwidHJpcGxlXCIpIHtcclxuICAgICAgICAgICAgY29waWVzID0gMztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBmaWVsZHMgPSB0aGlzLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmaWVsZFwiKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpICs9IGNvcGllcykge1xyXG4gICAgICAgICAgICBsZXQgZmllbGQgPSBmaWVsZHNbaV07XHJcbiAgICAgICAgICAgIGxldCBwID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogZmllbGQuZ2V0QXR0cmlidXRlKFwiZGF0YS10eXBlXCIpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSxcclxuICAgICAgICAgICAgICAgIGZsYXZvcjogZmllbGQuZ2V0QXR0cmlidXRlKFwiZGF0YS1mbGF2b3JcIikgfHwgdGhpcy5nZXRBdHRyaWJ1dGUoXCJmbGF2b3JcIiksXHJcbiAgICAgICAgICAgICAgICBjb2xvcjogZmllbGQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb2xvclwiKSB8fCB0aGlzLmdldEF0dHJpYnV0ZShcImNvbG9yXCIpLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaChwKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29waWVzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzZXMucHVzaChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXNlc1tpICsgal0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53YXZlcy5wdXNoKG5ldyBXYXZlKHRoaXMuY2FudmFzZXNbaSArIGpdLCB0aGlzLnBhcmVudEVsZW1lbnQsIHtcclxuICAgICAgICAgICAgICAgICAgICBhbXBsaXR1ZGU6IDIwLFxyXG4gICAgICAgICAgICAgICAgICAgIGZyZXF1ZW5jeTogMSxcclxuICAgICAgICAgICAgICAgICAgICBzcGVlZDogMC4wMixcclxuICAgICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBmaWVsZC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbG9yLXN0YXJ0XCIpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKFwiY29sb3Itc3RhcnRcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogZmllbGQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb2xvci1lbmRcIikgfHwgdGhpcy5nZXRBdHRyaWJ1dGUoXCJjb2xvci1lbmRcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsb3c6IGZpZWxkLmdldEF0dHJpYnV0ZShcImRhdGEtY29sb3ItZ2xvd1wiKSB8fCB0aGlzLmdldEF0dHJpYnV0ZShcImNvbG9yLWdsb3dcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdmVyOiBmaWVsZC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbG9yLWhvdmVyXCIpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKFwiY29sb3ItaG92ZXJcIikgfHwgXCIjZmZmZmZmXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBwb2ludENvdW50OiAxMCxcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IG9mZnNldCxcclxuICAgICAgICAgICAgICAgICAgICByaXBwbGVDYWxsYmFjazogaGFuZGxlUmlwcGxlLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlOiBwLFxyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiBpICsgaixcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSaXBwbGVFdmVudCB7XHJcbiAgICB4OiBudW1iZXI7XHJcbiAgICB5OiBudW1iZXI7XHJcbiAgICBtYW51YWw6IGJvb2xlYW47XHJcbiAgICBwYXJ0aWNsZTogV2F2ZVBhcnRpY2xlSW5mbztcclxufVxyXG4iLCJpbXBvcnQgeyB0cmFuc2xhdGlvbnMgfSBmcm9tIFwiLi4vLi4vaTE4bi9pMThuXCI7XHJcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4uLy4uL3V0aWxzL1NldHRpbmdzXCI7XHJcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VHYWluRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XHJcbiAgICAgICAgdGhpcy5zdHlsZS5sZWZ0ID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ4XCIpICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuc3R5bGUudG9wID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ5XCIpICsgXCJweFwiO1xyXG5cclxuICAgICAgICBsZXQgdHlwZSA9IHRoaXMuZ2V0QXR0cmlidXRlKFwidHlwZVwiKTtcclxuICAgICAgICBsZXQgZmxhdm9yID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJmbGF2b3JcIik7XHJcbiAgICAgICAgbGV0IGNvbG9yID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJjb2xvclwiKTtcclxuICAgICAgICBsZXQgcGFydGljbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHBhcnRpY2xlLmNsYXNzTGlzdC5hZGQoXCJwYXJ0aWNsZVwiKTtcclxuICAgICAgICBwYXJ0aWNsZS5jbGFzc0xpc3QuYWRkKHR5cGUpO1xyXG4gICAgICAgIHBhcnRpY2xlLmNsYXNzTGlzdC5hZGQoZmxhdm9yKTtcclxuICAgICAgICBwYXJ0aWNsZS5jbGFzc0xpc3QuYWRkKGNvbG9yKTtcclxuXHJcbiAgICAgICAgbGV0IGFtb3VudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIGFtb3VudC5pbm5lclRleHQgPSBgICsgJHt0aGlzLmdldEF0dHJpYnV0ZShcImFtb3VudFwiKX1gO1xyXG5cclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHBhcnRpY2xlKVxyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoYW1vdW50KVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKTtcclxuICAgICAgICB9LCAyMDAwKTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgVG9vbFRpcCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IHRyYW5zbGF0aW9ucyB9IGZyb20gXCIuLi8uLi9pMThuL2kxOG5cIjtcclxuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi4vLi4vdXRpbHMvU2V0dGluZ3NcIjtcclxuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGVkRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XHJcbiAgICAgICAgbGV0IGxhbmcgPSBTZXR0aW5ncy5nZXQoKS5nZW5lcmFsLnNldHRpbmdzLmxhbmd1YWdlLnZhbHVlO1xyXG4gICAgICAgIGxldCB0cmFuc2xhdGVkID0gVXRpbHMuZ2V0TmVzdGVkUHJvcGVydHkodHJhbnNsYXRpb25zW2xhbmddLCB0aGlzLmlubmVyVGV4dC50b0xvd2VyQ2FzZSgpKTtcclxuXHJcbiAgICAgICAgaWYgKHRyYW5zbGF0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5pbm5lclRleHQgPSB0cmFuc2xhdGVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuL1NldHRpbmdzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9nZ2VyIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgbG9nKGNvbnRleHQ6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIGlmIChTZXR0aW5ncy5nZXQoKSAmJiBTZXR0aW5ncy5nZXQoKS5kZWJ1Zy5zZXR0aW5ncy5sb2dnaW5nLnZhbHVlKSBjb25zb2xlLmxvZyhgWyR7Y29udGV4dH1dYCwgbWVzc2FnZSwgLi4uYXJncyk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBlcnJvcihjb250ZXh0OiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICBpZiAoU2V0dGluZ3MuZ2V0KCkgJiYgU2V0dGluZ3MuZ2V0KCkuZGVidWcuc2V0dGluZ3MubG9nZ2luZy52YWx1ZSkgY29uc29sZS5lcnJvcihgWyR7Y29udGV4dH1dYCwgbWVzc2FnZSwgLi4uYXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB3YXJuaW5nKGNvbnRleHQ6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIGlmIChTZXR0aW5ncy5nZXQoKSAmJiBTZXR0aW5ncy5nZXQoKS5kZWJ1Zy5zZXR0aW5ncy5sb2dnaW5nLnZhbHVlKSBjb25zb2xlLndhcm4oYFske2NvbnRleHR9XWAsIG1lc3NhZ2UsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGVidWcoY29udGV4dDogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgaWYgKFNldHRpbmdzLmdldCgpICYmIFNldHRpbmdzLmdldCgpLmRlYnVnLnNldHRpbmdzLmxvZ2dpbmcudmFsdWUgJiYgU2V0dGluZ3MuZ2V0KCkuZGVidWcuc2V0dGluZ3MudmVyYm9zZS52YWx1ZSkgY29uc29sZS5kZWJ1ZyhgWyR7Y29udGV4dH1dYCwgbWVzc2FnZSwgLi4uYXJncyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgU2F2ZUhhbmRsZXIgfSBmcm9tICcuLi9TYXZlSGFuZGxlci9TYXZlSGFuZGxlcic7XHJcbmltcG9ydCB0eXBlIHsgU2V0dGluZ3MgYXMgU2V0dGluZ3NUeXBlIH0gZnJvbSAnLi4vdHlwZXMvU2V0dGluZ3MnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNldHRpbmdzIHtcclxuICAgIHByaXZhdGUgc3RhdGljIHNldHRpbmdzOiBTZXR0aW5nc1R5cGU7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkZWZhdWx0KCk6IFNldHRpbmdzVHlwZSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZ2VuZXJhbDoge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwic2V0dGluZ3MuZ2VuZXJhbC50aXRsZVwiLFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBsYW5ndWFnZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJlblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcImVuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2V0dGluZ3MuZ2VuZXJhbC5sYW5ndWFnZS5uYW1lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBub1RhYkhpc3Rvcnk6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5nZW5lcmFsLm5vVGFiSGlzdG9yeS5uYW1lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcInNldHRpbmdzLmdlbmVyYWwubm9UYWJIaXN0b3J5LmRlc2NyaXB0aW9uXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnYW1lcGxheToge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwic2V0dGluZ3MuZ2FtZXBsYXkudGl0bGVcIixcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9PZmZsaW5lVGltZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNldHRpbmdzLmdhbWVwbGF5Lm5vT2ZmbGluZVRpbWUubmFtZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGlzcGxheToge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwic2V0dGluZ3MuZGlzcGxheS50aXRsZVwiLFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXJrTmF2aWdhdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNldHRpbmdzLmRpc3BsYXkuZGFya05hdmlnYXRpb24ubmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJzZXR0aW5ncy5kaXNwbGF5LmRhcmtOYXZpZ2F0aW9uLm5hbWVcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3RpbGxGaWVsZHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5kaXNwbGF5LnN0aWxsRmllbGRzLm5hbWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwic2V0dGluZ3MuZGlzcGxheS5zdGlsbEZpZWxkcy5uYW1lXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkZWJ1Zzoge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwic2V0dGluZ3MuZGVidWcudGl0bGVcIixcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2luZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5kZWJ1Zy5sb2dnaW5nLm5hbWVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHZlcmJvc2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzZXR0aW5ncy5kZWJ1Zy52ZXJib3NlLm5hbWVcIixcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQoKTogU2V0dGluZ3NUeXBlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXR0aW5ncztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldChzZXR0aW5nczogU2V0dGluZ3NUeXBlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHsuLi50aGlzLnNldHRpbmdzLCAuLi5zZXR0aW5nc307XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlc2V0KCk6IHZvaWQge1xyXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCByZXNldCBsb2dpY1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSB0aGlzLmRlZmF1bHQoKTtcclxuICAgICAgICBTYXZlSGFuZGxlci5zYXZlRGF0YSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBuYW1lc3BhY2UgVXRpbHMge1xyXG4gICAgZXhwb3J0IGNvbnN0IGdldE5lc3RlZFByb3BlcnR5ID0gKG9iajogYW55LCBwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICByZXR1cm4gcGF0aC5zcGxpdCgnLicpLnJlZHVjZSgoYWNjLCBrZXkpID0+IGFjYz8uW2tleV0sIG9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IGhleFRvUkdCID0gKGhleDogc3RyaW5nLCBhbHBoYT86IG51bWJlcikgPT4ge1xyXG4gICAgICAgIGxldCBub0hhc2ggPSBoZXgucmVwbGFjZShcIiNcIiwgXCJcIik7XHJcbiAgICAgICAgbGV0IHIgPSBwYXJzZUludChub0hhc2guc2xpY2UoMCwgMiksIDE2KSxcclxuICAgICAgICAgICAgZyA9IHBhcnNlSW50KG5vSGFzaC5zbGljZSgyLCA0KSwgMTYpLFxyXG4gICAgICAgICAgICBiID0gcGFyc2VJbnQobm9IYXNoLnNsaWNlKDQsIDYpLCAxNik7XHJcblxyXG4gICAgICAgIGlmIChhbHBoYSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgciArIFwiLCBcIiArIGcgKyBcIiwgXCIgKyBiICsgXCIsIFwiICsgYWxwaGEgKyBcIilcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJyZ2IoXCIgKyByICsgXCIsIFwiICsgZyArIFwiLCBcIiArIGIgKyBcIilcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IG1haW4gfSBmcm9tIFwiLi9tYWluXCI7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbWFpbik7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==