// Generated by CoffeeScript 1.3.3
var QuestionRunView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

QuestionRunView = (function(_super) {

  __extends(QuestionRunView, _super);

  function QuestionRunView() {
    this.setMessage = __bind(this.setMessage, this);
    return QuestionRunView.__super__.constructor.apply(this, arguments);
  }

  QuestionRunView.prototype.className = "question buttonset";

  QuestionRunView.prototype.events = {
    'change input': 'update',
    'change textarea': 'update'
  };

  QuestionRunView.prototype.initialize = function(options) {
    this.model = options.model;
    this.answer = {};
    this.name = this.model.escape("name").replace(/[^A-Za-z0-9]/g, "-");
    this.type = this.model.get("type");
    this.options = this.model.get("options");
    this.notAsked = options.notAsked;
    if (this.model.get("skippable") === "true" || this.model.get("skippable") === true) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
    if (this.notAsked === true) {
      this.isValid = true;
      return this.updateResult();
    }
  };

  QuestionRunView.prototype.update = function(event) {
    this.updateResult();
    this.updateValidity();
    return this.trigger("answer", event, this.model.get("order"));
  };

  QuestionRunView.prototype.updateResult = function() {
    var i, option, _i, _j, _len, _len1, _ref, _ref1;
    if (this.type === "open") {
      if (this.notAsked === true) {
        this.answer = "not_asked";
      } else {
        this.answer = this.$el.find("#" + this.cid + "_" + this.name).val();
      }
    } else if (this.type === "single") {
      if (this.notAsked === true) {
        this.answer = "not_asked";
      } else {
        this.answer = this.$el.find("." + this.cid + "_" + this.name + ":checked").val();
      }
    } else if (this.type === "multiple") {
      if (this.notAsked === true) {
        _ref = this.options;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          option = _ref[i];
          this.answer[this.options[i].value] = "not_asked";
        }
      } else {
        _ref1 = this.options;
        for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
          option = _ref1[i];
          this.answer[this.options[i].value] = this.$el.find("#" + this.cid + "_" + this.name + "_" + i).is(":checked") ? "checked" : "unchecked";
        }
      }
    }
    return this.$el.attr("data-result", _.isString(this.answer) ? this.answer : JSON.stringify(this.answer));
  };

  QuestionRunView.prototype.updateValidity = function() {
    if (this.model.get("skippable") === true || $("#question-" + this.name).hasClass("disabled_skipped")) {
      return this.isValid = true;
    } else {
      if (_.isEmpty(this.answer)) {
        return this.isValid = false;
      } else {
        return this.isValid = true;
      }
    }
  };

  QuestionRunView.prototype.setMessage = function(message) {
    return this.$el.find(".error_message").html(message);
  };

  QuestionRunView.prototype.render = function() {
    var checkOrRadio, html, i, option, _i, _len, _ref;
    this.$el.attr("id", "question-" + this.name);
    if (!this.notAsked) {
      html = "<div class='error_message'></div><div class='prompt'>" + (this.model.get('prompt')) + "</div>      <div class='hint'>" + (this.model.get('hint') || "") + "</div>";
      if (this.type === "open") {
        if (this.model.get("multiline")) {
          html += "<div><textarea id='" + this.cid + "_" + this.name + "' data-cid='" + this.cid + "'></textarea></div>";
        } else {
          html += "<div><input id='" + this.cid + "_" + this.name + "' data-cid='" + this.cid + "'></div>";
        }
        this.$el.html(html);
      } else {
        checkOrRadio = this.type === "multiple" ? "checkbox" : "radio";
        _ref = this.options;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          option = _ref[i];
          html += "            <label for='" + this.cid + "_" + this.name + "_" + i + "'>" + option.label + "</label>            <input id='" + this.cid + "_" + this.name + "_" + i + "' class='" + this.cid + "_" + this.name + "'  data-cid='" + this.cid + "' name='" + this.name + "' value='" + option.value + "' type='" + checkOrRadio + "'>          ";
        }
        this.$el.html(html);
      }
    } else {
      this.$el.hide();
    }
    return this.trigger("rendered");
  };

  return QuestionRunView;

})(Backbone.View);
