/**
 * @fileoverview dragscroll - scroll area by dragging
 * @version 0.0.6
 * 
 * @license MIT, see http://github.com/asvd/intence
 * @copyright 2015 asvd <heliosframework@gmail.com> 
 */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.dragscroll = {}));
    }
}(this, function (exports) {
    var _window = window;
    var _document = document;
    var mousemove = 'mousemove';
    var mouseup = 'mouseup';
    var mousedown = 'mousedown';
    var EventListener = 'EventListener';
    var addEventListener = 'add'+EventListener;
    var removeEventListener = 'remove'+EventListener;

    var dragged = [];

    var isDraggingClass = 'is-dragging';

    function reset(i, el) {
        for (i = 0; i < dragged.length;) {
            el = dragged[i++];
            el = el.container || el;
            el[removeEventListener](mousedown, el.md, 0);
            _window[removeEventListener](mouseup, el.mu, 0);
            _window[removeEventListener](mousemove, el.mm, 0);
        }

        // cloning into array since HTMLCollection is updated dynamically
        dragged = [].slice.call(_document.getElementsByClassName('dragscroll'));

        for (i = 0; i < dragged.length;) {
            (function(el, lastClientX, lastClientY, pushed, scroller, cont){
                var cont = el.container || el;
                var intervalID;

                cont[addEventListener](mousedown, cont.md = function(e) {
                    if (!el.hasAttribute('nochilddrag')
                        || _document.elementFromPoint(e.pageX, e.pageY) === cont) {

                        pushed = 1;
                        lastClientX = e.clientX;
                        lastClientY = e.clientY;

                        // Below line caused inputs inside the dragscrollable area to be un-focusable.
                        //e.preventDefault();

                        var initClientX = e.clientX;
                        var initClientY = e.clientY;

                        intervalID = window.setInterval(function() {
                            if (Math.abs(lastClientX - initClientX) > 10 || Math.abs(lastClientY - initClientY) > 10) {
                                cont.classList.add(isDraggingClass);
                                intervalID && _window.clearInterval(intervalID);
                            }
                        }, 150);
                    }
                }, 0);

                _window[addEventListener](mouseup, cont.mu = function() {
                    pushed = 0;
                    cont.classList.remove(isDraggingClass);
                    intervalID && _window.clearInterval(intervalID);
                }, 0);

                _window[addEventListener](mousemove, cont.mm = function(e) {
                    if (pushed) {
                         var scroller = el.scroller||el;
                         scroller.scrollLeft -= (- lastClientX + (lastClientX=e.clientX));
                         scroller.scrollTop -= (- lastClientY + (lastClientY=e.clientY));
                    }
                }, 0);
             })(dragged[i++]);
        }
    }


    if (_document.readyState == 'complete') {
        reset();
    } else {
        _window[addEventListener]('load', reset, 0);
    }

    exports.reset = reset;
}));