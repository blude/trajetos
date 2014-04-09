var Interface, Data, Geolocation;

Interface = (function() {

    var cssPrefixedTransform = {
        "WebkitTransform" : "-webkit-transform",
        "MozTransform" : "-moz-transform",
        "transform" : "transform"
    };

    var prefixedTransform = cssPrefixedTransform[Modernizr.prefixed('transform')];

    function updateCurrentYear() {
        var year = new Date().getFullYear();
        $currentYear.text(year);
    }

    function appendToPastPoints(element) {
        $(element).css('top', '').appendTo('#past-points');
    }

    function showMap() {
        $conteinerMapa.addClass('aberto');
        if (!isMapInit) initMap();
    }

    function hideMap() {
        $conteinerMapa.removeClass('aberto');
    }

    return {
        bindEls: function() {
            var self = this;
            $lineSearch.on('keyup', this.displaySuggestions)
                       .on('focus', function() {
                            self.scrollToElement(this, 5);
                        });
        },
        setTitle: function(title) {
            var oldTitle = document.title;
            document.title = title + ' - ' + oldTitle;
        },
        resetTitle: function(separator) {
            var oldTitle = document.title;
            document.title = title.substring(oldTitle.indexOf('-') + 2);
        },
        scrollToElement: function(element, offset) {
            var elementOffset = $(element).offset().top;
            $.scroll(elementOffset - offset);
        },
        scrollToCurrent: function() {
            this.scrollToElement($currentLocation, 60);
        },
        getNumberWithComma: function(number) {
            var parts = x.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return parts.join('.');
        },
        animatePoint: function(element, offset, duration) {
            $(element).animate({
                top: offset + 'px'
            }, duration, 'ease-in', function() {
                appendToPastPoints(element);
            });
        },
        moveToPast: function(closestIndex) {
            var pointsToMove = $upcomingPoints.find('.point').slice(0, closestIndex + 1);
            appendToPastPoints(pointsToMove);
        },
        displaySuggestions: function() {
            $linesFound.animate({
                translateY: 10 + 'px',
                opacity: 1
            }, 300, 'ease');
        },
        toggleMap: function() {
            $conteinerMapa.hasClass('aberto') ? hideMap() : showMap();
        },
        updateGuidelineHeight: function() {
            var actualViewHeight = $itinerary.height();
            $guideline.height(actualViewHeight);
        },
        appendResults: function(context, response) {
            context.append(response);
        },
        showResultsPage: function(pageTitle) {
            var self = this;
            $home.animate({
                translateY: -$home.height() + 'px'
            }, 300, 'ease-in', function(pageTitle) {
                self.setTitle(pageTitle);
                $pageResults.removeClass('hiden');
            });
        },
        flashCurrentDetail: function() {
            $currentlocation.find('.detail').fadeOunt(300, function() {
                var nextBusStop = $upcomingPoints.find('.bus-stop').first().find('name').text();
                $(this).fadeIn(300).find('.next-bus-stop').text(nextBusStop);
            });
        },
        updateItinerary: function() {
            var deltaDistance, $nextPoint;

            $nextPoint = $upcomingPoints.find('.point').first();

            deltaDistance = $currentlocation.offset().top - $nextPoint.offset().top;
            this.animatePoint(nextPoint, deltaDistance);

            if (this.isScrolledIntoView && $map.hasClass('aberto')) {
                this.scrollToCurrent();
            }

            this.flashCurrentDetail();
        },
        isScrolledIntoView: function(element) {
            var docViewTop,
                docViewBottom,
                elemTop,
                elemBottom;
            docViewTop = $(window).scrollTop();
            docViewBottom = docViewTop + $(window).height();
            elemTop = $(element).offset().top;
            elemBottom = elemTop + $(element).height();
            return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        }
        init: function() {
            updateCurrentYear();
        }
    }

}());

Data = (function() {

    return {
        getResults: function(line) {
            $.ajax({
                url: 'results.php',
                data: { line: line },
                dataType: 'html',
                context: $pageResults,
                success: function(response) {
                    var lineName = response.data.lines[line].lineName,
                        $this = $(this);
                    Interface.appendResults($this, response);
                    Interface.showResultsPage(lineName);
                    if (Modernizr.getlocation) {
                        Geolocation.findClosestPoint();
                        Geolocation.getCurrentLocation();
                    }
                }
            });
        }
    }

}());

