$('#carousel').slick({
    arrows: true,
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed:2500,
    speed: 500,
    variableWidth: true,
    onAfterChange: function(){ 
          var cat = ($('#carousel').slickCurrentSlide()) + 1;
          $('.client-text > li').hide();
          $('.client-text > li:nth-child('+ cat +')').show();
    }
});



  $('.client-text > li').hide();
  $('.client-text > li:first-child').show();


    

function searchVideoList() {


    var username="SamsungMobile";
    var writediv ="videos";
    var maxnumbervideos=50;
    var apikey="AIzaSyC61pBxn-Mlfzn8VkJcpz4p9R_6xn6aCXE";
    var q = document.getElementById("query").value;


    try {
        document.getElementById(writediv).innerHTML = "";
        var keyinfo = JSON.parse(getJSONData("https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=" + username + "&key=" + apikey));
        var userid = keyinfo.items[0].id;
        var videoinfo = JSON.parse(getJSONData("https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&q=" + q + "&maxResults=" + maxnumbervideos + "&key=" + apikey));
        var videos = videoinfo.items;
        var videocount = videoinfo.pageInfo.totalResults;
        // video listing
        for (var i = 0; i < videos.length; i++) {
            var videoid = videos[i].id.videoId;
            var videotitle = videos[i].snippet.title;
            var videodescription = videos[i].snippet.description;
            var videodate = videos[i].snippet.publishedAt; // date time published
            var videothumbnail = videos[i].snippet.thumbnails.default.url; // default, medium or high
            document.getElementById(writediv).innerHTML += "<hr /><div style='width:100%;min-height:90px;'>"
                + "<a href='https://www.youtube.com/watch?v=" + videoid + "' target='_blank'>"
                + "<img src='" + videothumbnail + "' style='border:none;float:left;margin-right:10px;' alt='" + videotitle + "' title='" + videotitle + "' /></a>"
                + "<h3><a href='https://www.youtube.com/watch?v=" + videoid + "' target='_blank'>" + videotitle + "</a></h3>" + videodescription + ""
                + "</div>";
        }
    } catch (ex) {
        alert(ex.message);
    }
}