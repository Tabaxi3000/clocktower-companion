(() => {
  "use strict";

  const data = window.BOTC_DATA;
  const strategy = window.BOTC_STRATEGY;
  if (!data) return;

  const additions = [
    {
      id: "balloonist", name: "Balloonist", team: "townsfolk",
      ability: "Each night, you learn a player of a different character type than last night. [+0 or +1 Outsider]",
      edition: "carousel", firstNight: 66, otherNight: 85, setup: true,
      firstNightReminder: "Point to any player. Mark them KNOW.",
      otherNightReminder: "Point to a player with a different character type from the previously shown player. Move KNOW.",
      reminders: ["Know"], scripts: ["luf"], tags: ["information", "setup"],
      play: "Write down the player shown each night and the character type each new result must have. Do not assume the shown player is sober, truthful, or the only player of that type.",
      bluff: "Prepare a legal sequence across character types before claiming results. Your Outsider-count story must match whether you claim the +1 setup option.",
      story: "Choose whether the Balloonist adds an Outsider before the bag. Each sober result must move to a different character type from the previous result."
    },
    {
      id: "widow", name: "Widow", team: "minion",
      ability: "On your 1st night, look at the Grimoire & choose a player: they are poisoned. 1 good player knows a Widow is in play.",
      edition: "carousel", firstNight: 34, otherNight: 0, setup: false,
      firstNightReminder: "Show the Grimoire. The Widow chooses a player to poison. Then wake the marked good player and show the Widow token.",
      otherNightReminder: "", reminders: ["Poisoned", "Know"], scripts: ["luf"], tags: ["poison", "information"],
      play: "Use the Grimoire view to identify which information source is most valuable to disrupt, then build a cover that explains why your conversations are unusually targeted.",
      bluff: "If good, a public Widow claim can explain suspicious information but also invites execution. If evil, remember exactly which player you poisoned and which good player received the warning.",
      story: "Give enough time to study the Grimoire, record the poisoned player, and choose one good player to learn that a Widow is in play. Do not identify the Widow."
    },
    {
      id: "goblin", name: "Goblin", team: "minion",
      ability: "If you publicly claim to be the Goblin when nominated & are executed that day, your team wins.",
      edition: "carousel", firstNight: 0, otherNight: 0, setup: false,
      firstNightReminder: "", otherNightReminder: "", reminders: ["Claimed"], scripts: ["luf"], tags: ["social", "execution"],
      play: "Save the explicit Goblin claim for a nomination where the threat changes the vote. A casual claim at another time does not satisfy the ability.",
      bluff: "Any player may bluff Goblin to discourage execution, but doing so spends trust. Be exact: the claim must be public, while nominated, and followed by execution that day for the real ability to win.",
      story: "Mark a valid public claim made while the Goblin is nominated. If that Goblin is executed that day while sober and healthy, evil wins immediately."
    },
    {
      id: "leviathan", name: "Leviathan", team: "demon",
      ability: "If more than 1 good player is executed, evil wins. All players know you are in play. After day 5, evil wins.",
      edition: "carousel", firstNight: 79, otherNight: 99, setup: false,
      firstNightReminder: "Announce that the Leviathan is in play and mark Day 1.",
      otherNightReminder: "Advance the day reminder and announce the Leviathan if needed.",
      reminders: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Good Player Executed"], scripts: ["luf"], tags: ["execution", "public"],
      play: "Track the day and every executed player's actual alignment. Good has very few safe executions, so your strongest defense is making two plausible Demon candidates survive until the final vote.",
      bluff: "A Leviathan can take a risky good-role bluff because night death patterns cannot expose it. Coordinate doubt around executions without making the Minion's protection look too obvious.",
      story: "Announce Leviathan publicly, track days exactly, and track good executions rather than total executions. End the game after a second good execution or once day five has passed as the ability specifies."
    },
    {
      id: "toymaker", name: "Toymaker", team: "fabled",
      ability: "The Demon may choose not to attack & must do this at least once per game. Evil players get normal starting info.",
      edition: "fabled", firstNight: 4, otherNight: 3, setup: false,
      firstNightReminder: "Resolve Minion Info and Demon Info even with fewer than seven players.",
      otherNightReminder: "If a Demon attack could end the game and the required no-attack night has not happened, do not wake the Demon.",
      reminders: ["Final Night: No Attack"], scripts: [], tags: ["fabled", "teensyville"],
      play: "This is a public Storyteller modifier rather than a player role.",
      bluff: "This is a public Storyteller modifier rather than a player bluff.",
      story: "Give normal evil starting information. Track whether the Demon has chosen not to attack; force the skipped attack before an otherwise game-ending attack if necessary."
    }
  ];

  additions.forEach(role => {
    if (!data.roles.some(existing => existing.id === role.id)) data.roles.push(role);
  });

  Object.assign(data.scripts, {
    ngj: ["clockmaker", "investigator", "empath", "chambermaid", "artist", "sage", "drunk", "klutz", "scarletwoman", "baron", "imp"],
    overriver: ["grandmother", "clockmaker", "innkeeper", "snakecharmer", "professor", "slayer", "lunatic", "recluse", "godfather", "spy", "imp"],
    luf: ["balloonist", "savant", "amnesiac", "fisherman", "artist", "cannibal", "mutant", "lunatic", "widow", "goblin", "leviathan"]
  });

  Object.assign(data.scriptMeta, {
    ngj: {
      name: "No Greater Joy", level: "Teensyville · beginner",
      theme: "A gentle next step after Trouble Brewing, with clear information and familiar poisoning and setup puzzles.",
      author: "Steven Medway", officialUrl: "https://bloodontheclocktower.com/pages/custom-scripts", wikiUrl: "https://wiki.bloodontheclocktower.com/Teensyville", teensyville: true
    },
    overriver: {
      name: "Over the River", level: "Teensyville · intermediate",
      theme: "Identity, registration, survival, and Demon uncertainty around Grandmother, Spy, Recluse, and Lunatic.",
      author: "Andrew Nathenson", officialUrl: "https://bloodontheclocktower.com/pages/custom-scripts", wikiUrl: "https://wiki.bloodontheclocktower.com/Teensyville", teensyville: true
    },
    luf: {
      name: "Laissez un Faire", level: "Teensyville · advanced",
      theme: "A long-form five- or six-player information puzzle built around Leviathan, Widow, Lunatic, and high-stakes execution choices.",
      author: "Steven Medway", officialUrl: "https://bloodontheclocktower.com/pages/teensyville-laissez-un-faire", wikiUrl: "https://wiki.bloodontheclocktower.com/Teensyville", teensyville: true
    }
  });

  Object.assign(data.scriptMeta.tb, { wikiUrl: "https://wiki.bloodontheclocktower.com/Trouble_Brewing" });
  Object.assign(data.scriptMeta.bmr, { wikiUrl: "https://wiki.bloodontheclocktower.com/Bad_Moon_Rising" });
  Object.assign(data.scriptMeta.snv, { wikiUrl: "https://wiki.bloodontheclocktower.com/Sects_%26_Violets" });
  Object.assign(data.scriptMeta.grimm, { officialUrl: "https://bloodontheclocktower.com/pages/custom-scripts" });

  const balanced = (name, description, priorities = {}) => ({ id: "balanced", name, description, priorities });
  window.BOTC_SETUP = {
    teensyScripts: ["ngj", "overriver", "luf"],
    officialResources: [
      ["Wiki home", "https://wiki.bloodontheclocktower.com/Main_Page"],
      ["Rules explanation", "https://wiki.bloodontheclocktower.com/Rules_Explanation"],
      ["Glossary", "https://wiki.bloodontheclocktower.com/Glossary"],
      ["Setup", "https://wiki.bloodontheclocktower.com/Setup"],
      ["Abilities", "https://wiki.bloodontheclocktower.com/Abilities"],
      ["States", "https://wiki.bloodontheclocktower.com/States"],
      ["Player strategy", "https://wiki.bloodontheclocktower.com/Player_Strategy"],
      ["Storyteller advice", "https://wiki.bloodontheclocktower.com/Storyteller_Advice"],
      ["Teensyville", "https://wiki.bloodontheclocktower.com/Teensyville"],
      ["Trouble Brewing", "https://wiki.bloodontheclocktower.com/Trouble_Brewing"],
      ["Bad Moon Rising", "https://wiki.bloodontheclocktower.com/Bad_Moon_Rising"],
      ["Sects & Violets", "https://wiki.bloodontheclocktower.com/Sects_%26_Violets"],
      ["Travellers", "https://wiki.bloodontheclocktower.com/Travellers"],
      ["Fabled", "https://wiki.bloodontheclocktower.com/Fabled"],
      ["Experimental characters", "https://wiki.bloodontheclocktower.com/Experimental"],
      ["Script Tool guide", "https://wiki.bloodontheclocktower.com/Script_Tool"],
      ["Official script collection", "https://bloodontheclocktower.com/pages/custom-scripts"]
    ],
    castProfiles: {
      tb: [
        balanced("Balanced fundamentals", "A readable mix of starting information, ongoing information, protection, and public tests.", { townsfolk: ["washerwoman","chef","empath","fortuneteller","undertaker","monk","ravenkeeper","virgin","slayer","soldier","mayor","librarian","investigator"], outsider: ["butler","recluse","saint","drunk"], minion: ["poisoner","scarletwoman","spy","baron"], demon: ["imp"] }),
        { id: "deduction", name: "Deduction web", description: "More cross-checkable information, with enough registration and drunkenness to prevent mechanical certainty.", priorities: { townsfolk: ["investigator","librarian","chef","empath","fortuneteller","undertaker","ravenkeeper","virgin","monk","slayer","mayor","soldier","washerwoman"], outsider: ["drunk","recluse","butler","saint"], minion: ["spy","poisoner","scarletwoman","baron"], demon: ["imp"] } },
        { id: "social", name: "Social pressure", description: "Public tests, survival claims, and claim-timing decisions matter more than a dense information chain.", priorities: { townsfolk: ["virgin","slayer","mayor","ravenkeeper","monk","soldier","empath","undertaker","chef","fortuneteller","washerwoman","librarian","investigator"], outsider: ["saint","butler","recluse","drunk"], minion: ["scarletwoman","poisoner","spy","baron"], demon: ["imp"] } }
      ],
      bmr: [
        balanced("Balanced mortality", "A mix of protection, extra death, resurrection, and information that leaves several plausible causes for each night.", { townsfolk: ["grandmother","chambermaid","gambler","exorcist","gossip","innkeeper","courtier","professor","tealady","sailor","minstrel","fool","pacifist"], outsider: ["moonchild","tinker","lunatic","goon"], minion: ["devilsadvocate","assassin","mastermind","godfather"], demon: ["pukka","po","shabaloth","zombuul"] }),
        { id: "death-puzzle", name: "Death puzzle", description: "Leans into extra deaths, failed deaths, resurrection, and competing explanations for the night record.", priorities: { townsfolk: ["gossip","gambler","professor","grandmother","exorcist","chambermaid","courtier","innkeeper","tealady","sailor","minstrel","fool","pacifist"], outsider: ["tinker","moonchild","lunatic","goon"], minion: ["assassin","mastermind","devilsadvocate","godfather"], demon: ["shabaloth","po","pukka","zombuul"] } },
        { id: "survival", name: "Protection & survival", description: "More players can survive, prevent, or reinterpret death, making execution timing and cause-of-death logs essential.", priorities: { townsfolk: ["innkeeper","tealady","fool","sailor","pacifist","exorcist","courtier","professor","chambermaid","grandmother","minstrel","gambler","gossip"], outsider: ["goon","lunatic","moonchild","tinker"], minion: ["devilsadvocate","mastermind","assassin","godfather"], demon: ["pukka","zombuul","po","shabaloth"] } }
      ],
      snv: [
        balanced("Balanced information", "A broad information network with one strong misinformation source and room for character changes.", { townsfolk: ["clockmaker","dreamer","flowergirl","towncrier","oracle","savant","seamstress","artist","juggler","sage","mathematician","philosopher","snakecharmer"], outsider: ["sweetheart","mutant","barber","klutz"], minion: ["witch","cerenovus","eviltwin"], demon: ["nodashii","vortox","fanggu","vigormortis"] }),
        { id: "madness", name: "Madness & public claims", description: "Cerenovus, Mutant, and public-information roles make exact wording and claim behavior central.", priorities: { townsfolk: ["juggler","artist","savant","towncrier","flowergirl","dreamer","oracle","seamstress","clockmaker","mathematician","sage","philosopher","snakecharmer"], outsider: ["mutant","klutz","sweetheart","barber"], minion: ["cerenovus","witch","eviltwin"], demon: ["vortox","nodashii","fanggu","vigormortis"] } },
        { id: "identity", name: "Identity changes", description: "Philosopher, Snake Charmer, Barber, Fang Gu, and Vigormortis create worlds where role or alignment can move.", priorities: { townsfolk: ["snakecharmer","philosopher","dreamer","sage","seamstress","oracle","savant","mathematician","clockmaker","flowergirl","towncrier","artist","juggler"], outsider: ["barber","sweetheart","klutz","mutant"], minion: ["eviltwin","witch","cerenovus"], demon: ["fanggu","vigormortis","nodashii","vortox"] } }
      ],
      grimm: [
        balanced("Controlled chorus", "Keeps variable death and experimental abilities legible while still showing the script's major threats.", { townsfolk: ["general","towncrier","gambler","exorcist","innkeeper","nightwatchman","fisherman","slayer","soldier","minstrel","cannibal","villageidiot","amnesiac"], outsider: ["damsel","drunk","golem","politician"], minion: ["assassin","scarletwoman","godfather","summoner"], demon: ["pukka","ojo","po","yaggababble"] }),
        { id: "explosive", name: "Explosive deaths", description: "Po, Yaggababble, Assassin, Gambler, and Golem create a volatile death ledger that rewards exact timing notes.", priorities: { townsfolk: ["gambler","innkeeper","exorcist","minstrel","cannibal","general","towncrier","fisherman","slayer","soldier","nightwatchman","villageidiot","amnesiac"], outsider: ["golem","politician","damsel","drunk"], minion: ["assassin","godfather","scarletwoman","summoner"], demon: ["po","yaggababble","ojo","pukka"] } },
        { id: "experimental", name: "Experimental puzzle", description: "Amnesiac, Village Idiot, Fisherman, and Cannibal maximize discovery and Storyteller judgment.", priorities: { townsfolk: ["amnesiac","villageidiot","fisherman","cannibal","general","towncrier","nightwatchman","gambler","exorcist","innkeeper","slayer","soldier","minstrel"], outsider: ["drunk","damsel","politician","golem"], minion: ["summoner","godfather","scarletwoman","assassin"], demon: ["ojo","pukka","yaggababble","po"] } }
      ],
      ngj: [
        balanced("First Teensyville game", "Direct, cross-checkable information with Scarlet Woman safety and no Outsider at five players.", { townsfolk: ["clockmaker","investigator","empath","chambermaid","artist","sage"], outsider: ["drunk","klutz"], minion: ["scarletwoman","baron"], demon: ["imp"] }),
        { id: "cross-check", name: "Cross-checking", description: "Front-loads information that can be compared across seats and nights.", priorities: { townsfolk: ["investigator","clockmaker","empath","chambermaid","artist","sage"], outsider: ["drunk","klutz"], minion: ["scarletwoman","baron"], demon: ["imp"] } },
        { id: "late-game", name: "Late-game tension", description: "Sage and Artist preserve decisive information while Chambermaid and Empath develop over time.", priorities: { townsfolk: ["sage","artist","chambermaid","empath","clockmaker","investigator"], outsider: ["klutz","drunk"], minion: ["scarletwoman","baron"], demon: ["imp"] } }
      ],
      overriver: [
        balanced("Identity puzzle", "Grandmother and Clockmaker anchor a game complicated by Spy, Recluse, Lunatic, and Snake Charmer.", { townsfolk: ["grandmother","clockmaker","innkeeper","snakecharmer","professor","slayer"], outsider: ["lunatic","recluse"], minion: ["spy","godfather"], demon: ["imp"] }),
        { id: "registration", name: "Registration maze", description: "Prioritizes Spy and Recluse interactions and information whose apparent source may be misleading.", priorities: { townsfolk: ["grandmother","clockmaker","slayer","professor","innkeeper","snakecharmer"], outsider: ["recluse","lunatic"], minion: ["spy","godfather"], demon: ["imp"] } },
        { id: "survival", name: "Survival & reversal", description: "Innkeeper, Professor, Snake Charmer, and Lunatic make survival and identity changes the center of play.", priorities: { townsfolk: ["innkeeper","professor","snakecharmer","grandmother","slayer","clockmaker"], outsider: ["lunatic","recluse"], minion: ["godfather","spy"], demon: ["imp"] } }
      ],
      luf: [
        balanced("Information web", "Savant, Balloonist, and Artist build a long information trail while Goblin and Widow keep executions dangerous.", { townsfolk: ["savant","balloonist","artist","fisherman","amnesiac","cannibal"], outsider: ["mutant","lunatic"], minion: ["widow","goblin"], demon: ["leviathan"] }),
        { id: "storyteller", name: "Storyteller puzzle", description: "Amnesiac, Fisherman, Savant, and Cannibal give the Storyteller more ways to shape a difficult but solvable trail.", priorities: { townsfolk: ["amnesiac","fisherman","savant","cannibal","artist","balloonist"], outsider: ["lunatic","mutant"], minion: ["widow","goblin"], demon: ["leviathan"] } },
        { id: "bluff-pressure", name: "Bluff pressure", description: "Balloonist, Mutant, Lunatic, and Goblin reward layered claims and punish casual executions.", priorities: { townsfolk: ["balloonist","savant","cannibal","artist","amnesiac","fisherman"], outsider: ["mutant","lunatic"], minion: ["goblin","widow"], demon: ["leviathan"] } }
      ]
    },
    genericProfiles: [
      { id: "balanced", name: "Balanced", description: "Keeps the imported script's published order and standard category mix.", tagOrder: [] },
      { id: "information", name: "Information-first", description: "Prioritizes information and confirmation roles before filling the remaining legal slots.", tagOrder: ["information", "confirmation", "detection"] },
      { id: "social", name: "Social & protection", description: "Prioritizes social, protection, survival, and execution-facing roles.", tagOrder: ["social", "protection", "survival", "execution"] }
    ],
    hiddenSetup: {
      fortuneteller: [{ key: "redHerring", label: "Fortune Teller red herring", type: "player", required: true, help: "Choose one good player who registers as the Demon only to the Fortune Teller." }],
      drunk: [{ key: "coverRole", label: "Role shown to the Drunk", type: "role", roleFilter: "townsfolkOutOfPlay", required: true, help: "Show a not-in-play Townsfolk token and simulate that ability." }],
      grandmother: [{ key: "grandchild", label: "Grandmother's grandchild", type: "player", required: true, help: "Record the good player and show their actual character to the Grandmother." }],
      lunatic: [
        { key: "believedDemon", label: "Demon shown to the Lunatic", type: "role", roleFilter: "demon", required: true, help: "The Lunatic believes they have this Demon ability." },
        { key: "fakeMinions", label: "Fake Minion team shown", type: "textarea", minPlayers: 7, required: true, help: "At seven or more players, record the players shown as Minions." },
        { key: "fakeBluffs", label: "Fake Demon bluffs shown", type: "textarea", minPlayers: 7, required: true, help: "At seven or more players, record the good characters shown as not in play." }
      ],
      eviltwin: [{ key: "goodTwin", label: "Good Twin", type: "player", required: true, help: "Choose an opposing good player; each twin learns the other and their character." }],
      nodashii: [{ key: "poisonedNeighbors", label: "No Dashii's two poisoned Townsfolk neighbors", type: "textarea", required: true, help: "Record the two nearest Townsfolk, skipping non-Townsfolk as needed." }],
      godfather: [{ key: "shownOutsiders", label: "Outsiders shown to the Godfather", type: "textarea", required: true, help: "Record every in-play Outsider character shown on the first night." }],
      widow: [
        { key: "poisonedPlayer", label: "Widow-poisoned player", type: "player", required: true, help: "Chosen after the Widow sees the Grimoire." },
        { key: "informedPlayer", label: "Good player told a Widow is in play", type: "player", required: true, help: "Show this good player the Widow token without identifying the Widow." }
      ],
      yaggababble: [{ key: "phrase", label: "Yaggababble secret phrase", type: "text", required: true, help: "Record the exact phrase; wording and public repetitions matter." }],
      amnesiac: [{ key: "ability", label: "Amnesiac ability and feedback scale", type: "textarea", required: true, help: "Write the complete ability, trigger, limits, and the exact warmth scale used for guesses." }],
      bountyhunter: [{ key: "evilTownsfolk", label: "Evil Townsfolk created by Bounty Hunter", type: "player", required: true, help: "This player's alignment changes to evil during setup." }],
      lleech: [{ key: "host", label: "Lleech host", type: "player", required: true, help: "The host is poisoned and the Lleech dies if and only if the host is dead." }],
      marionette: [
        { key: "believedRole", label: "Good role shown to the Marionette", type: "role", roleFilter: "goodOutOfPlay", required: true, help: "Simulate this good character while keeping the Marionette adjacent to the Demon." },
        { key: "demonNeighbor", label: "Adjacent Demon", type: "player", required: true, help: "Record the Demon neighboring the Marionette." }
      ],
      puzzlemaster: [{ key: "drunkPlayer", label: "Puzzlemaster-drunk player", type: "player", required: true, help: "This player remains drunk even if the Puzzlemaster dies." }],
      huntsman: [{ key: "damselPlayer", label: "Damsel added by the Huntsman", type: "player", required: true, help: "Record the player holding the added Damsel token." }],
      kazali: [{ key: "minionChoices", label: "Kazali's chosen Minions", type: "textarea", required: true, help: "Record each selected player and the Minion character given to them." }],
      damsel: [{ key: "minionsInformed", label: "All Minions were shown the Damsel token", type: "checkbox", required: true, help: "This confirms the first-night setup information was delivered." }],
      king: [{ key: "demonInformed", label: "The Demon was shown the King player", type: "checkbox", required: true, help: "The Demon learns which player is the King." }],
      magician: [{ key: "evilInfoPrepared", label: "Magician included in both evil starting-info groups", type: "checkbox", required: true, help: "Minions see the Magician as another Demon; the Demon sees the Magician as another Minion." }],
      villageidiot: [{ key: "drunkCopy", label: "Drunk Village Idiot copy", type: "player", required: true, minCopies: 2, help: "When multiple Village Idiots are in play, exactly one is drunk." }]
    },
    rulesAdditions: [
      {
        id: "small-games", title: "Five- and six-player games & Toymaker",
        summary: "Small games change evil starting information; Toymaker restores it in exchange for a required no-attack night.",
        items: [
          "With fewer than seven players, skip normal Minion Info and Demon Info: evil players do not learn one another and the Demon does not receive three bluffs.",
          "A Teensyville script is a compact character list for five or six players, usually six Townsfolk, two Outsiders, two Minions, and one or two Demons.",
          "Toymaker is public. It restores normal Minion and Demon starting information, including three Demon bluffs.",
          "With Toymaker, the Demon must choose not to attack at least once. If an attack could end the game before that happens, the Storyteller forces the no-attack night.",
          "The legal in-play token counts are still the ordinary five- or six-player counts after all bracketed setup modifiers are applied."
        ]
      },
      {
        id: "setup-modifiers", title: "Setup modifiers and hidden choices",
        summary: "Bracketed ability text changes the bag before roles are distributed; hidden choices belong in the Grimoire, not on the public script.",
        items: [
          "Apply every bracketed setup modifier before filling the bag. A +1 Outsider normally replaces one Townsfolk; a −1 Outsider normally adds one Townsfolk.",
          "If a setup effect creates a particular character or alignment, make that change before play and preserve the final legal player total.",
          "Choose and mark hidden setup information before it can affect an ability: examples include the Fortune Teller red herring, Drunk cover, Lleech host, Puzzlemaster drunk, Evil Twin, and Widow poison.",
          "Derived reminders still need to be recorded. For example, No Dashii poisons the two nearest Townsfolk neighbors, which may not be the immediately adjacent seats.",
          "Setup information remains secret unless an ability says it is public. A redacted export must not include these choices."
        ]
      },
      {
        id: "changes", title: "Character changes, alignment changes, and resurrection",
        summary: "Changing character or alignment does not rewind the game, but a newly created character receives the setup information its ability requires.",
        items: [
          "A player can change character without changing alignment, or change alignment without changing character. Apply only what the effect says.",
          "If a player becomes a new character, they gain the new ability and lose the old one. Tell them their new character when the rules require it and resolve any 'you start knowing' information.",
          "A dead player who changes character is still dead unless the effect also resurrects them. A resurrected player is alive again and ordinarily has a fresh ability unless the character text says otherwise.",
          "Track the time of every change. Information learned before a change does not disappear, while ongoing effects may end if their source ability no longer exists.",
          "Alignment and registration are different: a player can actually be good while temporarily registering as evil to a particular ability."
        ]
      },
      {
        id: "timing-conflicts", title: "Timing, simultaneous effects, and endings",
        summary: "Resolve the current ability completely, follow night order, and check win conditions whenever a relevant event occurs.",
        items: [
          "At night, follow the published order. Finish one character's instruction before waking the next unless a jinx or ability explicitly links them.",
          "An execution is the town's once-per-day process; a death is the result. An execution may occur without death, and a death may occur without execution.",
          "When an ability creates an immediate win or loss, stop and resolve that condition before continuing to later effects, subject to any ability that explicitly prevents the win.",
          "If several effects could explain the same event, record the actual cause privately. Players are entitled to public events, not the hidden reason behind them.",
          "For an interaction not answered by ability text, jinxes, the almanac, Rules Explanation, or glossary, make one consistent ruling and explain it after the game if doing so earlier would reveal hidden information."
        ]
      }
    ]
  };

  if (strategy) {
    if (!strategy.sources.includes("Official Blood on the Clocktower Wiki — role Tips & Tricks, bluffing, rules, setup, states, and glossary")) {
      strategy.sources.push("Official Blood on the Clocktower Wiki — role Tips & Tricks, bluffing, rules, setup, states, and glossary");
    }
    window.BOTC_SETUP.rulesAdditions.forEach(rule => {
      if (!strategy.rules.some(existing => existing.id === rule.id)) strategy.rules.push(rule);
    });
    Object.assign(strategy.roles, {
      balloonist: {
        firstMove: "Start a four-column log for Townsfolk, Outsider, Minion, and Demon. Record each shown player under one possible type without treating the order as fixed.",
        priorities: ["Preserve the exact nightly sequence.", "Check whether an added Outsider is consistent with public claims.", "Remember that character type is not alignment."],
        reveal: "Reveal enough of the chain to coordinate claims, but keep later results concealed if evil can exploit the remaining type pattern.",
        pitfalls: ["Assuming the sequence follows a fixed type order.", "Treating a shown player as confirmed good."],
        bluff: "Prepare a legal different-type sequence and a consistent +0/+1 Outsider story before day one."
      },
      widow: {
        firstMove: "Use the Grimoire to identify the information source whose poisoning will be hardest to diagnose, then approach conversations as if you did not see the setup.",
        priorities: ["Remember the poisoned player.", "Track which good player received the Widow warning.", "Use the warning to create several plausible Widow candidates."],
        reveal: "As evil, reveal only as part of a deliberate sacrifice or bluff. As a good player who learned the warning, share it when it affects the information model.",
        pitfalls: ["Accidentally revealing knowledge only the Widow could have.", "Choosing a poison target whose false result immediately confirms Widow."],
        bluff: "Build a cover that explains your early conversations without relying on Grimoire-only knowledge."
      },
      goblin: {
        firstMove: "Decide whether your value comes from threatening an execution, drawing suspicion away from the Demon, or never claiming until the decisive nomination.",
        priorities: ["Use the exact public claim while nominated.", "Track whether the execution happens that same day.", "Keep the Demon outside the center of the Goblin debate."],
        reveal: "Claim only when nominated and when the threat materially changes the vote, unless an earlier bluff serves a specific team plan.",
        pitfalls: ["Claiming outside the nomination and assuming it counts.", "Winning the argument so completely that town safely ignores you."],
        bluff: "A non-Goblin can make the same public claim, but must be prepared for town to call it."
      },
      leviathan: {
        firstMove: "Plan backward from day five. Identify which two or three players can remain plausible Demon candidates after the town spends its very limited executions.",
        priorities: ["Track the day counter.", "Track actual alignment of every executee.", "Use the Minion to make safe-looking executions dangerous."],
        reveal: "The Demon type is public; the real concealment problem is the Leviathan player's identity.",
        pitfalls: ["Forgetting that the restriction counts good executions, not all deaths.", "Letting all information converge on one candidate before the last legal execution."],
        bluff: "Choose a role with a developing information history and exploit the absence of ordinary Demon kills."
      }
    });
  }
})();
