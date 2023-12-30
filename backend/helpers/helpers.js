const crypto = require('crypto');
const secret = 'Anton-DUMB1801';

const helpers = {
    /**
     *
     * @param {Array} arr
     * @param {String} accumulator
     * @param {String} property
     * @param {String} value
     * @returns {Array}
     */
    groupBy: function (arr, accumulator, property, value) {
        let grouped = [];
        let currentYear;
        let currentObj = {
            year: null,
            months: []
        };

        arr.forEach(function (item, index) {
            if (!currentYear) {
                currentYear = item[accumulator][property];
            }

            if (currentYear === item[accumulator][property]) {
                currentObj.year = currentYear;
                currentObj.months.push(item[accumulator][value]);

                if (index + 1 === arr.length) {
                    grouped.push(currentObj);
                }
            } else if (currentYear !== item[accumulator][property]) {
                grouped.push(currentObj);

                currentYear = item[accumulator][property];

                currentObj = {
                    year: null,
                    months: []
                };
                currentObj.year = currentYear;
                currentObj.months.push(item[accumulator][value]);
            }
        });

        return grouped;
    },
    /**
     *
     * @param crypto
     * @param secret
     * @param string
     * @returns {string}
     */
    hashString: function (string) {
        return crypto.createHmac('sha256', secret).update(string).digest('hex')
    },
    /**
     *
     * @param min
     * @param max
     * @returns {number}
     */
    getRandomArbitrary(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
};

module.exports = helpers;


