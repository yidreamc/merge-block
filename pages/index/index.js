//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    box_data: [[], [], [], [], []],
    max_v: 4,
    set: 0,
    set_num:{}
  },
  onLoad: function () {
    this.start();
  
  },
  start: function () {
    var box_data = [[], [], [], [], []];
    for (var r = 0; r < 5; r++) {
      for (var c = 0; c < 5; c++) {
        var v = this.getV();
        box_data[r][c] = { on: 0, v: v, r: r, c: c, set: 0 }
        this.setData({
          box_data: box_data
        });
  
      }
    }
    this.initBox(box_data);
  },
  getV: function () {
    var v = 1;
    if (Math.random() < 0.05) {
      v = 4
    } else {
      if (Math.random() < 0.2) {
        v = 3
      } else {
        if (Math.random() < 0.5) {
          v = 2
        }
      }
    }
    return v
  },
  sBox: function(event){
    var e = event.target;

    var r = e.dataset.r | 0;
    var c = e.dataset.c | 0;
    var s = e.dataset.set | 0;
    
    if (this.data.box_data[r][c].on != 1) {

      var set_count = 0;
      for (var i = 0; i < this.data.box_data.length; i++) {
        for (var j = 0; j < this.data.box_data[i].length; j++) {
          var on = this.data.box_data[i][j].set == s ? 1 : 0;
          if (on == 1) {
            set_count++
          }
          this.data.box_data[i][j].on = on;
          this.setData({
            box_data: this.data.box_data
          });

        }
      }
      if (set_count < 2) {
        for (var i = 0; i < this.data.box_data.length; i++) {
          for (var j = 0; j < this.data.box_data[i].length; j++) {
            this.data.box_data[i][j].on = 0;
            this.setData({
              box_data: this.data.box_data
            });
          }
        }
      }
    } else {
      
      for (var i = 0; i < this.data.box_data.length; i++) {
        for (var j = 0; j < this.data.box_data[i].length; j++) {
          var on = this.data.box_data[i][j].set == s ? 2 : 0;
          if (i == r && j == c) {
            on = 0;
            this.data.box_data[i][j].v += 1;
            this.setData({
              max_v: Math.max(this.data.box_data[i][j].v, this.data.max_v)
            });
            this.setData({
              box_data: this.data.box_data
            });
          }
          this.data.box_data[i][j].on = on;
          this.setData({
            box_data: this.data.box_data
          });
        }
      }
      setTimeout(this.sortBox, 100);
      var that = this;
      setTimeout(function () {
        that.initBox(that.data.box_data)
      }, 500)
    }
  },
  sortBox: function(){
    for (var i = 0; i < this.data.box_data.length; i++) {
      var j = 0;
      while (this.data.box_data[i][j]) {
        // var $rc = document.querySelector(".r" + box_data[i][j].r + ".c" + box_data[i][j].c + ".box[data-on='0']");
        // if ($rc && $rc.dataset.on == 0) {
        //   $rc.className = "box r" + i + " c" + j
        // }
        if (this.data.box_data[i][j].on == 2) {
          this.data.box_data[i].splice(j, 1)
        } else {
          j++
        }
      }
      for (var k = 0; k < 5; k++) {
        if (!this.data.box_data[i][k]) {
          var v = this.getV();
          this.data.box_data[i][k] = { on: 3, v: v, r: i, c: k, set: 0 }
        } else {
          this.data.box_data[i][k] = { on: 0, v: this.data.box_data[i][k].v, r: i, c: k, set: 0 }
        }
      }
      this.setData({
        box_data: this.data.box_data
      });
    }
  },
  initBox: function (arr){
    this.setData({
      set_num: {},
      set: 0
    });

    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < arr[i].length; j++) {
        this.data.set++;
        this.setData({
          set: this.data.set
        });
         this.around(i, j, arr[i][j].v);
      }
    }
    setTimeout(this.moveBox, 10)
  },

  around: function (r, c, v){
    if (this.data.box_data[r][c].set) {
      return;
    }

    this.data.set_num[this.data.set] = this.data.set;
    this.data.box_data[r][c].set = this.data.set;

    this.setData({
      set_num: this.data.set_num,
      box_data: this.data.box_data
    });

    if (c > 0) {
      var c1 = Math.round(c) - 1;
      if (this.data.box_data[r][c1].v == v) {
        
        this.around(r, c1, v)
      }
    }
    if (c < 4) {
      var c2 = Math.round(c) + 1;
      if (this.data.box_data[r][c2].v == v) {
        this.around(r, c2, v)
      }
    }
    if (r > 0) {
      var r1 = Math.round(r) - 1;
      if (this.data.box_data[r1][c].v == v) {
        this.around(r1, c, v)
      }
    }
    if (r < 4) {
      var r2 = Math.round(r) + 1;
      if (this.data.box_data[r2][c].v == v) {
        this.around(r2, c, v)
      }
    }
  },
  moveBox: function(){
    // var box_data = this.data.box_data;
    for (var i = 0; i < this.data.box_data.length; i++) {
      for (var j = 0; j < this.data.box_data[i].length; j++) {
        if (this.data.box_data[i][j].on == 3){
          this.data.box_data[i][j].on = 0;
        }
      }
    }

    this.setData({
      box_data: this.data.box_data
    });
  }

})
