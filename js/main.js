/* Call helper methods */
MBP.scaleFix();
MBP.hideUrlBar();
MBP.enableActive();

;(function($) {

    var resetTitle = function() {
        var title = document.title;
        document.title = title.substring(title.indexOf('-') + 2);
    }

    var setTitle = function(title) {
        document.title = title + ' - ' + document.title;
    }

    /**
     * Watch for the document load and scroll events
     * and updates the guideline's height
     * to the current itinerary height.
     */
    $(window).on('load resize', function() {
        var actualHeight = $('#itinerary').height();
        $('#guide').height(actualHeight);
    });

    var isMapOpen = true;

    /*
     * Deals with scrolling to the current position
     */
    var scrollToCurrent = function() {
        $.scroll($('#current-location').offset().top - 60);
    }

    var flashCurrentDetail = function() {
        $('#current-location .detail').fadeOut(300, function() { $(this).fadeIn(300); });
    }

    var animatePoint = function(point, offset) {
        point.animate({
            top: offset
        }, 300, 'ease-in', function() {
            point.css('top', '').appendTo('#past-points');
        });
    }

    var updateItinerary = function() {
        setTimeout(function() {
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
    }

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
     }

    $('#search-submit').on('click tap', function() {
        if (!$(this).attr('disabled')) {
            $(this).attr('disabled', 'disabled').val('Calculando trajeto...');
            $('#line-search').blur();
            showResults();
        }
        return false;
    });
    
    /**
     * Enable submit button when typing
     */
    $('#line-search').on('keyup', function() {
        if ($('#search-submit').attr('disabled')) {
            $('#search-submit').removeAttr('disabled');
        }
        if ($(this).val() === '') {
            $('#search-submit').attr('disabled', 'disabled');
        }
    });

    /*
     * This goes back to the search (home) page
     */
    $('#go-search').live('click tap', function() {
        resetTitle();
        $('#page-results').addClass('hidden');
        $('#home').css('top', '').removeClass('hidden');
        $('#line-search').val('');
        $('#search-submit').val('Procurar');
        $.scroll(0);
        return false;
    });

    /*
     * More event listeners
     */
    $('.more').on('click tap', function() {
        return false;
    });

    $('#line-search-form').on('submit', function() {
        return false;
    });

    $('#toggle-map').on('click tap', function() {
        return false;
    });

    $('#jump-to-current').on('click tap', function(e) {
        scrollToCurrent();
        e.preventDefault();
    });

    // Updated copyright date
    (function() {
        var currentYear = (new Date().getFullYear());
        $('#current-year').text(currentYear);
    })();

    // Shortcut to show results
    (function() {
        if (window.location.search !== '') {
            showResults();
        }
    })();

})(window.Zepto);