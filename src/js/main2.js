$(document).ready(function () {
    //    window.requestAnimationFrame(function ( /* time */ time) {
    //        // time ~= +new Date // the unix time
    //        $(window).trigger('resize');
    //    });
    
    $(window).resize(onResize);
    function onResize() {
        var wh = $(window).height();
        $center = $('.center-container');
        $main = $('.main-container');
        var mh = $main.height();
        $sidebarright = $('.sidebar-right');
        var sbrh = $main.height();

        var h = Math.max(wh, mh, sbrh);
        $center.css('min-height', h + 'px');
        $main.css('min-height', h + 'px');
        $sidebarright.css('min-height', h + 'px');
    }

    
    function onContentUnload($content) {
        
    }
    function onContentLoad($content, url) {
        
    }
    
    (function () {
        $.address.init(function (event) {
            processJqueryAddressEvent(event);
        }).bind('change', function (event) {
            processJqueryAddressEvent(event);
        });

        var lastEvent = null;
        var fetchingPage = 0;

        function processJqueryAddressEvent(event) {
            if (fetchingPage) return;
            if (lastEvent && lastEvent.value == event.value) return;

            var url = null;
            var dir = 'partials';
            var htmlext = '.html';
            if (/^\/home/.test(event.value)) url = dir + '/home' + htmlext;
            if (/^\/location/.test(event.value)) url = dir + '/location' + htmlext;
            if (/^\/register/.test(event.value)) url = dir + '/register' + htmlext;
            if (/^\/contact/.test(event.value)) url = dir + '/contact' + htmlext;
            if (/^\/e-brochure/.test(event.value)) url = dir + '/e-brochure' + htmlext;
            if (/^\/concept/.test(event.value)) url = dir + '/concept' + htmlext;
            if (/^\/facilities/.test(event.value)) url = dir + '/facilities/phase1' + htmlext;
            if (/^\/floorplan/.test(event.value)) url = dir + '/floorplan/phase1' + htmlext;
            if (/^\/siteplan/.test(event.value)) url = dir + '/siteplan/phase1' + htmlext;
            if (/^\/gallery/.test(event.value)) url = null;

            if (!url) return;

            lastEvent = event;
            fetchingPage = 1;
            $.ajax(url).done(function (data) {
                var $cnt = $('.center-container').children();
                $cnt.fadeOut(100, function () {
                    
                });
                $('.center-container').empty();
                $(data).appendTo($('.center-container'));
                $('a').each(function () {
                    $(this).toggleClass('selected', $(this).text() == event.value);
                });
                $(window).trigger('resize');
            }).always(function () {
                fetchingPage = 0;
            });
        }
    })();


    //post initial
    $(window).trigger('resize');
});