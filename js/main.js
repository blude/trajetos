/* Call helper methods */
MBP.scaleFix();
MBP.hideUrlBar();
MBP.enableActive();

;(function ($) {

    var isMapOpen = false, isMapInitialized = false;

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

    /** Converts numeric degrees to radians */
    if (typeof Number.prototype.toRad === 'undefined') {
      Number.prototype.toRad = function () {
        return this * Math.PI / 180;
      }
    }

    /** Converts radians to numeric (signed) degrees */
    if (typeof Number.prototype.toDeg === 'undefined') {
      Number.prototype.toDeg = function () {
        return this * 180 / Math.PI;
      }
    }

    /** 
     * Formats the significant digits of a number, using only fixed-point notation (no exponential)
     * 
     * @param   {Number} precision: Number of significant digits to appear in the returned string
     * @returns {String} A string representation of number which contains precision significant digits
     */
    if (typeof Number.prototype.toPrecisionFixed === 'undefined') {
      Number.prototype.toPrecisionFixed = function (precision) {
        
        // use standard toPrecision method
        var n = this.toPrecision(precision);
        
        // ... but replace +ve exponential format with trailing zeros
        n = n.replace(/(.+)e\+(.+)/, function (n, sig, exp) {
          sig = sig.replace(/\./, '');       // remove decimal from significand
          l = sig.length - 1;
          while (exp-- > l) sig = sig + '0'; // append zeros from exponent
          return sig;
        });
        
        // ... and replace -ve exponential format with leading zeros
        n = n.replace(/(.+)e-(.+)/, function (n, sig, exp) {
          sig = sig.replace(/\./, '');       // remove decimal from significand
          while (exp-- > 1) sig = '0' + sig; // prepend zeros from exponent
          return '0.' + sig;
        });
        
        return n;
      }
    }

    /** Trims whitespace from string (q.v. blog.stevenlevithan.com/archives/faster-trim-javascript) */
    if (typeof String.prototype.trim === 'undefined') {
      String.prototype.trim = function () {
        return String(this).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      }
    }

    var numberWithCommas = function (x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return parts.join(".");
    }

    /**
     * Creates a point on the earth's surface at the supplied latitude / longitude
     *
     * @constructor
     * @param {Number} lat: latitude in numeric degrees
     * @param {Number} lon: longitude in numeric degrees
     * @param {Number} [rad=6371]: radius of earth if different value is required from standard 6,371km
     */
    var LatLon = function (lat, lon, rad) {
        if (typeof(rad) === 'undefined') rad = 6371;  // earth's mean radius in km
        // only accept numbers or valid numeric strings
        this._lat = typeof(lat) === 'number' ? lat : typeof(lat) === 'string' && lat.trim() !=='' ? + lat : NaN;
        this._lon = typeof(lon) === 'number' ? lon : typeof(lon) === 'string' && lon.trim() !=='' ? + lon : NaN;
        this._radius = typeof(rad) === 'number' ? rad : typeof(rad) === 'string' && trim(lon) !=='' ? + rad : NaN;
    }

    /**
     * Returns the distance from this point to the supplied point, in km 
     * (using Haversine formula)
     *
     * from: Haversine formula - R. W. Sinnott, "Virtues of the Haversine",
     *       Sky and Telescope, vol 68, no 2, 1984
     *
     * @param   {LatLon} point: Latitude/longitude of destination point
     * @param   {Number} [precision=4]: no of significant digits to use for returned value
     * @returns {Number} Distance in km between this point and destination point
     */
    LatLon.prototype.distanceTo = function (point, precision) {
        // default 4 sig figs reflects typical 0.3% accuracy of spherical model
        if (typeof precision === 'undefined') precision = 4;

        var R = this._radius;
        var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
        var lat2 = point._lat.toRad(), lon2 = point._lon.toRad();
        var dLat = lat2 - lat1;
        var dLon = lon2 - lon1;

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d.toPrecisionFixed(precision);
    }

    /**
     * [simpleDistance description]
     * @param  {LatLon} point:     Latitute/Longitude of destination point
     * @return {Number}           Distance in meters between this point and destination point
     */
    LatLon.prototype.sDistanceTo = function (point) {
        var R = this._radius;
        var lat1 = this._lat.toRad(), lon1 = this._lon.toRad(),
            lat2 = point._lat.toRad(), lon2 = point._lon.toRad();

        var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
        var y = (lat2 - lat1);
        var d = Math.sqrt(x * x + y * y) * R;

        return (d * 1000).toFixed();
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

    var findClosestPoint = function () {
        var i, distances, points, closest, cLat, cLon, p1, dist;
        distances = [];
        closest = -1;
        points = $('#upcoming-points').find('.point');
        cLat = $('#upcoming-points').data('lat');
        cLon = $('#upcoming-points').data('lon');
        p1 = new LatLon(cLat, cLon);

        points.each(function (index, item) {
            var pLat = item.data('lat'),
                pLon = item.data('lon'),
                p2 = new LatLon(pLat, pLon);

            dist = p1.sDistanceTo(p2);
            distances[index] = dist;
            if (closest === -1 || dist < distances[closest]) {
                closest = index;
            }
        });

        return closest;
    }

    var getCurrentLocation = function () {

        var cLat, cLon, nextPoint, nextLat, nextLon, p1, p2, dist;

        navigator.geolocation.getCurrentPosition(function (position) {

            cLat = position.coords.latitude;
            cLon = position.coords.longitude;

            nextPoint = $('#upcoming-points').find('.point').first();
            nextLat = nextPoint.data('lat');
            nextLon = nextPoint.data('lon');

            p1 = new LatLon(cLat, cLon);
            p2 = new LatLon(nextLat, nextLon);
            dist = p1.sDistanceTo(p2, 3);

            console.log('Coordenadas iniciais:');
            console.log('Lat: '+ cLat);
            console.log('Lon: '+ cLon);

            $('#upcoming-points').data('lat', cLat);
            $('#upcoming-points').data('lat', cLon);

            $('#current-location .dist').text(numberWithCommas(dist) + ' metros');
            console.log('Distância incial até próximo ponto: '+ numberWithCommas(dist) + ' metros');
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

            p1 = new LatLon(cLat, cLon);
            p2 = new LatLon(nextLat, nextLon);
            dist = p1.sDistanceTo(p2, 3);

            console.log('Distância até próximo ponto: '+ numberWithCommas(dist) + " metros");
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


    $('#toggle-map').live('click tap', function () {
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
            var onLocationFound = function (e) {
                L.marker(e.latlng).addTo(mapa);
            }
            mapa.on('locationfound', onLocationFound);

            var onLocationError = function (e) {
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