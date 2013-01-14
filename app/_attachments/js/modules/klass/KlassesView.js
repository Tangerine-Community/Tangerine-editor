var KlassesView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

KlassesView = (function(_super) {

  __extends(KlassesView, _super);

  function KlassesView() {
    this.render = __bind(this.render, this);
    this.onSubviewRendered = __bind(this.onSubviewRendered, this);
    KlassesView.__super__.constructor.apply(this, arguments);
  }

  KlassesView.prototype.events = {
    'click .add': 'toggleAddForm',
    'click .cancel': 'toggleAddForm',
    'click .save': 'saveNewKlass',
    'click .goto_class': 'gotoKlass',
    'click .curricula': 'gotoCurricula',
    'click .pull_data': 'pullData'
  };

  KlassesView.prototype.initialize = function(options) {
    this.views = [];
    this.klasses = options.klasses;
    this.curricula = options.curricula;
    return this.klasses.on("add remove change", this.render);
  };

  KlassesView.prototype.pullData = function() {
    var local, _fn,
      _this = this;
    this.tablets = {
      checked: 0,
      okCount: 0,
      ips: [],
      result: 0
    };
    Utils.midAlert("Please wait, detecting tablets.");
    _fn = function(local) {
      var ip;
      ip = Tangerine.settings.subnetIP(local);
      return $.ajax({
        url: Tangerine.settings.urlSubnet(ip),
        dataType: "jsonp",
        contentType: "application/json;charset=utf-8",
        timeout: 30000,
        complete: function(xhr, error) {
          _this.tablets.checked++;
          if (xhr.status === 200) {
            _this.tablets.okCount++;
            _this.tablets.ips.push(ip);
          }
          return _this.updatePull();
        }
      });
    };
    for (local = 0; local <= 255; local++) {
      _fn(local);
    }
    return {
      updatePull: function() {
        var ip, _fn2, _i, _len, _ref,
          _this = this;
        if (this.tablets.checked < 256) return;
        if (this.available.tablets.okCount > 0) {
          Utils.midAlert("Pulling from " + this.tablets.okCount + " tablets.");
          _ref = this.tablets.ips;
          _fn2 = function(ip) {
            return $.ajax({
              "url": Tangerine.settings.urlSubnet(ip) + "_design/tangerine/_view/byCollection",
              "dataType": "jsonp",
              "data": {
                keys: JSON.stringify(['result', 'klass', 'student', 'curriculum'])
              },
              success: function(data) {
                var datum, docList;
                docList = (function() {
                  var _j, _len2, _ref2, _results;
                  _ref2 = data.rows;
                  _results = [];
                  for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                    datum = _ref2[_j];
                    _results.push(datum.id);
                  }
                  return _results;
                })();
                return $.couch.replicate(Tangerine.settings.urlSubnet(ip), Tangerine.settings.urlDB("local"), {
                  success: function() {
                    _this.tablets.complete++;
                    _this.tablets.successful++;
                    return _this.updatePullResult();
                  },
                  error: function(a, b) {
                    _this.tablets.complete++;
                    return _this.updatePullResult();
                  }
                }, {
                  doc_ids: docList
                });
              }
            });
          };
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            ip = _ref[_i];
            _fn2(ip);
          }
        } else {
          Utils.midAlert("Cannot detect tablets");
        }
        return false;
      }
    };
  };

  KlassesView.prototype.updatePullResult = function() {
    if (this.tablets.complete === this.tablets.okCount) {
      return Utils.midAlert("Pull finished.<br>" + this.tablets.successful + " out of " + tablets.okCount + " successful.", 5000);
    }
  };

  KlassesView.prototype.gotoCurricula = function() {
    return Tangerine.router.navigate("curricula", true);
  };

  KlassesView.prototype.saveNewKlass = function() {
    var errors;
    errors = [];
    if ($.trim(this.$el.find("#year").val()) === "") errors.push(" - No year.");
    if ($.trim(this.$el.find("#grade").val()) === "") errors.push(" - No grade.");
    if ($.trim(this.$el.find("#stream").val()) === "") {
      errors.push(" - No stream.");
    }
    if (this.$el.find("#curriculum option:selected").val() === "_none") {
      errors.push(" - No curriculum selected.");
    }
    if (errors.length === 0) {
      return this.klasses.create({
        year: this.$el.find("#year").val(),
        grade: this.$el.find("#grade").val(),
        stream: this.$el.find("#stream").val(),
        curriculumId: this.$el.find("#curriculum option:selected").attr("data-id"),
        startDate: (new Date()).getTime()
      });
    } else {
      return alert("Please correct the following errors:\n\n" + (errors.join('\n')));
    }
  };

  KlassesView.prototype.gotoKlass = function(event) {
    return Tangerine.router.navigate("class/edit/" + $(event.target).attr("data-id"));
  };

  KlassesView.prototype.toggleAddForm = function() {
    this.$el.find("#add_form, .add").toggle();
    this.$el.find("#year").focus();
    if (this.$el.find("#add_form").is(":visible")) {
      return this.$el.find("#add_form").scrollTo();
    }
  };

  KlassesView.prototype.renderKlasses = function() {
    var $ul, klass, view, _i, _len, _ref;
    this.closeViews();
    $ul = $("<ul>").addClass("klass_list");
    _ref = this.klasses.models;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      klass = _ref[_i];
      view = new KlassListElementView({
        klass: klass,
        curricula: this.curricula
      });
      view.on("rendered", this.onSubviewRendered);
      view.render();
      this.views.push(view);
      $ul.append(view.el);
    }
    return this.$el.find("#klass_list_wrapper").append($ul);
  };

  KlassesView.prototype.onSubviewRendered = function() {
    return this.trigger("subRendered");
  };

  KlassesView.prototype.render = function() {
    var adminPanel, curricula, curriculaOptionList, _i, _len, _ref;
    curriculaOptionList = "<option value='_none' disabled='disabled' selected='selected'>" + (t('select a curriculum')) + "</option>";
    _ref = this.curricula.models;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      curricula = _ref[_i];
      curriculaOptionList += "<option data-id='" + curricula.id + "'>" + (curricula.get('name')) + "</option>";
    }
    if (Tangerine.user.isAdmin()) {
      adminPanel = "      <h1>Admin menu</h1>      <button class='pull_data command'>Pull data</button>    ";
    }
    this.$el.html("      " + (adminPanel || "") + "      <h1>" + (t('classes')) + "</h1>      <div id='klass_list_wrapper'></div>      <button class='add command'>" + (t('add')) + "</button>      <div id='add_form' class='confirmation'>        <div class='menu_box'>           <div class='label_value'>            <label for='year'>" + (t('year')) + "</label>            <input id='year'>          </div>          <div class='label_value'>            <label for='grade'>" + (t('grade')) + "</label>            <input id='grade'>          </div>          <div class='label_value'>            <label for='stream'>" + (t('stream')) + "</label>            <input id='stream'>          </div>          <div class='label_value'>            <label for='curriculum'>" + (t('curriculum')) + "</label><br>            <select id='curriculum'>" + curriculaOptionList + "</select>          </div>          <button class='command save'>" + (t('save')) + "</button><button class='command cancel'>" + (t('cancel')) + "</button>        </div>      </div>      <button class='command curricula'>" + (t('all curricula')) + "</button>    ");
    this.renderKlasses();
    return this.trigger("rendered");
  };

  KlassesView.prototype.closeViews = function() {
    var view, _i, _len, _ref;
    _ref = this.views != null;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      view.close();
    }
    return this.views = [];
  };

  KlassesView.prototype.onClose = function() {
    return this.closeViews();
  };

  return KlassesView;

})(Backbone.View);
