// Avoid `console` errors in browsers that lack a console.
;(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/*global Zepto, window*/

// Handling tap events can be tricky because 300ms after the cycle of
// touchstart, touchmove, touchend events the browser will send a click event
// to the same position on the screen.
//
// Unfortunately, if the DOM of your page has changed by the time this click
// event fires, it can end up hitting a random button instead of the element
// that used to be there.
//
// To fix this, we use a solution suggested by Google: every time there's a
// tap event that our code handles, we prevent any click events that fire in the
// same place shortly afterwards from having any effect.
//
// NOTE: it seems that even though we are cancelling the click event as soon as
// possible, a link that's under the delayed click will still be marked as
// :active for a few tens of milliseconds. I've tried cancelling mousedown
// events too, but that didn't seem to help.
//
// [1] https://developers.google.com/mobile/articles/fast_buttons#ghost
;(function($) {

    // The space-time coordinates in space-time of the most recent touchend
    // event.  Because touchend doesn't itself have any coordinates, we need to
    // maintain x and y ourselves by listening on touchstart and touchmove.
    var x, y, t;

    window.addEventListener('touchstart', function (e) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    }, true);

    window.addEventListener('touchmove', function (e) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    }, true);

    window.addEventListener('touchend', function (e) {
        t = new Date();
    }, true);

    // We only want to cancel the click if some javascript calls
    // .preventDefault() on the tap event (or equivalently returns false from
    // a tap event's handler).
    //
    // Due to limitations of the event model we also cancel the click if
    // javascript calls .stopPropagation(), as the event will not bubble this
    // far. That's probably fine as people rarely distinguish strongly between
    // the two.
    $(window).on('tap doubleTap', function (e) {
        if (!e.defaultPrevented) {
            t = 0;
        }
    });

    // Intercept all clicks on the document, and if they are close in spacetime
    // to a recently handled tap event, prevent them from happening.
    window.addEventListener('click', function (e) {
         // 1000ms is longer than 300ms. Google suggest 2500, but I'm not sure
         // on what basis. That seems unnecessarily long.
        var time_threshold = 1000,
            // 30px is the distance you can move your finger on the iPad before
            // the "tap" does not generate a click.
            // (it's also the threshold used by zepto before a tap becomes a
            // swipe)
            space_threshold = 30;

        if (new Date() - t <= time_threshold &&
            Math.abs(e.clientX - x) <= space_threshold &&
            Math.abs(e.clientY - y) <= space_threshold) {

            e.stopPropagation();
            e.preventDefault();
        }
    }, true);

}(window.Zepto));


/*
   Zepto scrollTop() port
 */
;(function($) {
    ["Left", "Top"].forEach(function(name, i) {
        var method = "scroll" + name;
    
        var isWindow = function(obj) {
            return obj && typeof obj === "object" && "setInterval" in obj;
        }
     
        var getWindow = function(elem) {
            return isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
        }
     
        $.fn[method] = function(val) {
            var elem, win;
            if (val === undefined) {
                elem = this[0];
                if (!elem) {
                    return null;
                }
                win = getWindow(elem);
                // Return the scroll offset
                return win ? ("pageXOffset" in win) ? win[i ? "pageYOffset" : "pageXOffset"] :
                    win.document.documentElement[method] ||
                    win.document.body[method] :
                    elem[method];
            }
            // Set the scroll offset
            this.each(function() {
                win = getWindow(this);
                if ( win ) {
                    var xCoord = !i ? val : $(win).scrollLeft();
                    var yCoord = i ? val : $(win).scrollTop();
                    win.scrollTo(xCoord, yCoord);
                } else {
                    this[method] = val;
                }
            });
        }
    });
})(window.Zepto);

// Check if element is into view
var isScrolledIntoView = function(elem) {
    var docViewTop, docViewBottom, elemTop, elemBottom;
    docViewTop = $(window).scrollTop();
    docViewBottom = docViewTop + $(window).height();
    elemTop = $(elem).offset().top;
    elemBottom = elemTop + $(elem).height();
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}