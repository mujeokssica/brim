var Brim,
    Sister = require('sister');

Brim = function Brim (config) {
    var brim,
        sister,
        player = {},
        device;

    if (!(this instanceof Brim)) {
        return new Brim(config);
    }

    brim = this;

    /**
     * Get device and the associated dimensions.
     * 
     * @return {Object} device
     * @return {String} device.name
     * @return {Number} device.maximumAvailableHeight
     */
    brim.getDevice = function () {
        var screenWidth = window.screen.availWidth,
            screenHeight = window.screen.availHeight,
            device = {};


        if (screenWidth == 320 && screenHeight == 548) {
            device.name = 'iphone-5s';
            // Upon loading the page it is 460
            // Upon exiting the MAH it is 461
            device.maximumAvailableHeight = 529;
        } else {
            throw new Error('Not iOS device.');
        }

        return device;
    };
  
    /**
     * Is window height the Maximum Available Height (MAH).
     * 
     * @return {Boolean}
     */
    brim.isMAH = function () {
        var windowHeight = window.innerHeight;

        if (window.orientation === 0) {
            return device.maximumAvailableHeight == windowHeight;
        }
        
        throw new Error('Orientation not implemented.');
    };

    /**
     * Sets the dimensions of the treadmill element and adjusts the position of the scroll
     * depending on the state of the windowHeight.
     * 
     * If window is not in MAH, then treadmill height is set to 3 times the size of the MAH;
     * the window is scrolled to the offset of one MAH. 3 times and the scroll offset,
     * is because user cannot scroll more than one MAH with a single touch-drag gesture.
     *
     * If window is in MAH, then treadmill height is set to 1 MAH and scroll offset to 0.
     * This restricts the ongoing touch-drag downwards event.
     */
    brim.treadmill = function () {
        if (brim.isMAH()) {
            player.treadmill.style.width = config.viewportWidth + 'px';
            player.treadmill.style.height = device.maximumAvailableHeight + 'px';

            brim._scrollY(0);
        } else {
            player.treadmill.style.width = config.viewportWidth + 'px';
            player.treadmill.style.height = (device.maximumAvailableHeight * 3) + 'px';

            brim._scrollY(device.maximumAvailableHeight);
        }
    };

    brim._scrollY = function (y) {
        //console.log('scrollY', y);

        global.scrollTo(0, y);
    };

    /*brim.mask = function () {
        if (brim.isMAH()) {
            //player.mask.style.display = 'none';
        } else {
            //player.mask.style.display = 'block';

            player.mask.style.position = 'fixed';
        
            player.mask.style.top = 0;
            player.mask.style.left = 0;
            player.mask.style.width = config.viewportWidth + 'px';
            player.mask.style.height = device.maximumAvailableHeight + 'px';
            player.mask.style.pointerEvents = 'none';
        }
    };*/

    config = config || {};

    if (!config.viewportWidth) {
        throw new Error('Unknown viewport width.');
    }

    sister = Sister();
    player.treadmill = document.querySelector('#treadmill');
    player.main = document.querySelector('#main');
    player.mask = document.querySelector('#mask');
    device = brim.getDevice();

    // On page load, isMAH is always false. This makes the documentHeight scrollable.
    brim.treadmill();

    // The resize event is triggered when page is loaded in MAH state.
    global.addEventListener('resize', function () {
        brim.treadmill();
    });









    

    sister.on('change', function () {
        console.log('change', 'MAH:', brim.isMAH(), window.innerHeight);
        //brim.mask();
    });

    

    //sister.trigger('change');

    /*

    //sister.on('scroll', function () {
    //    console.log('scroll', 'MAH:', brim.isMAH());

    //    brim.mask();
    //});

    
    //sister.trigger('scroll');

    setTimeout(function () {
        // Do not trigger the change event twice upon loading the page.
        // This is relevant when the initial scroll offset is not 0.
        

        global.addEventListener('scroll', function () {
            sister.trigger('scroll');
        });

        //sister.trigger('change');
        //sister.trigger('scroll');
    }, 10);*/

    global.addEventListener('touchstart', function (e) {
        // Disable window scrolling when in MAH.
        if (brim.isMAH()) {
            e.preventDefault();
        }
    });

    global.addEventListener('touchend', function (e) {
        // Make sure that user cannot scroll to the top of the treadmill.
        brim.treadmill();
    });
};


global.gajus = global.gajus || {};
global.gajus.Brim = Brim;

module.exports = Brim;