import moment from 'moment';

moment.updateLocale('en', {
    relativeTime: {
        future: 'in %s',
        past:   '%s',
        s(number, withoutSuffix) {
            return withoutSuffix ? 'now' : 'a few seconds';
        },
        m:  '1m',
        mm: '%dm',
        h:  '1h',
        hh: '%dh',
        d:  '1d',
        dd: '%dd',
        M:  '1M',
        MM: '%dM',
        y:  '1y',
        yy: '%dy',
    },
});
/*
moment.updateLocale('de', {
    relativeTime: {
        future: 'in %s',
        past:   'vor %s',
        s(number, withoutSuffix) {
            return withoutSuffix ? 'jetzt' : 'ein paar Sekunden';
        },
        m:  '1min',
        mm: '%dmin',
        h:  '1Std',
        hh: '%dStd',
        d:  '1T',
        dd: '%dT',
        M:  '1M',
        MM: '%dM',
        y:  '1J',
        yy: '%dJ',
    },
});
*/
