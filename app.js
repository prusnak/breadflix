var roothash = 'QmNxTtCso6bdh5dpbECdpWBXG4oDDYWgXuSd6AUgx2fVoB';

window.$ = window.jQuery = require('jquery');

var ipfsbase = 'http://localhost:8080/ipfs/';

document.addEventListener('DOMContentLoaded', function() {
    var load_movies = function() {
        $('.loading').fadeIn(300);
        $.getJSON(ipfsbase + roothash, function(data) {
            $('.loading').fadeOut(300);
            window.pages = data.pages;
            $.each(data.downloads, function(i, item) {
                window.store[item.id] = item;
                $('.movies').append('<div class="movie hidden" data-id="' + item.id + '"><div class="poster"><div class="eye"><i class="fa fa-eye"></i></div><img src="' + ipfsbase + item.id + '/cover.jpg" /></div><div class="title">' + item.title + '</div><div class="year">' + item.year + '</div></div>');
                setTimeout(function() {
                    $('.movie[data-id="' + item.id + '"]').removeClass('hidden');
                }, (i + 1) * 150);
            });
        }).fail(function() {
            alert('Error loading data...');
            $('.loading').fadeOut(300);
        });
    };
    var load_movie = function(id) {
        var movie = window.store[id];
        $('.single .poster img').attr('src', ipfsbase + movie.id + '/cover.jpg');
        $('.single .watch-button').attr('data-id', movie.id);
        $('.single .imdb-button').attr('href', 'http://www.imdb.com/title/' + movie.imdb + '/');
        $('.single .title').html(movie.title);
        $('.single .year').html(movie.year);
        $('.single .plot p').html(movie.plot);
        $('.single').addClass('active');
        $('.single-darken').fadeIn(300);
    };
    $(document).ready(function() {
        window.genre = '';
        window.query = '';
        window.page = 1;
        window.pages = -1;
        window.store = {};
        load_movies();
        $('input').on('keyup', function(e) {
            if (e.keyCode == 13) {
                window.query = $(this).val();
                window.page = 1;
                window.pages = -1;
                $('.movies').html('');
                load_movies();
            }
        });
        $('.main').scroll(function() {
            if ($(this)[0].scrollHeight - $(this).scrollTop() === $(this).outerHeight()) {
                if (window.page < window.pages || window.pages == -1) {
                    window.page++;
                    load_movies();
                }
            };
        });
        $('.sidebar a').click(function() {
            $('.sidebar a.active').removeClass('active');
            $(this).addClass('active');
            window.genre = $(this).html().toLowerCase();
            if (window.genre == 'popular') {
                window.genre = '';
            }
            window.page = 1;
            window.pages = -1;
            $('.movies').html('');
            load_movies();
        });
        $('.movies').on('click', '.movie', function() {
            var id = $(this).attr('data-id');
            load_movie(id);
        });
        $('.single .close').click(function() {
            $('.single').removeClass('active');
            $('.single-darken').fadeOut(300);
        });
        $('.single .watch-button').click(function() {
            var id = $(this).attr('data-id');
            var movie = window.store[id];

            $('.video-wrapper #stream').attr('poster', ipfsbase + movie.id + '/poster.jpg');
            $('.video-wrapper #stream source').attr('src', ipfsbase + movie.id + '/1080p.mp4');
            $('.video-wrapper #stream').load();
            $('.video-wrapper #stream').get(0).play();
            $('.player').fadeIn(300);
            $('.single .close').click();
        });
        $('.player .close').click(function() {
            $('.video-wrapper #stream').get(0).pause();
            $('.video-wrapper #stream').attr('poster', '');
            $('.video-wrapper #stream source').attr('src', '');
            $('.video-wrapper #stream').load();
            $('.player').fadeOut(300);
        });
    });
}, false);
