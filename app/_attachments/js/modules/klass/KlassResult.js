var KlassResult,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

KlassResult = (function(_super) {

  __extends(KlassResult, _super);

  function KlassResult() {
    KlassResult.__super__.constructor.apply(this, arguments);
  }

  KlassResult.prototype.url = "result";

  KlassResult.prototype.initialize = function(options) {
    if (options["new"] != null) {
      return this.set({
        'timestamp': (new Date()).getTime()
      });
    }
  };

  KlassResult.prototype.add = function(subtestDataElement) {
    return this.save({
      'subtestData': subtestDataElement
    });
  };

  KlassResult.prototype.get = function(options) {
    var result;
    this.assertSubtestData();
    if (options === "correct") return this.gridCount("correct");
    if (options === "incorrect") return this.gridCount("incorrect");
    if (options === "missing") return this.gridCount("missing");
    if (options === "total") return this.attributes.subtestData.items.length;
    if (options === "attempted") return this.getAttempted();
    if (options === "time_remain") return this.getTimeRemain();
    result = KlassResult.__super__.get.apply(this, arguments);
    return result;
  };

  KlassResult.prototype.gridCount = function(value) {
    var count, item, _i, _len, _ref;
    if (!(this.get("subtestData").items != null)) throw "No items";
    count = 0;
    _ref = this.get("subtestData").items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item.itemResult === value) count++;
    }
    return count;
  };

  KlassResult.prototype.getAttempted = function() {
    return parseInt(this.get("subtestData").attempted);
  };

  KlassResult.prototype.getTimeRemain = function() {
    return parseInt(this.get("subtestData").time_remain);
  };

  KlassResult.prototype.getCorrectPerSeconds = function(secondsAllowed) {
    return Math.round(this.get("correct") / (secondsAllowed - this.getTimeRemain())) * secondsAllowed;
  };

  KlassResult.prototype.assertSubtestData = function() {
    if (!(this.attributes.subtestData != null)) throw "No subtest data.";
  };

  return KlassResult;

})(Backbone.Model);
