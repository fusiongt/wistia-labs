// Generated by CoffeeScript 1.4.0

Wistia.plugin("googleAnalytics", function(video, options) {
  var buckets, percentWatched, pushEvent, triggerPercent, _fn, _i, _len, _ref;
  if (options == null) {
    options = {};
  }
  buckets = [];
  percentWatched = function() {
    var bucket, watched, _i, _len;
    watched = 0;
    for (_i = 0, _len = buckets.length; _i < _len; _i++) {
      bucket = buckets[_i];
      if (bucket) {
        watched += 1;
      }
    }
    return watched / buckets.length;
  };
  video.ready(function() {
    return buckets.length = Math.floor(video.duration());
  });
  video.bind("secondchange", function(s) {
    return buckets[s] = true;
  });
  pushEvent = function(name, val) {
    if (!window._gaq) {
      if (typeof console !== "undefined" && console !== null) {
        console.log("Could not send data to google analytics because _gaq is not defined.");
      }
    } else {
      return _gaq.push(['_trackEvent', 'Video', name, val]);
    }
  };
  _ref = [.25, .5, .75, 1];
  _fn = function(triggerPercent) {
    return video.bind("secondchange", function(s) {
      var percent;
      percent = percentWatched();
      if (percent >= (triggerPercent - .05)) {
        pushEvent("" + (Math.round(triggerPercent * 100)) + " Watched", video.name());
        return this.unbind;
      }
    });
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    triggerPercent = _ref[_i];
    _fn(triggerPercent);
  }
  video.bind("play", function() {
    pushEvent("Play", video.name());
    return this.unbind;
  });
  return {
    buckets: buckets,
    percentWatched: percentWatched,
    pushEvent: pushEvent
  };
});
