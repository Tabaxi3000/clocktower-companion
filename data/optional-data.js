(() => {
  "use strict";

  const data = window.BOTC_DATA;
  const strategy = window.BOTC_STRATEGY;
  const setup = window.BOTC_SETUP;
  if (!data || !strategy || !setup) return;

  const optionalRoles = [
    {
      id: "cacklejack", name: "Cacklejack", team: "traveller",
      ability: "Each day, choose a player: a different player changes character tonight.",
      edition: "experimental", firstNight: 0, otherNight: 1, setup: false,
      firstNightReminder: "", otherNightReminder: "A player other than the protected player changes character. This may be resolved wherever it best fits the night order.",
      reminders: ["Not Me"], scripts: [], tags: ["traveller", "character change", "day choice"],
      play: "Ask which players need to keep their abilities, choose one of them as protected, and record that choice every day. After each night, ask who appears to have changed.",
      bluff: "Your character is public, so your hidden information is your alignment. If evil, protect players whose current abilities help evil and make Storyteller-created changes look suspicious.",
      story: "Record the protected player each day. On every night except the first, change a different player into a different character and immediately give any start-knowing information the new character requires."
    },
    {
      id: "gangster", name: "Gangster", team: "traveller",
      ability: "Once per day, you may choose to kill an alive neighbor, if your other alive neighbor agrees.",
      edition: "experimental", firstNight: 0, otherNight: 0, setup: false,
      firstNightReminder: "", otherNightReminder: "", reminders: ["Used Today"], scripts: [], tags: ["traveller", "day ability", "death"],
      play: "Identify your two living neighbors before proposing a kill. Get the required agreement in front of the Storyteller, and use the extra death only when it improves your team's position.",
      bluff: "Your character is public. If evil, make a harmful kill look like a cautious consensus decision and keep the Demon from becoming one of your two living neighbors.",
      story: "Skip dead seats when finding the two living neighbors. Confirm the agreement, resolve the death immediately, and mark the ability used even if the target survives."
    },
    {
      id: "gnome", name: "Gnome", team: "traveller",
      ability: "All players start knowing a player of your alignment. You may choose to kill anyone who nominates them.",
      edition: "experimental", firstNight: 0, otherNight: 0, setup: true,
      firstNightReminder: "", otherNightReminder: "", reminders: ["Amigo"], scripts: [], tags: ["traveller", "public information", "nomination", "death"],
      play: "The announced player is your amigo and shares your starting alignment. Decide before each nomination whether killing their nominator helps your team; the nomination still proceeds.",
      bluff: "Your character and amigo are public, but your alignment is private. If evil, use the threat of an immediate kill to insulate an evil amigo or to make a good amigo look protected by evil.",
      story: "Choose a player with the Gnome's alignment and announce that player to everyone before play. If the Gnome invokes the ability after that player is nominated, kill the nominator immediately and continue the nomination."
    },
    {
      id: "bigwig", name: "Big Wig", team: "loric",
      ability: "Each nominee chooses a player: until voting, only they may speak & they are mad the nominee is good or they might die.",
      edition: "loric", firstNight: 0, otherNight: 0, setup: false,
      firstNightReminder: "", otherNightReminder: "", reminders: [], scripts: [], tags: ["loric", "nomination", "madness", "public"],
      play: "Public Storyteller modifier; it is not assigned to a player.", bluff: "Public Storyteller modifier; it is not a bluff.",
      story: "After each nomination, have the nominee select the only player allowed to speak before voting. That speaker must be mad that the nominee is good or may be executed."
    },
    {
      id: "gardener", name: "Gardener", team: "loric",
      ability: "The Storyteller assigns all players' characters.",
      edition: "loric", firstNight: 0, otherNight: 0, setup: false,
      firstNightReminder: "", otherNightReminder: "", reminders: [], scripts: [], tags: ["loric", "setup", "public"],
      play: "Public Storyteller modifier; it is not assigned to a player.", bluff: "Public Storyteller modifier; it is not a bluff.",
      story: "Assign every regular player's character deliberately. The Companion verifies that the seat plan uses the selected cast exactly once."
    },
    {
      id: "godofug", name: "God of Ug", team: "loric",
      ability: "One Ug hat. When wear Ug hat, must speak one sound at a time but vote twice. If fail, pass Ug hat.",
      edition: "loric", firstNight: 0, otherNight: 0, setup: false,
      firstNightReminder: "", otherNightReminder: "", reminders: ["Ug Hat"], scripts: [], tags: ["loric", "voting", "speech", "public"],
      play: "Public Storyteller modifier; it is not assigned to a player.", bluff: "Public Storyteller modifier; it is not a bluff.",
      story: "Choose the first hat wearer. Their raised hand counts as two votes. Move the hat when they break the one-sound-at-a-time restriction or when the table's fun requires it."
    },
    {
      id: "hindu", name: "Hindu", team: "loric",
      ability: "The first 4 players to die are immediately reincarnated as Travellers of the same alignment.",
      edition: "loric", firstNight: 0, otherNight: 0, setup: false,
      firstNightReminder: "", otherNightReminder: "", reminders: ["Reincarnated 1", "Reincarnated 2", "Reincarnated 3", "Reincarnated 4"], scripts: [], tags: ["loric", "death", "traveller", "public"],
      play: "Public Storyteller modifier; it is not assigned to a player.", bluff: "Public Storyteller modifier; it is not a bluff.",
      story: "For each of the first four deaths, immediately give that player a Traveller character while preserving alignment. Record the new public character and the private alignment."
    }
  ];

  optionalRoles.forEach(role => {
    if (!data.roles.some(existing => existing.id === role.id)) data.roles.push(role);
  });

  const travellerIds = data.roles.filter(role => role.team === "traveller").map(role => role.id);
  const recommendedTravellers = {
    tb: ["thief", "bureaucrat", "gunslinger", "beggar", "scapegoat"],
    bmr: ["matron", "judge", "apprentice", "bishop", "voudon"],
    snv: ["barista", "harlot", "butcher", "bonecollector", "deviant"],
    grimm: ["thief", "harlot", "judge", "beggar", "scapegoat"],
    ngj: ["bureaucrat", "gunslinger", "beggar", "scapegoat", "gnome"],
    overriver: ["matron", "judge", "apprentice", "gangster", "voudon"],
    luf: ["barista", "harlot", "bonecollector", "deviant", "cacklejack"],
    custom: []
  };

  window.BOTC_OPTIONAL = {
    travellerIds,
    loricIds: ["bigwig", "gardener", "godofug", "hindu"],
    recommendedTravellers
  };

  setup.hiddenSetup.gnome = [
    { key: "amigo", label: "Gnome amigo", type: "player", required: true, help: "Choose a player of the Gnome's alignment and announce this player to everyone before play." }
  ];
  setup.hiddenSetup.apprentice = [
    { key: "grantedAbility", label: "Apprentice ability", type: "text", required: true, help: "Record the Townsfolk ability for a good Apprentice or Minion ability for an evil Apprentice." }
  ];

  if (!setup.officialResources.some(([label]) => label === "Loric")) {
    setup.officialResources.splice(13, 0, ["Loric", "https://wiki.bloodontheclocktower.com/Loric"]);
  }

  const optionalRule = {
    id: "travellers-loric", title: "Travellers and Loric modifiers",
    summary: "Travellers are extra public player characters with private alignment; Loric are public Storyteller rules that alter the whole game.",
    items: [
      "Travellers may join or leave at any time. Their character is public and their alignment is private. They are extra seats and never replace a normal setup token.",
      "An evil Traveller learns the Demon, but does not learn other evil players and receives no Demon bluffs. Travellers are exiled rather than executed and do not count toward evil's two-players-alive victory condition.",
      "Loric are announced and added at the start. They are not players, cannot die, cannot become drunk or poisoned, and are immune to all game effects.",
      "Multiple Loric may be used, but their interactions can be difficult. This Companion offers only Big Wig, Gardener, God of Ug, and Hindu.",
      "Gardener assigns every regular seat deliberately. God of Ug gives the current hat wearer a two-vote hand. Hindu turns the first four players who die into same-alignment Travellers."
    ]
  };
  if (!strategy.rules.some(rule => rule.id === optionalRule.id)) strategy.rules.push(optionalRule);

  Object.assign(strategy.roles, {
    cacklejack: {
      firstMove: "Ask who most wants to keep their current character, then protect one player from the night's forced change.",
      priorities: ["Record your protected player every day.", "Ask who changed after each night.", "Separate a character change from an alignment change."],
      reveal: "Your role is public. Decide whether to make each daily choice publicly or privately based on what your team gains.",
      pitfalls: ["Assuming the changed player must be alive or good.", "Forgetting that a new start-knowing character receives its information."],
      bluff: "If evil, protect abilities useful to evil and help an evil player conceal a beneficial change."
    },
    gangster: {
      firstMove: "Learn the claims of your two living neighbors before asking either one to approve a kill.",
      priorities: ["Recalculate neighbors after every death.", "Get clear consent in front of the Storyteller.", "Remember the ability is spent for the day even if the target survives."],
      reveal: "Your role is public; explain the reasoning for a proposed kill before forcing a quick decision.",
      pitfalls: ["Counting dead players as neighbors.", "Treating a Gangster death as an execution."],
      bluff: "If evil, use an evil neighbor's consent to remove a good player while presenting it as a mutual test."
    },
    gnome: {
      firstMove: "Write down your publicly announced amigo and remember that they shared your alignment only when the game began.",
      priorities: ["Listen for nominations of the amigo.", "Choose deliberately whether to kill the nominator.", "Keep later alignment changes separate from the starting link."],
      reveal: "Your role and amigo are public; your private alignment is the uncertain part.",
      pitfalls: ["Waiting for the Storyteller to prompt the kill.", "Assuming the amigo's alignment can never change."],
      bluff: "If evil, make the public protection relationship look like evidence that the amigo is good."
    }
  });
})();
