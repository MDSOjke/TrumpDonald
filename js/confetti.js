var Confetti = new function() {
  function a() {
    var a = Math.random();
    return Math.pow(2 * a - 1, 3) + .5 * a - .25
  }

  function b(a, b, c, d, e) {
    var f = a - c,
      h = a + c,
      i = b - d,
      j = b + d;
    g.save(), g.translate(a, b), g.rotate(e), g.translate(-a, -b), g.beginPath(), g.moveTo(a, i), g.bezierCurveTo(h, i, h, j, a, j), g.bezierCurveTo(f, j, f, i, a, i), g.closePath(), g.fill(), g.restore()
  }

  function c(a, b, c, d, e) {
    var f = a - c,
      h = a + c,
      i = b - d,
      j = b;
    g.save(), g.translate(a, b), g.rotate(e), g.translate(-a, -b), g.beginPath(), g.moveTo(f, i), g.lineTo(f, j), g.lineTo(h, j), g.lineTo(h, i), g.closePath(), g.fill(), g.restore()
  }

  function d() {
    g.clearRect(0, 0, k, j);
    var e = (new Date).getTime(),
      i = Math.min((e - h) / 1e3, .016);
    for (h = e, x = 0; x < l.length; x++) {
      var n = l[x];
      if (n.vx > 0 ? n.vx -= i / 20 * n.vx * n.vx : n.vx += i / 20 * n.vx * n.vx, n.vy > 0 ? n.vy -= i / 20 * n.vy * n.vy : n.vy += i / 20 * n.vy * n.vy, n.vy += 4 * i, n.vx += a() * i * 20, n.vy += a() * i * 16, n.x += n.vx, n.y += n.vy, n.y > j + 50 || n.x < -50 || n > j + 50) {
        if (l.splice(x, 1), !l.length) return m = !1, void f.remove()
      } else n.rotation = (n.rotation + .2 + Math.PI) % Math.PI, g.fillStyle = n.color, n.rectangular ? c(n.x, n.y, n.size, n.size * Math.sin(n.rotation), n.rotationZ) : b(n.x, n.y, n.size, n.size * Math.sin(n.rotation), n.rotationZ)
    }
    setTimeout(d, 10)
  }
  function e() {
    m || (this.show(p, !1, !0), o--, 0 === o && clearInterval(i))
  }
  var f, g, h, i, j = 0,
    k = 0,
    l = [],
    m = !1,
    n = ["#46aeff", "#ff4646", "#fff"],
    o = 0,
    p = 0;
  this.showRepeated = function(a, b) {
    o = b, p = a, i = setInterval($.proxy(e, this), 100)
  }, this.show = function(b, c, e) {
    if (!m) {
      k = $(window).width(), j = $(window).height(), f = $("<canvas id='confetti'/>").css({
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 2000,
        pointerEvents: "none"
      }).attr("width", k).attr("height", j).appendTo("body"), g = f[0].getContext("2d"), l = [];
      var i;
      if (c)
        for (i = 0; b > i; i++) l.push({
          x: Math.random() * k,
          y: -50 - Math.random() * j,
          vx: 10 * Math.random() - 5,
          vy: 0,
          size: 10 + 2 * a(),
          color: n[Math.floor(i * n.length / b)],
          rotation: Math.random() * Math.PI,
          rotationZ: Math.random() * Math.PI,
          rectangular: e && i % 4 && (i + 1) % 4
        });
      else
        for (i = 0; b > i; i++) {
          var o = -10 + 30 * Math.random(), //velocity
            p = (Math.random()*2-1) * Math.PI / 2, //angle
            q = Math.min(k / 2 - 50, 600),
            dX = (TRUMP.trumpet.cP[0] - TRUMP.trumpet.tP[0]),
            dY = (TRUMP.trumpet.cP[1] - TRUMP.trumpet.tP[1]),
            atan = Math.atan2(dY, dX),
            pointDist = 250,
            trEnd = [];

          trEnd[0] = -pointDist*Math.cos(atan);
          trEnd[1] = -pointDist*Math.sin(atan);
          l.push({
            x: trEnd[0] + TRUMP.trumpet.cP[0],
            y: trEnd[1] + TRUMP.trumpet.cP[1],
            vx: -trEnd[0]/5*Math.random(),
            vy: -trEnd[1]/5*Math.random(),
            size: 10 + 2 * a(),
            color: n[Math.floor(i * n.length / b)],
            rotation: Math.random() * Math.PI,
            rotationZ: Math.random() * Math.PI,
            rectangular: e && i % 4 && (i + 1) % 4
          })
        }
      m = !0, h = (new Date).getTime(), d()
    }
  }, $(window).bind("resize", function() {
    m && (k = $(window).width(), j = $(window).height(), f.attr("width", k).attr("height", j))
  })
};
