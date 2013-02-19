/* Call helper methods */
MBP.scaleFix();
MBP.hideUrlBar();
MBP.enableActive();

;(function($) {

    var updateTimer, isMapOpen = false, isMapInitialized = false;

    // Updated copyright date
    (function() {
        var currentYear = (new Date().getFullYear());
        $('#current-year').text(currentYear);
    })();

    var resetTitle = function() {
        var title = document.title;
        document.title = title.substring(title.indexOf('-') + 2);
    };

    var setTitle = function(title) {
        document.title = title + ' - ' + document.title;
    };

    /**
     * Watch for the document load and scroll events
     * and updates the guideline's height
     * to the current itinerary height.
     */
    $(window).on('load resize', function() {
        var actualHeight = $('#itinerary').height();
        $('#guide').height(actualHeight);
    });

    /*
     * Deals with scrolling to the current position
     */
    var scrollToCurrent = function() {
        $.scroll($('#current-location').offset().top - 60);
    };

    var flashCurrentDetail = function() {
        $('#current-location .detail').fadeOut(300, function() { $(this).fadeIn(300); });
    };

    var animatePoint = function(point, offset) {
        point.animate({
            top: offset
        }, 300, 'ease-in', function() {
            point.css('top', '').appendTo('#past-points');
        });
    };

    var updateItinerary = function() {
        updateTimer = setTimeout(function() {
            var delta, current, point;
            current = $('#current-location');
            point = $('#upcoming-points').find('.point').first();
            /*
             * calcula o deslocamento a partir da diferença (delta)
             * entre a localizacao do usuario (currentOffset)
             * e o ponto a ser animado (pointOffset),
             * sendo ambos em relação ao topo da página.
             */
            delta = (current.offset().top) - (point.offset().top);
            animatePoint(point, delta);
            // verifica se o bloco que exibe a posicao atual
            // esta dentro da area visivel
            if (isScrolledIntoView(current) && !isMapOpen) {
                scrollToCurrent();
            }
            flashCurrentDetail();
            // continua atualizado se houverem mais pontos
            if ( $('#upcoming-points').find('.point').size() > 1) {
                updateItinerary();
            }
        }, 5000);
    };

    /**
     * Stop form submting
     */
     var showResults = function() {
        $('#page-results').load('results.php', function() {
            $('#home').animate({
                top: -($('#home').height())
            }, 300, 'ease-in', function() {
                setTitle('121 Mário Cypreste');
                $('#home').addClass('hidden');
                $('#page-results').removeClass('hidden');
                scrollToCurrent();
                updateItinerary();
            });
        });
     };

    var getCurrentLocation = function() {
        navigator.geolocation.getCurrentPosition(function(location) {
            console.log(location.coords.latitude +", "+ location.coords.longitude +" ("+ location.coords.accuracy +")");
        }, function(error) {
            if (error.PERMISSION_DENIED) {
                console.log('Localização negada!');
            }
        });
        return true;
    }

    $('.lines-found a').on('click tap', function() {
        $('#line-search').blur();
        if (Modernizr.geolocation) {
            var location = getCurrentLocation();
        }
        if (location) showResults();
        return false;
    });
    
    var showSuggestions = function() {
        $('.lines-found').animate({
            marginTop: '10px',
            opacity: 1
        }, 300, 'ease');
    }

    /**
     * Enable submit button when typing
     */
    $('#line-search').on('keyup', function() {
        if ($(this).val().length > 3) {
            showSuggestions();
        }
    }).on('focus', function() {
        $.scroll($(this).offset().top - 5);
    });


    $('#toggle-map').live('click tap', function() {
        if (!isMapInitialized) {
            var mapa = L.map('mapa');
            L.tileLayer('http://mt{s}.google.com/vt/v=w2.106&x={x}&y={y}&z={z}&s=', {
                attribution: 'Map by Google',
                maxZoom: 12,
                subdomains: '0123'
            }).addTo(mapa);
            mapa.locate({
                setView: true,
                maxZoom: 12
            });
            var onLocationFound = function(e) {
                L.marker(e.latlng).addTo(mapa);
            }
            mapa.on('locationfound', onLocationFound);

            function onLocationError(e) {
                alert(e.message);
            }
            mapa.on('locationerror', onLocationError);

            L.Util.requestAnimFrame(mapa.invalidateSize, mapa, false, mapa._container);
            isMapInitialized = true;
        }
        $.scroll(0);
        $('#mapa').fadeToggle(200);
        if (isMapOpen) $.scroll($('#current-location').offset().top - 310);
        isMapOpen = !isMapOpen;
        return false;
    });

    /*
     * This goes back to the search (home) page
     */
    $('#go-search').live('click tap', function() {
        clearTimeout(updateTimer);
        $('#page-results').addClass('hidden');
        $('#home').css('top', '').removeClass('hidden');
        $('#line-search').val('');
        $('.lines-found').css({
            marginTop: '-193px',
            opacity: 0
        });
        resetTitle();
        $.scroll(0);
        return false;
    });

    /*
     * More event listeners
     */

    $('#goto-current').live('tap click', function(e) {
        scrollToCurrent();
        e.preventDefault();
    });

    // Shortcut to show results
    (function() {
        if (window.location.search !== '') {
            showResults();
        }
    })();

    $('.box').live('click', function(e) { e.preventDefault(); });

})(window.Zepto);