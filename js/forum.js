/* ============================================================
   SawahKu — community forum (Reddit-style)
   Prototype: posts are saved in this browser (localStorage).
   A real version would save them on a server so everyone sees them.
   Pages:  forum.html            list of posts
           forum.html#new        ask a new question
           forum.html#post-ID    one post with its comments
   The home page shows the top 3 posts (#home-forum).
   ============================================================ */

(function () {
  "use strict";

  function cCount(p) {
    var n = p.comments.length;
    return n === 1 ? APP.t("forum.comment1") : APP.t("forum.comments", { n: n });
  }

  var KEY = "sk-forum-v1";
  var VOTES_KEY = "sk-votes";
  var NAME_KEY = "sk-name";
  var CATS = ["pest", "fert", "water", "price", "tech", "other"];
  var CAT_TAG = { pest: "tag--red", fert: "tag--green", water: "tag--sky", price: "tag--gold", tech: "tag--green", other: "tag--sky" };

  /* ---------- Sample posts (clearly marked "Sample" on screen) ---------- */
  function hoursAgo(h) { return new Date(Date.now() - h * 3600 * 1000).toISOString(); }
  function seed() {
    return [
      {
        id: "s1", sample: true, cat: "pest", votes: 12, created: hoursAgo(5), author: "Pesawah Sungai Besar",
        title: { ms: "Kawasan bulat padi jadi kuning lepas tu kering — bena perang ke?", en: "Round patches of paddy turn yellow then dry — brown planthopper?" },
        body: { ms: "Padi umur 45 hari. Ada 2–3 tompok bulat dalam petak yang kuning, sekarang macam terbakar. Di pangkal batang ada serangga kecil warna perang. Perlu sembur semua petak ke?", en: "Paddy is 45 days old. There are 2–3 round yellow patches in the plot, now looking burnt. Small brown insects at the base of the stems. Do I need to spray the whole plot?" },
        comments: [
          { sample: true, author: "Pesawah Sekinchan", created: hoursAgo(4), body: { ms: "Bunyi macam bena perang. Periksa pangkal pokok — kalau banyak, sembur di pangkal sahaja, tak perlu semua petak. Kurangkan urea dulu.", en: "Sounds like brown planthopper. Check the base of the plants — if there are many, spray only at the base, not the whole plot. Hold back on urea." } },
          { sample: true, author: "Pesawah Tanjong Karang", created: hoursAgo(3), body: { ms: "Jangan sembur awal sangat, nanti labah-labah pun mati. Saya kira dulu berapa banyak serangga.", en: "Don't spray too early, or the spiders die too. I count the insects first." } }
        ]
      },
      {
        id: "s2", sample: true, cat: "fert", votes: 8, created: hoursAgo(20), author: "Pesawah Sabak Bernam",
        title: { ms: "Baja subsidi lambat sampai, patut beli sendiri dulu?", en: "Subsidy fertiliser is late — should I buy my own first?" },
        body: { ms: "Padi dah 25 hari, patutnya bubuh urea minggu ni. Baja subsidi belum sampai lagi. Berbaloi ke beli sendiri?", en: "The paddy is 25 days old; urea is due this week. The subsidy fertiliser hasn't arrived. Is it worth buying my own?" },
        comments: [
          { sample: true, author: "Pesawah Sungai Besar", created: hoursAgo(18), body: { ms: "Saya beli sendiri musim lepas. Kalau lambat bubuh, pokok kurang beranak. Rugi hasil lagi mahal daripada harga baja.", en: "I bought my own last season. If you apply late, the plants tiller less. Losing yield costs more than the fertiliser." } }
        ]
      },
      {
        id: "s3", sample: true, cat: "water", votes: 5, created: hoursAgo(30), author: "Pesawah Kuala Selangor",
        title: { ms: "Hujan setiap petang, bila boleh sembur racun kulat?", en: "Rain every afternoon — when can I spray fungicide?" },
        body: { ms: "Nak sembur racun kulat untuk karah tapi hujan setiap petang. Ada tips?", en: "I want to spray fungicide for blast but it rains every afternoon. Any tips?" },
        comments: [
          { sample: true, author: "Pesawah Sekinchan", created: hoursAgo(28), body: { ms: "Tengok halaman Cuaca dalam aplikasi ni — pilih hari \"Sesuai sembur\". Saya sembur pagi sebelum pukul 10.", en: "Check the Weather page in this app — pick a day marked \"Good for spraying\". I spray in the morning before 10." } }
        ]
      },
      {
        id: "s4", sample: true, cat: "price", votes: 6, created: hoursAgo(50), author: "Pesawah Sungai Besar",
        title: { ms: "Potongan di kilang tinggi — macam mana nak dapat gred lebih baik?", en: "High deductions at the mill — how do I get a better grade?" },
        body: { ms: "Musim ni potongan hampir 20%. Ada petua supaya padi kurang hampa dan kotor?", en: "This season the deduction was almost 20%. Any tips so my paddy has fewer empty and dirty grains?" },
        comments: [
          { sample: true, author: "Pesawah Tanjong Karang", created: hoursAgo(47), body: { ms: "Tuai bila 85–90% bijirin dah kuning, dan keringkan sawah 10–14 hari sebelum tuai. Kurang hampa, kurang potongan.", en: "Harvest when 85–90% of grains are yellow, and drain the field 10–14 days before. Fewer empty grains, smaller deduction." } }
        ]
      },
      {
        id: "s5", sample: true, cat: "tech", votes: 4, created: hoursAgo(75), author: "Pesawah Sabak Bernam",
        title: { ms: "Ada yang pernah bela ikan dalam sawah?", en: "Has anyone kept fish in their paddy field?" },
        body: { ms: "Saya dengar ada orang bela ikan keli dalam sawah untuk bantu kawal rumpai dan serangga. Berbaloi ke?", en: "I heard some people keep catfish in the paddy to help control weeds and insects. Is it worth it?" },
        comments: [
          { sample: true, author: "Pesawah Sungai Besar", created: hoursAgo(70), body: { ms: "Saya buat. Ikan makan rumpai dan serangga, anak-anak pun suka memancing. Tapi kena jaga paras air.", en: "I do. The fish eat weeds and insects, and the kids love fishing. But you must watch the water level." } }
        ]
      }
    ];
  }

  /* ---------- Storage ---------- */
  function load() {
    var posts = APP.store.getJSON(KEY, null);
    if (!posts) { posts = seed(); save(posts); }
    return posts;
  }
  function save(posts) { APP.store.setJSON(KEY, posts); }
  function votes() { return APP.store.getJSON(VOTES_KEY, {}); }
  function txt(v) { return v && typeof v === "object" ? (v[APP.getLang()] || v.ms || v.en) : (v || ""); }
  function esc(s) { return APP.escapeHTML(s); }
  function hotScore(p) {
    var hours = (Date.now() - new Date(p.created).getTime()) / 3600000;
    return (p.votes + 2 * p.comments.length + 1) / Math.pow(hours + 2, 0.8);
  }

  /* ---------- Shared bits ---------- */
  function metaHTML(p) {
    return '<div class="post__meta"><span class="tag ' + CAT_TAG[p.cat] + '">' + APP.t("forum.cat." + p.cat) + "</span>" +
      "<span>" + APP.t("forum.by", { name: esc(p.author || APP.t("forum.anon")) }) + " · " + APP.timeAgo(p.created) + "</span>" +
      (p.sample ? '<span class="sample">' + APP.t("common.sample") + "</span>" : "") + "</div>";
  }
  function voteHTML(p) {
    var on = !!votes()[p.id];
    return '<div class="vote"><button type="button" data-vote="' + p.id + '" aria-pressed="' + on + '" aria-label="' + APP.t("forum.upvote") + '">' +
      APP.icons.up + "</button><b>" + (p.votes + (on ? 1 : 0)) + "</b></div>";
  }
  function toggleVote(id) {
    var v = votes();
    if (v[id]) delete v[id]; else v[id] = true;
    APP.store.setJSON(VOTES_KEY, v);
  }
  function shareLink(p) {
    var url = location.href.split("#")[0].split("?")[0].replace(/[^/]*$/, "forum.html") + "#post-" + p.id;
    return APP.waShare(APP.t("forum.shareText") + "\n" + txt(p.title) + "\n" + url);
  }

  /* =========================================================
     HOME PAGE PREVIEW
     ========================================================= */
  function renderHome(el) {
    var posts = load().slice().sort(function (a, b) { return hotScore(b) - hotScore(a); }).slice(0, 3);
    el.innerHTML = posts.map(function (p) {
      return '<a class="row-link" href="forum.html#post-' + p.id + '"><span class="tag ' + CAT_TAG[p.cat] + '">' +
        APP.t("forum.cat." + p.cat) + "</span><span><strong>" + esc(txt(p.title)) + "</strong><small>" +
        cCount(p) + " · " + APP.timeAgo(p.created) + "</small></span></a>";
    }).join("");
  }

  /* =========================================================
     FORUM PAGE
     ========================================================= */
  var els = {};
  var state = { sort: "hot", cat: "all", q: "", photo: "" };

  function route() {
    var h = location.hash;
    els.list.hidden = h.indexOf("#post-") === 0 || h === "#new";
    els.detail.hidden = h.indexOf("#post-") !== 0;
    els.form.hidden = h !== "#new";
    if (h.indexOf("#post-") === 0) renderDetail(h.slice(6));
    else if (h === "#new") openForm();
    else renderList();
    window.scrollTo(0, 0);
  }

  /* ----- List ----- */
  function renderList() {
    var q = state.q.trim().toLowerCase();
    var posts = load().filter(function (p) {
      if (state.cat !== "all" && p.cat !== state.cat) return false;
      if (!q) return true;
      return (txt(p.title) + " " + txt(p.body)).toLowerCase().indexOf(q) !== -1;
    });
    posts.sort(state.sort === "new"
      ? function (a, b) { return new Date(b.created) - new Date(a.created); }
      : function (a, b) { return hotScore(b) - hotScore(a); });

    els.posts.innerHTML = posts.length ? posts.map(function (p) {
      var body = txt(p.body);
      return '<article class="post">' + voteHTML(p) + "<div>" + metaHTML(p) +
        '<a class="post__title" href="#post-' + p.id + '">' + esc(txt(p.title)) + "</a>" +
        (body ? '<p class="post__excerpt">' + esc(body.length > 140 ? body.slice(0, 140) + "…" : body) + "</p>" : "") +
        (p.photo ? '<img class="post__photo" src="' + p.photo + '" alt="">' : "") +
        '<div class="post__foot"><a href="#post-' + p.id + '">' + APP.icons.comment + cCount(p) + "</a>" +
        '<a class="wa-link" href="' + shareLink(p) + '" target="_blank" rel="noopener">' + APP.icons.whatsapp + APP.t("common.shareWa") + "</a>" +
        (p.mine ? '<button type="button" data-delete="' + p.id + '" style="color:var(--red-500)">' + APP.t("forum.delete") + "</button>" : "") +
        "</div></div></article>";
    }).join("") : '<p class="empty">' + APP.t("forum.empty") + "</p>";
  }

  /* ----- One post ----- */
  function renderDetail(id) {
    var p = load().filter(function (x) { return x.id === id; })[0];
    if (!p) { els.detailBody.innerHTML = '<p class="empty">' + APP.t("forum.notFound") + "</p>"; return; }
    els.detailBody.innerHTML =
      '<article class="post post-full">' + voteHTML(p) + "<div>" + metaHTML(p) +
      '<h1 class="post__title">' + esc(txt(p.title)) + "</h1>" +
      (txt(p.body) ? '<p class="post__body">' + esc(txt(p.body)) + "</p>" : "") +
      (p.photo ? '<img class="post__photo" src="' + p.photo + '" alt="">' : "") +
      '<div class="post__foot"><a class="wa-link" href="' + shareLink(p) + '" target="_blank" rel="noopener">' + APP.icons.whatsapp + APP.t("common.shareWa") + "</a>" +
      (p.mine ? '<button type="button" data-delete="' + p.id + '" style="color:var(--red-500)">' + APP.t("forum.delete") + "</button>" : "") +
      "</div></div></article>" +
      '<h2 style="margin-top:22px;font-size:1.2rem">' + cCount(p) + "</h2>" +
      '<div class="comments">' + p.comments.map(function (c) {
        return '<div class="comment"><div class="comment__meta"><strong>' + esc(c.author || APP.t("forum.anon")) + "</strong> · " + APP.timeAgo(c.created) +
          (c.sample ? ' <span class="sample">' + APP.t("common.sample") + "</span>" : "") + "</div><p>" + esc(txt(c.body)) + "</p></div>";
      }).join("") + "</div>";
    els.replyPost.value = id;
  }

  function addComment(e) {
    e.preventDefault();
    var body = els.replyText.value.trim();
    if (!body) { els.replyText.focus(); return; }
    var id = els.replyPost.value;
    var name = els.replyName.value.trim();
    if (name) APP.store.set(NAME_KEY, name);
    var posts = load();
    posts.forEach(function (p) {
      if (p.id === id) p.comments.push({ author: name || APP.t("forum.anon"), body: body, created: new Date().toISOString() });
    });
    save(posts);
    els.replyText.value = "";
    renderDetail(id);
  }

  /* ----- New post ----- */
  function openForm() {
    var q = new URLSearchParams(location.search);
    if (q.get("title") && !els.fTitle.value) els.fTitle.value = q.get("title");
    if (q.get("cat")) setCat(q.get("cat"));
    els.fName.value = els.fName.value || APP.store.get(NAME_KEY) || "";
    els.fTitle.focus();
  }
  function setCat(cat) {
    els.form.querySelectorAll('input[name="cat"]').forEach(function (r) { r.checked = r.value === cat; });
  }
  function resizePhoto(file) {
    // Shrink the photo so it fits in the browser's storage.
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 900, w = img.width, h = img.height;
        if (w > max || h > max) { var r = Math.min(max / w, max / h); w = Math.round(w * r); h = Math.round(h * r); }
        var c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        state.photo = c.toDataURL("image/jpeg", 0.7);
        els.preview.src = state.photo;
        els.previewWrap.hidden = false;
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  function submitPost(e) {
    e.preventDefault();
    var title = els.fTitle.value.trim();
    var field = els.fTitle.closest(".field");
    if (!title) { field.classList.add("has-error"); els.fTitle.focus(); return; }
    field.classList.remove("has-error");
    var catEl = els.form.querySelector('input[name="cat"]:checked');
    var name = els.fName.value.trim();
    if (name) APP.store.set(NAME_KEY, name);
    var post = {
      id: "p" + Date.now().toString(36), mine: true, cat: catEl ? catEl.value : "other", votes: 0,
      created: new Date().toISOString(), author: name || APP.t("forum.anon"),
      title: title, body: els.fBody.value.trim(), photo: state.photo, comments: []
    };
    var posts = load();
    posts.unshift(post);
    try { save(posts); } catch (err) { post.photo = ""; save(posts); }
    els.formEl.reset();
    state.photo = "";
    els.previewWrap.hidden = true;
    history.replaceState(null, "", location.pathname + "#post-" + post.id);
    route();
  }

  function deletePost(id) {
    if (!window.confirm(APP.t("forum.confirmDelete"))) return;
    save(load().filter(function (p) { return p.id !== id; }));
    location.hash = "";
    route();
  }

  function renderCats() {
    els.cats.innerHTML = ["all"].concat(CATS).map(function (c) {
      return '<button type="button" class="chip" data-cat="' + c + '" aria-pressed="' + (state.cat === c) + '">' + APP.t("forum.cat." + c) + "</button>";
    }).join("");
    els.catTiles.innerHTML = CATS.map(function (c, i) {
      return '<label><input type="radio" name="cat" value="' + c + '"' + (i === 0 ? " checked" : "") + "><span>" + APP.t("forum.cat." + c) + "</span></label>";
    }).join("");
  }

  /* ---------- Start ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var home = document.getElementById("home-forum");
    if (home) {
      renderHome(home);
      document.addEventListener("langchange", function () { renderHome(home); });
    }

    var app = document.getElementById("forum-app");
    if (!app) return;
    ["list", "detail", "form", "posts", "cats", "detailBody", "replyText", "replyName", "replyPost", "fTitle", "fBody", "fName", "catTiles", "preview", "previewWrap", "search"]
      .forEach(function (k) { els[k] = document.getElementById("f-" + k); });
    els.formEl = document.getElementById("f-formEl");

    renderCats();
    var q = new URLSearchParams(location.search);
    if (q.get("new")) { history.replaceState(null, "", location.pathname + location.search + "#new"); }
    els.replyName.value = APP.store.get(NAME_KEY) || "";

    // Sort + category + search
    document.getElementById("f-sort").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-sort]");
      if (!b) return;
      state.sort = b.getAttribute("data-sort");
      this.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      renderList();
    });
    els.cats.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]");
      if (!b) return;
      state.cat = b.getAttribute("data-cat");
      renderCats();
      renderList();
    });
    els.search.addEventListener("input", function () { state.q = els.search.value; renderList(); });

    // Votes and delete work in the list and the post view
    app.addEventListener("click", function (e) {
      var v = e.target.closest("[data-vote]");
      if (v) { toggleVote(v.getAttribute("data-vote")); route(); return; }
      var d = e.target.closest("[data-delete]");
      if (d) deletePost(d.getAttribute("data-delete"));
    });

    document.getElementById("f-replyForm").addEventListener("submit", addComment);
    els.formEl.addEventListener("submit", submitPost);
    document.getElementById("f-photo").addEventListener("change", function (e) { if (e.target.files[0]) resizePhoto(e.target.files[0]); });
    document.getElementById("f-removePhoto").addEventListener("click", function () {
      state.photo = ""; els.previewWrap.hidden = true; document.getElementById("f-photo").value = "";
    });
    els.fTitle.addEventListener("input", function () { els.fTitle.closest(".field").classList.remove("has-error"); });

    window.addEventListener("hashchange", route);
    document.addEventListener("langchange", function () { renderCats(); route(); });
    route();
  });
})();
