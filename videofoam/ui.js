// Generated by CoffeeScript 1.3.3
var videoFoam,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

videoFoam = (function() {

  function videoFoam() {
    this.updateOutput = __bind(this.updateOutput, this);

    this.debounceUpdateOutput = __bind(this.debounceUpdateOutput, this);

    var _this = this;
    this.iframeApiString = "<script src='//fast.wistia.com/static/iframe-api-v1.js'></script>";
    $("#configure").on("keyup", "input[type=text], textarea", function() {
      return _this.debounceUpdateOutput();
    });
  }

  videoFoam.prototype.debounceUpdateOutput = function() {
    var updateOutputTimeout;
    clearTimeout("updateOutputTimeout");
    return updateOutputTimeout = setTimeout(this.updateOutput, 500);
  };

  videoFoam.prototype.updateOutput = function() {
    var isIframe, isPopover;
    this.sourceEmbedCode = Wistia.EmbedCode.parse($("#source_embed_code").val());
    this.outputEmbedCode = Wistia.EmbedCode.parse($("#source_embed_code").val());
    if (this.sourceEmbedCode && this.sourceEmbedCode.isValid()) {
      isIframe = Wistia.EmbedCode.isIframe(this.sourceEmbedCode.toString());
      isPopover = Wistia.EmbedCode.isPopover(this.sourceEmbedCode.toString());
      this.outputEmbedCode.setOption("videoFoam", true);
      if (isIframe || isPopover) {
        this.outputEmbedCode.toString() + this.iframeApiString;
      }
      $("#output_embed_code").val(this.outputEmbedCode);
      this.outputEmbedCode.previewInElem("preview");
      this.addResizableTo($("#draggable_wrapper"));
      return $("#try").show();
    } else {
      $("#output_embed_code").val("Hmm, that embed code doesn't look right. Maybe our dog chewed on it?");
      return $("#preview").html('<div id="placeholder_preview">Your video here</div>');
    }
  };

  videoFoam.prototype.addResizableTo = function(elem) {
    return elem.addClass('foamed').draggable().resizable();
  };

  return videoFoam;

})();

window.setupLabInterface = function($) {
  return $(function() {
    return window.videoFoam = new videoFoam();
  });
};