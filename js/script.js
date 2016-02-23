// get new york times api key
var nytAPIkey;
$.getJSON('api_keys.json', function(data) {
    nytAPIkey = data.nyTimes;
})


function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview as background image
    var $street = $('#street');
    var $city = $('#city');

    var streetAddress = $street.val();
    var cityAddress = $city.val();

    var address = streetAddress + ', ' + cityAddress;
    $greeting.text('So, you want to explore ' + address + '?');
    var imgURL = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=';
    imgURL += address;
    $body.append('<img class="bgimg" src="' + imgURL + '">');

    // load new york times articles about this city
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityAddress + '&sort=newest&api-key=3c9fa1163dbf54d1236e4b9780fa0f1b:15:74514315';
    $.getJSON(nytimesUrl, function(data){
      $nytHeaderElem.text('New York Times Articles About ' + cityAddress);
      articles = data.response.docs;
      for (var i = 0; i < articles.length; i++) {
        var article = articles[i];
        $nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>' + article.snippet + '</p>'+'</li>');
      };
    }).error(function(e){
      $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });


    // load wikipedia articles about this city

    // if request has not completed in 8 seconds, handle as an error
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    var wikiAPI = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
                    cityAddress + '&format=json&callback=wikiCallback';
    $.ajax({
        url: wikiAPI,
        dataType: "jsonp",
        success: function(data) {
            console.log(data);
            var articleList = data[1];
            articleList.forEach(function(article) {
                var url = 'http://en.wikipedia.org/wiki/' + article;
                $wikiElem.append(
                    '<li>' +
                    '<a href="' + url + '">' + article + '</a>' +
                    '</li>'
                )
            });

            // success, so clear timeout
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);

// loadData();
