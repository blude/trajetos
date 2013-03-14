/* Call helper methods */
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
            var nextBusStop = $('#upcoming-points').find('.bus-stop').first().find('.name').text(); 
            $(this).fadeIn(300).find('.next-bus-stop').text(nextBusStop);
        });
    };

    var animatePoint = function (point, offset) {
        point.animate({
            translateY: offset + 'px'
        }, 300, 'ease-in', function() {
            point.css('top', '').appendTo('#past-points');
        });
    };

    var updateItinerary = function () {
        var delta, current, point;
        current = $('#current-location');
        point = $('#upcoming-points').find('.point').first();
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

    var distanceBetween = function (p1, p2) {
        return google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
    };

    google.maps.LatLng.prototype.distanceTo = function (p2) {
        return google.maps.geometry.spherical.computeDistanceBetween(this, p2);
    };

    var getCurrentLocation = function () {

        var $nextPoint, $2ndNextPoint, $upcoming = $('#upcoming-points'), dist, diffPoints, distP2nd, distStop;

        navigator.geolocation.getCurrentPosition(function (position) {

            $nextPoint = $upcoming.find('.point').eq(0);
            var pBus = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var p1 = new google.maps.LatLng($nextPoint.data('lat'), $nextPoint.data('lon'));

            dist = Math.round(distanceBetween(pBus, p1));

            $upcoming.data('lat', position.coords.latitude);
            $upcoming.data('lat', position.coords.longitude);
            $upcoming.find('.dist').text(numberWithCommas(dist) + ' metros');

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

            $upcoming = $('#upcoming-points');
            $nextPoint = $upcoming.find('.point').eq(0);
            $2ndNextPoint = $upcoming.find('.point').eq(1);

            var pBus = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var p1 = new google.maps.LatLng($nextPoint.data('lat'), $nextPoint.data('lon'));
            var p2 = new google.maps.LatLng($2ndNextPoint.data('lat'), $2ndNextPoint.data('lon'));
            var pBusStop = new google.maps.LatLng($upcoming.find('.bus-stop').first().data('lat'), $upcoming.find('.bus-stop').first().data('lon'));

//          dist = Math.round(distanceBetween(pBus, p1));
            distStop = Math.round(distanceBetween(pBus, pBusStop));

            console.log('Distância até próximo ponto: '+ distStop + " metros");
            $('#current-location .dist').text(numberWithCommas(distStop) + ' metros');

            diffPoints = Math.round(distanceBetween(p1, p2));
            distP2nd = Math.round(distanceBetween(pBus, p2));

            // compare a distancia entre os pontos P1 e P2 e entre o ônibus e P2.
            // se a distancia entre o onibus e P2 for menor do que entre os pontos
            // é por que o ônibus já passou por P1, portanto avance para o próximo
            if (distP2nd < diffPoints) {
                console.log("Próximo ponto...");
                updateItinerary();
            }
        });
    };

    var goToClosest = function (index) {
        console.log('Indice do ponto mais próximo: '+ index);
        console.log($('#upcoming-points').find('.point').eq(index));
        $('#upcoming-points').find('.point').slice(0, index + 1).appendTo('#past-points');
    }

    var findClosestPoint = function () {
        navigator.geolocation.getCurrentPosition(function (position) {
            var currentPoint = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var $points = $('#upcoming-points').find('.point');
            var distances = [],
                closest = -1;
            for (var i = 0; i < $points.size(); i++) {
                var p2 = new google.maps.LatLng($points.eq(i).data('lat'), $points.eq(i).data('lon'));
                var distance = distanceBetween(currentPoint, p2);
                distances[i] = distance;
                if (closest === -1 || distance < distances[closest]) {
                    closest = i;
                }
            }
            if (distances[closest] > 600) {
                alert('Você está mesmo nessa linha?');
                window.location = window.location.pathname;
            } else {
                goToClosest(closest);
                scrollToCurrent();
            }
        });
    }

    /**
    * Stop form submting
    */
    var showResults = function () {
        $('#page-results').load('results.php', function() {
            $('#home').animate({
                translateY: -$('#home').height() +'px'
            }, 300, 'ease-in', function () {
                setTitle('164 - Forte Sâo João');
                $('#home').addClass('hidden');
                $('#page-results').removeClass('hidden');
                if (Modernizr.geolocation) {
                    findClosestPoint();
                    getCurrentLocation();
                }
            });
        });
    };


    $('.lines-found a').on('click tap', function (e) {
        $('#line-search').blur();
        showResults();
    }).on('touchstart', function (e) {
        e.preventDefault();
    });
    
    var showSuggestions = function () {
        $('.lines-found').animate({
            translateY: '10px',
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
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('mapa'), mapOptions);

        var poly, polyOptions =  {
            strokeColor: '#0033ff',
            strokeOpacity: 1.0,
            strokeWeight: 3.0
        };

        poly = new google.maps.Polyline(polyOptions);

        poly.setMap(map);

        var path = [];

        $.getJSON('data/itineraries.json', function (data) {
            var points = data.points;
            $.each(points, function (key, value) {
                path.push(new google.maps.LatLng(value.coords.lat, value.coords.lon));
            });
            poly.setPath(path);
        });

        var image = {
            url: 'img/bus-marker.png',
            size: new google.maps.Size(32, 41),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 37)
        };

        var marker = new google.maps.Marker({
            map: map,
            title: 'Você está aqui.',
            icon: image
        });

        var pos;

        if (Modernizr.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                marker.setPosition(pos);
                map.setCenter(pos);

                isMapInit = true;

            }, function (error) {
                handleNoGeolocation(true);
                isMapInit = false;
            });

            navigator.geolocation.watchPosition(function (position) {
                pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                marker.setPosition(pos);
                map.setCenter(pos);

            }, function (error) {
                handleNoGeolocation(true);
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
        $('#conteiner-mapa').addClass('aberto');
        if (!isMapInit) initMap();
        isMapOpen = true;
    };

    var closeMap = function () {
        $('#conteiner-mapa').removeClass('aberto');
        isMapOpen = false;
    }

    var toggleMap = function () {
        isMapOpen ? closeMap() : openMap();
    }

    $('#toggle-map').live('click tap', function () {
        toggleMap();
        return false;
    });

    var goBackToSearch = function() {
        $('#page-results').addClass('hidden');
        $('#home').css('-webkit-transform', '').removeClass('hidden');
        $('#line-search').val('');
        $('.lines-found').css({
            '-webkit-transform': 'translateY(-193px)',
            opacity: 0
        });
        resetTitle();
        $.scroll(0);
        return false;
    }

    /*
     * This goes back to the search (home) page
     */
    $('#go-search').live('click tap', goBackToSearch);

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