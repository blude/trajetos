/* Call helper methods */
MBP.scaleFix();
MBP.hideUrlBar();
MBP.enableActive();

;(function ($) {

    var map,
        isMapOpen = false,
        isMapInit = false;

    // Updated copyright date
    (function () {
        var currentYear = (new Date().getFullYear());
        $('#current-year').text(currentYear);
    })();

    var resetTitle = function () {
        var title = document.title;
        document.title = title.substring(title.indexOf('-') + 2);
    };

    var setTitle = function (title) {
        document.title = title + ' - ' + document.title;
    };

    var numberWithCommas = function (x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return parts.join(".");
    }

    /*
     * Deals with scrolling to the current position
     */
    var scrollToCurrent = function () {
        $.scroll($('#current-location').offset().top - 60);
    };

    var flashCurrentDetail = function () {
        $('#current-location .detail').fadeOut(300, function() {
            var $next = $('#upcoming-points').find('.bus-stop').first(); 
            $(this).fadeIn(300).find('.next-bus-stop').text($next);
        });
    };

    var animatePoint = function (point, offset) {
        point.animate({
            top: offset
        }, 300, 'ease-in', function() {
            point.css('top', '').appendTo('#past-points');
        });
    };

    var updateItinerary = function () {
        var delta, current, point;
        current = $('#current-location');
        point = $('#upcoming-points').find('.bus-stop').first();
        /*
         * calcula o deslocamento a partir da diferença (delta)
         * entre a localizacao do usuario (currentOffset)
         * e o ponto a ser animado (pointOffset),
         * sendo ambos em relação ao topo da página.
         */
        delta = current.offset().top - point.offset().top;
        animatePoint(point, delta);
        // verifica se o bloco que exibe a posicao atual
        // esta dentro da area visivel
        if (isScrolledIntoView(current) && !isMapOpen) {
            scrollToCurrent();
        }
        flashCurrentDetail();
    };


    var getCurrentLocation = function () {

        var cLat, cLon, nextPoint, nextLat, nextLon, p1, p2, dist;

        navigator.geolocation.getCurrentPosition(function (position) {

            cLat = position.coords.latitude;
            cLon = position.coords.longitude;

            nextPoint = $('#upcoming-points').find('.point').first();
            nextLat = nextPoint.data('lat');
            nextLon = nextPoint.data('lon');

            p1 = new google.maps.LatLng(cLat, cLon);
            p2 = new google.maps.LatLng(nextLat, nextLon);
            dist = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
            dist = Math.round(dist);

            $('#upcoming-points').data('lat', cLat);
            $('#upcoming-points').data('lat', cLon);

            $('#upcoming-points').find('.dist').text(numberWithCommas(dist) + ' metros');

        }, function (error) {
            if (error.code === 1) {
                console.log('Localização negada!');
            } else if (error.code === 2) {
                console.log("Localização indisponível.");
            } else if (error.code === 3) {
                console.log('Tempo esgotado...');
            } else {
                console.log('Erro desconhecido.');
            }
        });

        navigator.geolocation.watchPosition(function (position) {
            cLat = position.coords.latitude;
            cLon = position.coords.longitude;

            nextPoint = $('#upcoming-points').find('.point').first();
            nextLat = nextPoint.data('lat');
            nextLon = nextPoint.data('lon');

            p1 = new google.maps.LatLng(cLat, cLon);
            p2 = new google.maps.LatLng(nextLat, nextLon);
            dist = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
            dist = Math.round(dist);

            console.log('Distância até próximo ponto: '+ dist + " metros");
            $('#current-location .dist').text(numberWithCommas(dist) + ' metros');

            if (dist < 30) {
                console.log("Próximo ponto...");
                updateItinerary();
            }
        });
    };

    /**
    * Stop form submting
    */
    var showResults = function () {
        $('#page-results').load('results.php', function() {
            $('#home').animate({
                top: -$('#home').height()
            }, 300, 'ease-in', function () {
                setTitle('121 Mário Cypreste');
                $('#home').addClass('hidden');
                $('#page-results').removeClass('hidden');
                scrollToCurrent();

                if (Modernizr.geolocation) {
                    getCurrentLocation();
                }
            });
        });
    };


    $('.lines-found a').on('click tap', function (e) {
        $('#line-search').blur();
        showResults();
        e.preventDefault();
    });
    
    var showSuggestions = function () {
        $('.lines-found').animate({
            marginTop: '10px',
            opacity: 1
        }, 300, 'ease');
    }

    /**
     * Enable submit button when typing
     */
    $('#line-search').on('keyup', function () {
        if ($(this).val().length > 2) {
            showSuggestions();
        }
    }).on('focus', function() {
        $.scroll($(this).offset().top - 5);
    });

    var initMap = function () {
        var mapOptions = {
            zoom: 13,
            streetViewControl: false,
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('mapa'), mapOptions);

        if (Modernizr.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                var marker = new google.maps.Marker({
                    map: map,
                    position: pos,
                    animation: google.maps.Animation.DROP,
                    title: 'Você está aqui.'
                });

                map.setCenter(pos);

                isMapInit = true;

            }, function (error) {
                handleNoGeolocation(true);
                isMapInit = false;
            });
        } else {
            // navegador não suporta geo-localizacao
            handleNoGeolocation(false);
            isMapInit = false;   
        }
    };

    var handleNoGeolocation = function (errorFlag) {
        if (errorFlag) {
            var content = "Erro: geolocalização indisponível.";
        } else {
            var content = "O navegador não suporta geolocalização.";
        }

        var options = {
            map: map,
            position: new google.maps.LatLng(-20, -40),
            content: content
        };

        var infoWindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
    };

    var openMap = function () {
        if (!isMapInit) initMap();
        $.scroll(0);
        $('#mapa').fadeIn(200);
        if (isMapOpen) $.scroll($('#currento-location').offset().top - 310);
        isMapOpen = true;
    };

    var closeMap = function () {
        $('#mapa').fadeOut(200);
        isMapOpen = false;
    }

    var toggleMap = function () {
        isMapOpen ? closeMap() : openMap();
    }

    $('#toggle-map').live('click tap', function () {
        toggleMap();
        return false;
    });

    /*
     * This goes back to the search (home) page
     */
    $('#go-search').live('click tap', function () {
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

    $('#goto-current').live('tap click', function (e) {
        scrollToCurrent();
        e.preventDefault();
    });

    // Shortcut to show results
    (function() {
        if (window.location.search !== '' && Modernizr.geolocation) {
            showResults();
            getCurrentLocation();
        }
    })();

    $('.box').live('click', function (e) { e.preventDefault(); });


    /**
     * Watch for the document load and scroll events
     * and updates the guideline's height
     * to the current itinerary height.
     */
    $(window).on('load resize', function () {
        var actualHeight = $('#itinerary').height();
        $('#guide').height(actualHeight);
    });

})(window.Zepto);