var roothash = 'QmbSCGtCspqoM2EXMZnuL492xx2bvKD3E6nV5sH4ownjGh';

window.$ = window.jQuery = require('jquery');

var ipfsbase = 'http://localhost:8080/ipfs/';

document.addEventListener('DOMContentLoaded', function() {

    var nextId = (function() {
        var id = 0;
        return function() { return 'mov_' + (id++); };
    })();

    var load_movies = function() {
        $('.loading').fadeIn(300);
        $.getJSON(ipfsbase + roothash, function(data) {
            $('.loading').fadeOut(300);
            window.pages = data.pages;
            $.each(data.downloads, function(i, item) {
                item.id = nextId();
                window.store[item.id] = item;
                if (item.hashcover) {
                    item.cover = ipfsbase + item.hashcover;
                } else {
                    item.cover = 'cover.jpg';
                }
                $('.movies').append('<div class="movie hidden" data-id="' + item.id + '"><div class="poster"><div class="eye"><i class="fa fa-eye"></i></div><img src="' + item.cover + '" /></div><div class="title">' + item.title + '</div><div class="year">' + item.year + '</div></div>');
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
        var item = window.store[id];
        $('.single .poster img').attr('src', item.cover);
        $('.single .watch-button').attr('data-id', item.id);
        $('.single .imdb-button').attr('href', 'http://www.imdb.com/title/' + item.imdb + '/');
        $('.single .title').html(item.title);
        $('.single .year').html(item.year);
        $('.single .plot p').html(item.plot);
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
            var item = window.store[id];

            if (item.hashposter) {
                $('.video-wrapper #video').attr('poster', ipfsbase + item.hashposter);
            }
            if (item.hash1080p) {
                $('.video-wrapper #video > source').attr('src', ipfsbase + item.hash1080p);
            } else if (item.hash720p) {
                $('.video-wrapper #video > source').attr('src', ipfsbase + item.hash720p);
            }
            $('.video-wrapper #video').load();
            $('.video-wrapper #video').get(0).play();
            $('.player').fadeIn(300);
            $('.single .close').click();
        });

        $('.player .close').click(function() {
            $('.video-wrapper #video').get(0).pause();
            $('.video-wrapper #video').attr('poster', '');
            $('.video-wrapper #video > source').attr('src', '');
            $('.video-wrapper #video').load();
            $('.player').fadeOut(300);
        });

        $('.video-wrapper #video').click(function() {
            if (this.paused) {
                this.play();
                $('#videoicon').attr('src', 'play.svg');
                $('#videoicon').show();
                $('#videoicon').fadeOut(1000);
            } else {
                this.pause();
                $('#videoicon').attr('src', 'pause.svg');
                $('#videoicon').show();
                $('#videoicon').fadeOut(1000);
            }
        });

        $('.video-wrapper #video').dblclick(function() {
            if (document.webkitFullscreenElement) {
                this.webkitExitFullscreen();
            } else {
                this.webkitRequestFullscreen();
            }
        });
    });

}, false);
