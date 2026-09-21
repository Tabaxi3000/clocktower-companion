(() => {
  "use strict";

  const DATA = window.BOTC_DATA;
  const STRATEGY = window.BOTC_STRATEGY || { sources: [], general: {}, rules: [], roles: {} };
  const SETUP = window.BOTC_SETUP || { teensyScripts: [], officialResources: [], castProfiles: {}, genericProfiles: [], hiddenSetup: {} };
  const OPTIONAL = window.BOTC_OPTIONAL || { travellerIds: [], loricIds: [], recommendedTravellers: {} };
  const ROLES = DATA.roles;
  const R = Object.fromEntries(ROLES.map(role => [role.id, role]));
  const STORAGE_KEY = "ravenswood-ledger-v1";
  const BASE_TITLE = document.title;
  const DEFAULT_TIMER_MESSAGE = "Time is up — please return for nominations and public discussion.";
  const TEAM_ORDER = ["townsfolk", "outsider", "minion", "demon"];
  const STATUS_OPTIONS = ["drunk", "poisoned", "protected", "mad", "spent ability", "red herring", "good twin", "evil twin", "marked", "other"];
  const EVENT_TYPES = ["ability choice", "information", "death", "execution", "resurrection", "nomination", "vote", "protection", "drunk", "poison", "role change", "alignment change", "madness", "storyteller note"];
  const MODE_VIEWS = {
    storyteller: ["setup", "grimoire", "run", "votes", "intel", "worlds", "strategy", "rules", "reference", "archive"],
    player: ["setup", "votes", "intel", "worlds", "strategy", "rules", "reference"]
  };
  const THEME_COLORS = {
    tb: "#a83e57", bmr: "#465b9d", snv: "#8650a7", grimm: "#39745e",
    ngj: "#248a8c", overriver: "#347da8", luf: "#3b7790", custom: "#8a5f4b"
  };

  const CAST_ORDERS = {
    tb: {
      townsfolk: ["washerwoman","chef","empath","fortuneteller","undertaker","monk","ravenkeeper","virgin","slayer","soldier","mayor","librarian","investigator"],
      outsider: ["butler","recluse","saint","drunk"],
      minion: ["poisoner","scarletwoman","spy"], demon: ["imp"]
    },
    bmr: {
      townsfolk: ["grandmother","chambermaid","gambler","exorcist","gossip","innkeeper","courtier","professor","tealady","sailor","minstrel","fool","pacifist"],
      outsider: ["moonchild","tinker","lunatic","goon"],
      minion: ["devilsadvocate","assassin","mastermind"], demon: ["pukka","po","shabaloth","zombuul"]
    },
    snv: {
      townsfolk: ["clockmaker","dreamer","flowergirl","towncrier","oracle","savant","seamstress","artist","juggler","sage","mathematician","philosopher","snakecharmer"],
      outsider: ["sweetheart","mutant","barber","klutz"],
      minion: ["witch","cerenovus","eviltwin"], demon: ["nodashii","vortox","fanggu","vigormortis"]
    },
    grimm: {
      townsfolk: ["general","towncrier","gambler","exorcist","innkeeper","nightwatchman","fisherman","slayer","soldier","minstrel","cannibal","villageidiot","amnesiac"],
      outsider: ["damsel","drunk","golem","politician"],
      minion: ["assassin","scarletwoman","godfather"], demon: ["pukka","ojo","po","yaggababble"]
    }
  };

  const TWISTS = {
    tb: [
      ["none", "Standard distribution"], ["baron", "Baron: +2 Outsiders"],
    ],
    bmr: [
      ["none", "Standard distribution"], ["godfather-plus", "Godfather: +1 Outsider"], ["godfather-minus", "Godfather: −1 Outsider"],
    ],
    snv: [
      ["none", "Standard distribution"], ["fanggu", "Fang Gu: +1 Outsider"], ["vigormortis", "Vigormortis: −1 Outsider"],
    ],
    grimm: [
      ["none", "Standard distribution"], ["godfather-plus", "Godfather: +1 Outsider"],
      ["godfather-minus", "Godfather: −1 Outsider"], ["summoner", "Summoner opening: no Demon"],
      ["vi-two", "Two Village Idiots"], ["vi-three", "Three Village Idiots"],
    ],
    ngj: [["none", "Standard distribution"], ["baron", "Baron: +2 Outsiders"]],
    overriver: [["none", "Standard distribution"], ["godfather-plus", "Godfather: +1 Outsider"], ["godfather-minus", "Godfather: −1 Outsider"]],
    luf: [["none", "Balloonist: +0 Outsiders"], ["balloonist-plus", "Balloonist: +1 Outsider"]],
    custom: [["none", "Standard distribution (manual modifiers)"]]
  };

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
  const escapeHTML = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const title = value => value ? value[0].toUpperCase() + value.slice(1) : "";
  const playerName = id => state.players.find(p => p.id === id)?.name || "—";
  const roleName = id => R[id]?.name || "Unassigned";
  const alignmentFor = roleId => ["minion","demon"].includes(R[roleId]?.team) ? "evil" : R[roleId] ? "good" : "unknown";
  const isTeensyScript = (script = state.script) => SETUP.teensyScripts.includes(script);
  const isSmallGame = () => Number(state.playerCount) < 7;
  const toymakerActive = () => isSmallGame() && Boolean(state.toymaker);
  const officialWikiUrl = role => role && role.edition !== "custom" ? `https://wiki.bloodontheclocktower.com/${encodeURIComponent(role.name.replaceAll(" ", "_"))}` : "";
  const scriptMeta = (script = state.script) => script === "custom" && state.customScript
    ? { name: state.customScript.name || "Imported Custom Script", level: "Custom", theme: `Imported${state.customScript.author ? ` · ${state.customScript.author}` : ""}` }
    : DATA.scriptMeta[script];
  const scriptIds = (script = state.script, includeTravellers = false) => {
    let ids;
    if (script === "custom" && state.customScript) {
      ids = state.customScript.ids.filter(id => !["traveller", "loric"].includes(R[id]?.team));
    } else {
      ids = [...(DATA.scripts[script] || [])].filter(id => !["traveller", "loric"].includes(R[id]?.team));
    }
    if (includeTravellers) ids.push(...OPTIONAL.travellerIds);
    return [...new Set(ids)];
  };
  const scriptRoles = (script = state.script, includeTravellers = false) => {
    const ids = scriptIds(script, includeTravellers);
    return ids.map(id => R[id]).filter(Boolean);
  };
  const roleStrategy = role => {
    const detail = STRATEGY.roles?.[role?.id] || {};
    return {
      enriched: Boolean(STRATEGY.roles?.[role?.id]),
      firstMove: detail.firstMove || role?.play || "Read the exact ability and identify what must be chosen, learned, tracked, or protected before you speak publicly.",
      priorities: detail.priorities?.length ? detail.priorities : [
        "Record exact choices, targets, results, deaths, and timing instead of relying on memory.",
        "Compare the ability with public claims, votes, and every legal source of misinformation.",
        role?.team === "demon" ? "Keep your cover history and kill plan compatible." : role?.team === "minion" ? "Use your ability and cover to protect the Demon rather than your own survival." : "Make sure at least one other player can recover your useful information if you die."
      ],
      reveal: detail.reveal || "Reveal when the information changes a decision, preserves it after your death, or protects a more valuable teammate.",
      pitfalls: detail.pitfalls?.length ? detail.pitfalls : ["Treating one result as complete proof.", "Losing the exact timing, target, or wording of an ability result."],
      bluff: detail.bluff || role?.bluff || "Build a legal history that matches the role's exact timing and public events."
    };
  };

  function perceivedIdentity(player) {
    if (!player?.roleId) return { role: null, alignment: "unknown", disguised: false };
    let roleId = player.roleId;
    let alignment = player.alignment;
    if (player.roleId === "drunk") {
      roleId = state.hiddenSetup["drunk.coverRole"] || "";
      alignment = "good";
    } else if (player.roleId === "lunatic") {
      roleId = state.hiddenSetup["lunatic.believedDemon"] || "";
      alignment = "evil";
    } else if (player.roleId === "marionette") {
      roleId = state.hiddenSetup["marionette.believedRole"] || "";
      alignment = "good";
    }
    return { role: R[roleId] || null, alignment, disguised: roleId !== player.roleId };
  }

  function privateIdentityIssue(player) {
    if (!player?.roleId) return "role is unassigned";
    const requirements = {
      drunk: ["drunk.coverRole", "choose a legal not-in-play Townsfolk role shown to the Drunk"],
      lunatic: ["lunatic.believedDemon", "choose a Demon shown to the Lunatic"],
      marionette: ["marionette.believedRole", "choose a legal not-in-play good role shown to the Marionette"]
    };
    const requirement = requirements[player.roleId];
    if (requirement) {
      const field = activeHiddenSetupFields().find(item => item.storageKey === requirement[0]);
      if (!field || hiddenSetupMissing(field)) return requirement[1];
    }
    return "";
  }

  function freshState() {
    return {
      version: 1, mode: "storyteller", script: "tb", playerCount: 7, twist: "none", rotation: 0, castPreset: "balanced", toymaker: false,
      players: [], cast: [], bluffs: [], phase: "firstNight", day: 1, rolesHidden: false,
      customScript: null, deliveryLog: {},
      lorics: [], loricState: { ugHolder: "", hinduReincarnations: 0 }, gardenerAssignments: {},
      timer: { durationSeconds: 300, remainingSeconds: 300, running: false, endsAt: null, sound: true, notification: false, message: DEFAULT_TIMER_MESSAGE },
      secrets: { redHerring: "", drunkRole: "", yaggaPhrase: "", amnesiac: "" },
      hiddenSetup: {},
      events: [], nominations: [], intel: [], worlds: [], queueDone: {},
      outcome: "unfinished", postgame: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!parsed || parsed.version !== 1) return freshState();
      const loaded = { ...freshState(), ...parsed, loricState: { ...freshState().loricState, ...(parsed.loricState || {}) }, timer: { ...freshState().timer, ...(parsed.timer || {}) }, secrets: { ...freshState().secrets, ...(parsed.secrets || {}) }, hiddenSetup: { ...(parsed.hiddenSetup || {}) }, gardenerAssignments: { ...(parsed.gardenerAssignments || {}) } };
      const legacy = {
        "fortuneteller.redHerring": loaded.secrets.redHerring,
        "drunk.coverRole": loaded.secrets.drunkRole,
        "yaggababble.phrase": loaded.secrets.yaggaPhrase,
        "amnesiac.ability": loaded.secrets.amnesiac
      };
      Object.entries(legacy).forEach(([key, value]) => { if (value && !loaded.hiddenSetup[key]) loaded.hiddenSetup[key] = value; });
      return loaded;
    } catch { return freshState(); }
  }

  let state = loadState();
  let currentView = "setup";
  let selectedStrategyRole = "";
  let expandAllRules = false;
  let handoffIndex = 0;
  let saveTimer;
  let tableTimerHandle = null;
  let timerAudioContext = null;
  let countUpdateTimer = null;

  function saveState(message) {
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    $("#quick-save").textContent = "Saved locally";
    if (message) toast(message);
  }

  function queueSave() {
    $("#quick-save").textContent = "Saving…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveState(), 180);
  }

  function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  const timerPhonePlayers = () => state.players.filter(player => player.phone.trim().replace(/[^+\d]/g, ""));
  const timerReminderText = () => state.timer.message.trim() || DEFAULT_TIMER_MESSAGE;

  function timerSmsHref(players = timerPhonePlayers()) {
    const numbers = players.map(player => player.phone.trim().replace(/[^+\d]/g, "")).filter(Boolean);
    const separator = /iPad|iPhone|iPod/i.test(navigator.userAgent) ? "&" : "?";
    return `sms:${numbers.join(",")}${separator}body=${encodeURIComponent(timerReminderText())}`;
  }

  function formatTimer(seconds) {
    const safe = Math.max(0, Math.round(Number(seconds) || 0));
    return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
  }

  function renderTimerMessaging() {
    const players = timerPhonePlayers();
    const message = timerReminderText();
    const summary = $("#timer-recipient-summary");
    if (summary) summary.textContent = players.length
      ? `${players.length} player${players.length === 1 ? " has" : "s have"} a saved phone number.`
      : "No player phone numbers saved.";
    ["#timer-text-now", "#timer-alert-text-all"].forEach(selector => {
      const link = $(selector);
      if (!link) return;
      link.href = players.length ? timerSmsHref(players) : "#";
      link.classList.toggle("disabled", !players.length);
      link.setAttribute("aria-disabled", String(!players.length));
      link.tabIndex = players.length ? 0 : -1;
    });
    const alertMessage = $("#timer-alert-message");
    if (alertMessage) alertMessage.textContent = message;
    const recipientList = $("#timer-alert-recipients");
    if (recipientList) recipientList.innerHTML = players.length
      ? `<p>${players.length} SMS draft${players.length === 1 ? " is" : "s are"} ready. Use one group draft or text people separately:</p><div>${players.map(player => `<a class="button-link" href="${escapeHTML(timerSmsHref([player]))}">Text ${escapeHTML(player.name)}</a>`).join("")}</div>`
      : '<p>No phone numbers are saved. The chime and device notification still work; add numbers under Setup to prepare return texts.</p>';
  }

  function renderTimer() {
    const remaining = Math.max(0, Number(state.timer.remainingSeconds) || 0);
    $("#timer-display").textContent = formatTimer(remaining);
    $("#timer-toggle").textContent = state.timer.running ? "Pause timer" : remaining > 0 && remaining < state.timer.durationSeconds ? "Resume timer" : "Start timer";
    $("#timer-duration").value = String(state.timer.durationSeconds);
    $("#timer-duration").disabled = state.timer.running;
    $("#timer-sound").checked = state.timer.sound;
    $("#timer-notification").checked = state.timer.notification;
    if (document.activeElement !== $("#timer-message")) $("#timer-message").value = state.timer.message;
    const progress = $("#timer-progress");
    progress.max = Math.max(1, state.timer.durationSeconds);
    progress.value = remaining;
    const status = $("#timer-status");
    if (state.timer.running) status.textContent = `Running · return at ${new Date(state.timer.endsAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    else if (!remaining) status.textContent = "Time is up. Bring everyone back to town square.";
    else if (remaining < state.timer.durationSeconds) status.textContent = `Paused with ${formatTimer(remaining)} remaining.`;
    else status.textContent = `Ready for ${state.timer.durationSeconds / 60} minute${state.timer.durationSeconds === 60 ? "" : "s"}.`;
    document.body.classList.toggle("timer-warning", state.timer.running && remaining <= 60);
    renderTimerMessaging();
  }

  function primeTimerAudio() {
    if (!state.timer.sound) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!timerAudioContext) timerAudioContext = new AudioContext();
    timerAudioContext.resume().catch(() => {});
    const oscillator = timerAudioContext.createOscillator();
    const gain = timerAudioContext.createGain();
    gain.gain.value = 0.00001;
    oscillator.connect(gain); gain.connect(timerAudioContext.destination);
    oscillator.start(); oscillator.stop(timerAudioContext.currentTime + 0.015);
  }

  function playTimerChime() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) { toast("This browser cannot play the timer chime"); return; }
    if (!timerAudioContext) timerAudioContext = new AudioContext();
    const play = () => {
      const start = timerAudioContext.currentTime + 0.03;
      [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
        const oscillator = timerAudioContext.createOscillator();
        const gain = timerAudioContext.createGain();
        const at = start + index * 0.24;
        oscillator.type = index === 3 ? "sine" : "triangle";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.24, at + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.42);
        oscillator.connect(gain); gain.connect(timerAudioContext.destination);
        oscillator.start(at); oscillator.stop(at + 0.45);
      });
    };
    if (timerAudioContext.state === "suspended") timerAudioContext.resume().then(play).catch(() => toast("Tap Play chime again to enable sound"));
    else play();
  }

  function stopTimerInterval() {
    if (tableTimerHandle) clearInterval(tableTimerHandle);
    tableTimerHandle = null;
  }

  function clearTimerAlert() {
    document.body.classList.remove("timer-finished");
    document.title = BASE_TITLE;
  }

  function finishTimer() {
    stopTimerInterval();
    state.timer.running = false;
    state.timer.endsAt = null;
    state.timer.remainingSeconds = 0;
    saveState();
    renderTimer();
    document.body.classList.add("timer-finished");
    document.title = "⏰ Time to return · Ravenswood Ledger";
    if (state.timer.sound) playTimerChime();
    if (state.timer.notification && "Notification" in window && Notification.permission === "granted") {
      try { new Notification("Time to return", { body: timerReminderText(), tag: "ravenswood-discussion-timer" }); } catch {}
    }
    if (navigator.vibrate) navigator.vibrate([180, 90, 180, 90, 420]);
    renderTimerMessaging();
    const dialog = $("#timer-alert-dialog");
    if (!dialog.open) dialog.showModal();
  }

  function tickTimer() {
    if (!state.timer.running || !state.timer.endsAt) return;
    const remaining = Math.max(0, Math.ceil((state.timer.endsAt - Date.now()) / 1000));
    if (remaining === state.timer.remainingSeconds) return;
    state.timer.remainingSeconds = remaining;
    if (!remaining) finishTimer();
    else renderTimer();
  }

  function beginTimerInterval() {
    stopTimerInterval();
    tableTimerHandle = setInterval(tickTimer, 250);
  }

  async function toggleTimer() {
    if (state.timer.running) {
      tickTimer();
      state.timer.running = false;
      state.timer.endsAt = null;
      stopTimerInterval();
      saveState(); renderTimer();
      return;
    }
    if (!state.timer.remainingSeconds) state.timer.remainingSeconds = state.timer.durationSeconds;
    clearTimerAlert();
    primeTimerAudio();
    if (state.timer.notification && "Notification" in window && Notification.permission === "default") {
      try { await Notification.requestPermission(); } catch {}
    }
    state.timer.running = true;
    state.timer.endsAt = Date.now() + state.timer.remainingSeconds * 1000;
    saveState();
    beginTimerInterval();
    renderTimer();
  }

  function resetTimer() {
    stopTimerInterval();
    state.timer.running = false;
    state.timer.endsAt = null;
    state.timer.remainingSeconds = state.timer.durationSeconds;
    clearTimerAlert();
    saveState(); renderTimer();
  }

  function shuffle(values) {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  const corePlayers = () => state.players.filter(player => !player.extraTraveller);
  const extraTravellerPlayers = () => state.players.filter(player => player.extraTraveller);
  const allTravellerRoles = () => OPTIONAL.travellerIds.map(id => R[id]).filter(Boolean);
  const loricActive = id => state.lorics.includes(id);

  function blankPlayer(seat, extraTraveller = false) {
    return {
      id: uid(extraTraveller ? "t" : "p"), seat, name: extraTraveller ? `Traveller ${extraTravellerPlayers().length + 1}` : `Player ${seat}`,
      phone: "", roleId: "", alignment: "unknown", alive: true, deadVote: true, claim: "", claimHistory: "", trust: 50,
      statuses: [], publicNote: "", privateNote: "", coverRole: "", extraTraveller
    };
  }

  function ensurePlayers() {
    const count = Math.max(5, Math.min(isTeensyScript() ? 6 : 15, Number(state.playerCount) || 7));
    state.playerCount = count;
    const extras = extraTravellerPlayers();
    const regular = corePlayers();
    while (regular.length < count) regular.push(blankPlayer(regular.length + 1));
    const normalizedRegular = regular.slice(0, count).map((player, index) => ({ ...player, extraTraveller: false, phone: player.phone || "", seat: index + 1, statuses: player.statuses || [] }));
    const normalizedExtras = extras.map((player, index) => ({ ...player, extraTraveller: true, phone: player.phone || "", seat: count + index + 1, statuses: player.statuses || [] }));
    state.players = [...normalizedRegular, ...normalizedExtras];
    if (!state.players.some(player => player.id === state.loricState.ugHolder)) state.loricState.ugHolder = "";
  }

  function hydrateCustomRoles() {
    if (!state.customScript?.roles) return;
    state.customScript.roles.forEach(role => {
      R[role.id] = role;
      if (!ROLES.some(existing => existing.id === role.id)) ROLES.push(role);
    });
  }

  function effectiveCounts() {
    const base = { ...DATA.counts[String(state.playerCount)] };
    if (!base) return { townsfolk: 0, outsider: 0, minion: 0, demon: 0 };
    if (state.twist === "baron") { base.townsfolk -= 2; base.outsider += 2; }
    if (state.twist === "godfather-plus" || state.twist === "fanggu") { base.townsfolk -= 1; base.outsider += 1; }
    if (state.twist === "godfather-minus" && base.outsider > 0) { base.townsfolk += 1; base.outsider -= 1; }
    if (state.twist === "balloonist-plus") { base.townsfolk -= 1; base.outsider += 1; }
    if (state.twist === "vigormortis" && base.outsider > 0) { base.townsfolk += 1; base.outsider -= 1; }
    if (state.twist === "summoner") { base.townsfolk += 1; base.demon = 0; }
    return base;
  }

  function rotatePick(pool, count, offset = 0, forced = []) {
    const cleanForced = forced.filter(Boolean);
    const available = pool.filter(id => !cleanForced.includes(id));
    const rotated = available.length ? available.slice(offset % available.length).concat(available.slice(0, offset % available.length)) : [];
    return [...cleanForced, ...rotated].slice(0, count);
  }

  function castProfiles() {
    return SETUP.castProfiles[state.script] || SETUP.genericProfiles || [];
  }

  function availableTwists() {
    let choices = [...(TWISTS[state.script] || TWISTS.custom)];
    if (state.script === "ngj" && state.playerCount === 6) choices = choices.filter(([value]) => value !== "baron");
    if (state.script === "grimm" && state.playerCount >= 13) choices = choices.filter(([value]) => ["godfather-plus", "godfather-minus", "summoner"].includes(value));
    if (DATA.counts[String(state.playerCount)]?.outsider === 0) choices = choices.filter(([value]) => value !== "godfather-minus");
    return choices;
  }

  function normalizeTwist() {
    const choices = availableTwists();
    if (!choices.some(([value]) => value === state.twist)) state.twist = choices[0]?.[0] || "none";
  }

  function activeCastProfile() {
    const profiles = castProfiles();
    return profiles.find(profile => profile.id === state.castPreset) || profiles[0] || { id: "balanced", name: "Balanced", description: "Uses the published script order.", priorities: {} };
  }

  function profileOrder(team) {
    const modifierRoles = {
      baron: state.twist === "baron",
      godfather: state.twist.startsWith("godfather"),
      fanggu: state.twist === "fanggu",
      vigormortis: state.twist === "vigormortis",
      summoner: state.twist === "summoner"
    };
    const roles = scriptRoles().filter(role => role.team === team && (state.script === "custom" || (modifierRoles[role.id] ?? true)));
    const profile = activeCastProfile();
    const preferred = (profile.priorities?.[team] || []).filter(id => roles.some(role => role.id === id));
    let remaining = roles.filter(role => !preferred.includes(role.id));
    if (profile.tagOrder?.length) {
      const score = role => profile.tagOrder.reduce((total, tag, index) => total + (role.tags.includes(tag) ? profile.tagOrder.length - index : 0), 0);
      remaining = remaining.sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));
    }
    return [...preferred, ...remaining.map(role => role.id)];
  }

  function recommendCast(increment = false) {
    normalizeTwist();
    if (increment) state.rotation += 1;
    const counts = effectiveCounts();
    const profile = activeCastProfile();
    state.castPreset = profile.id;
    const order = TEAM_ORDER.reduce((groups, team) => { groups[team] = profileOrder(team); return groups; }, {});
    const forced = { townsfolk: [], outsider: [], minion: [], demon: [] };
    if (state.twist === "baron") forced.minion = ["baron"];
    if (state.twist.startsWith("godfather")) forced.minion = ["godfather"];
    if (state.twist === "fanggu") forced.demon = ["fanggu"];
    if (state.twist === "vigormortis") forced.demon = ["vigormortis"];
    if (state.twist === "balloonist-plus") forced.townsfolk = ["balloonist"];
    if (state.twist === "summoner") forced.minion = ["summoner"];
    if (state.twist === "vi-two") forced.townsfolk = ["villageidiot", "villageidiot"];
    if (state.twist === "vi-three") forced.townsfolk = ["villageidiot", "villageidiot", "villageidiot"];
    const cast = [];
    TEAM_ORDER.forEach((team, teamIndex) => {
      const picked = rotatePick(order[team], counts[team], state.rotation + teamIndex, forced[team]);
      cast.push(...picked);
    });
    state.cast = cast;
    state.bluffs = [];
    state.gardenerAssignments = {};
    corePlayers().forEach(p => { p.roleId = ""; p.alignment = "unknown"; p.coverRole = ""; });
    saveState(increment ? "Cast rotated" : "Recommended cast ready");
    renderAll();
  }

  function activeHiddenSetupFields() {
    const activeRoles = [...state.cast, ...state.players.filter(player => R[player.roleId]?.team === "traveller").map(player => player.roleId)];
    const copies = activeRoles.reduce((counts, id) => ((counts[id] = (counts[id] || 0) + 1), counts), {});
    const fields = [];
    Object.entries(copies).forEach(([roleId, count]) => {
      (SETUP.hiddenSetup[roleId] || []).forEach(field => {
        if (field.minPlayers && state.playerCount < field.minPlayers) return;
        if (field.minCopies && count < field.minCopies) return;
        fields.push({ ...field, roleId, storageKey: `${roleId}.${field.key}` });
      });
    });
    if (toymakerActive()) {
      fields.push({ roleId: "toymaker", key: "noAttackTaken", storageKey: "toymaker.noAttackTaken", label: "Toymaker no-attack night completed", type: "checkbox", required: false, help: "Leave unchecked until the Demon voluntarily skips an attack or the Storyteller forces the final legal skip." });
    }
    return fields;
  }

  function hiddenSetupMissing(field) {
    const value = state.hiddenSetup[field.storageKey];
    if (field.type === "checkbox") return value !== true;
    if (!String(value || "").trim()) return true;
    if (field.type === "player") return !state.players.some(player => player.id === value);
    if (field.type === "role") {
      const role = R[value];
      if (!role || !scriptIds().includes(role.id)) return true;
      if (field.roleFilter === "demon") return role.team !== "demon";
      if (field.roleFilter === "townsfolkOutOfPlay") return role.team !== "townsfolk" || state.cast.includes(role.id);
      if (field.roleFilter === "goodOutOfPlay") return !["townsfolk", "outsider"].includes(role.team) || state.cast.includes(role.id);
    }
    return false;
  }

  function syncLegacySecret(key, value) {
    const legacyKeys = {
      "fortuneteller.redHerring": "redHerring",
      "drunk.coverRole": "drunkRole",
      "yaggababble.phrase": "yaggaPhrase",
      "amnesiac.ability": "amnesiac"
    };
    if (legacyKeys[key]) state.secrets[legacyKeys[key]] = String(value || "");
  }

  function setupIssues() {
    const issues = [];
    const counts = effectiveCounts();
    const actual = { townsfolk: 0, outsider: 0, minion: 0, demon: 0 };
    state.cast.forEach(id => { if (R[id] && actual[R[id].team] !== undefined) actual[R[id].team] += 1; });
    if (state.cast.length !== state.playerCount) issues.push(["error", `Cast has ${state.cast.length} tokens for ${state.playerCount} players.`]);
    TEAM_ORDER.forEach(team => {
      if (actual[team] !== counts[team]) issues.push(["error", `${title(team)} count is ${actual[team]}; expected ${counts[team]}.`]);
    });
    const duplicates = Object.entries(state.cast.reduce((m,id) => ((m[id] = (m[id] || 0) + 1), m), {})).filter(([,n]) => n > 1);
    duplicates.forEach(([id,n]) => { if (id !== "villageidiot") issues.push(["error", `${roleName(id)} appears ${n} times.`]); });
    if (state.twist === "summoner" && !state.cast.includes("summoner")) issues.push(["error", "Summoner opening selected without a Summoner."]);
    if (state.twist === "summoner" && actual.demon) issues.push(["error", "A Summoner opening starts with no Demon token."]);
    if (state.twist === "godfather-minus" && DATA.counts[String(state.playerCount)].outsider === 0) issues.push(["error", "Godfather cannot remove an Outsider when the standard setup has none; choose +1 instead."]);
    if (isTeensyScript() && state.playerCount > 6) issues.push(["error", "Teensyville scripts are built for five or six non-Traveller players."]);
    if (!isTeensyScript() && ["bmr","snv","grimm"].includes(state.script) && state.playerCount < 7) issues.push(["warn", "This script is normally better at seven or more non-Traveller players."]);
    if (state.script !== "custom" && state.cast.includes("baron") && state.twist !== "baron") issues.push(["error", "Baron is in the cast, so select the Baron +2 Outsiders setup variation."]);
    if (state.script !== "custom" && state.cast.includes("godfather") && !state.twist.startsWith("godfather")) issues.push(["error", "Godfather is in the cast; choose whether it adds or removes an Outsider."]);
    if (state.script !== "custom" && state.cast.includes("fanggu") && state.twist !== "fanggu") issues.push(["error", "Fang Gu is in the cast, so apply its +1 Outsider setup variation."]);
    if (state.script !== "custom" && state.cast.includes("vigormortis") && state.twist !== "vigormortis") issues.push(["error", "Vigormortis is in the cast, so apply its −1 Outsider setup variation."]);
    if (state.twist === "balloonist-plus" && !state.cast.includes("balloonist")) issues.push(["error", "Balloonist +1 Outsider is selected without a Balloonist in the cast."]);
    if (state.lorics.length > 1) issues.push(["warn", "Multiple Loric are active. The official rules allow this at the Storyteller's risk; check their interactions before play."]);
    if (loricActive("godofug") && !state.players.some(player => player.id === state.loricState.ugHolder)) issues.push(["error", "God of Ug needs an initial Ug-hat wearer."]);
    if (loricActive("gardener")) {
      const regular = corePlayers();
      const assignments = regular.map(player => state.gardenerAssignments[player.id] || "");
      const assignedCounts = assignments.reduce((countsByRole, id) => ((countsByRole[id] = (countsByRole[id] || 0) + 1), countsByRole), {});
      const castCounts = state.cast.reduce((countsByRole, id) => ((countsByRole[id] = (countsByRole[id] || 0) + 1), countsByRole), {});
      const exact = assignments.length === state.cast.length && assignments.every(Boolean) && Object.keys({ ...assignedCounts, ...castCounts }).every(id => assignedCounts[id] === castCounts[id]);
      if (!exact) issues.push(["error", "Gardener seat assignments must use every selected cast token exactly once."]);
      const marionetteIndex = assignments.indexOf("marionette");
      const demonIndex = assignments.findIndex(id => R[id]?.team === "demon");
      if (marionetteIndex >= 0 && demonIndex >= 0) {
        const distance = Math.abs(regular[marionetteIndex].seat - regular[demonIndex].seat);
        if (![1, state.players.length - 1].includes(distance)) issues.push(["error", "The Gardener plan must seat the Marionette next to the Demon."]);
      }
    }
    if (loricActive("hindu")) issues.push(["info", `Hindu reincarnations recorded: ${Math.max(0, Math.min(4, Number(state.loricState.hinduReincarnations) || 0))} of 4.`]);
    activeHiddenSetupFields().filter(field => field.required && hiddenSetupMissing(field)).forEach(field => issues.push(["warn", `Hidden setup still needs: ${field.label}.`]));
    if (state.players.length && state.players.every(player => player.roleId)) {
      const playerFor = key => state.players.find(player => player.id === state.hiddenSetup[key]);
      [
        ["fortuneteller.redHerring", "Fortune Teller red herring"],
        ["grandmother.grandchild", "Grandmother grandchild"],
        ["eviltwin.goodTwin", "Evil Twin's Good Twin"],
        ["widow.informedPlayer", "Widow-informed player"]
      ].forEach(([key, label]) => {
        const target = playerFor(key);
        if (target && target.alignment !== "good") issues.push(["warn", `${label} should be a good player; ${target.name} is currently ${target.alignment}.`]);
      });
      const bountyTarget = playerFor("bountyhunter.evilTownsfolk");
      if (bountyTarget && R[bountyTarget.roleId]?.team !== "townsfolk") issues.push(["warn", `The Bounty Hunter's evil player must hold a Townsfolk character; ${bountyTarget.name} is ${roleName(bountyTarget.roleId)}.`]);
      const drunkCopy = playerFor("villageidiot.drunkCopy");
      if (drunkCopy && drunkCopy.roleId !== "villageidiot") issues.push(["warn", `The drunk Village Idiot reminder is on ${drunkCopy.name}, who is not a Village Idiot.`]);
      const gnome = state.players.find(player => player.roleId === "gnome");
      const amigo = playerFor("gnome.amigo");
      if (gnome && amigo && amigo.alignment !== gnome.alignment) issues.push(["error", `The Gnome's amigo must share the Gnome's starting alignment; ${amigo.name} is currently ${amigo.alignment}.`]);
      const marionette = state.players.find(player => player.roleId === "marionette");
      const demon = playerFor("marionette.demonNeighbor");
      if (marionette && demon) {
        const distance = Math.abs(marionette.seat - demon.seat);
        if (R[demon.roleId]?.team !== "demon" || ![1, state.players.length - 1].includes(distance)) issues.push(["error", "The Marionette must neighbor the Demon in the seating circle."]);
      }
    }
    if (isSmallGame()) issues.push(["info", toymakerActive() ? "Toymaker is active: give normal evil starting information and track the required no-attack night." : "Small-game rule: skip normal Minion/Demon starting information and do not give Demon bluffs."]);
    const activeJinxes = DATA.jinxes.filter(j => state.cast.includes(j.a) && state.cast.includes(j.b));
    activeJinxes.forEach(j => issues.push(["warn", `Jinx: ${roleName(j.a)} / ${roleName(j.b)} — ${j.reason}`]));
    if (!issues.some(i => i[0] === "error")) issues.unshift(["ok", "Token total and category distribution are legal."]);
    return issues;
  }

  function setupIsLegal() { return !setupIssues().some(i => i[0] === "error"); }

  function assignRoles() {
    if (!setupIsLegal()) { toast("Fix setup errors before assigning roles"); return; }
    const regular = corePlayers();
    const tokens = loricActive("gardener") ? regular.map(player => state.gardenerAssignments[player.id]) : shuffle(state.cast);
    const marionetteIndex = tokens.indexOf("marionette");
    const demonIndex = tokens.findIndex(id => R[id]?.team === "demon");
    if (!loricActive("gardener") && marionetteIndex >= 0 && demonIndex >= 0 && tokens.length > 1) {
      const neighbors = [demonIndex - 1, demonIndex + 1].filter(index => index >= 0 && index < tokens.length);
      if (!neighbors.includes(marionetteIndex)) {
        const destination = neighbors[Math.floor(Math.random() * neighbors.length)];
        [tokens[marionetteIndex], tokens[destination]] = [tokens[destination], tokens[marionetteIndex]];
      }
    }
    regular.forEach((p, i) => {
      p.roleId = tokens[i]; p.alignment = alignmentFor(tokens[i]); p.alive = true; p.deadVote = true; p.statuses = [];
    });
    populateDerivedHiddenSetup();
    makeBluffs();
    saveState("Roles assigned privately");
    renderAll();
  }

  function populateDerivedHiddenSetup() {
    if (state.cast.includes("godfather")) {
      const outsiders = state.cast.filter(id => R[id]?.team === "outsider").map(roleName);
      state.hiddenSetup["godfather.shownOutsiders"] = outsiders.length ? outsiders.join(", ") : "None";
    }
    const noDashiiIndex = state.players.findIndex(player => player.roleId === "nodashii");
    if (noDashiiIndex >= 0) {
      const found = [];
      for (const direction of [-1, 1]) {
        for (let distance = 1; distance < state.players.length; distance += 1) {
          const index = (noDashiiIndex + direction * distance + state.players.length) % state.players.length;
          if (R[state.players[index].roleId]?.team === "townsfolk") { found.push(state.players[index].name); break; }
        }
      }
      state.hiddenSetup["nodashii.poisonedNeighbors"] = [...new Set(found)].join(", ");
    }
    const marionette = state.players.find(player => player.roleId === "marionette");
    if (marionette) {
      const index = state.players.indexOf(marionette);
      const neighbors = [state.players[(index - 1 + state.players.length) % state.players.length], state.players[(index + 1) % state.players.length]];
      const demon = neighbors.find(player => R[player?.roleId]?.team === "demon");
      if (demon) state.hiddenSetup["marionette.demonNeighbor"] = demon.id;
    }
  }

  function makeBluffs() {
    if (!state.cast.length) { toast("Generate a cast first"); return; }
    if (isSmallGame() && !toymakerActive()) {
      state.bluffs = [];
      state.players.forEach(player => { if (["minion", "demon"].includes(R[player.roleId]?.team)) player.coverRole = ""; });
      saveState("Small-game evil information withheld");
      renderBluffs(); renderGrimoire();
      return;
    }
    const excluded = new Set(state.cast);
    const drunkValue = state.hiddenSetup["drunk.coverRole"] || state.secrets.drunkRole || "";
    const drunkId = R[drunkValue] ? drunkValue : ROLES.find(role => role.name.toLowerCase() === String(drunkValue).trim().toLowerCase())?.id;
    const candidates = scriptRoles().filter(r => ["townsfolk","outsider"].includes(r.team) && !excluded.has(r.id) && r.id !== drunkId);
    const score = role => (role.tags.includes("information") ? 3 : 0) + (role.tags.includes("protection") ? 2 : 0) + (role.tags.includes("social") ? 1 : 0) + Math.random();
    state.bluffs = [...candidates].sort((a,b) => score(b) - score(a)).slice(0,3).map(r => r.id);
    const evil = state.players.filter(p => ["minion", "demon"].includes(R[p.roleId]?.team));
    const extraCovers = candidates.filter(r => !state.bluffs.includes(r.id));
    evil.forEach((p, i) => { p.coverRole = (state.bluffs[i] || extraCovers[i - state.bluffs.length]?.id || state.bluffs[0] || ""); });
    saveState("Bluff plan generated");
    renderBluffs(); renderGrimoire();
  }

  function cycleCastRole(index) {
    const current = R[state.cast[index]];
    if (!current) return;
    const pool = scriptRoles().filter(r => r.team === current.team).map(r => r.id);
    let nextIndex = (pool.indexOf(current.id) + 1) % pool.length;
    for (let guard = 0; guard < pool.length; guard++, nextIndex = (nextIndex + 1) % pool.length) {
      const next = pool[nextIndex];
      if (next === "villageidiot" || !state.cast.includes(next)) { state.cast[index] = next; break; }
    }
    state.bluffs = [];
    state.gardenerAssignments = {};
    queueSave(); renderSetup();
  }

  function renderTop() {
    document.documentElement.dataset.script = state.script;
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = THEME_COLORS[state.script] || THEME_COLORS.custom;
    $("#mode-select").value = state.mode;
    $$('[data-st-only]').forEach(el => el.hidden = state.mode !== "storyteller");
    $$('[data-player-only]').forEach(el => el.hidden = state.mode !== "player");
    const visibleNav = [];
    $$("#main-nav button").forEach(button => {
      button.hidden = !button.dataset.modes.split(" ").includes(state.mode);
      if (button.hidden) return;
      visibleNav.push(button);
      button.querySelector("em").textContent = button.dataset[state.mode === "player" ? "playerLabel" : "storyLabel"];
    });
    visibleNav.forEach((button, index) => { button.querySelector("span").textContent = String(index + 1).padStart(2, "0"); });
  }

  function viewAllowed(view) { return MODE_VIEWS[state.mode].includes(view); }

  function renderScriptOptions() {
    const options = Object.entries(DATA.scriptMeta).map(([id, meta]) => `<option value="${id}">${escapeHTML(meta.name)}${meta.teensyville ? " · Teensyville" : ""}</option>`);
    if (state.customScript) options.push(`<option value="custom">${escapeHTML(state.customScript.name || "Imported Custom Script")}</option>`);
    $("#script-select").innerHTML = options.join("");
    $("#script-select").value = state.script;
  }

  function hiddenRoleOptions(field, selectedValue) {
    let roles = scriptRoles();
    if (field.roleFilter === "demon") roles = roles.filter(role => role.team === "demon");
    if (field.roleFilter === "townsfolkOutOfPlay") roles = roles.filter(role => role.team === "townsfolk" && !state.cast.includes(role.id));
    if (field.roleFilter === "goodOutOfPlay") roles = roles.filter(role => ["townsfolk","outsider"].includes(role.team) && !state.cast.includes(role.id));
    const byName = roles.find(role => role.name.toLowerCase() === String(selectedValue || "").toLowerCase());
    const selected = R[selectedValue] ? selectedValue : byName?.id || selectedValue;
    if (selected && selected !== selectedValue) state.hiddenSetup[field.storageKey] = selected;
    return `<option value="">Choose a role…</option>${roles.map(role => `<option value="${escapeHTML(role.id)}" ${role.id === selected ? "selected" : ""}>${escapeHTML(role.name)}</option>`).join("")}`;
  }

  function renderHiddenSetup() {
    const list = $("#hidden-setup-list");
    if (!list || state.mode !== "storyteller") { if (list) list.innerHTML = ""; return; }
    const fields = activeHiddenSetupFields();
    if (!fields.length) {
      list.innerHTML = '<p class="empty-state">This cast has no additional role-specific setup choices. Keep ordinary first-night information in the night queue.</p>';
      return;
    }
    list.innerHTML = fields.map(field => {
      const value = state.hiddenSetup[field.storageKey] ?? "";
      const required = field.required ? "Required before play. " : "";
      if (field.type === "checkbox") {
        return `<label class="hidden-setup-field check-row"><input type="checkbox" data-hidden-setup="${escapeHTML(field.storageKey)}" ${value === true ? "checked" : ""}><span><strong>${escapeHTML(field.label)}</strong><small>${escapeHTML(required + field.help)}</small></span></label>`;
      }
      let control = "";
      if (field.type === "player") control = `<select data-hidden-setup="${escapeHTML(field.storageKey)}">${optionPlayers()} </select>`;
      else if (field.type === "role") control = `<select data-hidden-setup="${escapeHTML(field.storageKey)}">${hiddenRoleOptions(field, value)}</select>`;
      else if (field.type === "textarea") control = `<textarea data-hidden-setup="${escapeHTML(field.storageKey)}" rows="3">${escapeHTML(value)}</textarea>`;
      else control = `<input data-hidden-setup="${escapeHTML(field.storageKey)}" value="${escapeHTML(value)}">`;
      const markup = `<label class="hidden-setup-field"><span>${escapeHTML(field.label)}</span>${control}<small>${escapeHTML(required + field.help)}</small></label>`;
      return markup;
    }).join("");
    fields.filter(field => field.type === "player").forEach(field => {
      const input = list.querySelector(`[data-hidden-setup="${CSS.escape(field.storageKey)}"]`);
      if (input) input.value = state.hiddenSetup[field.storageKey] || "";
    });
  }

  function travellerOptions(selected = "") {
    const recommended = new Set(OPTIONAL.recommendedTravellers[state.script] || []);
    const roles = allTravellerRoles().sort((a, b) => a.name.localeCompare(b.name));
    const options = values => values.map(role => `<option value="${escapeHTML(role.id)}" ${role.id === selected ? "selected" : ""}>${escapeHTML(role.name)}</option>`).join("");
    const preferred = roles.filter(role => recommended.has(role.id));
    const other = roles.filter(role => !recommended.has(role.id));
    return `${preferred.length ? `<optgroup label="Recommended for this script">${options(preferred)}</optgroup>` : ""}<optgroup label="All other Travellers">${options(other)}</optgroup>`;
  }

  function gardenerRoleOptions(selected = "") {
    const counts = state.cast.reduce((result, roleId) => ((result[roleId] = (result[roleId] || 0) + 1), result), {});
    return `<option value="">Choose cast token…</option>${Object.entries(counts).map(([roleId, count]) => `<option value="${escapeHTML(roleId)}" ${roleId === selected ? "selected" : ""}>${escapeHTML(roleName(roleId))}${count > 1 ? ` ×${count}` : ""}</option>`).join("")}`;
  }

  function renderOptionalCharacters() {
    const container = $("#optional-characters");
    if (!container) return;
    const travellers = extraTravellerPlayers();
    const activeLorics = OPTIONAL.loricIds.map(id => R[id]).filter(role => role && loricActive(role.id));
    if (state.mode === "player") {
      const travellerMarkup = travellers.length
        ? travellers.map(player => `<article class="public-optional-card traveller"><span class="optional-kind">Traveller</span><strong>${escapeHTML(player.name)} · ${escapeHTML(roleName(player.roleId))}</strong><p>${escapeHTML(R[player.roleId]?.ability || "Public Traveller character")}</p></article>`).join("")
        : '<p class="empty-state">No Travellers are currently recorded.</p>';
      const loricMarkup = activeLorics.length
        ? activeLorics.map(role => `<article class="public-optional-card loric"><span class="optional-kind">Loric</span><strong>${escapeHTML(role.name)}</strong><p>${escapeHTML(role.ability)}</p></article>`).join("")
        : '<p class="empty-state">No Loric modifiers are active.</p>';
      container.innerHTML = `<div class="optional-public-grid"><section><h3>Travellers in play</h3>${travellerMarkup}</section><section><h3>Public Loric modifiers</h3>${loricMarkup}</section></div>`;
      return;
    }

    const travellerRows = travellers.length ? travellers.map(player => `<article class="traveller-control-card" data-extra-traveller="${escapeHTML(player.id)}">
      <div class="traveller-control-heading"><strong>${escapeHTML(player.name)}</strong><span>Public role · private alignment</span></div>
      <label>Name<input data-traveller-name="${escapeHTML(player.id)}" value="${escapeHTML(player.name)}"></label>
      <label>Character<select data-traveller-role="${escapeHTML(player.id)}">${travellerOptions(player.roleId)}</select></label>
      <label>Alignment<select data-traveller-alignment="${escapeHTML(player.id)}"><option value="good" ${player.alignment === "good" ? "selected" : ""}>Good</option><option value="evil" ${player.alignment === "evil" ? "selected" : ""}>Evil</option></select></label>
      <label>Phone<input data-traveller-phone="${escapeHTML(player.id)}" inputmode="tel" autocomplete="tel" value="${escapeHTML(player.phone)}" placeholder="Optional"></label>
      <button class="text-button remove-traveller" data-remove-traveller="${escapeHTML(player.id)}" type="button">Remove Traveller</button>
    </article>`).join("") : '<p class="empty-state">No Travellers added. They are extra players and do not alter the normal token distribution.</p>';

    const loricCards = OPTIONAL.loricIds.map(id => R[id]).filter(Boolean).map(role => `<label class="loric-card ${loricActive(role.id) ? "active" : ""}"><input type="checkbox" data-loric-toggle="${escapeHTML(role.id)}" ${loricActive(role.id) ? "checked" : ""}><span><strong>${escapeHTML(role.name)}</strong><small>${escapeHTML(role.ability)}</small></span></label>`).join("");
    const godOfUg = loricActive("godofug") ? `<label class="loric-setting">Current Ug-hat wearer<select data-ug-holder>${optionPlayers()}</select><small>Their raised hand defaults to +2 in the vote ledger.</small></label>` : "";
    const gardener = loricActive("gardener") ? `<div class="loric-setting"><strong>Gardener seat plan</strong><small>Assign every selected cast token exactly once.</small><div class="gardener-grid">${corePlayers().map(player => `<label>${escapeHTML(player.seat + ". " + player.name)}<select data-gardener-player="${escapeHTML(player.id)}">${gardenerRoleOptions(state.gardenerAssignments[player.id] || "")}</select></label>`).join("")}</div></div>` : "";
    const hindu = loricActive("hindu") ? `<label class="loric-setting">Hindu reincarnations completed<select data-hindu-count>${[0,1,2,3,4].map(number => `<option value="${number}" ${Number(state.loricState.hinduReincarnations) === number ? "selected" : ""}>${number} of 4</option>`).join("")}</select><small>After each qualifying death, edit that player and assign a same-alignment Traveller character.</small></label>` : "";

    container.innerHTML = `<div class="optional-control-grid">
      <section class="optional-section"><div class="optional-section-heading"><div><h3>Add a Traveller</h3><p>All official and current experimental Travellers are available. Suggested choices are listed first.</p></div><span class="count-badge">${travellers.length} added</span></div>
        <div class="traveller-add-grid"><label>Character<select id="new-traveller-role">${travellerOptions()}</select></label><label>Name<input id="new-traveller-name" placeholder="Traveller name"></label><label>Alignment<select id="new-traveller-alignment"><option value="good">Good</option><option value="evil">Evil</option></select></label><label>Phone<input id="new-traveller-phone" inputmode="tel" autocomplete="tel" placeholder="Optional"></label><button id="add-traveller" class="primary" type="button">Add Traveller</button></div>
        <div class="traveller-control-list">${travellerRows}</div>
      </section>
      <section class="optional-section"><div class="optional-section-heading"><div><h3>Loric modifiers</h3><p>Only the four requested public modifiers are available. Add all Loric at the start of the game.</p></div><span class="count-badge">${activeLorics.length} active</span></div><div class="loric-grid">${loricCards}</div>${godOfUg}${gardener}${hindu}</section>
    </div>`;
    const ugSelect = container.querySelector("[data-ug-holder]");
    if (ugSelect) ugSelect.value = state.loricState.ugHolder || "";
  }

  function renderSetup() {
    ensurePlayers();
    const meta = scriptMeta();
    $("#script-select").value = state.script;
    $("#player-count").value = state.playerCount;
    $("#player-count").max = isTeensyScript() ? "6" : "15";
    if (state.mode === "storyteller") {
      $("#twist-select").innerHTML = availableTwists().map(([value,label]) => `<option value="${value}" ${value === state.twist ? "selected" : ""}>${label}</option>`).join("");
      const profiles = castProfiles();
      const profile = activeCastProfile();
      state.castPreset = profile.id;
      $("#cast-preset-select").innerHTML = profiles.map(item => `<option value="${escapeHTML(item.id)}" ${item.id === profile.id ? "selected" : ""}>${escapeHTML(item.name)}</option>`).join("");
      $("#cast-preset-description").textContent = profile.description;
      $("#toymaker-row").hidden = !isSmallGame();
      $("#use-toymaker").checked = toymakerActive();
      const counts = effectiveCounts();
      $("#distribution-strip").innerHTML = TEAM_ORDER.map(team => `<span class="${team}"><strong>${counts[team]}</strong><small>${title(team)}</small></span>`).join("");
    } else {
      $("#twist-select").innerHTML = "";
      $("#cast-preset-select").innerHTML = "";
      $("#cast-preset-description").textContent = "";
      $("#toymaker-row").hidden = true;
      $("#distribution-strip").innerHTML = "";
    }
    $("#name-list").innerHTML = corePlayers().map(p => `<div class="name-row"><span>${p.seat}</span><label><span class="sr-only">Seat ${p.seat} name</span><input data-player-name="${p.id}" value="${escapeHTML(p.name)}" aria-label="Seat ${p.seat} name"></label>${state.mode === "storyteller" ? `<label class="phone-field"><span class="sr-only">${escapeHTML(p.name)} phone number</span><input data-player-phone="${p.id}" inputmode="tel" autocomplete="tel" value="${escapeHTML(p.phone)}" placeholder="Phone number" aria-label="${escapeHTML(p.name)} phone number"></label>` : ""}</div>`).join("");
    const travellerCount = extraTravellerPlayers().length;
    $("#setup-status").textContent = `${meta.name} · ${state.playerCount} players${travellerCount ? ` + ${travellerCount} Traveller${travellerCount === 1 ? "" : "s"}` : ""}`;
    $("#setup-eyebrow").textContent = state.mode === "storyteller" ? "Before the bag" : "Public information only";
    $("#setup-title").textContent = state.mode === "storyteller" ? "Build a legal, readable game" : "Set up a clean player notebook";
    $("#custom-script-status").textContent = state.customScript ? `${state.customScript.name}${state.customScript.author ? ` by ${state.customScript.author}` : ""} · ${state.customScript.ids.length} roles imported.` : "Official and included scripts loaded.";
    $("#cast-title").textContent = state.mode === "storyteller" ? "Selected cast" : "Script roster";
    $("#cast-description").textContent = state.mode === "storyteller" ? `${activeCastProfile().name}: ${activeCastProfile().description} Click a token to substitute another legal same-team role.` : "Public characters available on this script; this does not show which roles are in play.";
    renderOptionalCharacters(); renderCast(); renderHiddenSetup(); renderValidation(); renderBluffs(); renderDelivery();
  }

  function renderCast() {
    const board = $("#cast-board");
    if (state.mode === "player") {
      const byTeam = scriptRoles().reduce((groups, role) => {
        if (!groups[role.team]) groups[role.team] = [];
        groups[role.team].push(role);
        return groups;
      }, {});
      board.innerHTML = TEAM_ORDER.map(team => `<div class="team-row"><div class="team-label">${title(team)}</div><div class="token-list">${(byTeam[team] || []).map(r => `<span class="role-token ${team}">${escapeHTML(r.name)}</span>`).join("")}</div></div>`).join("");
      return;
    }
    if (!state.cast.length) { board.innerHTML = '<p class="empty-state">Choose a script and generate a recommended cast.</p>'; return; }
    board.innerHTML = TEAM_ORDER.map(team => {
      const tokens = state.cast.map((id,index) => ({ id,index })).filter(x => R[x.id]?.team === team);
      return `<div class="team-row"><div class="team-label">${title(team)}</div><div class="token-list">${tokens.map(x => `<button class="role-token ${team}" data-cast-index="${x.index}" title="Replace ${escapeHTML(roleName(x.id))}">${escapeHTML(roleName(x.id))}</button>`).join("") || "—"}</div></div>`;
    }).join("");
  }

  function renderValidation() {
    if (state.mode !== "storyteller") { $("#validation-list").innerHTML = ""; return; }
    $("#validation-list").innerHTML = setupIssues().map(([kind,text]) => `<div class="validation-item ${kind === "ok" ? "" : kind}">${escapeHTML(text)}</div>`).join("");
  }

  function renderBluffs() {
    const el = $("#bluff-plan");
    if (state.mode !== "storyteller") { el.innerHTML = ""; return; }
    if (isSmallGame() && !toymakerActive()) { el.className = "bluff-plan empty-state"; el.textContent = "In a five- or six-player game, evil gets no normal starting information and the Demon gets no bluffs. Enable Toymaker to restore both."; return; }
    if (!state.bluffs.length) { el.className = "bluff-plan empty-state"; el.textContent = state.cast.length ? "Generate legal not-in-play roles after selecting the cast." : "Generate a cast first."; return; }
    el.className = "bluff-plan";
    const official = state.bluffs.map(id => `<div class="bluff-card"><strong>${escapeHTML(roleName(id))}</strong><small>${escapeHTML(roleStrategy(R[id]).bluff)}</small></div>`).join("");
    const covers = state.players.filter(p => ["minion", "demon"].includes(R[p.roleId]?.team)).map(p => `<div class="bluff-card"><strong>${escapeHTML(p.name)} → ${escapeHTML(roleName(p.coverRole))}</strong><small>${R[p.roleId]?.team === "demon" ? "Demon cover; the three roles above are the official bluffs." : "Minion cover; communicate privately with the Demon."}</small></div>`).join("");
    el.innerHTML = `<h3>Demon sees</h3>${official}<h3>Evil cover allocation</h3>${covers || '<p>Assign roles to seats to allocate covers.</p>'}`;
  }

  function nightInstruction(role, timing) {
    const order = Number(role?.[timing] || 0);
    const reminder = String(role?.[`${timing}Reminder`] || "").replace(/:reminder:/g, "").replace(/\s+/g, " ").trim();
    if (!order && reminder) return `Wakes; this custom script does not number the order — ${reminder}`;
    if (!order) return "Does not normally wake.";
    return `Official wake position ${order}${reminder ? ` — ${reminder}` : "."}`;
  }

  function roleMessage(player) {
    const identity = perceivedIdentity(player);
    const role = identity.role;
    if (!role) return "";
    const meta = scriptMeta();
    const custom = state.script === "grimm" || state.script === "custom";
    const strategy = roleStrategy(role);
    const message = [
      `Blood on the Clocktower — private role for ${player.name}`,
      `Script: ${meta.name}${custom ? " (custom script)" : ""}${state.customScript?.author && state.script === "custom" ? ` by ${state.customScript.author}` : ""}`,
      `Seat: ${player.seat}`,
      `Role: ${role.name}`,
      `Alignment: ${identity.alignment}`,
      `Ability: ${role.ability}`,
      `Recommended first move: ${strategy.firstMove}`,
      `First night: ${nightInstruction(role, "firstNight")}`,
      `Other nights: ${nightInstruction(role, "otherNight")}`,
      "Keep this message private. Ask the Storyteller if any wording or timing is unclear."
    ];
    const activeLoricText = OPTIONAL.loricIds.filter(loricActive).map(id => `${roleName(id)} — ${R[id].ability}`);
    if (activeLoricText.length) message.splice(2, 0, `Public Loric modifiers:\n${activeLoricText.join("\n")}`);
    if (role.team === "traveller") {
      message.splice(6, 0, "Traveller rule: your character is public, your alignment is private, you may be exiled, and you do not replace a normal setup token.");
      if (identity.alignment === "evil") {
        const demon = state.players.find(candidate => R[candidate.roleId]?.team === "demon");
        if (demon) message.splice(7, 0, `The Demon is ${demon.name}. You do not learn the other evil players or receive Demon bluffs.`);
      }
    }
    if (isSmallGame()) {
      message.splice(4, 0, toymakerActive()
        ? "Public modifier: Toymaker is active. Evil receives normal starting information, and the Demon must skip one attack during the game."
        : "Small-game rule: normal Minion/Demon starting information is skipped, and the Demon receives no three bluffs.");
    }
    if (player.roleId === "lunatic" && !isSmallGame()) {
      const fakeMinions = String(state.hiddenSetup["lunatic.fakeMinions"] || "").trim();
      const fakeBluffs = String(state.hiddenSetup["lunatic.fakeBluffs"] || "").trim();
      if (fakeMinions) message.splice(5, 0, `Your Minions: ${fakeMinions}`);
      if (fakeBluffs) message.splice(6, 0, `Your three not-in-play bluffs: ${fakeBluffs}`);
    }
    if (strategy.enriched && role.play && role.play !== strategy.firstMove) message.splice(7, 0, `General plan: ${role.play}`);
    return message.join("\n\n");
  }

  function smsHref(player) {
    const phone = player.phone.trim().replace(/[^+\d]/g, "");
    const separator = /iPad|iPhone|iPod/i.test(navigator.userAgent) ? "&" : "?";
    return `sms:${encodeURIComponent(phone)}${separator}body=${encodeURIComponent(roleMessage(player))}`;
  }

  function renderDelivery() {
    const el = $("#delivery-list");
    if (!el) return;
    if (state.mode !== "storyteller") { el.innerHTML = ""; return; }
    const ready = state.players.filter(player => player.phone.trim() && player.roleId);
    if (!ready.length) {
      el.className = "delivery-list empty-state";
      el.textContent = "Add phone numbers and assign roles first.";
      return;
    }
    el.className = "delivery-list";
    el.innerHTML = ready.map(player => {
      const sent = state.deliveryLog?.[player.id];
      const issue = privateIdentityIssue(player);
      const identity = perceivedIdentity(player);
      const identityNote = identity.disguised && identity.role ? `${roleName(player.roleId)} → show ${identity.role.name}` : roleName(player.roleId);
      if (issue) return `<div class="delivery-card"><div><strong>${escapeHTML(player.name)} · ${escapeHTML(roleName(player.roleId))}</strong><small>${escapeHTML(player.phone)} · Complete hidden setup: ${escapeHTML(issue)}.</small></div></div>`;
      return `<div class="delivery-card ${sent ? "sent" : ""}"><div><strong>${escapeHTML(player.name)} · ${escapeHTML(identityNote)}</strong><small>${escapeHTML(player.phone)}${sent ? ` · draft opened ${new Date(sent).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}` : ""}</small></div><div class="delivery-actions"><button data-copy-role-message="${player.id}" type="button">Copy</button><a data-text-role="${player.id}" href="${escapeHTML(smsHref(player))}">Text role</a></div></div>`;
    }).join("");
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove();
    }
  }

  async function importCustomScript(file) {
    const payload = JSON.parse(await file.text());
    if (!Array.isArray(payload)) throw new Error("Script JSON must be an array");
    const meta = payload.find(item => item && typeof item === "object" && item.id === "_meta") || {};
    const customRoles = [];
    const ids = [];
    for (const item of payload) {
      if (item && typeof item === "object" && item.id === "_meta") continue;
      const id = typeof item === "string" ? item : item?.id;
      if (!id) continue;
      if (!R[id] && typeof item === "object" && item.name && item.team && item.ability) {
        const role = {
          id, name: item.name, team: item.team, ability: item.ability, edition: "custom",
          firstNight: Number(item.firstNight || 0), otherNight: Number(item.otherNight || 0),
          firstNightReminder: item.firstNightReminder || "", otherNightReminder: item.otherNightReminder || "",
          setup: Boolean(item.setup), reminders: item.reminders || [], scripts: ["custom"], tags: ["custom"],
          play: "Track the exact trigger, choice, and result for this custom ability; confirm ambiguous timing with the Storyteller before play.",
          bluff: "Reproduce the custom role's legal timing and keep a written history. Make sure every other player has access to the same ability wording.",
          story: "Write a ruling and timing procedure before setup. Custom abilities should be understandable, consistently resolved, and visible on every player's script."
        };
        customRoles.push(role); R[id] = role; ROLES.push(role);
      }
      if (R[id] && !ids.includes(id)) ids.push(id);
    }
    if (ids.length < 5) throw new Error("Fewer than five recognized roles were found");
    state.customScript = { name: meta.name || file.name.replace(/\.json$/i, "") || "Imported Custom Script", author: meta.author || "", ids, roles: customRoles };
    state.script = "custom"; state.twist = "none"; state.castPreset = SETUP.genericProfiles?.[0]?.id || "balanced"; state.cast = []; state.bluffs = []; state.rotation = 0; selectedStrategyRole = "";
    renderScriptOptions(); recommendCast();
    saveState(`Imported ${state.customScript.name}`);
  }

  function redactedState() {
    const clone = JSON.parse(JSON.stringify(state));
    clone.players.forEach(player => { player.phone = ""; player.privateNote = ""; player.coverRole = ""; });
    clone.deliveryLog = {};
    clone.hiddenSetup = {};
    clone.secrets = {};
    clone.bluffs = [];
    return clone;
  }

  function renderGrimoire() {
    if (state.mode !== "storyteller") { $("#grimoire-ring").innerHTML = ""; return; }
    const hidden = state.rolesHidden;
    $("#hide-roles").textContent = hidden ? "Show roles" : "Hide roles";
    $("#grimoire-ring").innerHTML = state.players.map(p => {
      const role = R[p.roleId];
      const team = role?.team || "traveller";
      return `<button class="player-card ${team} ${p.alive ? "" : "dead"}" data-edit-player="${p.id}" style="--team-color:var(--${team === "townsfolk" ? "good" : team})"><span class="seat">SEAT ${p.seat}</span><strong>${escapeHTML(p.name)}</strong><span class="role-name">${hidden ? "••••••" : escapeHTML(roleName(p.roleId))}</span><div class="status-chips">${p.statuses.map(s => `<span class="chip">${escapeHTML(s)}</span>`).join("")}${!p.deadVote && !p.alive ? '<span class="chip">vote spent</span>' : ""}${p.coverRole && !hidden ? `<span class="chip">cover: ${escapeHTML(roleName(p.coverRole))}</span>` : ""}</div></button>`;
    }).join("") || '<p class="empty-state">Assign roles from Setup.</p>';
  }

  function optionPlayers(includeBlank = true) {
    return `${includeBlank ? '<option value="">—</option>' : ""}${state.players.map(p => `<option value="${p.id}">${p.seat}. ${escapeHTML(p.name)}${p.alive ? "" : " †"}</option>`).join("")}`;
  }

  function phaseKey() { return `${state.phase}-${state.day}`; }
  function phaseText() { return state.phase === "firstNight" ? "First night" : state.phase === "night" ? `Night ${state.day}` : `Day ${state.day}`; }

  function renderRun() {
    if (state.mode !== "storyteller") {
      $("#night-queue").innerHTML = "";
      $("#timeline").innerHTML = "";
      $("#event-actor").innerHTML = "";
      $("#event-target").innerHTML = "";
      return;
    }
    $("#phase-label").textContent = phaseText();
    $("#day-label").textContent = `Day ${state.day}`;
    $("#event-type").innerHTML = EVENT_TYPES.map(x => `<option>${x}</option>`).join("");
    $("#event-actor").innerHTML = optionPlayers();
    $("#event-target").innerHTML = optionPlayers();
    renderQueue(); renderTimeline();
  }

  function renderPublicNightOrder(target = "#script-night-order") {
    const roles = [...scriptRoles(), ...extraTravellerPlayers().map(player => R[player.roleId]).filter(Boolean)].filter((role, index, values) => values.findIndex(item => item.id === role.id) === index);
    if (toymakerActive() && R.toymaker && !roles.some(role => role.id === "toymaker")) roles.push(R.toymaker);
    const column = (timing, heading) => {
      const waking = roles.filter(role => Number(role[timing]) > 0).sort((a,b) => Number(a[timing]) - Number(b[timing]));
      const sleeping = roles.filter(role => !Number(role[timing])).sort((a,b) => a.name.localeCompare(b.name));
      const items = values => values.map(role => `<div class="public-order-item" data-night="${timing}" data-role-id="${escapeHTML(role.id)}"><span class="order-position">${Number(role[timing]) || "—"}</span><div><strong>${escapeHTML(role.name)}</strong><p>${escapeHTML(role.ability)}</p><small>${escapeHTML(nightInstruction(role, timing))}</small></div></div>`).join("");
      return `<section class="night-order-column"><h2>${heading}</h2><p>${waking.length} wake · ${sleeping.length} do not normally wake</p><h3>Wakes in order</h3><div class="public-order-list">${items(waking)}</div><h3>Does not normally wake</h3><div class="public-order-list">${items(sleeping)}</div></section>`;
    };
    const board = $(target);
    if (board) board.innerHTML = column("firstNight", "First night") + column("otherNight", "Other nights");
  }

  function currentQueue() {
    if (state.phase === "day") return [];
    const timing = state.phase === "firstNight" ? "firstNight" : "otherNight";
    return state.players.filter(p => p.roleId && p.alive && Number(R[p.roleId]?.[timing]) > 0)
      .sort((a,b) => Number(R[a.roleId][timing]) - Number(R[b.roleId][timing]));
  }

  function renderQueue() {
    const queue = currentQueue();
    $("#night-queue").innerHTML = queue.length ? queue.map((p,i) => {
      const key = `${phaseKey()}-${p.id}`;
      return `<div class="queue-item ${state.queueDone[key] ? "done" : ""}"><strong>${i+1}</strong><div><b>${escapeHTML(roleName(p.roleId))} · ${escapeHTML(p.name)}</b><small>${escapeHTML(R[p.roleId].ability)}</small></div><button data-queue-done="${escapeHTML(key)}">${state.queueDone[key] ? "Undo" : "Done"}</button></div>`;
    }).join("") : `<p class="empty-state">${state.phase === "day" ? "Day phase: use the event log for public abilities, private advice, deaths, and rulings." : "No assigned living characters have a listed wake position."}</p>`;
  }

  function renderTimeline() {
    const sorted = [...state.events].reverse();
    $("#timeline").innerHTML = sorted.length ? sorted.map(e => `<div class="timeline-item"><time>${escapeHTML(e.phase)}</time><div><strong>${escapeHTML(title(e.type))}${e.actor ? ` · ${escapeHTML(playerName(e.actor))}` : ""}${e.target ? ` → ${escapeHTML(playerName(e.target))}` : ""}</strong><p>${escapeHTML(e.detail)}</p>${e.purpose ? `<p class="truth-${e.truth}">Purpose: ${escapeHTML(e.purpose)}</p>` : ""}</div><button data-delete-event="${e.id}" aria-label="Remove timeline entry only" title="Remove log entry only; edit the player separately to reverse a state change">×</button></div>`).join("") : '<p class="empty-state">No events recorded yet.</p>';
  }

  function addEvent(event) {
    const entry = { id: uid("e"), phase: phaseText(), at: new Date().toISOString(), truth: "na", purpose: "", ...event };
    state.events.push(entry);
    const target = state.players.find(p => p.id === entry.target);
    if (target && ["death","execution"].includes(entry.type)) target.alive = false;
    if (target && entry.type === "resurrection") { target.alive = true; target.deadVote = true; }
    if (target && entry.type === "poison" && !target.statuses.includes("poisoned")) target.statuses.push("poisoned");
    if (target && entry.type === "drunk" && !target.statuses.includes("drunk")) target.statuses.push("drunk");
    if (target && entry.type === "protection" && !target.statuses.includes("protected")) target.statuses.push("protected");
    saveState();
  }

  function advancePhase(back = false) {
    if (!back) {
      if (state.phase === "firstNight") state.phase = "day";
      else if (state.phase === "day") state.phase = "night";
      else { state.phase = "day"; state.day += 1; state.players.forEach(p => { p.statuses = p.statuses.filter(s => !["protected","mad"].includes(s)); }); }
    } else {
      if (state.phase === "night") state.phase = "day";
      else if (state.phase === "day" && state.day > 1) { state.day -= 1; state.phase = "night"; }
      else if (state.phase === "day") state.phase = "firstNight";
    }
    saveState(); renderAll();
  }

  function aliveCount() { return state.players.filter(p => p.alive).length; }
  function currentNominations() { return state.nominations.filter(n => n.day === state.day); }
  function currentBlock() {
    const noms = currentNominations().filter(n => n.qualifies);
    if (!noms.length) return null;
    const max = Math.max(...noms.map(n => n.total));
    const leaders = noms.filter(n => n.total === max);
    return leaders.length === 1 ? leaders[0] : null;
  }

  function renderVotes() {
    const threshold = Math.ceil(aliveCount() / 2);
    $("#vote-threshold").textContent = threshold;
    $("#nominator-select").innerHTML = optionPlayers(false);
    $("#nominee-select").innerHTML = optionPlayers(false);
    renderDeadVotes();
    const reminders = [
      loricActive("bigwig") ? "Big Wig: after a nomination, the nominee chooses the only speaker before voting; that speaker must be mad the nominee is good or might die." : "",
      loricActive("godofug") ? `${playerName(state.loricState.ugHolder)} currently wears the Ug hat and defaults to a two-vote hand.` : ""
    ].filter(Boolean);
    $("#voter-grid").innerHTML = `${reminders.length ? `<div class="vote-loric-note">${reminders.map(escapeHTML).join("<br>")}</div>` : ""}${state.players.map(p => {
      const ugVote = loricActive("godofug") && p.id === state.loricState.ugHolder;
      const deadVoteClass = p.alive ? "" : p.deadVote ? "dead-available" : "spent";
      const deadVoteLabel = p.alive ? "" : p.deadVote ? '<small>dead vote available</small>' : '<small>dead vote spent</small>';
      return `<div class="voter-check ${deadVoteClass}"><input type="checkbox" data-voter="${p.id}" ${!p.alive && !p.deadVote ? "disabled" : ""} aria-label="${escapeHTML(p.name)} votes"><span>${escapeHTML(p.name)}${p.alive ? "" : " †"}${ugVote ? " · Ug" : ""}${deadVoteLabel}</span><select data-vote-weight="${p.id}" aria-label="${escapeHTML(p.name)} vote weight"><option value="1" ${ugVote ? "" : "selected"}>+1</option><option value="2" ${ugVote ? "selected" : ""}>+2</option><option value="-1">−1</option><option value="3">+3</option></select></div>`;
    }).join("")}`;
    updateVoteTotal(); renderNominationList(); renderVoteMatrix();
  }

  function renderDeadVotes() {
    const list = $("#dead-vote-list");
    const summary = $("#dead-vote-summary");
    if (!list || !summary) return;
    if (state.mode !== "storyteller") { list.innerHTML = ""; summary.textContent = ""; return; }
    const dead = state.players.filter(player => !player.alive);
    const available = dead.filter(player => player.deadVote).length;
    summary.textContent = dead.length ? `${available} available · ${dead.length - available} spent` : "No dead players";
    list.innerHTML = dead.length ? dead.map(player => `<button type="button" class="dead-vote-card ${player.deadVote ? "available" : "spent"}" data-toggle-dead-vote="${escapeHTML(player.id)}" aria-pressed="${String(!player.deadVote)}"><span><strong>${escapeHTML(player.name)}</strong><small>${player.deadVote ? "Click when this player uses their vote" : "Click to restore if marked by mistake"}</small></span><b>${player.deadVote ? "AVAILABLE" : "SPENT"}</b></button>`).join("") : '<p class="empty-state">No one is dead yet. Dead players will appear here automatically.</p>';
  }

  function updateVoteTotal() {
    const total = $$('[data-voter]:checked').reduce((sum, box) => sum + Number($(`[data-vote-weight="${box.dataset.voter}"]`)?.value || 1), 0);
    $("#vote-total").textContent = total;
    return total;
  }

  function renderNominationList() {
    const noms = currentNominations();
    const block = currentBlock();
    $("#block-summary").textContent = block ? `${playerName(block.nominee)} on the block with ${block.total}` : noms.length ? "Vote tied · no one on block" : "No one on the block";
    $("#nomination-list").innerHTML = noms.length ? noms.map(n => `<div class="nomination-card"><strong>${escapeHTML(playerName(n.nominator))} → ${escapeHTML(playerName(n.nominee))}</strong><small>${n.total} votes · threshold ${n.threshold}${n.executed ? " · EXECUTED" : n.qualifies ? " · qualified" : " · short"}</small><p>${escapeHTML(n.case || "")}</p></div>`).join("") : '<p class="empty-state">No nominations recorded today.</p>';
  }

  function renderVoteMatrix() {
    const noms = currentNominations();
    $("#vote-matrix thead").innerHTML = `<tr><th>Voter</th>${noms.map(n => `<th>${escapeHTML(playerName(n.nominee))}</th>`).join("")}</tr>`;
    $("#vote-matrix tbody").innerHTML = state.players.map(p => `<tr><td>${escapeHTML(p.name)}</td>${noms.map(n => `<td>${n.votes[p.id] ?? "·"}</td>`).join("")}</tr>`).join("");
  }

  function renderIntel() {
    $("#claim-board").innerHTML = state.players.map(p => `<button class="claim-card" data-edit-player="${p.id}"><header><strong>${escapeHTML(p.name)}</strong><span>${p.trust}% good</span></header><div class="confidence"><span style="width:${p.trust}%"></span></div><p><b>Claim:</b> ${escapeHTML(p.claim || "unclaimed")}</p><p>${escapeHTML(p.publicNote || "No public notes")}</p></button>`).join("");
    const filter = $("#intel-filter").value;
    const entries = state.intel.filter(i => filter === "all" || i.truth === filter).reverse();
    $("#intel-ledger").innerHTML = entries.length ? entries.map(i => `<div class="intel-row"><span>${escapeHTML(i.phase)}</span><strong>${escapeHTML(playerName(i.source))}${i.subject ? ` → ${escapeHTML(playerName(i.subject))}` : ""}</strong><div><b>${escapeHTML(i.raw)}</b><br><span>${escapeHTML(i.interpretation || "")}</span>${i.tag ? `<br><small>${escapeHTML(i.tag)}</small>` : ""}</div><button data-delete-intel="${i.id}" class="truth-${i.truth}">${i.confidence}% · ${escapeHTML(i.truth)}</button></div>`).join("") : '<p class="empty-state">No information recorded.</p>';
    renderPlayerVoteHistory();
  }

  function renderPlayerVoteHistory() {
    const board = $("#player-vote-history");
    if (state.mode !== "player") { board.innerHTML = ""; return; }
    if (!state.nominations.length) { board.innerHTML = '<p class="empty-state">Record nominations and votes to build each player\'s history.</p>'; return; }
    board.innerHTML = state.players.map(player => {
      const made = state.nominations.filter(nomination => nomination.nominator === player.id).length;
      const received = state.nominations.filter(nomination => nomination.nominee === player.id).length;
      const voted = state.nominations.filter(nomination => Object.hasOwn(nomination.votes || {}, player.id)).length;
      const history = state.nominations.flatMap(nomination => {
        const actions = [];
        if (nomination.nominator === player.id) actions.push(`nominated ${playerName(nomination.nominee)}`);
        if (Object.hasOwn(nomination.votes || {}, player.id)) {
          const weight = Number(nomination.votes[player.id]);
          actions.push(`voted ${weight > 0 ? "+" : ""}${weight} on ${playerName(nomination.nominee)}`);
        }
        if (nomination.nominee === player.id) actions.push(`was nominated by ${playerName(nomination.nominator)} (${nomination.total}/${nomination.threshold}${nomination.executed ? ", executed" : nomination.qualifies ? ", qualified" : ", short"})`);
        return actions.length ? [`<li><strong>Day ${nomination.day}:</strong> ${escapeHTML(actions.join("; "))}</li>`] : [];
      });
      return `<article class="vote-history-card"><header><strong>${escapeHTML(player.name)}</strong><span>${voted} vote${voted === 1 ? "" : "s"} · ${made} nomination${made === 1 ? "" : "s"} made · ${received} received</span></header>${history.length ? `<ul>${history.join("")}</ul>` : '<p class="empty-state">No recorded vote or nomination activity.</p>'}</article>`;
    }).join("");
  }

  function duplicateClaims() {
    const groups = {};
    state.players.forEach(p => {
      const claim = p.claim.trim().toLowerCase();
      if (!claim) return;
      if (!groups[claim]) groups[claim] = [];
      groups[claim].push(p.name);
    });
    return Object.entries(groups).filter(([,names]) => names.length > 1).map(([claim,names]) => `${names.join(" and ")} both claim ${claim}`);
  }

  function suggestWorlds() {
    const needed = effectiveCounts().minion;
    const ranked = corePlayers().filter(player => R[player.roleId]?.team !== "traveller").sort((a,b) => a.trust - b.trust);
    const duplicates = duplicateClaims();
    state.worlds = ranked.slice(0, Math.min(6, ranked.length)).map((demon, index) => {
      const minions = ranked.filter(p => p.id !== demon.id).slice((index + 1) % Math.max(1,ranked.length - 1), (index + 1) % Math.max(1,ranked.length - 1) + needed).map(p => p.id);
      const evidence = state.intel.filter(i => i.subject === demon.id && i.truth === "false").map(i => i.raw).slice(0,2);
      const score = Math.max(10, Math.min(85, Math.round(72 - demon.trust * .55 - index * 3 + evidence.length * 8)));
      return { id: uid("w"), name: `World ${index + 1}: ${demon.name}`, demon: demon.id, minions, assumptions: duplicates[index % Math.max(1,duplicates.length)] || "Check setup count, misinformation source, and claim timing.", support: evidence.join("; ") || "Low trust relative to other current candidates.", contradictions: "What sober result or death pattern would rule this out?", confidence: score, suggested: true };
    });
    saveState("Candidate worlds suggested"); renderWorlds();
  }

  function renderWorlds() {
    $("#world-list").innerHTML = state.worlds.length ? [...state.worlds].sort((a,b) => b.confidence - a.confidence).map(w => `<article class="world-card"><header><div><span class="eyebrow">${w.suggested ? "Suggested" : "Tracked"}</span><h2>${escapeHTML(w.name)}</h2></div><span class="world-score">${w.confidence}</span></header><dl><dt>Demon</dt><dd>${escapeHTML(playerName(w.demon))}</dd><dt>Minions</dt><dd>${w.minions.map(playerName).map(escapeHTML).join(", ") || "—"}</dd><dt>Assumes</dt><dd>${escapeHTML(w.assumptions || "—")}</dd><dt>Supports</dt><dd>${escapeHTML(w.support || "—")}</dd><dt>Problems</dt><dd>${escapeHTML(w.contradictions || "—")}</dd></dl><div class="button-row"><button data-edit-world="${w.id}">Edit</button><button data-delete-world="${w.id}">Delete</button></div></article>`).join("") : '<p class="empty-state">Add at least three worlds: your leader, a serious alternative, and one where your most trusted premise fails.</p>';
  }

  function strategyPrimerMarkup(key) {
    const guide = STRATEGY.general?.[key];
    if (!guide) return "";
    return `<p class="eyebrow">${key === "good" ? "Good team" : "Evil team"}</p><h2>${escapeHTML(guide.title)}</h2><p class="primer-intro">${escapeHTML(guide.intro)}</p>${guide.sections.map(section => `<details><summary>${escapeHTML(section.title)}</summary><ul>${section.items.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul></details>`).join("")}`;
  }

  function strategyCardMarkup(role, featured = false) {
    const strategy = roleStrategy(role);
    const timing = `${nightInstruction(role, "firstNight")} ${nightInstruction(role, "otherNight")}`;
    const wiki = officialWikiUrl(role);
    const source = wiki ? `<section class="wiki-source"><h3>Official character guide</h3><p>Examples, Tips & Tricks, bluffing advice, and detailed interactions live on the official wiki.</p><a class="official-wiki-link" href="${escapeHTML(wiki)}" target="_blank" rel="noopener noreferrer">Open ${escapeHTML(role.name)} on the official wiki ↗</a></section>` : "";
    return `<${featured ? "article" : "details"} class="${featured ? "featured-role-card" : `strategy-entry ${role.team}`}" ${featured ? "" : ""}>${featured ? `<header><div><p class="eyebrow">${strategy.enriched ? "Transcript + official-wiki guide" : "Role guide"}</p><h2>${escapeHTML(role.name)}</h2><p>${escapeHTML(title(role.team))} · ${escapeHTML(role.ability)}</p></div><span class="role-token ${role.team}">${escapeHTML(role.name)}</span></header>` : `<summary><strong>${escapeHTML(role.name)}</strong><span>${escapeHTML(role.ability)}</span><em>${escapeHTML(title(role.team))}</em></summary>`}<div class="strategy-card-body"><section class="first-move"><h3>Do this first</h3><p>${escapeHTML(strategy.firstMove)}</p></section><section><h3>What to track</h3><ul>${strategy.priorities.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section><section><h3>When to reveal</h3><p>${escapeHTML(strategy.reveal)}</p></section><section><h3>Common traps</h3><ul>${strategy.pitfalls.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section><section><h3>Bluff / cover plan</h3><p>${escapeHTML(strategy.bluff)}</p></section><section><h3>Timing</h3><p>${escapeHTML(timing)}</p></section>${state.mode === "storyteller" ? `<section><h3>Storyteller note</h3><p>${escapeHTML(role.story)}</p></section>` : ""}${source}</div></${featured ? "article" : "details"}>`;
  }

  function renderStrategy() {
    const roles = scriptRoles(state.script, true);
    const validIds = new Set(roles.map(role => role.id));
    if (!validIds.has(selectedStrategyRole)) selectedStrategyRole = roles[0]?.id || "";
    const selector = $("#strategy-role-select");
    selector.innerHTML = TEAM_ORDER.concat("traveller").map(team => {
      const teamRoles = roles.filter(role => role.team === team);
      return teamRoles.length ? `<optgroup label="${escapeHTML(title(team))}">${teamRoles.map(role => `<option value="${escapeHTML(role.id)}">${escapeHTML(role.name)}</option>`).join("")}</optgroup>` : "";
    }).join("");
    selector.value = selectedStrategyRole;
    const selected = R[selectedStrategyRole] || roles[0];
    $("#featured-strategy").innerHTML = selected ? strategyCardMarkup(selected, true) : '<p class="empty-state">No recognized roles are available on this script.</p>';
    $("#good-strategy").innerHTML = strategyPrimerMarkup("good");
    $("#evil-strategy").innerHTML = strategyPrimerMarkup("evil");
    $("#strategy-library").innerHTML = roles.map(role => strategyCardMarkup(role)).join("") || '<p class="empty-state">No recognized roles are available.</p>';
    $("#strategy-sources").textContent = `Strategy synthesis: ${STRATEGY.sources.join(" · ")}. Character ability text and night order come from the official game data.`;
  }

  function renderRules() {
    $("#official-resource-links").innerHTML = SETUP.officialResources.map(([label, url]) => `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)} <span>↗</span></a>`).join("");
    const query = $("#rule-search").value.trim().toLowerCase();
    const rules = STRATEGY.rules.filter(rule => !query || [rule.title, rule.summary, ...rule.items].join(" ").toLowerCase().includes(query));
    $("#rules-index").innerHTML = rules.map(rule => `<a href="#rule-${escapeHTML(rule.id)}">${escapeHTML(rule.title)}</a>`).join("") || '<span>No matching topics</span>';
    $("#rules-reference").innerHTML = rules.map((rule, index) => `<details id="rule-${escapeHTML(rule.id)}" class="rule-entry" ${(expandAllRules || query || index === 0) ? "open" : ""}><summary><span>${String(index + 1).padStart(2,"0")}</span><div><strong>${escapeHTML(rule.title)}</strong><small>${escapeHTML(rule.summary)}</small></div></summary><ul>${rule.items.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul></details>`).join("") || '<p class="empty-state">No rules match that search.</p>';
    $("#expand-rules").textContent = expandAllRules ? "Collapse all" : "Expand all";
  }

  function renderReference() {
    const query = $("#role-search").value.trim().toLowerCase();
    const team = $("#role-team-filter").value;
    const currentOnly = $("#current-script-only").checked;
    const currentIds = new Set(scriptIds(state.script, true));
    OPTIONAL.loricIds.forEach(id => currentIds.add(id));
    if (toymakerActive()) currentIds.add("toymaker");
    const meta = scriptMeta();
    const roster = [...scriptRoles(state.script, true), ...OPTIONAL.loricIds.map(id => R[id]).filter(Boolean)];
    const counts = roster.reduce((result, role) => { result[role.team] = (result[role.team] || 0) + 1; return result; }, {});
    const scriptSource = meta.officialUrl || meta.wikiUrl;
    $("#script-guide-summary").innerHTML = `${escapeHTML(meta.name)}${meta.author ? ` by ${escapeHTML(meta.author)}` : ""} · ${escapeHTML(meta.level || "Script")} · ${escapeHTML(meta.theme || "")} · ${counts.townsfolk || 0} Townsfolk, ${counts.outsider || 0} Outsiders, ${counts.minion || 0} Minions, ${counts.demon || 0} Demons, ${counts.traveller || 0} optional Travellers, ${counts.loric || 0} available Loric.${toymakerActive() ? " Toymaker is active." : ""}${scriptSource ? ` <a class="official-wiki-link" href="${escapeHTML(scriptSource)}" target="_blank" rel="noopener noreferrer">Official script source ↗</a>` : ""}`;
    renderPublicNightOrder();
    const filtered = ROLES.filter(r => (!currentOnly || currentIds.has(r.id)) && (team === "all" || r.team === team) && (!query || [r.name,r.ability,r.firstNightReminder,r.otherNightReminder,r.story,...r.tags].join(" ").toLowerCase().includes(query)));
    $("#role-reference").innerHTML = filtered.map(r => { const wiki = officialWikiUrl(r); return `<details class="role-entry ${r.team}"><summary><strong>${escapeHTML(r.name)}</strong><span class="ability">${escapeHTML(r.ability)}</span><span>${escapeHTML(title(r.team))}</span></summary><div class="role-entry-content script-role-content"><section><h3>What the character does</h3><p>${escapeHTML(r.ability)}</p><p class="tag-line">${r.tags.map(tag => `<span class="chip">${escapeHTML(tag)}</span>`).join("")}</p>${wiki ? `<a class="official-wiki-link" href="${escapeHTML(wiki)}" target="_blank" rel="noopener noreferrer">Official ${escapeHTML(r.name)} guide ↗</a>` : ""}</section><section><h3>First night</h3><p>${escapeHTML(nightInstruction(r, "firstNight"))}</p></section><section><h3>Other nights</h3><p>${escapeHTML(nightInstruction(r, "otherNight"))}</p></section>${state.mode === "storyteller" ? `<section><h3>Storyteller handling</h3><p>${escapeHTML(r.story)}</p></section>` : ""}</div></details>`; }).join("") || '<p class="empty-state">No characters match.</p>';
  }

  function renderArchive() {
    if (state.mode !== "storyteller") {
      $("#game-summary").innerHTML = "";
      $("#postgame-notes").value = "";
      return;
    }
    const deaths = state.players.filter(p => !p.alive).length;
    const travellers = extraTravellerPlayers().length;
    $("#game-summary").innerHTML = `<p><strong>${escapeHTML(scriptMeta().name)}</strong> · ${state.playerCount} regular players${travellers ? ` + ${travellers} Traveller${travellers === 1 ? "" : "s"}` : ""}</p><p>Day ${state.day}, ${deaths} dead, ${state.events.length} events, ${state.nominations.length} nominations, ${state.intel.length} information entries, ${state.worlds.length} worlds.</p><p>Loric: ${state.lorics.map(roleName).map(escapeHTML).join(", ") || "none"}</p><p>Created ${new Date(state.createdAt).toLocaleString()}</p>`;
    $("#game-outcome").value = state.outcome;
    $("#postgame-notes").value = state.postgame;
  }

  function renderAll() {
    renderTop(); renderSetup(); renderGrimoire(); renderRun(); renderVotes(); renderIntel(); renderWorlds(); renderStrategy(); renderRules(); renderReference(); renderArchive(); renderTimer();
  }

  function showView(view) {
    currentView = viewAllowed(view) ? view : "setup";
    $$(".view").forEach(el => el.classList.toggle("active", el.id === `view-${currentView}`));
    $$("#main-nav button").forEach(el => el.classList.toggle("active", el.dataset.view === currentView));
    $("#app").focus({ preventScroll: true });
    history.replaceState(null, "", `#${currentView}`);
  }

  function playerEditor(playerId) {
    const p = state.players.find(x => x.id === playerId);
    if (!p) return;
    const rolePool = p.extraTraveller ? allTravellerRoles() : [...scriptRoles(), ...(loricActive("hindu") ? allTravellerRoles() : [])].filter((role, index, values) => values.findIndex(item => item.id === role.id) === index);
    const actualRole = state.mode === "storyteller" ? `<label>Actual role<select id="edit-role"><option value="">Unassigned</option>${rolePool.map(r => `<option value="${r.id}" ${r.id === p.roleId ? "selected" : ""}>${escapeHTML(r.name)} · ${title(r.team)}</option>`).join("")}</select></label><label>Actual alignment<select id="edit-alignment"><option value="unknown">Unknown</option><option value="good" ${p.alignment === "good" ? "selected" : ""}>Good</option><option value="evil" ${p.alignment === "evil" ? "selected" : ""}>Evil</option></select></label>` : "";
    $("#player-editor").innerHTML = `<div class="editor-fields"><h2>${escapeHTML(p.name)} · ${p.extraTraveller ? "extra Traveller" : `seat ${p.seat}`}</h2><div class="form-grid two">${actualRole}<label>Alive<select id="edit-alive"><option value="1" ${p.alive ? "selected" : ""}>Alive</option><option value="0" ${!p.alive ? "selected" : ""}>Dead</option></select></label><label>Dead vote<select id="edit-deadvote"><option value="1" ${p.deadVote ? "selected" : ""}>Available</option><option value="0" ${!p.deadVote ? "selected" : ""}>Spent</option></select></label></div><label>Current claim<input id="edit-claim" value="${escapeHTML(p.claim)}"></label><label>Claim history<textarea id="edit-claim-history" rows="3">${escapeHTML(p.claimHistory)}</textarea></label><label>Confidence this player is good: <output id="trust-output">${p.trust}%</output><input id="edit-trust" type="range" min="0" max="100" value="${p.trust}"></label><fieldset><legend>States & reminders</legend><div class="status-picker">${STATUS_OPTIONS.map(s => `<label><input type="checkbox" data-edit-status="${s}" ${p.statuses.includes(s) ? "checked" : ""}>${s}</label>`).join("")}</div></fieldset><label>Public / player note<textarea id="edit-public" rows="3">${escapeHTML(p.publicNote)}</textarea></label>${state.mode === "storyteller" ? `<label>Private Storyteller note<textarea id="edit-private" rows="3">${escapeHTML(p.privateNote)}</textarea></label>` : ""}<button id="save-player-edit" class="primary" type="button">Save player</button></div>`;
    $("#edit-trust").addEventListener("input", e => $("#trust-output").textContent = `${e.target.value}%`);
    $("#save-player-edit").addEventListener("click", () => {
      if (state.mode === "storyteller") { p.roleId = $("#edit-role").value; p.alignment = $("#edit-alignment").value; }
      p.alive = $("#edit-alive").value === "1"; p.deadVote = $("#edit-deadvote").value === "1";
      p.claim = $("#edit-claim").value.trim(); p.claimHistory = $("#edit-claim-history").value.trim(); p.trust = Number($("#edit-trust").value);
      p.statuses = $$('[data-edit-status]:checked').map(x => x.dataset.editStatus); p.publicNote = $("#edit-public").value.trim();
      if (state.mode === "storyteller") p.privateNote = $("#edit-private").value.trim();
      saveState("Player updated"); $("#player-dialog").close(); renderAll();
    });
    $("#player-dialog").showModal();
  }

  function openIntelDialog() {
    $("#intel-editor").innerHTML = `<div class="editor-fields"><h2>Add information</h2><div class="form-grid two"><label>Phase<input id="intel-phase" value="${escapeHTML(phaseText())}"></label><label>Source<select id="intel-source">${optionPlayers()}</select></label></div><label>Subject<select id="intel-subject">${optionPlayers()}</select></label><label>Raw information<textarea id="intel-raw" rows="2" required placeholder="Exact words, number, gesture, or result"></textarea></label><label>Interpretation<textarea id="intel-interpretation" rows="2"></textarea></label><div class="form-grid two"><label>Status<select id="intel-truth"><option value="unreliable">Unreliable / unknown</option><option value="true">Marked true</option><option value="false">Marked false</option></select></label><label>Confidence<input id="intel-confidence" type="number" min="0" max="100" value="60"></label></div><label>Contradiction / evidence tag<input id="intel-tag" placeholder="e.g. conflicts with N2 death pattern"></label><button class="primary" type="submit">Save information</button></div>`;
    $("#intel-dialog").showModal();
  }

  function openWorldDialog(worldId = "") {
    const w = state.worlds.find(x => x.id === worldId) || { id: "", name: "", demon: "", minions: [], assumptions: "", support: "", contradictions: "", confidence: 50 };
    const minionChecks = state.players.map(p => `<label><input type="checkbox" data-world-minion="${p.id}" ${w.minions.includes(p.id) ? "checked" : ""}>${escapeHTML(p.name)}</label>`).join("");
    $("#world-editor").innerHTML = `<div class="editor-fields"><h2>${w.id ? "Edit" : "Add"} possible world</h2><input id="world-id" type="hidden" value="${w.id}"><label>Name<input id="world-name" value="${escapeHTML(w.name)}" required placeholder="e.g. Poisoner–Imp world"></label><label>Demon candidate<select id="world-demon">${optionPlayers()} </select></label><fieldset><legend>Minion candidates</legend><div class="status-picker">${minionChecks}</div></fieldset><label>Required assumptions<textarea id="world-assumptions" rows="2">${escapeHTML(w.assumptions)}</textarea></label><label>Supporting evidence<textarea id="world-support" rows="2">${escapeHTML(w.support)}</textarea></label><label>Contradictions / tests<textarea id="world-contradictions" rows="2">${escapeHTML(w.contradictions)}</textarea></label><label>Confidence / ranking score<input id="world-confidence" type="range" min="0" max="100" value="${w.confidence}"></label><button class="primary" type="submit">Save world</button></div>`;
    $("#world-demon").value = w.demon;
    $("#world-dialog").showModal();
  }

  function startHandoff() {
    if (!state.players.every(p => p.roleId)) { toast("Assign roles before private handoff"); return; }
    const unresolved = state.players.find(player => privateIdentityIssue(player));
    if (unresolved) { toast(`Complete hidden setup for ${unresolved.name}: ${privateIdentityIssue(unresolved)}`); return; }
    handoffIndex = 0; renderHandoff(false); $("#handoff-dialog").showModal();
  }

  function renderHandoff(revealed) {
    const p = state.players[handoffIndex];
    if (!p) { $("#handoff-content").innerHTML = `<div class="handoff-screen"><div><h2>Distribution complete</h2><p>Return the device to the Storyteller.</p><button id="handoff-finish" class="primary">Close</button></div></div>`; $("#handoff-finish").onclick = () => $("#handoff-dialog").close(); return; }
    if (!revealed) {
      $("#handoff-content").innerHTML = `<div class="handoff-screen"><div><p class="eyebrow">Seat ${p.seat}</p><h2>Pass to ${escapeHTML(p.name)}</h2><p>Make sure only this player can see the screen.</p><button id="reveal-role" class="primary large">Reveal role</button></div></div>`;
      $("#reveal-role").onclick = () => renderHandoff(true);
    } else {
      const identity = perceivedIdentity(p);
      const role = identity.role;
      if (!role) { handoffIndex += 1; renderHandoff(false); return; }
      const strategy = roleStrategy(role);
      $("#handoff-content").innerHTML = `<div class="handoff-screen"><div class="role-reveal ${role.team}"><p class="eyebrow">You are</p><strong>${escapeHTML(role.name)}</strong><p>${escapeHTML(role.ability)}</p><p>Alignment: <b>${escapeHTML(identity.alignment)}</b></p><div class="handoff-strategy"><h3>Recommended first move</h3><p>${escapeHTML(strategy.firstMove)}</p><small>The Player Strategy tab has the full guide, reveal timing, common traps, and bluff plan.</small></div><button id="hide-next" class="primary large">Hide & next player</button></div></div>`;
      $("#hide-next").onclick = () => { handoffIndex += 1; renderHandoff(false); };
    }
  }

  function download(name, text, type = "application/json") {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function markdownReport() {
    const meta = scriptMeta();
    const cast = state.players.map(p => `- Seat ${p.seat}: **${p.name}** — ${roleName(p.roleId)} (${p.alignment}), ${p.alive ? "alive" : "dead"}`).join("\n");
    const events = state.events.map(e => `- **${e.phase} · ${title(e.type)}:** ${e.actor ? playerName(e.actor) : "ST"}${e.target ? ` → ${playerName(e.target)}` : ""} — ${e.detail}`).join("\n") || "- None";
    const noms = state.nominations.map(n => `- Day ${n.day}: ${playerName(n.nominator)} → ${playerName(n.nominee)}, ${n.total} votes${n.executed ? ", executed" : ""}`).join("\n") || "- None";
    return `---\ntags: [botc, game-review]\n---\n# ${meta.name} — ${new Date(state.createdAt).toLocaleDateString()}\n\n## Result\n\n${state.outcome}\n\n## Cast\n\n${cast}\n\n## Timeline\n\n${events}\n\n## Nominations\n\n${noms}\n\n## Review\n\n${state.postgame || "Add observations here."}\n`;
  }

  function bindEvents() {
    $("#main-nav").addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) showView(b.dataset.view); });
    $("#mode-select").addEventListener("change", e => { state.mode = e.target.value; if (!viewAllowed(currentView)) currentView = "setup"; saveState(); renderAll(); showView(currentView); });
    $("#script-select").addEventListener("change", e => {
      state.script = e.target.value;
      state.twist = "none";
      state.castPreset = (SETUP.castProfiles[state.script] || SETUP.genericProfiles || [])[0]?.id || "balanced";
      if (isTeensyScript() && state.playerCount > 6) state.playerCount = 6;
      state.rotation = 0; state.cast = []; state.bluffs = []; selectedStrategyRole = "";
      queueSave(); recommendCast();
    });
    const applyPlayerCount = value => {
      const number = Number(value);
      const maximum = isTeensyScript() ? 6 : 15;
      if (!Number.isFinite(number) || number < 5 || number > maximum) return;
      state.playerCount = Math.round(number);
      ensurePlayers();
      recommendCast();
    };
    $("#player-count").addEventListener("input", e => {
      clearTimeout(countUpdateTimer);
      const value = e.target.value;
      countUpdateTimer = setTimeout(() => applyPlayerCount(value), 260);
    });
    $("#player-count").addEventListener("change", e => { clearTimeout(countUpdateTimer); applyPlayerCount(e.target.value); });
    $("#twist-select").addEventListener("change", e => { state.twist = e.target.value; recommendCast(); });
    $("#cast-preset-select").addEventListener("change", e => { state.castPreset = e.target.value; state.rotation = 0; recommendCast(); });
    $("#use-toymaker").addEventListener("change", e => {
      state.toymaker = e.target.checked;
      state.bluffs = [];
      state.players.forEach(player => { if (["minion", "demon"].includes(R[player.roleId]?.team)) player.coverRole = ""; });
      saveState(e.target.checked ? "Toymaker enabled" : "Toymaker disabled");
      renderAll();
    });
    $("#generate-cast").addEventListener("click", () => recommendCast(false));
    $("#randomize-cast").addEventListener("click", () => recommendCast(true));
    $("#shuffle-seats").addEventListener("click", () => { const regular = corePlayers(); const names = shuffle(regular.map(p => p.name)); regular.forEach((p,i) => p.name = names[i]); saveState("Names shuffled"); renderAll(); });
    $("#name-list").addEventListener("input", e => {
      const playerId = e.target.dataset.playerName || e.target.dataset.playerPhone;
      if (!playerId) return;
      const p = state.players.find(x => x.id === playerId);
      if (!p) return;
      if (e.target.dataset.playerName) p.name = e.target.value;
      if (e.target.dataset.playerPhone) p.phone = e.target.value;
      queueSave();
      if (e.target.dataset.playerPhone) renderDelivery();
    });
    $("#optional-characters").addEventListener("click", e => {
      if (e.target.closest("#add-traveller")) {
        const roleId = $("#new-traveller-role")?.value || OPTIONAL.travellerIds[0];
        if (!R[roleId] || R[roleId].team !== "traveller") { toast("Choose a Traveller character"); return; }
        const traveller = blankPlayer(state.players.length + 1, true);
        traveller.name = $("#new-traveller-name")?.value.trim() || `Traveller ${extraTravellerPlayers().length + 1}`;
        traveller.phone = $("#new-traveller-phone")?.value.trim() || "";
        traveller.roleId = roleId;
        traveller.alignment = $("#new-traveller-alignment")?.value === "evil" ? "evil" : "good";
        state.players.push(traveller);
        ensurePlayers();
        if (loricActive("godofug") && !state.loricState.ugHolder) state.loricState.ugHolder = traveller.id;
        saveState(`${traveller.name} added as ${roleName(roleId)}`);
        renderAll();
        return;
      }
      const remove = e.target.closest("[data-remove-traveller]");
      if (remove) {
        const traveller = state.players.find(player => player.id === remove.dataset.removeTraveller && player.extraTraveller);
        if (!traveller || !confirm(`Remove ${traveller.name} from this game? Existing timeline entries will remain.`)) return;
        state.players = state.players.filter(player => player.id !== traveller.id);
        if (state.loricState.ugHolder === traveller.id) state.loricState.ugHolder = "";
        ensurePlayers(); saveState("Traveller removed"); renderAll();
      }
    });
    $("#optional-characters").addEventListener("input", e => {
      const playerId = e.target.dataset.travellerName || e.target.dataset.travellerPhone;
      if (!playerId) return;
      const player = state.players.find(candidate => candidate.id === playerId && candidate.extraTraveller);
      if (!player) return;
      if (e.target.dataset.travellerName) player.name = e.target.value;
      if (e.target.dataset.travellerPhone) player.phone = e.target.value;
      queueSave();
    });
    $("#optional-characters").addEventListener("change", e => {
      const loricId = e.target.dataset.loricToggle;
      if (loricId) {
        if (e.target.checked && !state.lorics.includes(loricId)) state.lorics.push(loricId);
        if (!e.target.checked) state.lorics = state.lorics.filter(id => id !== loricId);
        if (loricId === "godofug") state.loricState.ugHolder = e.target.checked ? (state.loricState.ugHolder || state.players[0]?.id || "") : "";
        if (loricId === "gardener") state.gardenerAssignments = e.target.checked ? Object.fromEntries(corePlayers().map((player, index) => [player.id, state.cast[index] || ""])) : {};
        if (loricId === "hindu" && !e.target.checked) state.loricState.hinduReincarnations = 0;
        saveState(e.target.checked ? `${roleName(loricId)} enabled` : `${roleName(loricId)} disabled`);
        renderAll();
        return;
      }
      if (e.target.dataset.travellerRole || e.target.dataset.travellerAlignment) {
        const playerId = e.target.dataset.travellerRole || e.target.dataset.travellerAlignment;
        const player = state.players.find(candidate => candidate.id === playerId && candidate.extraTraveller);
        if (!player) return;
        if (e.target.dataset.travellerRole) player.roleId = e.target.value;
        if (e.target.dataset.travellerAlignment) player.alignment = e.target.value;
        saveState("Traveller updated"); renderAll();
        return;
      }
      if (e.target.dataset.ugHolder !== undefined) {
        state.loricState.ugHolder = e.target.value;
        saveState("Ug-hat wearer updated"); renderAll();
        return;
      }
      if (e.target.dataset.gardenerPlayer) {
        state.gardenerAssignments[e.target.dataset.gardenerPlayer] = e.target.value;
        saveState("Gardener seat plan updated"); renderAll();
        return;
      }
      if (e.target.dataset.hinduCount !== undefined) {
        state.loricState.hinduReincarnations = Math.max(0, Math.min(4, Number(e.target.value) || 0));
        saveState("Hindu tracker updated"); renderAll();
      }
    });
    $("#custom-script-import").addEventListener("change", async e => {
      const file = e.target.files[0];
      if (!file) return;
      try { await importCustomScript(file); }
      catch (err) { toast(`Could not import script: ${err.message}`); }
      e.target.value = "";
    });
    $("#cast-board").addEventListener("click", e => { const b = e.target.closest("[data-cast-index]"); if (b) cycleCastRole(Number(b.dataset.castIndex)); });
    $("#validate-setup").addEventListener("click", () => { renderValidation(); toast(setupIsLegal() ? "Setup is legal" : "Setup needs attention"); });
    $("#hidden-setup-list").addEventListener("input", e => {
      const key = e.target.dataset.hiddenSetup;
      if (!key) return;
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      state.hiddenSetup[key] = value;
      syncLegacySecret(key, value);
      queueSave();
      renderValidation();
    });
    $("#make-bluffs").addEventListener("click", makeBluffs);
    $("#assign-roles").addEventListener("click", assignRoles);
    $("#start-handoff").addEventListener("click", startHandoff);
    $("#prepare-messages").addEventListener("click", () => {
      const assigned = state.players.filter(player => player.roleId);
      const ready = assigned.filter(player => player.phone.trim() && !privateIdentityIssue(player));
      renderDelivery();
      if (!assigned.length) toast("Assign roles before preparing messages");
      else if (!ready.length) toast("Add at least one phone number");
      else if (assigned.some(player => player.phone.trim() && privateIdentityIssue(player))) toast(`${ready.length} draft${ready.length === 1 ? "" : "s"} ready; complete hidden identities for the remaining players`);
      else toast(`${ready.length} private message draft${ready.length === 1 ? "" : "s"} ready`);
    });
    $("#delivery-list").addEventListener("click", async e => {
      const copyButton = e.target.closest("[data-copy-role-message]");
      if (copyButton) {
        const player = state.players.find(item => item.id === copyButton.dataset.copyRoleMessage);
        if (player && !privateIdentityIssue(player)) { await copyText(roleMessage(player)); toast(`Copied ${player.name}'s role message`); }
        return;
      }
      const textLink = e.target.closest("[data-text-role]");
      if (!textLink) return;
      state.deliveryLog[textLink.dataset.textRole] = new Date().toISOString();
      saveState();
      setTimeout(renderDelivery, 250);
    });
    $("#clear-phones").addEventListener("click", () => {
      if (!confirm("Clear every saved phone number and the draft-opened log from this game?")) return;
      state.players.forEach(player => { player.phone = ""; });
      state.deliveryLog = {};
      saveState("Phone numbers cleared");
      renderSetup();
    });
    $("#hide-roles").addEventListener("click", () => { state.rolesHidden = !state.rolesHidden; renderGrimoire(); });
    document.addEventListener("click", e => { const b = e.target.closest("[data-edit-player]"); if (b) playerEditor(b.dataset.editPlayer); });
    $("#previous-phase").addEventListener("click", () => advancePhase(true));
    $("#next-phase").addEventListener("click", () => advancePhase(false));
    $("#timer-toggle").addEventListener("click", toggleTimer);
    $("#timer-reset").addEventListener("click", resetTimer);
    $("#timer-duration").addEventListener("change", e => {
      stopTimerInterval();
      state.timer.durationSeconds = Math.max(60, Number(e.target.value) || 300);
      state.timer.remainingSeconds = state.timer.durationSeconds;
      state.timer.running = false;
      state.timer.endsAt = null;
      clearTimerAlert(); saveState(); renderTimer();
    });
    $("#timer-sound").addEventListener("change", e => { state.timer.sound = e.target.checked; if (state.timer.sound) primeTimerAudio(); saveState(); renderTimer(); });
    $("#timer-notification").addEventListener("change", async e => {
      if (e.target.checked && !("Notification" in window)) { e.target.checked = false; toast("Device notifications are not supported here"); }
      if (e.target.checked && Notification.permission === "default") {
        try { e.target.checked = (await Notification.requestPermission()) === "granted"; } catch { e.target.checked = false; }
      }
      if (e.target.checked && Notification.permission === "denied") { e.target.checked = false; toast("Device notifications are blocked in browser settings"); }
      state.timer.notification = e.target.checked; saveState(); renderTimer();
    });
    $("#timer-message").addEventListener("input", e => { state.timer.message = e.target.value; queueSave(); renderTimerMessaging(); });
    $("#timer-copy-message").addEventListener("click", async () => { await copyText(timerReminderText()); toast("Return reminder copied"); });
    $("#timer-alert-copy").addEventListener("click", async () => { await copyText(timerReminderText()); toast("Return reminder copied"); });
    $("#timer-alert-chime").addEventListener("click", playTimerChime);
    $("#timer-alert-dialog").addEventListener("close", clearTimerAlert);
    [$("#timer-text-now"), $("#timer-alert-text-all")].forEach(link => link.addEventListener("click", e => { if (!timerPhonePlayers().length) { e.preventDefault(); toast("Add player phone numbers in Setup first"); } }));
    $("#refresh-queue").addEventListener("click", renderQueue);
    $("#night-queue").addEventListener("click", e => { const b = e.target.closest("[data-queue-done]"); if (!b) return; const k = b.dataset.queueDone; state.queueDone[k] = !state.queueDone[k]; queueSave(); renderQueue(); });
    $("#event-form").addEventListener("submit", e => { e.preventDefault(); addEvent({ type: $("#event-type").value, actor: $("#event-actor").value, target: $("#event-target").value, detail: $("#event-detail").value.trim(), truth: $("#event-truth").value, purpose: $("#event-purpose").value.trim() }); e.target.reset(); renderAll(); });
    $("#timeline").addEventListener("click", e => { const b = e.target.closest("[data-delete-event]"); if (!b) return; state.events = state.events.filter(x => x.id !== b.dataset.deleteEvent); saveState("Event removed"); renderAll(); });
    $("#voter-grid").addEventListener("change", updateVoteTotal);
    $("#dead-vote-list").addEventListener("click", e => {
      const button = e.target.closest("[data-toggle-dead-vote]");
      if (!button) return;
      const player = state.players.find(candidate => candidate.id === button.dataset.toggleDeadVote && !candidate.alive);
      if (!player) return;
      player.deadVote = !player.deadVote;
      saveState(`${player.name}'s dead vote marked ${player.deadVote ? "available" : "spent"}`);
      renderVotes(); renderGrimoire();
    });
    $("#nomination-form").addEventListener("submit", e => {
      e.preventDefault();
      const nominator = $("#nominator-select").value, nominee = $("#nominee-select").value;
      if (!nominator || !nominee || nominator === nominee) { toast("Choose two different players"); return; }
      if (currentNominations().some(n => n.nominator === nominator)) { toast("That player already nominated today"); return; }
      if (currentNominations().some(n => n.nominee === nominee)) { toast("That player was already nominated today"); return; }
      const votes = {}; $$('[data-voter]:checked').forEach(box => { votes[box.dataset.voter] = Number($(`[data-vote-weight="${box.dataset.voter}"]`).value); });
      const threshold = Math.ceil(aliveCount()/2), total = Object.values(votes).reduce((a,b) => a+b,0), before = currentBlock();
      const qualifies = total >= threshold && (!before || total >= before.total);
      const executed = $("#mark-executed").checked;
      const n = { id: uid("n"), day: state.day, nominator, nominee, case: $("#nomination-case").value.trim(), votes, threshold, total, qualifies, executed };
      state.nominations.push(n);
      Object.keys(votes).forEach(id => { const p = state.players.find(x => x.id === id); if (p && !p.alive) p.deadVote = false; });
      addEvent({ type: "nomination", actor: nominator, target: nominee, detail: `${total} votes (threshold ${threshold})${executed ? "; executed" : ""}` });
      if (executed) { const p = state.players.find(x => x.id === nominee); if (p) p.alive = false; addEvent({ type: "execution", actor: "", target: nominee, detail: "Executed after nominations closed" }); }
      e.target.reset(); saveState("Nomination recorded"); renderAll();
    });
    $("#add-intel").addEventListener("click", openIntelDialog);
    $("#intel-form").addEventListener("submit", e => { e.preventDefault(); state.intel.push({ id: uid("i"), phase: $("#intel-phase").value, source: $("#intel-source").value, subject: $("#intel-subject").value, raw: $("#intel-raw").value.trim(), interpretation: $("#intel-interpretation").value.trim(), truth: $("#intel-truth").value, confidence: Number($("#intel-confidence").value), tag: $("#intel-tag").value.trim() }); saveState("Information recorded"); $("#intel-dialog").close(); renderAll(); });
    $("#intel-filter").addEventListener("change", renderIntel);
    $("#intel-ledger").addEventListener("click", e => { const b = e.target.closest("[data-delete-intel]"); if (!b) return; state.intel = state.intel.filter(x => x.id !== b.dataset.deleteIntel); saveState("Information removed"); renderIntel(); });
    $("#add-world").addEventListener("click", () => openWorldDialog());
    $("#suggest-worlds").addEventListener("click", suggestWorlds);
    $("#world-form").addEventListener("submit", e => { e.preventDefault(); const id = $("#world-id").value || uid("w"); const world = { id, name: $("#world-name").value.trim(), demon: $("#world-demon").value, minions: $$('[data-world-minion]:checked').map(x => x.dataset.worldMinion), assumptions: $("#world-assumptions").value.trim(), support: $("#world-support").value.trim(), contradictions: $("#world-contradictions").value.trim(), confidence: Number($("#world-confidence").value), suggested: false }; const index = state.worlds.findIndex(x => x.id === id); if (index >= 0) state.worlds[index] = world; else state.worlds.push(world); saveState("World saved"); $("#world-dialog").close(); renderWorlds(); });
    $("#world-list").addEventListener("click", e => { const edit = e.target.closest("[data-edit-world]"); const del = e.target.closest("[data-delete-world]"); if (edit) openWorldDialog(edit.dataset.editWorld); if (del) { state.worlds = state.worlds.filter(x => x.id !== del.dataset.deleteWorld); saveState("World removed"); renderWorlds(); } });
    $("#strategy-role-select").addEventListener("change", e => { selectedStrategyRole = e.target.value; renderStrategy(); });
    $("#rule-search").addEventListener("input", renderRules);
    $("#expand-rules").addEventListener("click", () => { expandAllRules = !expandAllRules; renderRules(); });
    [["#role-search","input"],["#role-team-filter","change"],["#current-script-only","change"]].forEach(([s,event]) => $(s).addEventListener(event, renderReference));
    $("#game-outcome").addEventListener("change", e => { state.outcome = e.target.value; queueSave(); });
    $("#postgame-notes").addEventListener("input", e => { state.postgame = e.target.value; queueSave(); });
    $("#export-game").addEventListener("click", () => download(`ravenswood-${state.script}-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(state,null,2)));
    $("#export-redacted").addEventListener("click", () => download(`ravenswood-${state.script}-redacted-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(redactedState(),null,2)));
    $("#export-report").addEventListener("click", () => download(`clocktower-review-${new Date().toISOString().slice(0,10)}.md`, markdownReport(), "text/markdown"));
    $("#import-game").addEventListener("change", async e => { const file = e.target.files[0]; if (!file) return; try { const parsed = JSON.parse(await file.text()); if (!parsed.players || !parsed.script) throw new Error("Invalid save"); stopTimerInterval(); state = { ...freshState(), ...parsed, loricState: { ...freshState().loricState, ...(parsed.loricState || {}) }, timer: { ...freshState().timer, ...(parsed.timer || {}) }, secrets: { ...freshState().secrets, ...(parsed.secrets || {}) }, hiddenSetup: { ...(parsed.hiddenSetup || {}) }, gardenerAssignments: { ...(parsed.gardenerAssignments || {}) } }; ensurePlayers(); hydrateCustomRoles(); renderScriptOptions(); saveState("Game imported"); renderAll(); if (state.timer.running && state.timer.endsAt) beginTimerInterval(); } catch (err) { toast(`Could not import: ${err.message}`); } e.target.value = ""; });
    $("#new-game").addEventListener("click", () => { if (!confirm("Start a new blank game? Export first if you need this record.")) return; stopTimerInterval(); clearTimerAlert(); state = freshState(); ensurePlayers(); recommendCast(); showView("setup"); });
    $("#quick-save").addEventListener("click", () => saveState("Game saved locally"));
    $$('[data-close]').forEach(b => b.addEventListener("click", () => $(`#${b.dataset.close}`).close()));
  }

  function init() {
    let timerExpiredWhileAway = false;
    state.timer.durationSeconds = Math.max(60, Number(state.timer.durationSeconds) || 300);
    state.timer.remainingSeconds = Math.max(0, Number(state.timer.remainingSeconds) || 0);
    if (state.timer.running && state.timer.endsAt) {
      state.timer.remainingSeconds = Math.max(0, Math.ceil((Number(state.timer.endsAt) - Date.now()) / 1000));
      if (!state.timer.remainingSeconds) timerExpiredWhileAway = true;
    } else {
      state.timer.running = false;
      state.timer.endsAt = null;
      if (!state.timer.remainingSeconds) state.timer.remainingSeconds = state.timer.durationSeconds;
    }
    ensurePlayers();
    hydrateCustomRoles();
    if (state.script === "custom" && !state.customScript) state.script = "tb";
    renderScriptOptions();
    if (!state.cast.length) recommendCast();
    bindEvents();
    renderAll();
    if (timerExpiredWhileAway) finishTimer();
    else if (state.timer.running) beginTimerInterval();
    const hash = location.hash.slice(1);
    if (hash && $(`#view-${hash}`)) showView(hash);
  }

  init();
})();
