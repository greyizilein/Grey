/* ==========================================================
   GREY — the bookshop catalogue
   One entry per book, in shelf order. Each book also gets its own
   page at book.html?b=<id>.
   To start selling a book, fill in:
     price    the price in Naira, e.g. 5000
     buyLink  the book's page on the Paystack storefront (Paystack takes the
              payment and delivers the download)
     format   optional, e.g. "PDF · 320 pages"
     sample   true when assets/grey/samples/<id>.json holds a free sample;
              the book then gets a "Read a sample" button and opens in
              the reader at reader.html?b=<id>
   A book without a price or buy link shows "Coming soon".
   ========================================================== */
(function () {
var G = (window.GREY = window.GREY || {});

G.series = {
  "Neither": "A political thriller trilogy set in Nigeria, 2057.",
  "An Autobiography of God": "Theology, philosophy and suspense: the divine story retold.",
};

G.author = {
  name: "Grey Izilein",
  bio: [
      "Grey Izilein has spent years working behind the curtain of publishing as a professional ghostwriter. Through his collaborations with ghostwriting companies and independent clients, he has written across genres, giving life to the voices, visions, and stories of others.",
      "For Grey, writing is a discovery. He writes out of curiosity for the human potential for good and evil, and as a way to test the extent of his own capabilities by simulating the world through the lives and reasoning of his characters. Strategic, curious, and calculating like the typical Aquarius-INTJ, he is fascinated by how people perceive the world and why.",
      "Most of all, he is intrigued by how easily the ordinary is dismissed as mediocre, when in truth it holds some of humanity’s most compelling stories. To him, the beauty of the ordinary lies in its power to reveal extraordinary heroes and villains, proving the truth in the saying: “Out of intense complexities, intense simplicities arise.” Grey writes not to claim uniqueness, but to explore what it means to be human and to distinguish the shade of his humanity from that of everyone else."
  ],
};

G.books = [
  {
    id: "neither-1",
    sample: true,
    series: "Neither",
    number: 1,
    title: "Neither",
    subtitle: "An Unemotional Perspective",
    author: "Grey Izilein",
    price: 8500,
    format: "",   // CONFIRM
    buyLink: "https://paystack.shop/greysllc?product=neither-an-unemotional-perspective-akamby",
    cover: "assets/grey/books/neither-1.webp",
    blurb: ["It’s Nigeria, 2057, and power is a dangerous inheritance. The Quinn family have everything, wealth, loyalty, and a legacy that makes them untouchable. But when Harlequin Quinn the President dies under suspicious circumstances, the cracks in their dynasty are revealed. His twin, Merceides, scrambles to hold the family together while their third brother, Elzaiya, a hidden reclusive genius with a brilliantly dangerous mind steers events from the shadows. At his side is Machiavelli, a street orphan turned confidant, bound by friendship and loyalty. Across the city, Bala Sarki, the ruthless sultan whose empire is built on lies, hungers for the Quinns’ land. His brother Emerson, brilliant but unhinged, plots revenge born of betrayal and obsession. When Sarki’s daughter is kidnapped and suspicion falls on the Quinns, a chain of assassinations, betrayals, and political games is set into motion. From Lagos to Palestine, no one is safe. Families devour themselves, enemies masquerade as friends, and survival means sacrificing everything, love, loyalty, even conscience. Neither: An Unemotional Perspective is a searing tale of power and ambition, where every choice tilts the balance between life and death."],
    synopsis: ["The year is 2057. Nigeria stands scarred by civil wars and rebuilt through fragile alliances, but beneath the glass towers and presidential halls, corruption, vengeance, and blood feuds remain.", "At the centre is the Quinn dynasty, wealthy, adored, and envied. The twins, Harlequin and Merceides, command the nation’s spotlight, yet it is their third brother, Elzaiya, a reclused genius with rare talents and a mind as dangerous as it is brilliant, who shapes their fates. Alongside him stands Machiavelli, once a street orphan, now bound to Elzaiya by respect, loyalty, and friendship.", "Their enemies are no less formidable. Bala Sarki, one of Africa’s richest men, craves the Quinns’ uranium-rich lands, while his brother Emerson, a brilliant, unstable mastermind, plots revenge rooted in old betrayals and unquenched desire. When Sarki’s daughter is kidnapped in a meticulously staged abduction, and Harlequin dies under mysterious circumstances, the fragile balance shatters.", "From Lagos to Palestine, fortunes shift through assassinations, kidnappings, and betrayals. Loyalties are tested, alliances splinter, and hidden truths are revealed. Everyone must reckon with the question: are they in control of their fate, or they merely pawns in a larger game designed by players more formidable than they thought?", "Neither: An Unemotional Perspective is a sweeping saga of power, family, and love, where enemies wear the mask of allies, love becomes a weapon, and survival demands cold, ruthless realism."],
  },
  {
    id: "neither-2",
    sample: true,
    series: "Neither",
    number: 2,
    title: "Neither II",
    subtitle: "An Unusual Diary",
    author: "Grey Izilein",
    price: 8500,
    format: "",   // CONFIRM
    buyLink: "https://paystack.shop/greysllc?product=neither-an-unusual-diary-dieetc",
    cover: "assets/grey/books/neither-2.webp",
    blurb: ["The Quinn family stands at the edge of collapse. In the wake of betrayal and bloodshed, Elzaiya hides behind the name “Cain,” concealing his true identity even from those closest to him. It is a fragile disguise, one that shields him from enemies yet threatens to consume him with every passing day. But ghosts do not rest. Emerson’s shadow lingers over the Quinn legacy, twisting loyalties and stirring doubts that no one can ignore. His influence presses down on Elzaiya, forcing him to confront whether he is preserving his family—or becoming everything he once despised.", "Into this unrest steps Kane, a figure as ruthless as he is unpredictable. His arrival disrupts the fragile balance Elzaiya has built, drawing allies and enemies alike into a spiral of mistrust, revenge, and blood. While Harvey struggles to recover and Hadeezah’s presence reawakens Elzaiya’s humanity, enemies tighten their grip, determined to tear apart what remains of the Quinns.", "Neither: An Unusual Diary deepens the saga into a battle of identity, loyalty, and survival. It is a story of masks and betrayals, of a family bound by blood and broken by power, and of a man who must decide whether protecting his family is worth the cost of losing himself."],
    synopsis: ["In the wake of betrayal and Emerson’s poisonous legacy, Elzaiya takes on the mask of “Cain,” a false identity that shields him but also pulls him deeper into a world of lies and suspicion. Haunted by ghosts and bound to secrets too dangerous to confess, he walks the fine line between survival and self-destruction. But shadows do not vanish so easily. Emerson’s influence lingers like a wound that refuses to heal, shaping the path Elzaiya dreads becoming his own. Into this fragile balance comes Kane, enigmatic, brutal, and impossible to ignore. His presence forces Elzaiya to confront both his enemies and the darkness rising within himself.", "All around, the Quinn circle tightens. As Harvey clings to life, as innocents like Aretta and others fall in the crossfire, morality itself begins to blur. Hadeezah’s presence offers Elzaiya fleeting humanity, but every choice he makes drags him closer to the abyss Emerson has called him to see. The Quinn legacy, once about power and legacy, now fractures around questions of justice, vengeance, and the unbearable cost of survival. Allies turn uncertain, while foes press in with threats of blood and ruin. Every decision cuts home, binding Elzaiya to the fate of his family even as it corrodes the boundaries of who he once was.", "The story carries the Quinn saga into darker territory, where vengeance and loyalty blur, and the cost of survival may be nothing less than the soul of its heir. Neither: An Unusual Diary is a continuation that plunges deeper into the human psyche, testing the line between hero and villain, love and destruction, good and evil—and asking whether anyone can suffer endlessly without becoming the very thing they once fought against."],
  },
  {
    id: "neither-3",
    sample: true,
    series: "Neither",
    number: 3,
    title: "The Hanging Commercials",
    subtitle: "Neither, Book III",
    author: "Grey Izilein",
    price: 8500,
    format: "",   // CONFIRM
    buyLink: "https://paystack.shop/greysllc?product=neither-the-hanging-commercials-axoxyt",
    cover: "assets/grey/books/neither-3.webp",
    blurb: ["The Quinn family is pulled deeper into a struggle that threatens to consume them all. After the chaos of betrayal and bloodshed, Elzaiya joins forces with Aleks Evander, a father whose grief has hardened into vengeance and whose resources can turn mourning into war. Their pact offers Elzaiya protection and power, but it also ties him to a man whose rage mirrors the very darkness he has tried to resist.", "Inside the family, loyalties continue to unravel. Harlequin seizes the chance to rebuild his reputation by casting Elzaiya as a dangerous manipulator before the world. Aaira, torn by pride and obsession, binds herself to Emerson, even as her choices sever the last fragile threads of kinship. And Emerson himself—unrelenting, brilliant, and ruthless—remains the shadow no one can escape, shaping the family’s fate even in silence.", "Amidst political deception and violent retribution, Elzaiya finds himself entangled in Aleks’s household, where Irina Evander’s presence complicates every alliance with a dangerous pull of her own. Neither: The Hanging Commercials continues the Quinn saga with greater intensity, drawing its characters into a world where deception becomes currency, vengeance corrodes love, and survival may demand a price Elzaiya can no longer afford to pay."],
    synopsis: ["As The Hanging Commercials opens, Elzaiya is thrust into the global spotlight. After surviving betrayal, assassination attempts, and the poison of Emerson’s legacy, Elzaiya steps further into a world where every move is watched and each alliance could mean death. To shield himself while striking back, he forges a pact with Aleks Evander, a grieving patriarch whose wealth and influence make him a formidable ally—but whose thirst for vengeance rivals even the Quinns’ darkest instincts. For Elzaiya, Aleks represents both an opportunity and a warning of what unchecked rage can become.", "But enemies within the family prove harder to escape than those outside. Harlequin, unwilling to accept his diminished role, returns to public life, painting Elzaiya as a deranged manipulator. Aaira, torn between pride, shame, and a destructive devotion to Emerson, unravels what little stability remains of maternal bonds. And Emerson himself, cunning, tireless, and lethal, casts a shadow that refuses to fade.", "Elzaiya’s balancing act grows ever more precarious as Aleks draws him into a game of power and blood, while Irina Evander, Aleks’s daughter, tempts him with a dangerous allure that blurs the lines between ally, betrayer, and lover. At the same time, Elzaiya marshals the rest of the Quinn family to his side, and together, they fight their common foes, but their rivalry over method, morality, and truth threatens to collapse the fragile front they present.", "At the heart of it all, Hadeezah becomes Elzaiya’s fragile tether to humanity, even as his choices place her in greater danger with each passing day. Her presence reminds him of what he could lose, yet also forces him to face the truth of what he has become.", "Neither: The Hanging Commercials is an unflinching continuation of the Quinn saga, where power is coveted, love is dangerous, and family is its own salvation and its curse. As betrayal multiplies and vengeance fuels every choice, Elzaiya’s war becomes a question of identity: can he hold on to the love that anchors him, or will the chaos he believed he could control finally consume him?"],
  },
  {
    id: "aog-1",
    sample: true,
    series: "An Autobiography of God",
    number: 1,
    title: "God So Loved the World",
    subtitle: "An Autobiography of God, Book I",
    author: "Grey Izilein",
    price: null,   // CONFIRM
    format: "",   // CONFIRM
    buyLink: "",   // CONFIRM
    cover: "assets/grey/books/aog-1.webp",
    blurb: ["An Autobiography of God: God So Loved the World is a daring re-imagining of the divine narrative, blending theology, philosophy, and modern suspense into a story that questions humanity’s deepest assumptions.", "The book opens with a haunting premise: if every death is predetermined, then even suicide must be divinely ordained. From this unsettling challenge to fate and free will, the narrative shifts between heaven and earth. In the celestial court, God, Zehra—the mischievous diplomat of heaven, and the Morning Star debate humanity’s worth. On earth, the fallout is felt in the lives of three strangers.", "Zyair, an anxious analyst, stumbles upon a deadly secret hidden inside a pair of headphones. Genesys, a sharp-witted bookseller, becomes entangled in riddles that pit intellect against danger. Lauren, the enigmatic new neighbour, may be an ally or not. And when Mr. Rogers dies violently, their lives spiral into break-ins, gunfire, and coded conspiracies, unaware that unseen forces are pulling their strings.", "Grey Izilein delivers a gripping tale where scripture collides with suspense, and every question about love, fate, and freedom might be part of God’s own unfinished autobiography."],
    synopsis: ["An Autobiography of God: God So Loved the World is a daring re-imagining of the divine narrative, blending theology, philosophy, and thriller-like storytelling into a work that questions humanity’s deepest assumptions. Written through a kaleidoscope of perspectives: from an Oxford research paper to the conversations of angels, the devil, and mortals, it presents a story where heaven’s order, human free will, and cosmic manipulation collide.", "The book begins with an unsettling premise: if death were truly predetermined, then even suicide must be divinely ordained. From this springboard, the narrative challenges ideas of fate, providence, and the reality of free will. Through the voice of Maximus E. Rex, a scholar pitting faith and logic, readers are invited into a zero-sum game of questioning, where the act of asking is as critical as the answers themselves. The novel then shifts to a celestial stage, where God, Zehra, the Devil, and Regulus debate humanity’s worth. They plot, entice kings and empires to ruin, and quietly guide human destiny, revealing both divine restraint and infernal cunning.", "As centuries collapse into the present day, the outcomes are revealed in several people’s lives: Zyair, a withdrawn financial analyst haunted by anxiety; Genesys, a sharp-tongued bookstore worker obsessed with life’s meaning; and Lauren, a mysterious new neighbour. Their paths converge after the violent death of Mr. Rogers, a man guarding a secret embedded within a simple pair of headphones. What begins as chance encounters spirals into a series of break-ins, gunshots, and coded messages, pulling the trio into a web of supernatural intrigue. They must confront not only earthly conspiracies but also the invisible hand of cosmic powers.", "Grey Izilein’s narrative refuses easy answers. It portrays humanity as both fragile and transcendent: capable of love, betrayal, sacrifice, and cruelty, while forcing the reader to ask: if God truly authored His own autobiography, would it be the Bible as it is today, or a confession of love, a defense of free will, or a chronicle of unfinished creation? The result is a gripping, intellectually provocative tale that weaves ancient scripture, philosophical riddles, and modern suspense into a miasma of belief and doubt."],
  },
  {
    id: "aog-2",
    sample: true,
    series: "An Autobiography of God",
    number: 2,
    title: "The Nature of Our Flaws",
    subtitle: "An Autobiography of God, Book II",
    author: "Grey Izilein",
    price: null,   // CONFIRM
    format: "",   // CONFIRM
    buyLink: "",   // CONFIRM
    cover: "",
    note: "Contains themes of grief, abuse and exploitation.",
    blurb: ["When six-year-old Safiyah loses her parents in a sudden plane crash, her world collapses overnight. Stripped of family, home, and inheritance by predatory relatives, she clings to Mariam—the maid who becomes her protector and only anchor. But survival soon forces Safiyah into darker trials: exploitation, betrayal, and choices that will shape the rest of her life.", "Over her story looms a cosmic debate. God claims He has always been present, though silent. The Devil insists he is merely watching as humanity destroys itself. Between divine restraint and infernal cunning lies Safiyah’s fragile struggle to hold onto love, dignity, and a sense of self.", "Bold, unsettling, and deeply human, The Nature of Our Flaws is not just a novel—it is a confrontation with suffering, faith, and the shadows we carry within us."],
    synopsis: ["In An Autobiography of God: The Nature of Our Flaws, Grey Izilein delivers a bold and unsettling exploration of grief, survival, and the fragile interplay between divine oversight and human corruption. Told through shifting perspectives—including God, the Devil, and the young girl at the centre of the story—the novel blurs the boundaries between theological reflection and raw, lived suffering.", "At its heart is Safiyah, a six-year-old whose life unravels in an instant when her parents die in a mysterious plane crash. What begins as a child’s intimate grief soon spirals into a battle for survival. Her inheritance is stolen by predatory relatives, her innocence is eroded by betrayal and predation, and her trust in the world fractures beyond repair. Through it all, Mariam—the maid who becomes both sister and guardian—fights to hold Safiyah together, even as forces far larger than them plot her downfall. Their relationship becomes the fragile thread that resists despair, offering moments of love, protection, and resilience amidst a landscape of exploitation.", "Hovering over their lives are two narrators: God, who claims constant presence yet allows tragedy to unfold, and the Devil, who delights in Safiyah’s suffering while insisting that human choices—not his manipulations—are the true architects of evil. Their alternating voices transform the narrative into a philosophical battleground, asking whether suffering is divinely permitted, devilishly orchestrated, or simply born of human flaws.", "Across Safiyah’s journey—from orphaned child to determined young woman—the novel confronts readers with uncomfortable questions: Where does grief end and corruption begin? How do the wounds of abuse reshape identity? Can love, however fragile, redeem what has been shattered? Brutal and haunting, yet threaded with flickers of hope, Izilein’s work is less a conventional story than a mirror held up to the human condition. It dares the reader to reckon with loss, betrayal, survival, and the quiet persistence of belief, even when faith feels impossible."],
  },
  {
    id: "aog-3",
    sample: true,
    series: "An Autobiography of God",
    number: 3,
    title: "The Unnamed Judge",
    subtitle: "An Autobiography of God, Book III",
    author: "Grey Izilein",
    price: null,   // CONFIRM
    format: "",   // CONFIRM
    buyLink: "",   // CONFIRM
    cover: "assets/grey/books/aog-3.webp",
    note: "A narration of Judges 19–21. Contains graphic violence, including sexual violence.",
    blurb: ["Israel, 1028 BC. There is no king in the land, and every man does what is right in his own eyes.", "Levi ben Saar is a priest's son who learned how men behave by watching his father's flock. When a dying stranger brings word of a Moabite invasion, the quiet boy stands before the elders of his tribe, shames them into action, and wins a war without losing a single man. Soon all of Israel is calling him Sar ha-Séder, the Prince of Order.", "Malchi ben Abner is Benjamin's unloved heir, blamed for his brother's death and schooled in theft and influence by a charming liar named Caleb. Where Levi builds trust, Malchi buys debts, until half of Israel owes Benjamin its bread.", "Their rivalry begins with a slap in a courtyard. It ends at Gibeah, on a night no one in Israel will ever forget, and with a judge who sends his grief to every tribe.", "The Unnamed Judge retells Judges 19–21 as the story of a righteous man in a lawless age, and asks what becomes of him when the law has failed and heaven is silent: how the Prince of Order became Mélekh ha-Métim, the King of the Dead."],
    synopsis: ["The Unnamed Judge is the third book of An Autobiography of God, a narration of the closing chapters of the Book of Judges, when Israel had no king and every man did what was right in his own eyes. Grey Izilein gives the Bible's nameless Levite a name, a childhood and a mind, and follows him from boyhood to the edge of a civil war.", "Levi ben Saar grows up in Ramathaim, the son of a peace-loving priest, with the gift of the men of Issachar: he understands the times. When his family takes in Eliab, a famine refugee from Ephraim, Levi falls for Eliab's daughter Miriam, a girl who carries a scar from a Benjamite raid. When a dying soldier warns of a Moabite invasion, Levi speaks before the elders, is made the youngest elder in his tribe's history, and, with the commander Uri ben Hador, wins the battle of Abel-Shittim without losing a man.", "In Benjamin, Malchi ben Abner grows up despised by his father, until a thief named Caleb teaches him that fear and debt are better tools than love. Eight years later, Benjamin is creditor to half of Israel and has made Ephraim its vassal. Levi breaks that hold before the Great Council, and Malchi answers with his fists and then with something far colder.", "What follows is a war of minds. Raids strike exactly where Levi's defences are weakest, and his reputation collapses until he unmasks the traitor feeding his plans to the enemy. But the price of being right is paid by those he loves. Silenced by grief and betrayed by someone close to him, Levi withdraws to Mount Ephraim, until a journey home ends at Gibeah, on a night that will force all of Israel to choose between comfort and justice.", "Measured, intimate and at times unbearably violent, The Unnamed Judge is a study of how righteousness curdles into vengeance when no one else will act, and of a nation that only finds its conscience when it is forced to look at its own darkness."],
  },
  {
    id: "venn-and-the-priori",
    series: "",
    number: 0,
    title: "Venn & The Priori",
    subtitle: "The envious art of knowing how to possess all that you desire",
    author: "Grey Izilein",
    price: null,   // CONFIRM
    format: "",   // CONFIRM
    buyLink: "",   // CONFIRM
    cover: "assets/grey/books/venn-and-the-priori.webp",
    blurb: ["In a community where faith and crime are neighbours, a child grows up without parents, raised instead by nuns who preach salvation with cigarettes in their mouths and guns at their hips. Poverty is constant, dignity fragile, and the only lesson that endures is simple: no one is coming to save you.", "At fifteen, the question becomes urgent—do you need a noble reason to not want to be poor, or is wanting more enough? A chance encounter with the execution of a local crime lord forces a choice: walk away and stay powerless, or step forward into a world of diamonds, blood, and promises whispered by dangerous strangers. Choosing survival means crossing a line that cannot be uncrossed.", "School by day and apprentice to shadows by night, the unnamed narrator learns that wealth is leverage, loyalty is currency, and love is both weakness and weapon. A fleeting romance offers escape, while a mentor’s ruthless philosophy sharpens ambition into something more dangerous: strategy. But as each circle of life begins to overlap—the street, the parish, the classroom, the underworld—the danger grows.", "Venn & The Priori is not just a story of crime and survival; it is a meditation on desire, power, and the price of wanting more. It asks: when poverty demands your obedience and power offers you freedom, how much of yourself are you willing to trade to possess everything you desire?"],
    synopsis: [],
  }
];
})();
