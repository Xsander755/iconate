/*! iconate.js - v0.3.0 - 2015-05-01
* http://bitshadow.github.io/iconatejs/
* Copyright (c) 2015 Jignesh Kakadiya; Licensed MIT */

/*! iconate.js - v0.3.0 - 2015-04-27
 * http://bitshadow.github.io/iconatejs/
 * Copyright (c) 2015 Jignesh Kakadiya; Licensed MIT */

/*global window */
/*global document */
(function() {
    'use strict';

    var DEFAULT_DURATION = 600;
    var TEST_INTERVAL = 10;
    var ONE_SECOND = 1000;
    var MAX_FRAMES = 100;
    var frameCounter = 1;
    var ANIMATION_START, ANIMATION_END;

    /**
     * chrome 4, ie 10+, firefox 16, safari 4, opera 12.1, 15
     */

    if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
        ANIMATION_END = 'webkitAnimationEnd';
    } else {
        ANIMATION_END = 'animationend';
    }

    if (window.onanimationstart === undefined && window.onwebkitanimationstart !== undefined) {
        ANIMATION_START = 'webkitAnimationStart';
    } else {
        ANIMATION_START = 'animationstart';
    }

    var currentTime = Date.now || function() {
        return new Date().getTime();
    };

    var time = currentTime();
    var timer1 = setInterval(func1, TEST_INTERVAL);
    var timer2 = setInterval(func1, TEST_INTERVAL);

    function func1() {
        var elapsedTime = currentTime() - time;
        if (elapsedTime >= ONE_SECOND) {
            clearInterval(timer1);
            clearInterval(timer2);
            console.log('frameCounter', frameCounter / 4);
        }

        frameCounter = frameCounter + 1;
    }

    function setAnimation(element, animType, duration) {
        element.style.setProperty('-webkit-animation', animType + ' ' + duration + 's');
        element.style.setProperty('animation', animType + ' ' + duration + 's');
        element.style.setProperty('-moz-animation', animType + ' ' + duration + 's');
        element.style.setProperty('-o-animation', animType + ' ' + duration + 's');
    }

    function removeAnimation(element) {
        element.style.removeProperty('-webkit-animation');
        element.style.removeProperty('animation');
        element.style.removeProperty('-moz-animation');
        element.style.removeProperty('-o-animation');
    }

    function changeClasses(element, from, to) {
        if (element.classList.contains(from)) {
            element.classList.remove(from);
        }

        element.classList.add(to);
    }

    function iconate(el, options, callback) {
        var duration, interval, showPercent;
        options = options || {};

        // var result = document.getElementById('result');
        duration = options.duration || DEFAULT_DURATION;
        interval = duration / MAX_FRAMES;

        function animationStartHandler() {
            var currentPercent = 0,
                averageFrames;
            showPercent = window.setInterval(function() {
                currentPercent = currentPercent < MAX_FRAMES ? currentPercent + 1 : 0;
                averageFrames = Math.max(parseInt(frameCounter / 4, 10), 40);
                if (currentPercent === averageFrames) {
                    changeClasses(el, options.from, options.to);
                }

                // result.innerHTML = currentPercent;
            }, interval);
        }

        function animationEndHandler() {
            window.clearInterval(showPercent);
            removeAnimation(el);

            el.removeEventListener(ANIMATION_END, animationEndHandler);
            el.removeEventListener(ANIMATION_START, animationStartHandler);

            if (callback && typeof callback === 'function') {
                callback();
            }
        }

        el.addEventListener(ANIMATION_START, animationStartHandler, false);
        el.addEventListener(ANIMATION_END, animationEndHandler, false);

        setAnimation(el, options.animation, duration / ONE_SECOND);
    }

    // commonjs
    if (typeof exports === 'object') {
        module.exports = iconate;
    }

    // AMD module
    else if (typeof define === 'function' && define.amd) {
        define([], iconate);
    }

    // Browser global
    else {
        window.iconate = iconate;
    }
}());
