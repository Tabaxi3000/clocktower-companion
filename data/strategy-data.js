window.BOTC_STRATEGY = {
  updated: "2026-09-20",
  sources: [
    "Clocktower Academy — A Beginner's Guide to Trouble Brewing",
    "Clocktower Academy — How to Win as the Good Team",
    "Clocktower Academy — How to Win as the Evil Team",
    "Clocktower Academy — How to Bluff as Every Trouble Brewing Character",
    "Clocktower Academy — How to Bluff as Every Sects & Violets Character",
    "Clocktower Academy — individual Trouble Brewing character guides",
    "Clocktower Academy — How Madness Works",
    "Official Blood on the Clocktower rules, glossary, character sheets, and night order"
  ],

  general: {
    good: {
      title: "Playing for good",
      intro: "Good begins with more players but less certainty. The job is to exchange enough information to build and test worlds without handing evil every useful target immediately.",
      sections: [
        {
          title: "Opening day",
          items: [
            "Read your exact ability and timing before deciding whether to claim. A start-knowing role can usually afford more risk than an ongoing information or protection role.",
            "Have private conversations. Give different people enough information to compare stories, and make sure at least one trusted player can release your information if you die.",
            "Count expected Outsiders, then list every setup modifier that could change that count. Treat the count as a constraint, not automatic proof that a claimant is evil.",
            "Record raw information separately from your interpretation. ‘The Storyteller showed me 1’ is a fact about what you received; ‘Alice is evil’ is a theory."
          ]
        },
        {
          title: "Executions and voting",
          items: [
            "Executions create information. Early in the game, an informative execution can be better than waiting for perfect certainty that never arrives.",
            "Say the purpose of a nomination before votes are counted: Demon attempt, Minion removal, role test, or information-generating execution.",
            "Track who nominated, who voted, whether the vote could have been decisive, and whether a player changed position after hearing the count.",
            "A dead vote is scarce. Spending it early can be correct, but know what your vote is buying and how many votes the final day may require."
          ]
        },
        {
          title: "Solving the game",
          items: [
            "Keep more than one live world. Include one where your best information is poisoned, drunk, falsely registered, or attached to an evil claimant.",
            "Use deaths, survival, voting, claims, setup counts, and ability results together. None of these is reliable enough to solve the game alone.",
            "Continue speaking with suspected and dead players. Even an evil player reveals priorities through the worlds they push and the executions they spend time creating.",
            "Before final three, run a concise public recap: every claim, every result, known causes of misinformation, surviving Demon candidates, and the nomination order."
          ]
        }
      ]
    },
    evil: {
      title: "Playing for evil",
      intro: "Evil starts with an information advantage and a numbers disadvantage. It wins by making one coherent false history easier to believe than the real one.",
      sections: [
        {
          title: "Coordinate without advertising it",
          items: [
            "The Demon should distribute the three bluffs and learn each Minion's cover. In person, keep the exchange brief and make the conversation look ordinary.",
            "Agree on the few facts that must match: claims, fake nightly results, Outsider count, and what each evil player will say if another is executed.",
            "Do not force constant private meetings. Pass only the information a teammate needs, such as a dangerous target, a planned claim, or a role that must not be contradicted.",
            "Keep a written or mental ledger for any bluff with daily choices, pairings, numbers, votes, nominations, or Storyteller visits."
          ]
        },
        {
          title: "Build believable pressure",
          items: [
            "Mix accurate details into false conclusions. A claim that explains everything too perfectly often attracts more attention than a slightly incomplete good-player story.",
            "Minions can spend their lives to protect the Demon. Drawing an execution, double-claiming another Minion, or accusing a teammate can buy days and credibility.",
            "Vote and nominate with a reason that fits your claimed role. A passive evil team leaves the good team too much uncontested control over the day.",
            "Use kills, poisoning, protection failures, and no-death nights to support the public world you want town to consider."
          ]
        },
        {
          title: "Demon survival",
          items: [
            "The Demon should look useful but not indispensable. A claim that explains why you live is safer than repeatedly insisting survival confirms you.",
            "Kill information engines, confirmed players, and players organizing town—but consider Soldier, Ravenkeeper, Sage, protection, and deliberate bait.",
            "Know the script's transfer mechanics: Imp star-pass, Fang Gu jump, Scarlet Woman catch, Barber swap, Snake Charmer swap, or Pit-Hag changes.",
            "When the town finds an evil player, decide whether saving them is worth exposing the Demon. Often it is better to let the execution happen and use the result."
          ]
        }
      ]
    }
  },

  rules: [
    {
      id: "objective",
      title: "Objective, teams, and winning",
      summary: "Good hunts the Demon; evil keeps a living Demon until only two non-Traveller players remain.",
      items: [
        "Townsfolk and Outsiders begin good. Minions and Demons begin evil. Travellers may be either alignment.",
        "Good normally wins immediately when the Demon dies. Evil normally wins immediately when only two players remain alive, not counting Travellers.",
        "Dead and living players win or lose with their current alignment. Death does not remove a player from the team.",
        "Character abilities can replace or delay normal win conditions. Resolve the exact ability text and any current jinxes before the default rule.",
        "If several effects could end the game at once, the Storyteller resolves the relevant abilities and announces the winner. Ask the Storyteller rather than revealing hidden reasoning."
      ]
    },
    {
      id: "setup",
      title: "Setup and the bag",
      summary: "The Storyteller secretly chooses a legal character mix, applies bracketed setup changes, and distributes one token to each player.",
      items: [
        "Standard 5–15 player counts are shown in the Setup tab. Travellers are additional players and are not included in the normal Townsfolk/Outsider/Minion/Demon count.",
        "Square brackets in an ability, such as [+2 Outsiders], change setup before tokens enter the bag. Additions are balanced by removing the same number of another type so the token count still equals the player count.",
        "Players secretly view only their own token. The Drunk receives a Townsfolk token but is placed in the Grimoire as the Drunk.",
        "In an ordinary game of seven or more, Minions learn the Demon and the Demon learns the Minions plus three not-in-play good characters. Ordinary five- and six-player games omit this information unless a rule such as the Toymaker says otherwise.",
        "The Storyteller may use public Fabled characters to handle accessibility, unusual scripts, time limits, or balance."
      ]
    },
    {
      id: "cycle",
      title: "Night, dawn, day, and dusk",
      summary: "The game begins with the first night, then alternates day and other-night phases.",
      items: [
        "At night everyone closes their eyes and stays silent. The Storyteller wakes characters in the script's night order and communicates with gestures, tokens, or writing.",
        "The first night has its own order and often contains setup information. ‘Each night*’ means every night except the first night.",
        "At dawn, the Storyteller announces deaths but normally does not announce causes. Players then talk publicly or privately during the day.",
        "Day abilities use their printed timing. The Storyteller eventually calls for nominations, resolves one execution at most, and sends everyone to sleep.",
        "The public night-order list shows what every character on the script would do. It never reveals which characters are actually in play."
      ]
    },
    {
      id: "speech",
      title: "Conversation, claims, and privacy",
      summary: "Players may lie about almost anything; the Storyteller must answer rules questions truthfully.",
      items: [
        "During the day, living and dead players may talk publicly or privately, make any claim, withhold information, or lie. Do not show another player your physical character token.",
        "A player may bluff a character that is not in play, double-claim one that is, or tell the truth in a misleading way. Social promises are not rules-enforced contracts.",
        "The Storyteller tells the truth about game rules and public procedure. They may mislead through character abilities only when the rules permit it.",
        "Private digital role messages can appear on lock screens. Use device handoff or warn players before texting sensitive role information.",
        "Respect table boundaries. Deception belongs inside the game; harassment, coercion, secret recording, and using out-of-game personal information do not."
      ]
    },
    {
      id: "nominations",
      title: "Nominations, voting, and execution",
      summary: "Each living player may nominate once per day; the nominee needs at least half the living vote and the unique highest total.",
      items: [
        "Only living players normally nominate. Each living player may nominate once per day, and each player may be nominated once per day.",
        "Every living player may vote on any number of nominations. A dead player may vote only once more for the rest of the game, using their vote token.",
        "A nomination reaches the block with votes from at least half the living players, rounded up. A later nominee must exceed the current total; matching it creates a tie and leaves no one on the block.",
        "When nominations close, the unique qualifying player on the block is executed. There can be at most one execution each day, and an executed player might survive if an ability prevents death.",
        "Execution and death are different events. Some abilities trigger on execution even if the player does not die; others require actual death."
      ]
    },
    {
      id: "death",
      title: "Death and the dead vote",
      summary: "Death removes the character ability, not the player's voice or investment in the game.",
      items: [
        "A dead player normally loses their ability immediately, including ongoing effects, unless their ability says otherwise.",
        "Dead players continue talking, sharing information, closing their eyes at night, and winning or losing with their team.",
        "A dead player cannot normally nominate and has one remaining vote for the entire game. Once that vote is spent, they may not vote again.",
        "Being selected by an ability while dead is legal unless the ability requires a living target. ‘Choose a player’ alone includes living and dead players.",
        "Track death, execution, ability loss, and the dead vote separately; they are not interchangeable states."
      ]
    },
    {
      id: "execution-exile",
      title: "Execution versus Traveller exile",
      summary: "Exiling a Traveller is a public group decision, not a nomination, vote, execution, or character ability.",
      items: [
        "Travellers are removed by exile rather than execution. The group may exile any number of Travellers in a day.",
        "Any player may support an exile, including a dead player who has already spent their dead vote.",
        "Character abilities do not alter exile support. Vote modifiers, protection from execution, and effects triggered by execution do not apply unless an ability explicitly says otherwise.",
        "A Traveller's alignment is revealed when they are exiled. Their character was already public.",
        "Record exiles separately from nominations and executions so ability triggers remain clear."
      ]
    },
    {
      id: "unreliable",
      title: "Drunkenness, poisoning, and false information",
      summary: "A drunk or poisoned player has no ability, but the Storyteller usually pretends that it works.",
      items: [
        "A drunk or poisoned character has no ability. It cannot kill, protect, change setup, register specially, or create an effect.",
        "The Storyteller may wake that player and provide true or false information as if the ability worked. The player is not told that they are impaired.",
        "False information is not automatically the opposite of the truth. It may be any legal-looking result unless another ability, such as the Vortox, imposes a stricter requirement.",
        "When the state ends, the ability functions again from that point forward; past information and failed effects are not repaired retroactively.",
        "Keep the received result, the possible source of unreliability, and the conclusion in separate notes."
      ]
    },
    {
      id: "registration",
      title: "Registration and detection",
      summary: "Some abilities can make a player appear as another character, type, or alignment without changing what they really are.",
      items: [
        "Registration affects abilities that detect or interact with the stated property. It does not grant the registered character's ability.",
        "The Recluse may register as evil and as a Minion or Demon. The Spy may register as good and as a Townsfolk or Outsider, even while dead.",
        "Registration is chosen separately for each relevant interaction. A player can register differently to different abilities in the same game or night when their text permits it.",
        "The Storyteller uses registration to create a fair and interesting puzzle, not to rewrite public rules or a player's actual token.",
        "When testing a result, ask whether it identifies a player, an alignment, a character type, or a specific character; different registration clauses affect different questions."
      ]
    },
    {
      id: "wording",
      title: "How to read ability wording",
      summary: "Timing words, choice words, and modal words carry rules meaning.",
      items: [
        "‘You start knowing’ resolves on the first night or when that character is created later. ‘Each night’ includes the first night; ‘each night*’ does not.",
        "‘Choose’ means the player decides. If an effect happens without ‘choose,’ the Storyteller commonly decides. Restrictions in parentheses are mandatory.",
        "‘May’ and ‘might’ allow an effect not to happen. ‘Safe from the Demon’ prevents harmful Demon-caused effects but does not grant protection from every source.",
        "A once-per-game ability is spent when used, even if the player was drunk or poisoned and nothing happened.",
        "Character, player, alignment, type, execution, death, nomination, and vote are distinct terms. Read the exact noun and trigger before resolving an interaction."
      ]
    },
    {
      id: "madness",
      title: "Madness",
      summary: "Madness describes an effort to convince the group; it does not force speech, belief, or literal role-play.",
      items: [
        "A player who is mad about something is making a genuine effort to convince the group it is true. Silence, coded admissions, or obvious winks may fail that standard.",
        "A player may break madness. The stated consequence, often possible execution, is discretionary unless the ability says otherwise.",
        "Madness is judged from context: the player's experience, opportunities to speak, the state of the day, and whether the attempt could plausibly persuade anyone.",
        "The Storyteller should not demand harmful, humiliating, or inaccessible performance. Adjust communication methods while preserving the game effect.",
        "Being made mad does not change a player's character or alignment and does not make their private information false."
      ]
    },
    {
      id: "storyteller",
      title: "Storyteller rulings and mistakes",
      summary: "The Storyteller runs hidden information, makes discretionary choices, and gives final table rulings.",
      items: [
        "Ask rules questions privately when the question itself might reveal your role. The Storyteller should explain public rules honestly without confirming hidden setup.",
        "When an ability gives the Storyteller a choice, the goal is a fair, understandable, and interesting game—not helping one team arbitrarily.",
        "Jinxes modify specific character interactions on custom scripts. Check the current jinx list before setup and when either character changes into play.",
        "If the Storyteller makes a mistake, they should correct what can be corrected without exposing unnecessary hidden information, then explain it after the game.",
        "The official almanac's How to Run entry is the definitive detailed procedure when summary text leaves an interaction unclear."
      ]
    }
  ],

  roles: {
    washerwoman: {
      firstMove: "Privately approach both shown players before announcing the exact Townsfolk. Ask for a soft claim or a three-for-three so the real role is not immediately exposed.",
      priorities: ["Preserve the real Townsfolk if their ability benefits from secrecy.", "Revisit whether each candidate's later behavior fits the shown role.", "Remember that the Spy can register as the shown good character."],
      reveal: "Reveal the complete ping when it protects the real player from execution, resolves a double claim, or gives town a useful trust anchor.",
      pitfalls: ["Treating either candidate as mechanically confirmed.", "Publicly naming a valuable ongoing role on day one without a reason."],
      bluff: "Pick a real script Townsfolk and include an evil ally in the pair when possible. Speak to both named players so the claim resembles a genuine Washerwoman process. This is safer for a Minion than a Demon because later confirmation roles may expose it."
    },
    librarian: {
      firstMove: "Check the base Outsider count and every setup modifier, then speak separately to the two players in your ping. A zero is also information and should be recorded exactly.",
      priorities: ["Use the ping to locate a possible Drunk without forcing an early public claim.", "Compare the final Outsider claims with setup math.", "Keep Spy and Recluse registration in your worlds."],
      reveal: "Release the exact character and pair when Outsider count becomes disputed or a candidate needs to explain unreliable information.",
      pitfalls: ["Assuming both candidates know they are Outsiders—the Drunk does not.", "Using Outsider count as conclusive proof while a Baron or registration effect is possible."],
      bluff: "A Drunk ping can make reliable information look suspect. A Librarian–Saint story can also support a teammate's risky Outsider bluff. Keep the expected Outsider count legal."
    },
    investigator: {
      firstMove: "Write down both players and the exact Minion. Ask what each candidate is claiming before you make the accusation public.",
      priorities: ["Look for behavior that matches the named Minion's visible incentives.", "Use the Minion type to anticipate threats even before choosing between the pair.", "Allow for Spy and Recluse registration."],
      reveal: "Reveal early when the named Minion creates an urgent hazard; otherwise give the candidates room to produce claims first.",
      pitfalls: ["Executing both candidates automatically.", "Forgetting that killing a Minion can be useful without proving the other candidate good."],
      bluff: "Name one expendable teammate and one good player as the pair, preferably with a Minion type whose effects can be simulated. The named evil player may intentionally absorb the execution."
    },
    chef: {
      firstMove: "Draw the seating circle and mark every adjacent pair. Build several legal evil placements that produce your number before sharing a conclusion.",
      priorities: ["Update the diagram when Minions or alignment changes are found.", "Account for the Recluse possibly registering evil.", "Use a zero to rule out adjacency rather than to clear individual players."],
      reveal: "Chef information is usually safe to release early, but the interpretation becomes much stronger after the evil count or one evil player is known.",
      pitfalls: ["Counting players instead of adjacent evil pairs.", "Forgetting the pair that crosses the end of a written seating list."],
      bluff: "Choose a low number that supports several alternative seating worlds. Draw them before speaking and include a possible Recluse explanation if that role is on the script."
    },
    empath: {
      firstMove: "Record both alive neighbors and the number before any deaths change the seating. Decide who should privately inherit your history if you die.",
      priorities: ["Update alive neighbors after every death.", "Compare number changes with the exact seat that disappeared.", "Test poison and Recluse worlds before hard-accusing a neighbor."],
      reveal: "You can soft-claim to neighbors early, but publish the full sequence once it separates a small number of worlds or protects you from being framed.",
      pitfalls: ["Using physical neighbors after one dies instead of alive neighbors.", "Treating an unchanged number as proof that nothing changed."],
      bluff: "Keep a nightly table of neighbors and numbers. A zero can recruit both neighbors; later changes must follow deaths. Decide in advance which neighbor your sequence is meant to frame."
    },
    fortuneteller: {
      firstMove: "Choose pairs that divide your Demon candidates into different groups and record both names and the result every night.",
      priorities: ["Use no results to shrink worlds.", "Test combinations that can identify a red herring rather than repeating one suspect forever.", "Protect your identity while the information remains valuable."],
      reveal: "Share through a trusted intermediary or reveal once your history can survive public checking. Include every pair, not just the dramatic yes results.",
      pitfalls: ["Assuming a yes identifies which of the two players caused it.", "Forgetting Recluse registration, poisoning, or the red herring."],
      bluff: "Maintain a complete fake nightly history with mixed yes and no results and a plausible red-herring theory. An isolated yes is easier to defend than a chain that condemns every good player."
    },
    undertaker: {
      firstMove: "Push for an execution whose character would answer a live question, then keep the exact nightly result separate from what the executed player claimed.",
      priorities: ["Build a multi-day chain before revealing if you can survive.", "Use confirmed first-night roles as anchors.", "Remember that Spy and Recluse may register unusually and a drunk or poisoned result may be arbitrary."],
      reveal: "Reveal when town is about to distrust confirmed executions, when you become a likely kill, or when the result changes today's nomination.",
      pitfalls: ["Calling every result a confirmation without testing impairment.", "Inventing a result for a day with no execution."],
      bluff: "Prepare the claimed character before each execution and approach the executed player the next day as a real Undertaker would. A Spy can reproduce exact roles; other evil players need a coordinated story."
    },
    monk: {
      firstMove: "Choose someone the Demon is likely to attack, not simply the loudest trusted player. Record every target privately.",
      priorities: ["Vary or repeat targets deliberately.", "Use a no-death night as evidence, not proof.", "Coordinate with a revealed information role only when the protection is worth exposing yourself."],
      reveal: "Reveal a protection history when it explains survival, creates a trusted pair, or prevents town from misreading a no-death night.",
      pitfalls: ["Protecting yourself, which is illegal.", "Assuming your target was attacked or that a later death disproves the earlier protection."],
      bluff: "The Demon can sink a kill into a dead or protected-looking target, then claim Monk protection. Do not manufacture too many no-death nights, and have an explanation if a former target dies later."
    },
    ravenkeeper: {
      firstMove: "Act useful enough to attract a kill while keeping your actual role ambiguous. Plan which player would be most valuable to learn exactly.",
      priorities: ["Create a believable kill target without overplaying the bait.", "Choose a player whose exact character separates several worlds.", "Tell town the result promptly after a Demon kill."],
      reveal: "Usually reveal only after triggering or when execution is unavoidable and town needs to know you produced no result.",
      pitfalls: ["Looking so obviously like a Ravenkeeper that the Demon never attacks.", "Expecting information after execution or a non-Demon death."],
      bluff: "As a living Demon, claim the role late and explain your survival as avoidance. An Imp can star-pass, then the dead former Demon can claim a Ravenkeeper result that supports the new Imp's cover."
    },
    virgin: {
      firstMove: "Quietly find a credible Townsfolk willing to nominate you while the confirmation will still help town.",
      priorities: ["Choose the nominator carefully.", "Use the confirmed execution to anchor later claims.", "Remember that Outsiders do not trigger you and a Spy might."],
      reveal: "Reveal before the agreed nomination. After the trigger, make sure town records exactly who was confirmed and what was not proved.",
      pitfalls: ["Letting an uncoordinated first nomination waste the ability.", "Calling a failed trigger proof that either player is evil."],
      bluff: "This is dangerous because town can test it. A Spy may nominate and register as Townsfolk; otherwise prepare a drunk, poisoned, or non-Townsfolk explanation and expect scrutiny."
    },
    slayer: {
      firstMove: "Tell one trusted player you hold the shot, then wait for a target whose death or survival will meaningfully reorganize the worlds.",
      priorities: ["Use the shot publicly and unambiguously.", "Choose timing that leaves time to react.", "Treat a failed shot as one result among several, not a mechanical clear."],
      reveal: "Reveal at the moment you shoot. Earlier disclosure is useful only if it changes how town protects or evaluates you.",
      pitfalls: ["Saving the shot until the game ends.", "Forgetting drunkenness, poisoning, or Recluse registration interactions."],
      bluff: "Take a public shot that is expected to fail. Shooting an evil teammate can make them look good; shooting a distrusted good player can reinforce the frame."
    },
    soldier: {
      firstMove: "Bluff a role the Demon wants to kill, then watch for a no-death night without claiming that it proves the attack hit you.",
      priorities: ["Make yourself attractive but not obvious bait.", "Coordinate a later reveal with the death pattern.", "Keep other no-death explanations alive."],
      reveal: "Reveal after a plausible attack or when town is about to execute you for surviving too long.",
      pitfalls: ["Hard-claiming immediately and guaranteeing the Demon attacks elsewhere.", "Treating survival as mechanical confirmation."],
      bluff: "Sink a Demon kill to create a no-death night after making your cover look kill-worthy. Reveal Soldier afterward, but leave room for Monk, Mayor, or deliberate no-kill explanations."
    },
    mayor: {
      firstMove: "Build a trustworthy voting record and make sure at least one player knows your claim before the endgame.",
      priorities: ["Keep the final-three no-execution option available.", "Do not read every survival as a bounce.", "Plan how town will distinguish you from a Demon using Mayor as cover."],
      reveal: "Reveal early enough to build a final-three plan, but not so loudly that every death around you is interpreted as a bounce.",
      pitfalls: ["Assuming town can safely skip execution without first ruling out other win conditions.", "Relying on the Storyteller to redirect every attack."],
      bluff: "Use survival and a possible bounced kill as supporting evidence, especially if a Washerwoman-style claim can back you. Reaching final three is not enough; your voting history must also look good."
    },
    butler: {
      firstMove: "Choose a master you expect to vote responsibly and track your choice each night. Your legal vote still remains optional.",
      priorities: ["Keep every vote legal.", "Use master behavior as social evidence.", "Fit your public claim to the expected Outsider count."],
      reveal: "Claim when your voting restriction matters or when Outsider count needs resolving.",
      pitfalls: ["Voting when the master did not vote.", "Assuming a trusted master proves your own alignment."],
      bluff: "Choose a publicly trusted master and mirror legal votes. Claiming a dead master can explain caution, but the single dead vote makes the story easy to audit. Usually safer for a Minion than the Demon."
    },
    drunk: {
      firstMove: "Play the Townsfolk token you saw as sincerely as possible. Record all results and choices; do not decide you are the Drunk after one surprising result.",
      priorities: ["Look for a pattern of contradictions.", "Check Outsider count and possible Baron setup.", "Remember that unreliable information may still be true."],
      reveal: "You cannot knowingly reveal as the Drunk at the start. Discuss the possibility only after enough evidence accumulates.",
      pitfalls: ["Automatically reversing every result.", "Using a Drunk world to stop doing the useful work of your apparent role."],
      bluff: "An evil player can begin with an information role, then retreat to ‘I may be the Drunk’ when results fail. This also hides the real Drunk and disturbs the Outsider count."
    },
    recluse: {
      firstMove: "Check the Outsider count and decide which information roles should privately know your claim before they interpret an evil ping.",
      priorities: ["Offer yourself for useful checks when registration ambiguity is informative.", "Do not let every evil result be dismissed as Recluse registration.", "Track whether your claim makes the setup legal."],
      reveal: "Usually reveal before an Investigator, Chef, Fortune Teller, Slayer, or Undertaker result about you is treated as conclusive.",
      pitfalls: ["Assuming you always register evil.", "Becoming a permanent excuse for an otherwise impossible evil world."],
      bluff: "Use evil-looking information and Chef adjacency as cover, but do not overclaim what the Storyteller must do. A Recluse can register badly; it is not guaranteed."
    },
    saint: {
      firstMove: "Tell one or two trusted players before public suspicion forms, and keep a useful voting and world-building record.",
      priorities: ["Avoid casual execution.", "Resolve Outsider count.", "Help town test you socially because your ability should not be tested mechanically."],
      reveal: "Reveal publicly when nomination becomes realistic or when a trusted confirmation can support you.",
      pitfalls: ["Waiting until votes are already circling.", "Demanding permanent immunity from scrutiny."],
      bluff: "Support the claim with Outsider math, a Librarian story, or an Empath relationship. The Demon can use Saint late, then star-pass if the town stops believing it."
    },
    poisoner: {
      firstMove: "Identify which ability can create the most useful wrong conclusion, not merely which player seems strongest.",
      priorities: ["Coordinate high-value targets with the Demon.", "Move the poison when a fixed pattern becomes visible.", "Sometimes allow true information so town cannot map you easily."],
      reveal: "Never claim Poisoner while the game is live unless a highly unusual tactical reason outweighs exposing the evil team.",
      pitfalls: ["Poisoning dead or spent roles without a purpose.", "Creating misinformation that contradicts the Demon cover."],
      bluff: "Use a good cover with an auditable history. Your poison targets should quietly support that history rather than produce impossible results."
    },
    spy: {
      firstMove: "Read the Grimoire methodically: roles, reminders, misinformation, and valuable Demon targets. Choose a cover that matches facts only you can safely know.",
      priorities: ["Pass urgent target and claim information to the Demon.", "Support evil cover stories without revealing impossible knowledge.", "Use possible good registration to survive tests, never as a guarantee."],
      reveal: "Do not reveal your real role during play. After death, continue using your knowledge to shape town's worlds.",
      pitfalls: ["Remembering the Grimoire incorrectly.", "Giving so much exact information that your Spy perspective becomes obvious."],
      bluff: "You are best equipped for Undertaker, Washerwoman, Librarian, or other exact-information covers because you can see the real tokens. Keep the story human rather than flawless."
    },
    scarletwoman: {
      firstMove: "Build an independent cover and stay alive while five or more non-Traveller players live. Be ready to become the Demon without warning.",
      priorities: ["Know who the original Demon is and whether pressure may cause a transfer.", "Avoid making your claim depend entirely on the original Demon.", "After a catch, reassess kills and every cover immediately."],
      reveal: "Do not reveal the real role. If the original Demon is exposed, distancing or even helping execute them can make your cover stronger.",
      pitfalls: ["Dying before the insurance matters.", "Failing to notice that fewer than five players means the catch no longer works."],
      bluff: "A good cover should remain believable before and after a Demon execution. If you helped kill the old Demon, use that action as social evidence."
    },
    baron: {
      firstMove: "Your mechanical contribution happened during setup. Take a plausible cover, support the real Outsider-count world, and decide whether your life is more useful as pressure relief for the Demon.",
      priorities: ["Protect the Demon rather than yourself.", "Use the extra Outsiders to create believable claims.", "Nominate and vote actively enough to resemble your cover."],
      reveal: "Do not reveal the real role during play unless conceding for a specific tactical purpose.",
      pitfalls: ["Acting as if having no nightly action means having no job.", "Claiming an extra Outsider slot that the real setup already uses visibly."],
      bluff: "Baron often needs no protected long-term bluff because its ability is spent. If the Demon has limited cover choices, take a riskier claim and draw the first execution."
    },
    imp: {
      firstMove: "Learn the Minions and three bluffs, choose a cover you can maintain, and decide how to pass each remaining bluff without making an obvious evil meeting.",
      priorities: ["Kill information engines and town coordinators while checking for bait.", "Keep at least one Minion socially usable or alive for a star-pass.", "Make every kill compatible with your cover and the Demon world you want town to believe."],
      reveal: "Never reveal the real role during live play. A star-pass is a transfer plan, not a public confession.",
      pitfalls: ["Killing obvious Ravenkeeper or Soldier bait without considering alternatives.", "Star-passing to an unprepared or dead Minion.", "Using a cover whose nightly history you cannot reproduce."],
      bluff: "Ongoing roles require a ledger; passive roles require a reason the Demon has not killed you. A star-pass can let the dead old Imp claim Ravenkeeper information that supports the new Imp."
    },

    clockmaker: {
      firstMove: "Write the number and map every Demon–Minion spacing that satisfies it before anyone's claim influences your diagram.",
      priorities: ["Count in both directions.", "Revisit the map after role changes.", "Use claims to remove pairs, not to force one favorite answer."],
      reveal: "Waiting a day can stop evil from immediately arranging its story around your number.",
      pitfalls: ["Counting the Demon or Minion as a step.", "Forgetting Summoner or character-change interactions on custom scripts."],
      bluff: "Choose a number that supports your planned frames without pointing directly at the real Demon. A Minion can take more risk with the claim than the Demon."
    },
    dreamer: {
      firstMove: "Choose someone you can question privately and write both shown characters exactly. One is their real character unless your information is impaired or forced false.",
      priorities: ["Build a complete target/pair history.", "Challenge claims privately before exposing a good role.", "Account for No Dashii poisoning, Vortox falsity, and Cerenovus madness."],
      reveal: "Reveal pairings once they catch a contradiction or when protecting the correct good character is less important than resolving worlds.",
      pitfalls: ["Treating the evil character shown as an alignment result.", "Exposing powerful roles casually."],
      bluff: "For an evil ally, give their real evil character and claimed good cover as the pair. Under a Vortox, a real Dreamer must get a pair that does not include the target's true character."
    },
    snakecharmer: {
      firstMove: "Choose deliberately, never yourself, and record every living target. Decide before sleeping who will receive your history if you stop being good.",
      priorities: ["Avoid random repeats unless they test a specific change.", "If you become the Demon, rebuild your public story immediately.", "Track which former Demon is now poisoned Snake Charmer."],
      reveal: "A delayed list of safe checks can narrow Demon worlds, but early disclosure may tell the Demon exactly whom you have not checked.",
      pitfalls: ["Choosing a dead player.", "Forgetting that hitting the Demon swaps character and alignment."],
      bluff: "Publish a credible checked-player list slowly. In a chaotic line, an evil player can even claim they hit the Demon and are now evil, but the timing and resulting claims must hold together."
    },
    mathematician: {
      firstMove: "Record each number with the full dawn-to-dawn window and list which abilities could have worked abnormally because of another character.",
      priorities: ["Separate abnormal operation from an ordinary failed guess.", "Compare jumps with Sweetheart, No Dashii, or Vigormortis poisoning.", "Use low numbers to narrow causes rather than solve one player directly."],
      reveal: "Release the sequence when other claims provide candidate malfunctions to match against it.",
      pitfalls: ["Counting your own abnormal information about the number.", "Counting an ability that failed normally rather than due to another character."],
      bluff: "Low, steady counts are easier to defend. Wait for public claims, then choose a sequence that appears to explain a Sweetheart death or Demon poisoning pattern."
    },
    flowergirl: {
      firstMove: "Record every voter every day before receiving the nightly yes/no.",
      priorities: ["Create controlled voting groups when possible.", "Remember that a changed Demon may alter the candidate set.", "Compare results with actual public hands, not remembered intentions."],
      reveal: "Share the ledger once several days intersect into a useful Demon set.",
      pitfalls: ["Missing late hand changes.", "Treating a no as clearing someone who did not vote that day."],
      bluff: "This is a homework bluff: the public vote record must support every result. Preselect whom you want to frame and make sure the real Demon votes accordingly."
    },
    towncrier: {
      firstMove: "Record every nominator and receive the nightly yes/no before interpreting which nomination mattered.",
      priorities: ["Encourage controlled nomination sets.", "Track Minion changes and dead Minions.", "Compare the sequence rather than one isolated result."],
      reveal: "Reveal when a day with a small nominator set creates a useful clear or accusation.",
      pitfalls: ["Confusing voters with nominators.", "Forgetting that each player may nominate only once per day."],
      bluff: "Coordinate evil nominations before giving results. A false no can clear a Minion; a yes can frame every good nominator from that day."
    },
    oracle: {
      firstMove: "Create a row for every dead player and record the cumulative number each night.",
      priorities: ["Watch when the total rises.", "Include evil Outsiders or alignment changes.", "Test Fang Gu and Vigormortis worlds against both deaths and counts."],
      reveal: "A sequence becomes more useful after two or more deaths, but an early zero can still create a valuable trusted dead group.",
      pitfalls: ["Counting characters by printed team instead of current alignment.", "Forgetting that the number is cumulative."],
      bluff: "Truthful early counts can buy trust. Later, keep a dead Minion appearing good or invent a dead evil to discredit an information source. Every jump needs a candidate."
    },
    savant: {
      firstMove: "Visit the Storyteller and write both statements word for word. Do not simplify them from memory.",
      priorities: ["Solve all days together as constraints.", "Ask what each statement means before leaving.", "Avoid declaring which half is true too early."],
      reveal: "Share enough exact wording for other players to test, especially if you may die before the next visit.",
      pitfalls: ["Paraphrasing away a logical distinction.", "Forgetting that the Storyteller does not provide fake statements to a bluffer."],
      bluff: "Prepare two statements every day, one clearly supportable and one useful lie, and match the Storyteller's usual style. Broad early statements are easier to maintain."
    },
    seamstress: {
      firstMove: "Identify one trusted alignment anchor and one uncertain player. Save the comparison until the answer changes a real decision.",
      priorities: ["Remember you cannot select yourself.", "Use the result to link alignments, not identify exact roles.", "Record when the once-per-game ability was spent."],
      reveal: "Reveal immediately if the comparison resolves an execution; otherwise preserve surprise until the linked claims matter.",
      pitfalls: ["Comparing two unknowns with no plan.", "Using the ability while impaired and assuming a clean result."],
      bluff: "Link the Demon to a trusted good player with a same result, or split two trusted goods with different. Often safer for a Minion because the claim creates a testable link."
    },
    philosopher: {
      firstMove: "Survey missing abilities and likely in-play duplicates before choosing. Consider whom you may make drunk.",
      priorities: ["Choose for the current game, not raw power.", "Track the gained ability's timing exactly.", "Plan how a duplicate holder will interpret being drunk."],
      reveal: "Coordinate if the gained ability affects public planning, but secrecy can protect a powerful ongoing choice.",
      pitfalls: ["Choosing an ability without understanding its night timing.", "Forgetting the in-play original becomes drunk."],
      bluff: "Claim that you gained another ability and produce that role's history. If the real holder exists, your claim can make their contradictory results look like Philosopher drunkenness."
    },
    artist: {
      firstMove: "Write an exact yes/no question that divides the largest possible set of worlds, then confirm its interpretation with the Storyteller before using it.",
      priorities: ["Avoid ambiguous words such as ‘responsible’ or ‘near.’", "Ask about current or historical state deliberately.", "Record the precise wording and answer."],
      reveal: "Share the exact question, not just the conclusion.",
      pitfalls: ["Spending the ability on a question whose yes and no answers lead to the same action.", "Changing the wording when retelling it."],
      bluff: "Prepare exact wording and a plausible private visit. A fake Vortox-check answer can pressure town into the wrong execution choice."
    },
    juggler: {
      firstMove: "On day one, publicly make and record up to five player-character guesses before the opportunity ends.",
      priorities: ["Use the guesses to test real claims.", "Encourage other players to juggle so your behavior is less isolated.", "Keep the exact list and result."],
      reveal: "The guesses are public; reveal the number promptly enough for town to compare it with claims.",
      pitfalls: ["Making guesses after day one.", "Forgetting that players may have lied about their roles and Vortox information must be false."],
      bluff: "Make a real public list and choose a defensible number. Guessing evil characters for several good players can later support a frame if the reported count is high."
    },
    sage: {
      firstMove: "Look valuable enough to be killed without making the bait obvious, and decide which two-player result would be most informative if you trigger.",
      priorities: ["Stay in Demon kill range.", "Use voting and claim history to compare the shown pair.", "Distinguish Demon death from other night deaths."],
      reveal: "Reveal the pair immediately after a confirmed trigger so town can preserve and test it.",
      pitfalls: ["Expecting information after execution or non-Demon death.", "Hard-claiming so early that the Demon safely avoids you."],
      bluff: "A former Fang Gu or a Minion killed by Vigormortis can plausibly die at night and claim Sage. Name two candidates with the intended frame among them."
    },
    mutant: {
      firstMove: "Choose a believable Townsfolk claim and make a sincere effort to support it. Do not hint that you are secretly an Outsider.",
      priorities: ["Understand the Storyteller's madness expectations.", "Keep the fake Townsfolk history consistent.", "Balance helping town with avoiding an ability-triggered execution."],
      reveal: "Openly claiming Mutant may be judged a break of madness and can cause execution. Speak privately to the Storyteller if accessibility or wording is unclear.",
      pitfalls: ["Using coded admissions or obvious winks.", "Treating madness as a command that removes personal choice."],
      bluff: "An evil player can fake a Townsfolk and later claim the deception was Mutant madness. The Storyteller cannot execute the bluffer for a Mutant ability that is not real, so the timing needs another explanation."
    },
    sweetheart: {
      firstMove: "Tell a trusted player your role and identify which information chains could become uncertain if you die.",
      priorities: ["Avoid unnecessary death.", "After death, track where permanent drunkenness best explains contradictions.", "Do not assume who the Storyteller selected."],
      reveal: "Reveal when death is likely or when a later contradiction needs the Sweetheart world on record.",
      pitfalls: ["Publicly naming the player you think became drunk as if it were known.", "Using your death to dismiss all future information."],
      bluff: "A dying evil player can claim Sweetheart and use later contradictions as supposed drunkenness. Make sure the Outsider count and timing remain plausible."
    },
    barber: {
      firstMove: "Place your claim somewhere safe before death and keep a snapshot of every role claim that existed before a possible swap.",
      priorities: ["Announce the death clearly.", "Watch for changed claims or behavior.", "Remember the Demon may decline to swap."],
      reveal: "Reveal before or immediately after death so town knows a swap may have occurred.",
      pitfalls: ["Assuming a swap happened.", "Treating changed characters as changed alignments."],
      bluff: "A convincing fake usually needs coordinated evil players who can appear to swap claims. Otherwise use the mere uncertainty to weaken pre-death role information."
    },
    klutz: {
      firstMove: "Maintain a shortlist of living players you would safely choose if you died tonight.",
      priorities: ["Update the shortlist after every major reveal.", "Choose promptly on learning you are dead.", "Use mechanical evidence over social closeness."],
      reveal: "Claim before death if it helps trusted players prepare, but avoid giving evil an easy route to force a bad selection.",
      pitfalls: ["Choosing a dead player.", "Letting table pressure replace your own alignment evidence."],
      bluff: "Warn the Storyteller that you plan to fake the trigger so the table procedure stays clear. Choose an evil ally if trusted; choose a good player if your claim is already distrusted."
    },
    witch: {
      firstMove: "Curse someone likely to nominate and decide what public story their death would support.",
      priorities: ["Follow announced nomination plans.", "Protect the Demon from dangerous nominators.", "Adjust when only three players live and the ability stops."],
      reveal: "Do not reveal the real role. Use the curse pattern to make another Minion world look plausible if useful.",
      pitfalls: ["Cursing players who never nominate.", "Forgetting the final-three restriction."],
      bluff: "Your good cover needs to explain any caution around nominations. If town identifies a Witch, you can still imply the Witch is another living or dead candidate."
    },
    cerenovus: {
      firstMove: "Select a player and good character whose forced story will create a useful conflict without making the madness impossible to perform.",
      priorities: ["Create meaningful double claims.", "Coordinate with teammates' covers.", "Use repeat madness when pressure is more useful than novelty."],
      reveal: "Do not reveal the real role. If town knows a Cerenovus is active, exploit uncertainty over which claimant is genuinely mad.",
      pitfalls: ["Choosing an inaccessible or self-defeating madness task.", "Forcing a claim that directly exposes the Demon cover."],
      bluff: "Claim a good role with a normal history. If accused of inconsistency, a Cerenovus world may explain why another player—not you—was forced into the competing claim."
    },
    pithag: {
      firstMove: "Map which character changes remove the strongest threat, create a useful evil ability, or safely move the Demon.",
      priorities: ["Track every new token and alignment separately.", "Expect arbitrary deaths when creating a Demon.", "Coordinate major transformations with the current Demon."],
      reveal: "Do not reveal the real role. Character changes should support a public explanation such as Philosopher, Barber, or Snake Charmer where possible.",
      pitfalls: ["Trying to create an already in-play character.", "Creating a Demon without planning for arbitrary deaths and the old Demon."],
      bluff: "Build a complete good-role history and use real character changes to make contradictory claims look like normal Sects & Violets chaos."
    },
    eviltwin: {
      firstMove: "Learn the good twin's exact character, then prepare a full history and a reason your behavior fits it better than theirs.",
      priorities: ["Keep both twins alive when that blocks good's win.", "Attack credibility without sounding mechanically certain.", "Coordinate other evil information around the pair."],
      reveal: "The twin relationship is public between the two players; present your case early enough that silence does not concede it.",
      pitfalls: ["Relying only on confidence or volume.", "Forgetting that executing the good twin immediately gives evil the win."],
      bluff: "Your job is already a good-role bluff. Match choices, timing, and information closely enough that town cannot safely execute either twin."
    },
    fanggu: {
      firstMove: "Find a likely Outsider and decide whether jumping creates a safer Demon than remaining where you are.",
      priorities: ["Communicate enough that a new Fang Gu can identify the evil team.", "Use the +1 Outsider setup to support cover claims.", "After jumping, help the new Demon while dead."],
      reveal: "Never reveal the real role in live play. The old Fang Gu's death should look like an ordinary Demon kill.",
      pitfalls: ["Jumping to an Outsider who cannot adapt.", "Forgetting the jump happens only the first time the Fang Gu kills an Outsider."],
      bluff: "Build a cover that can survive your own night death if you plan to jump. The new Demon needs a separate believable history immediately."
    },
    nodashii: {
      firstMove: "Identify your two nearest Townsfolk neighbors and predict which false information their poisoning can create.",
      priorities: ["Kill players who can map the poison pattern.", "Keep your public claim compatible with the seating clues.", "Recalculate neighbors after character changes, not deaths—the ability names your two Townsfolk neighbors in seating order."],
      reveal: "Never reveal the real role. Encourage other poisoning explanations when neighboring information fails.",
      pitfalls: ["Ignoring that Outsiders and evil players are skipped when finding poisoned Townsfolk neighbors.", "Leaving an obvious geometric poison trail."],
      bluff: "Use neighboring bad information to make yourself or an ally look confirmed. Your good cover should not require consistently sober results from those same poisoned players."
    },
    vigormortis: {
      firstMove: "Decide which Minion ability remains valuable after death and which neighboring Townsfolk should become poisoned.",
      priorities: ["Kill Minions for a reason, not automatically.", "Use dead Minion activity to distort town's timeline.", "Remember the setup has one fewer Outsider."],
      reveal: "Never reveal the real role. Let Minion deaths appear to clear the players who pushed them when that protects you.",
      pitfalls: ["Killing a Minion whose ability offers no continued value.", "Forgetting only one Townsfolk neighbor is poisoned by each killed Minion."],
      bluff: "Choose a cover that benefits from dead-player trust. A killed Minion may claim Sage or another night-death role while continuing to use their real ability."
    },
    vortox: {
      firstMove: "Plan how every Townsfolk result can be false and make sure an execution occurs every day.",
      priorities: ["Track all information abilities, including once-per-game questions.", "Use compulsory falsity to build coherent wrong worlds.", "Push a safe execution whenever town considers skipping."],
      reveal: "Never reveal the real role. Good players may test Vortox by proposing no execution, so your cover needs a reason to oppose that plan.",
      pitfalls: ["Allowing true Townsfolk information.", "Forgetting the no-execution loss condition."],
      bluff: "A Vortox-checking Artist or other public test can become a powerful fake story. Ensure your reported information is compatible with the script's false-information rules."
    }
  }
};
