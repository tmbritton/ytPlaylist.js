(function( $, undefined ) {
  $.fn.ytPlaylist = function(options) {
    
    // Settings object
  	var settings = $.extend( {
  		'playlist' : 'PLDFmQ1Ea1sUXBNTLloUE6T0iSs5Xt97Ig',
  	}, options);

    // URL for Youtube Playlist API call
   	var request = 'https://gdata.youtube.com/feeds/api/playlists/' + settings.playlist + '?alt=json'

    /**
     *  Get the JSON, kick off the program with the success callback.
     *  
     *  @param string request
     *    YouTube API URL that gives us the JSON response.
     *  @param string selector
     *    Element in which to create playlist.  
     */    
    var getJSON = function(request, selector) {
    	$.ajax({
  			url: request,
  			dataType: 'json',
  			success: function(response){
    			successCallback(response, selector);
  			},
  			error: function(jqXHR, textStatus, errorThrown){
  				console.log(textStatus);
  			},
    	});
    };

    /**
     *  Success callback for AJAX request. Calls functions that process returned JSON.
     *  
     *  @param object json
     *    JSON object returned by YouTube API.
     *  @param string selector
     *    Element in which to create playlist.  
     */
    var successCallback = function(json, selector) {
    	createTitle(json, selector);
      parseList(json, selector);
      addListeners(selector);
    };

    /**
     *  Create title and append it to playlist container element
     *   
     *  @param object json
     *    JSON object returned by YouTube API.
     *  @param string selector
     *    Element in which to create playlist.  
     */
    var createTitle = function(json, selector) {
      var title = json.feed.title.$t;
      $(selector).append('<h3>' + title + '</h3>');
    };
	  
    /**
     *  Create iframe embed and list of videos from JSON
     *   
     *  @param object json
     *    JSON object returned by YouTube API.
     *  @param string selector
     *    Element in which to create playlist.  
     */
    var parseList = function(json, selector) {
      var list = json.feed.entry;
      $(list).each(function( index ) {
        var vidinfo = [];
        vidinfo.url = $(this)[0].link[0].href;
        vidinfo.height = $(this)[0].media$group.media$thumbnail[0].height;
        vidinfo.width = $(this)[0].media$group.media$thumbnail[0].width;
        vidinfo.title = $(this)[0].title.$t;
        vidinfo.thumbnail = $(this)[0].media$group.media$thumbnail[2].url;
        if(index === 0) {
          embedIframe(vidinfo, selector);
          $(selector).append('<ul></ul>');
        }
        //var listItem = '<li><a href="' + vidinfo.url + '" rel=\'{"h":' + vidinfo.height+ ', "w":' + vidinfo.width + '}\'>' + vidinfo.title + '</a></li>';
        var listItem = '<li><a href="' + vidinfo.url + '" rel=\'{"h":' + vidinfo.height+ ', "w":' + vidinfo.width + '}\'><img src="' + vidinfo.thumbnail + '" alt="' + vidinfo.title +'" title="' + vidinfo.title +'" /></li>'; 
        $(selector).children('ul').append(listItem);
        if(index === 0) {
          $(selector).find('img').addClass('active');
        }          
      });
    };

    /**
     *  Create iframe embed and list of videos from JSON
     *   
     *  @param object vidinfo
     *    Object of video info used in the embed
     *  @param string selector
     *    Element in which to embed iframe.  
     */
    var embedIframe = function(vidinfo, selector) {
      //Get rid of any existing iframes
      $(selector).children('iframe').remove();
      var urlsplit = vidinfo.url.split(/v=|&/);
      vid = urlsplit[1];
      var width = $(selector).width();
      if(width > vidinfo.width) {
        var proportion = vidinfo.width / width;
        var difference = (1 - proportion);
        var height = Math.round(vidinfo.height * difference + vidinfo.height);
      } else {
        var proportion = width / vidinfo.width;
        var difference = (1 - proportion);
        var height = Math.round(vidinfo.height * difference);
      }
      var iframe = '<iframe width="' + width + '" height="' + height + '" src="http://www.youtube.com/embed/' + vid + '" frameborder="0" rel="0" allowfullscreen></iframe>';
      $(iframe).insertAfter($(selector).find('h3'));
    };
    
    /**
     *  Add listeners for user interaction
     *   
     *  @param string selector
     *    Element in which we embedded iframe.  
     */
    var addListeners = function(selector) {
      $(selector).find('a').bind('click', function(){
        onClickCallback($(this), selector);
        return false;
      });
    }

    /**
     *  Add listeners for user interaction
     *   
     *  @param object element
     *    jQuery object of <a> element that was clicked. 
     *
     *  @param string selector
     *    Element in which we embedded iframe.  
     */
    var onClickCallback = function(element, selector) {
      var vidinfo = []
      $(selector).find('img').removeClass('active');
      $(element).children('img').addClass('active');
      vidinfo.url = $(element).attr('href');
      var dimensions = $.parseJSON($(element).attr('rel'));
      vidinfo.height = dimensions.h;
      vidinfo.width = dimensions.w;
      embedIframe(vidinfo, selector);
    }
    //Kick it off
    getJSON(request, $(this));
  };
})( jQuery );