Geolocation = (function() {

    function getDistanceBetween(p1, p2) {
        return google.maps.geometry.spherical.computedDistanceBetween(p1, p2);
    }

    function handleError(flag) {
        var errorMsg,
            options,
            infoWindow;

        if (flag) {
            errorMsg = 'Geolocalização não disponível no momento.';
        } else {
            errorMsg = 'Geolocalização não suportada neste dispositivo;';
        }

        options = {
            map: map,
            position: new google.maps.Latlng(-20, -40),
            content: content
        };

        infoWindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
    }

    google.maps.LatLng.prototype.getDistanceTo = function(p2) {
        return getDistanceBetween(this, p2);
    }

    return {
        getCurrentLocation: function() {

        },
        bindEls: function() {

        },
        findClosestPoint: function() {
            navigator.geolocation.getCurrentPosition(function(position) {
                var currentPoint,
                    $points,
                    distances = [],
                    closestPoint = -1;

                currentPoint = new google.maps.latLng(position.coords.latitute, position.coords.longitude);
                $points = $upcomingPoints.find('.point');

                for (var i = 0; i < $points.size(); i++) {
                    var p2;
                    p2 = new google.maps.Latlng($points.eq(i).data('lat'), $points.eq(i).data('lon'));
                    distances[i] = currentPoint.getDistanceTo(p2);
                    if (closestPoint === -1 || distances[i] < distances[closestPoint]) {
                        closestPoint = i;
                    }
                }

                Interface.moveToPast(closestPoint);
                Interface.scrollToCurrent();
            });
        },
        getCurrentLocation: function() {
            var $nextPoint, $nextPoint2, distance, diffPoints, distanceP2, distanceStop;

            navigator.geolocation.getCurrentPosition(function(pos) {
                var pBus, p1;
                $nextPoint = $upcomingPoints.find('.point').first();
                pBus = new google.maps.LatLng(pos.coords.latitute, pos.coords.longitude);
                p1 = new google.maps.LatLng($nextPoint.data('lat'), $nextPoint.data('lon'));

                distance = Math.round(pBus.getDistanceTo(p1));

                $upcomingPoints.data({
                    'lat' : pos.coords.latitute,
                    "lon" : pos.coords.longitude
                });
                $upcomingPoints.find('.dist').text(getNumberWithComma(dist) + ' metros');
            }, function(givenError) {
                var errorMsg;
                switch (givenError.code) {
                    case 1:
                        errorMsg = 'Localização negada';
                        break;
                    case 2:
                        errorMsg = 'Localização indisponível';
                        break;
                    case 3:
                        errorMsg = 'Tempo esgotado';
                        break;
                    default:
                        errorMsg = 'Erro desconhecido';
                }
                console.log(errorMsg);
            });
        },
        watchCurrentLocation: function() {
            navigator.geolocation.watchPosition(function(pos) {
                $nextpoint = $upcomingPoints.find('.point').eq(0);
                $nextPoint2 = $upcomingPoints.find('.point').eq(1);

                pBus = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

                p1 = new google.maps.LatLng($nextPoint.data('lat'), $nextPoint.data('lon'));
                p2 = new google.maps.LatLng($nextpoint2.data('lat'), $nextPoint2.data('lon'));
                pBusStop = new google.maps.LatLng($upcomingPoints.find('.bus-stop').first().data('lat'), $upcomingPoints.find('.bus-stop').first().data('lon'));

                disStop = Math.round(pBus.getDistanceTo(pBusStop));

                $currentlocation.find('.dist').text(getNumberWithComma(distStop) + ' metros');

                diffPoints = Math.round(p1.getDistanceTo(p2));
                distancePoint2 = Math.round(pBus.getDistanceTo(p2));

                if (distancePoint2 < diffPoints) {
                    Interface.updateItinerary();
                }
            })
        }
    }

}());

