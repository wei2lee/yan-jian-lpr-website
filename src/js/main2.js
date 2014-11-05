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



    $.address.init(function (event) {
        processJqueryAddressEvent(event);
    }).bind('change', function (event) {
        processJqueryAddressEvent(event);
    });

    var lastEvent = null;

    function processJqueryAddressEvent(event) {
        if (lastEvent && lastEvent.value == event.value) return;

        var url = '';
        var pathnames = ['/home'];
//        if (pathnames.indexOf(event.value) >= 0) {
        if(true){
            url = 'partials' + event.value + '.html';
        } else {
            url = 'partials/home.html';
        }

        lastEvent = event;
        $.ajax(url).done(function (data) {
            var $cnt = $('.center-container').children();
            $cnt.fadeOut(100, function(){
                 
            });
            $('.center-container').empty();
            $(data).appendTo($('.center-container'));
            $('a').each(function () {
                $(this).toggleClass('selected', $(this).text() == event.value);
            });
            $(window).trigger('resize');
        });
    }
    $(window).trigger('resize');
});