if(typeof require === 'function') {
    $ = require('./jquery');
}

var getCookie = function (name) {
    var cookie = document.cookie;
    var cookies = cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var kv = cookies[i].split('=');
        if ($.trim(kv[0]) == name) {
            return kv[1] && kv[1].length ? kv[1] : null;
        }
    }
    return false;
};
if (!getCookie('YNOTE_CSTK')) {
    $.ajax({
        url : '/yws/mapi/user?keyfrom=web&method=get',
        cache : false,
        type : "GET"
    });
}
$.ajaxPrefilter(function (options, oriOptions, xhr) {
    if (!options.url || !options.contentType) {
        return;
    }
    if (!/(?:\/yws)/i.test(options.url)) {
        return;
    }
    if (/(?:\/yws\/mapi\/user\?.*method=get)/i.test(options.url) ||
            /(?:\/yws\/mapi\/user\?.*method=register)/i.test(options.url) ||
            /(?:\/yws\/mapi\/user\?.*method=edm)/i.test(options.url) ||
            /(?:\/yws\/mapi\/res\/)/i.test(options.url) ||
            /(?:\/yws\/mapi\/ad\/)/i.test(options.url) ||
            /(?:\/yws\/mapi\/payment)/i.test(options.url) ||
            /(?:\/yws\/mapi\/ilogrpt)/i.test(options.url) ||
            /(?:\/yws\/mapi\/weibo\/share)/i.test(options.url) ||
            /(?:\/yws\/public\/collaboration)/i.test(options.url)) {
        return;
    }
    if (!getCookie('YNOTE_CSTK')) {
        $.ajax({
            url : '/yws/mapi/user?method=get&keyfrom=web',
            async: false,cache : false,type : "GET"
        });
    }
    if (!getCookie('YNOTE_CSTK')) {
        return;
    }
    if (/(?:x-www-form-urlencoded)/i.test(options.contentType)) {
        if (options.data) {
            options.data += '&cstk=' + getCookie('YNOTE_CSTK');
        } else {
            options.data = 'cstk=' + getCookie('YNOTE_CSTK');
        }
    } else if (/(?:json)/i.test(options.contentType)) {
        if (options.url) {
            if (options.url.indexOf('?') !== -1) {
                options.url += '&cstk=' + getCookie('YNOTE_CSTK');
            } else {
                options.url +='?cstk=' + getCookie('YNOTE_CSTK');
            }
        }
    } else {
        if (options.data && typeof options.data === "string") {
            options.data += '&cstk=' + getCookie('YNOTE_CSTK');
        } else {
            options.data = 'cstk=' + getCookie('YNOTE_CSTK');
        }
    }
});