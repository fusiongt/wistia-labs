Wistia.plugin("resumable", function(video, options) {

  var uuid = Wistia.seqId("wistia_resumable");
    
  function resumableKey() {
    return [video.params.pageUrl, video.hashedId(), "resume_time"];
  }

  function setTime(t) {  
    return Wistia.localStorage(resumableKey(), t);
  }

  function resumeTime() {
    return Wistia.localStorage(resumableKey());
  }

  function resumeCss() {
    return "" +
    "#" + uuid + " {\n" +
    "background-color: rgba(48, 48, 48, 0.82);\n" +
    "box-shadow: rgba(0, 0, 0, 0.9) 0px 0px 218px 30px inset;\n" +
    "color: rgb(255, 255, 255);\n" +
    "display: inline-block;\n" +
    "font-family: 'Open Sans', Arial, sans-serif;\n" +
    "font-size: 19px;\n" +
    "font-weight: bold;\n" +
    "height: " + video.videoHeight() + "px;\n" +
    "left: 0;\n" +
    "letter-spacing: 1px;\n" +
    "line-height: 26px;\n" +
    "position: absolute;\n" +
    "text-align: center;\n" +
    "top: 0;\n" +
    "white-space: normal;\n" +
    "width: " + video.videoWidth() + "px;\n" +
    "}\n" +
    "#" + uuid + "_content {\n" +
    "  position: relative;\n" +
    "}\n" +
    "#" + uuid + "_resume_play {\n" +
    "*display: inline;\n" +
    "display: inline-block;\n" +
    "height: 120px;\n" +
    "vertical-align: top;\n" +
    "width: 80px;\n" +
    "zoom: 1;\n" +
    "}\n" +
    "#" + uuid + "_resume_play_arrow {\n" +
    "background-image: url(http://localhost:8000/resumable/play-icon.png);\n" +
    "display: block;\n" +
    "height: 80px;\n" +
    "width: 80px;\n" +
    "}\n" +
    "#" + uuid + "_resume_play:hover #" + uuid + "_resume_play_arrow {\n" +
    "background-position:0px -80px;\n" +
    "}\n" +
    "#" + uuid + "_resume_skip {\n" +
    "*display: inline;\n" +
    "display: inline-block;\n" +
    "height: 120px;\n" +
    "vertical-align: top;\n" +
    "width: 80px;\n" +
    "zoom: 1;\n" +
    "}\n" +
    "#" + uuid + "_resume_skip_arrow {\n" +
    "background-image: url(http://localhost:8000/resumable/skip-icon.png);\n" +
    "display: block;\n" +
    "height: 80px;\n" +
    "width: 80px;\n" +
    "}\n" +
    "#" + uuid + "_resume_skip:hover #" + uuid + "_resume_skip_arrow {\n" +
    "background-position: 0px -80px;\n" +
    "}\n" +
    "#" + uuid + "_resume_play, #" + uuid + "_resume_skip {\n" +
    "color: #fff;\n" +
    "cursor: pointer;\n" +
    "font-size: 15px;\n" +
    "font-style: italic;\n" +
    "font-weight: normal;\n" +
    "line-height: 15px;\n" +
    "margin: 0 20px;\n" +
    "text-decoration: none;\n" +
    "}";
  }

  var styleElem;

  function removeCss() {
    var par;
    if (styleElem && (par = styleElem.parentNode)) {
      par.removeChild(styleElem);
      styleElem = null;
    }
  }

  function addCss() {
    styleElem = Wistia.util.addInlineCss(document.getElementById(uuid), resumeCss());
  }

  function refreshCss() {
    removeCss();
    addCss();
  }

  function centerVertically() {
    var resumeScreen = document.getElementById(uuid + "_content");
    resumeScreen.style.top = "" + (Math.max(0, video.videoHeight() - Wistia.util.elemHeight(resumeScreen)) / 2) + "px";
  }

  function fit() {
    refreshCss();
    centerVertically();
  }

  function removeOverlay() {
    var resumeScreen = document.getElementById(uuid);
    var par;
    if (resumeScreen && (par = resumeScreen.parentNode)) {
      par.removeChild(resumeScreen);
      resumeScreen = null;
    }
  }

  function jumpToResumeTime() {
    removeOverlay();
    video.time(resumeTime()).play();
  }

  function playFromBeginning() {
    removeOverlay();
    video.time(0).play();
  }

  function showOverlay() {
    removeOverlay();
    if (resumeTime()) {
      var resumeScreen = document.createElement("div");
      resumeScreen.id = uuid;
      resumeScreen.innerHTML = "" +
      "<div id='" + uuid + "_content'>" +
      "<div>It looks like you've watched<br />part of this video before!</div>" +
      "<a href='#' id='" + uuid + "_resume_play'>" +
      "  <span id='" + uuid + "_resume_play_arrow'>&nbsp;</span>" +
      "  Watch from the beginning" +
      "</a><a href='#' id='" + uuid + "_resume_skip'>" +
      "  <span id='" + uuid + "_resume_skip_arrow'>&nbsp;</span>" +
      "  Skip to where you left off" +
      "</a>" +
      "</div>";
      video.grid.top_inside.appendChild(resumeScreen);
      refreshCss();
      centerVertically();
      var resumePlayElem = document.getElementById(uuid + "_resume_play");
      var resumeSkipElem = document.getElementById(uuid + "_resume_skip");

      resumeSkipElem.onclick = jumpToResumeTime;
      resumePlayElem.onclick = playFromBeginning;
      return true;
    }
    else {
      return false;
    }
  }

  if (!showOverlay()) {
    setTime(0);
  }
  
  video.bind("secondchange", setTime)

  video.bind("end", function() {
    setTime(0);
  });

  video.bind("widthchanged", fit);
  video.bind("heightchanged", fit);

  return {
    key: resumableKey,
    time: resumeTime,
    setTime: setTime,
    fit: fit,
    showOverlay: showOverlay,
    jumpToResumeTime: jumpToResumeTime,
    playFromBeginning: playFromBeginning
  };
});