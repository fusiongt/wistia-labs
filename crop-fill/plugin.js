// Generated by CoffeeScript 1.6.2
(function(W) {
  return W.plugin('cropFill', function(video, options) {
    var lastHeight, lastWidth, resize, target, unwatchTarget, videoAspect, watchTarget;

    videoAspect = null;
    video.hasData(function() {
      var still;

      still = video.data.media.assets.still;
      return videoAspect = still.width / still.height;
    });
    target = video.container.parentNode;
    if (target !== document.body && !/absolute|fixed|relative/.test(target.style.position)) {
      target.style.position = 'relative';
      target.style.overflow = 'hidden';
    }
    video.container.style.position = 'absolute';
    resize = function() {
      var newLeft, newTop, targetAspect, targetHeight, targetWidth;

      targetWidth = W.elem.width(target);
      targetHeight = W.elem.height(target);
      targetAspect = targetWidth / targetHeight;
      if (targetAspect > videoAspect) {
        video.width(targetWidth);
        video.height(targetWidth / videoAspect);
        newTop = -(video.height() - targetHeight) / 2;
        return video.container.style.top = "" + (Math.round(newTop)) + "px";
      } else {
        video.height(targetHeight);
        video.width(targetHeight * videoAspect);
        newLeft = -(video.width() - targetWidth) / 2;
        return video.container.style.left = "" + (Math.round(newLeft)) + "px";
      }
    };
    lastWidth = W.elem.width(target);
    lastHeight = W.elem.height(target);
    watchTarget = function() {
      var heightNow, widthNow;

      widthNow = W.elem.width(target);
      heightNow = W.elem.height(target);
      if (lastWidth !== widthNow) {
        resize();
        lastWidth = widthNow;
      } else if (lastHeight !== heightNow) {
        resize();
        lastHeight = heightNow;
      }
      return W.timeout("" + video.uuid + ".cropFill.watchTarget", watchTarget, 500);
    };
    unwatchTarget = function() {
      return W.clearTimeouts("" + video.uuid + ".cropFill.watchTarget");
    };
    watchTarget();
    video.bind('widthchange', resize);
    video.bind('heightchange', resize);
    video.hasData(resize);
    return {
      resize: resize,
      watch: watchTarget,
      unwatch: unwatchTarget
    };
  });
})(Wistia);
