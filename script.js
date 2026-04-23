
const questionEl = document.getElementById("question");
const explanationEl = document.getElementById("explanation");
const answersEl = document.getElementById("answers");
const resultBox = document.getElementById("result");
const resultTitleEl = document.getElementById("result-title");
const resultTextEl = document.getElementById("result-text");

let state = {};
let stepCount = 0;

function updateProgress(percent) {
  const bar = document.getElementById("tool-progress-bar");
  if (bar) bar.style.width = percent + "%";
}

function setStep(step, total = 6) {
  stepCount = step;
  updateProgress((step / total) * 100);
}

function renderQuestion(question, explanation, options, step = 1, total = 6) {
  resultBox.style.display = "none";
  questionEl.textContent = question;
  explanationEl.textContent = explanation || "";
  answersEl.innerHTML = "";
  setStep(step, total);

  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "button";
    button.textContent = option.label;
    button.onclick = option.action;
    answersEl.appendChild(button);
  });
}

function showResult(title, reasons, entryPoint = "") {
  resultBox.style.display = "block";
  resultTitleEl.textContent = title;
  updateProgress(100);

  let html = "<strong>Why:</strong><ul>";
  reasons.forEach((reason) => {
    html += `<li>${reason}</li>`;
  });
  html += "</ul>";

  if (entryPoint) {
    html += `<p><strong>Trade Entry:</strong> ${entryPoint}</p>`;
  }

  resultTextEl.innerHTML = html;
}

function restartTool() {
  state = {};
  stepCount = 0;
  updateProgress(0);
  startTool();
}

function startTool() {
  state = {};
  renderQuestion(
    "What are you seeing?",
    "Choose the type of setup you want to check.",
    [
      { label: "Pattern", action: choosePattern },
      { label: "Indicator", action: chooseIndicator },
      { label: "Candlestick", action: chooseCandlestick }
    ],
    1,
    6
  );
}

/* ---------------- PATTERNS ---------------- */

function choosePattern() {
  state.type = "pattern";
  renderQuestion(
    "Which pattern are you seeing?",
    "Pick the pattern that best matches the chart.",
    [
      { label: "Head and Shoulders", action: askHSHeadHeight },
      { label: "Double Top", action: askDTTopLevel }
    ],
    2,
    6
  );
}

/* Head and Shoulders */

function askHSHeadHeight() {
  state.setup = "head-and-shoulders";
  renderQuestion(
    "Is the head clearly higher than both shoulders?",
    "The middle peak should be clearly higher than the two shoulders. If it isn't, the pattern is probably weak.",
    [
      { label: "Yes", action: () => { state.hsHead = "yes"; askHSShoulders(); } },
      { label: "Kind of", action: () => { state.hsHead = "kind-of"; askHSShoulders(); } },
      { label: "No", action: () => { state.hsHead = "no"; askHSShoulders(); } }
    ],
    3,
    6
  );
}

function askHSShoulders() {
  renderQuestion(
    "Are the shoulders roughly level?",
    "The shoulders don't have to be perfect, but they should look somewhat even.",
    [
      { label: "Yes", action: () => { state.hsShoulders = "yes"; askHSNeckline(); } },
      { label: "Somewhat", action: () => { state.hsShoulders = "somewhat"; askHSNeckline(); } },
      { label: "No", action: () => { state.hsShoulders = "no"; askHSNeckline(); } }
    ],
    4,
    6
  );
}

function askHSNeckline() {
  renderQuestion(
    "Is there a clear neckline?",
    "The neckline is the support line under the pattern. When price breaks it, that's usually the signal.",
    [
      { label: "Yes", action: () => { state.hsNeckline = "yes"; askHSResistance(); } },
      { label: "No", action: () => { state.hsNeckline = "no"; askHSResistance(); } }
    ],
    5,
    6
  );
}

function askHSResistance() {
  renderQuestion(
    "Is the pattern forming near resistance?",
    "A bearish pattern usually matters more if it forms where price has already had trouble going higher.",
    [
      { label: "Yes", action: () => { state.hsResistance = "yes"; askHSConfirmation(); } },
      { label: "No", action: () => { state.hsResistance = "no"; askHSConfirmation(); } }
    ],
    6,
    6
  );
}

function askHSConfirmation() {
  renderQuestion(
    "Did you check confirmation indicators?",
    "Confirmation means another signal supports the bearish reversal. For example, MACD weakening or price rejecting the upper Bollinger Band.",
    [
      { label: "MACD confirms", action: () => finishHS("macd") },
      { label: "Bollinger confirms", action: () => finishHS("bollinger") },
      { label: "Both confirm", action: () => finishHS("both") },
      { label: "None confirm", action: () => finishHS("none") }
    ],
    6,
    6
  );
}

function finishHS(confirm) {
  const strongShape = state.hsHead === "yes" && (state.hsShoulders === "yes" || state.hsShoulders === "somewhat");
  const clearStructure = state.hsNeckline === "yes";
  const strongLocation = state.hsResistance === "yes";
  const hasConfirm = confirm !== "none";

  if (strongShape && clearStructure && strongLocation && hasConfirm) {
    showResult(
      "RESULT: STRONG SELL SETUP",
      [
        "Head is clearly above both shoulders",
        "Shoulders look balanced enough",
        "There is a clear neckline",
        "The pattern is near resistance",
        "Other tools confirm weakness"
      ],
      "Enter when price breaks below the neckline."
    );
    return;
  }

  if (strongShape && clearStructure) {
    showResult(
      "RESULT: WAIT",
      [
        "The pattern is forming",
        "But the location or confirmation is not strong enough yet",
        "You want a cleaner neckline break with better support"
      ],
      "Wait for a neckline break with confirmation."
    );
    return;
  }

  showResult(
    "RESULT: NO TRADE",
    [
      "The pattern structure is weak or unclear",
      "The head and shoulders are not lining up well enough",
      "There is not enough confirmation"
    ]
  );
}

/* Double Top */

function askDTTopLevel() {
  state.setup = "double-top";
  renderQuestion(
    "Are the two tops level or close to level?",
    "The two highs should be close to the same level. If one is way higher, it's not really a double top.",
    [
      { label: "Yes", action: () => { state.dtLevel = "yes"; askDTResistance(); } },
      { label: "Slightly off", action: () => { state.dtLevel = "slightly-off"; askDTResistance(); } },
      { label: "No", action: () => { state.dtLevel = "no"; askDTResistance(); } }
    ],
    3,
    6
  );
}

function askDTResistance() {
  renderQuestion(
    "Is the pattern forming near resistance?",
    "A double top usually matters more if it forms where price has already struggled to break higher.",
    [
      { label: "Yes", action: () => { state.dtResistance = "yes"; askDTReject(); } },
      { label: "No", action: () => { state.dtResistance = "no"; askDTReject(); } }
    ],
    4,
    6
  );
}

function askDTReject() {
  renderQuestion(
    "Did price reject the second top?",
    "Rejection means price tried to go higher again but sellers pushed it back down.",
    [
      { label: "Strong rejection", action: () => { state.dtReject = "strong"; askDTNeckline(); } },
      { label: "Small rejection", action: () => { state.dtReject = "small"; askDTNeckline(); } },
      { label: "No rejection", action: () => { state.dtReject = "none"; askDTNeckline(); } }
    ],
    5,
    6
  );
}

function askDTNeckline() {
  renderQuestion(
    "Is there a clear neckline or support area below?",
    "The neckline is the support level between the two tops.",
    [
      { label: "Yes", action: () => { state.dtNeckline = "yes"; askDTConfirmation(); } },
      { label: "Not clearly", action: () => { state.dtNeckline = "no"; askDTConfirmation(); } }
    ],
    6,
    6
  );
}

function askDTConfirmation() {
  renderQuestion(
    "Did you check confirmation indicators?",
    "Confirmation means another tool supports the bearish idea. For example, MACD weakening or price rejecting the upper Bollinger Band.",
    [
      { label: "MACD confirms", action: () => finishDT("macd") },
      { label: "Bollinger confirms", action: () => finishDT("bollinger") },
      { label: "Both confirm", action: () => finishDT("both") },
      { label: "None confirm", action: () => finishDT("none") }
    ],
    6,
    6
  );
}

function finishDT(confirm) {
  const levelTops = state.dtLevel === "yes" || state.dtLevel === "slightly-off";
  const strongVersion = state.dtLevel === "yes";
  const resistance = state.dtResistance === "yes";
  const rejection = state.dtReject === "strong" || state.dtReject === "small";
  const strongReject = state.dtReject === "strong";
  const neckline = state.dtNeckline === "yes";
  const hasConfirm = confirm !== "none";

  if (strongVersion && resistance && strongReject && neckline && hasConfirm) {
    showResult(
      "RESULT: STRONG SELL SETUP",
      [
        "The two tops are level",
        "The second top was rejected",
        "The pattern is near resistance",
        "There is a clear neckline",
        "Indicators confirm weakness"
      ],
      "Enter when price breaks below the neckline."
    );
    return;
  }

  if (levelTops && resistance && rejection && neckline) {
    showResult(
      "RESULT: POSSIBLE SETUP - WAIT",
      [
        "The pattern is forming reasonably well",
        "But confirmation is weak or incomplete",
        "You want a stronger break or cleaner rejection"
      ],
      "Wait for the neckline break or a stronger rejection candle."
    );
    return;
  }

  showResult(
    "RESULT: NO TRADE",
    [
      "The tops are not clean enough or rejection is weak",
      "The location or structure does not support the setup enough",
      "There is not enough confirmation"
    ]
  );
}

/* ---------------- INDICATORS ---------------- */

function chooseIndicator() {
  state.type = "indicator";
  renderQuestion(
    "Which indicator are you looking at?",
    "Choose the indicator you want to check.",
    [
      { label: "MACD", action: askMACDLocation },
      { label: "Bollinger Bands", action: askBollingerTouch }
    ],
    2,
    6
  );
}

/* MACD */

function askMACDLocation() {
  state.setup = "macd";
  renderQuestion(
    "Where is price on the chart?",
    "Signals near support or resistance matter more than signals in the middle of the chart.",
    [
      { label: "Near support", action: () => { state.macdLocation = "support"; askMACDCross(); } },
      { label: "Near resistance", action: () => { state.macdLocation = "resistance"; askMACDCross(); } },
      { label: "Neither", action: () => { state.macdLocation = "neither"; askMACDCross(); } }
    ],
    3,
    6
  );
}

function askMACDCross() {
  renderQuestion(
    "What are the MACD lines doing?",
    "A cross up can mean momentum is starting to turn bullish. A cross down can mean momentum is starting to turn bearish.",
    [
      { label: "Crossing up", action: () => { state.macdCross = "up"; askMACDHistogram(); } },
      { label: "Crossing down", action: () => { state.macdCross = "down"; askMACDHistogram(); } },
      { label: "Not clearly crossing", action: () => { state.macdCross = "unclear"; askMACDHistogram(); } }
    ],
    4,
    6
  );
}

function askMACDHistogram() {
  renderQuestion(
    "What is the histogram doing?",
    "The bars show if momentum is getting stronger or weaker.",
    [
      { label: "Bars getting stronger", action: () => { state.macdBars = "stronger"; askMACDMatch(); } },
      { label: "Bars getting weaker", action: () => { state.macdBars = "weaker"; askMACDMatch(); } },
      { label: "Mixed", action: () => { state.macdBars = "mixed"; askMACDMatch(); } }
    ],
    5,
    6
  );
}

function askMACDMatch() {
  renderQuestion(
    "Does the signal match the location?",
    "Confirmation means the momentum direction agrees with chart location. For example, bullish momentum near support or bearish momentum near resistance.",
    [
      { label: "Yes", action: () => finishMACD("yes") },
      { label: "No", action: () => finishMACD("no") },
      { label: "Not sure", action: () => finishMACD("not-sure") }
    ],
    6,
    6
  );
}

function finishMACD(match) {
  if (
    state.macdLocation === "support" &&
    state.macdCross === "up" &&
    state.macdBars === "stronger" &&
    match === "yes"
  ) {
    showResult(
      "RESULT: BUY BIAS",
      [
        "Price is near support",
        "MACD is crossing up",
        "Momentum bars are getting stronger",
        "The signal matches the chart location"
      ],
      "Enter on the next bullish candle after the MACD cross."
    );
    return;
  }

  if (
    state.macdLocation === "resistance" &&
    state.macdCross === "down" &&
    state.macdBars === "stronger" &&
    match === "yes"
  ) {
    showResult(
      "RESULT: SELL BIAS",
      [
        "Price is near resistance",
        "MACD is crossing down",
        "Bearish momentum is building",
        "The signal matches the chart location"
      ],
      "Enter on the next bearish candle after the MACD cross."
    );
    return;
  }

  showResult(
    "RESULT: WAIT / NO EDGE",
    [
      "Momentum is unclear or mixed",
      "The location is not supporting the signal enough",
      "There is no strong edge here yet"
    ]
  );
}

/* Bollinger Bands */

function askBollingerTouch() {
  state.setup = "bollinger";
  renderQuestion(
    "Where is price touching the bands?",
    "Touching the outer bands usually means more than just moving around the middle.",
    [
      { label: "Upper band", action: () => { state.bbTouch = "upper"; askBollingerLocation(); } },
      { label: "Lower band", action: () => { state.bbTouch = "lower"; askBollingerLocation(); } },
      { label: "Middle", action: () => { state.bbTouch = "middle"; askBollingerLocation(); } }
    ],
    3,
    6
  );
}

function askBollingerLocation() {
  renderQuestion(
    "Is price near support or resistance?",
    "Bands matter more when they line up with a key level.",
    [
      { label: "Support", action: () => { state.bbLocation = "support"; askBollingerAction(); } },
      { label: "Resistance", action: () => { state.bbLocation = "resistance"; askBollingerAction(); } },
      { label: "Neither", action: () => { state.bbLocation = "neither"; askBollingerAction(); } }
    ],
    4,
    6
  );
}

function askBollingerAction() {
  renderQuestion(
    "What is price doing with the band?",
    "If price touches the band and quickly moves away, that's rejection. If it keeps hugging the band, that can mean trend continuation.",
    [
      { label: "Rejecting it", action: () => { state.bbAction = "rejecting"; askBollingerVolatility(); } },
      { label: "Riding it", action: () => { state.bbAction = "riding"; askBollingerVolatility(); } },
      { label: "Just touching", action: () => { state.bbAction = "touching"; askBollingerVolatility(); } }
    ],
    5,
    6
  );
}

function askBollingerVolatility() {
  renderQuestion(
    "Is volatility expanding or staying quiet?",
    "If the bands are expanding, it usually means the move has strength.",
    [
      { label: "Expanding", action: () => finishBollinger("expanding") },
      { label: "Tight / quiet", action: () => finishBollinger("tight") },
      { label: "Not sure", action: () => finishBollinger("not-sure") }
    ],
    6,
    6
  );
}

function finishBollinger(volatility) {
  if (
    state.bbTouch === "upper" &&
    state.bbLocation === "resistance" &&
    state.bbAction === "rejecting"
  ) {
    showResult(
      "RESULT: POSSIBLE SELL SETUP",
      [
        "Price is touching the upper band",
        "This is happening near resistance",
        "Price is rejecting the band",
        "The setup may show exhaustion"
      ],
      "Enter when price closes back inside the bands with bearish momentum."
    );
    return;
  }

  if (
    state.bbTouch === "lower" &&
    state.bbLocation === "support" &&
    state.bbAction === "rejecting"
  ) {
    showResult(
      "RESULT: POSSIBLE BUY SETUP",
      [
        "Price is touching the lower band",
        "This is happening near support",
        "Price is rejecting the band",
        "The setup may show bounce potential"
      ],
      "Enter when price closes back inside the bands with bullish momentum."
    );
    return;
  }

  showResult(
    "RESULT: WAIT",
    [
      "Price is not giving a strong band reaction",
      "The location is weak or price is just drifting",
      "There is not enough structure to enter yet"
    ]
  );
}

/* ---------------- CANDLESTICKS ---------------- */

function chooseCandlestick() {
  state.type = "candlestick";
  renderQuestion(
    "Which candlestick are you seeing?",
    "Choose the candle you want to check.",
    [
      { label: "Hammer", action: askHammerSupport },
      { label: "Doji", action: askDojiLocation }
    ],
    2,
    6
  );
}

/* Hammer */

function askHammerSupport() {
  state.setup = "hammer";
  renderQuestion(
    "Is the hammer forming at support?",
    "A hammer usually matters more if it shows up at support.",
    [
      { label: "Yes", action: () => { state.hammerSupport = "yes"; askHammerMove(); } },
      { label: "No", action: () => { state.hammerSupport = "no"; askHammerMove(); } }
    ],
    3,
    6
  );
}

function askHammerMove() {
  renderQuestion(
    "Did it appear after a downward move?",
    "A hammer usually works best after price has been dropping.",
    [
      { label: "Yes", action: () => { state.hammerMove = "yes"; askHammerWick(); } },
      { label: "No", action: () => { state.hammerMove = "no"; askHammerWick(); } }
    ],
    4,
    6
  );
}

function askHammerWick() {
  renderQuestion(
    "Is the lower wick clearly longer than the body?",
    "A real hammer should have a long lower wick.",
    [
      { label: "Yes", action: () => { state.hammerWick = "yes"; askHammerBody(); } },
      { label: "Slightly", action: () => { state.hammerWick = "slightly"; askHammerBody(); } },
      { label: "No", action: () => { state.hammerWick = "no"; askHammerBody(); } }
    ],
    5,
    6
  );
}

function askHammerBody() {
  renderQuestion(
    "Is the body near the top of the candle?",
    "The candle body should be near the top of the wick.",
    [
      { label: "Yes", action: () => { state.hammerBody = "yes"; askHammerConfirm(); } },
      { label: "No", action: () => { state.hammerBody = "no"; askHammerConfirm(); } }
    ],
    6,
    6
  );
}

function askHammerConfirm() {
  renderQuestion(
    "Did an indicator confirm the reaction?",
    "Confirmation means another tool supports a bullish reversal, like MACD turning up or price bouncing off the lower Bollinger Band.",
    [
      { label: "Yes", action: () => finishHammer("yes") },
      { label: "No", action: () => finishHammer("no") },
      { label: "Mixed", action: () => finishHammer("mixed") }
    ],
    6,
    6
  );
}

function finishHammer(confirm) {
  if (
    state.hammerSupport === "yes" &&
    state.hammerMove === "yes" &&
    state.hammerWick === "yes" &&
    state.hammerBody === "yes" &&
    confirm === "yes"
  ) {
    showResult(
      "RESULT: STRONG BUY SETUP",
      [
        "The hammer is at support",
        "It appeared after a downward move",
        "The lower wick is clearly long",
        "The body is near the top",
        "Indicators support the bullish reaction"
      ],
      "Enter when the next candle closes bullish above the hammer."
    );
    return;
  }

  if (
    state.hammerSupport === "yes" &&
    state.hammerMove === "yes" &&
    (state.hammerWick === "yes" || state.hammerWick === "slightly")
  ) {
    showResult(
      "RESULT: POSSIBLE REVERSAL",
      [
        "The hammer has some valid structure",
        "Location and prior move support a bounce idea",
        "But confirmation is not strong enough yet"
      ],
      "Wait for a bullish follow-through candle."
    );
    return;
  }

  showResult(
    "RESULT: WEAK HAMMER / NO TRADE",
    [
      "The candle structure or location is weak",
      "The setup is missing important context",
      "The hammer alone is not enough here"
    ]
  );
}

/* Doji */

function askDojiLocation() {
  state.setup = "doji";
  renderQuestion(
    "Where is the doji forming?",
    "A doji means more if it shows up at support or resistance.",
    [
      { label: "Support", action: () => { state.dojiLocation = "support"; askDojiBefore(); } },
      { label: "Resistance", action: () => { state.dojiLocation = "resistance"; askDojiBefore(); } },
      { label: "Neither", action: () => { state.dojiLocation = "neither"; askDojiBefore(); } }
    ],
    3,
    6
  );
}

function askDojiBefore() {
  renderQuestion(
    "What happened before the doji?",
    "A doji basically means the market couldn't decide which way to go.",
    [
      { label: "Strong move up", action: () => { state.dojiBefore = "up"; askDojiConfirm(); } },
      { label: "Strong move down", action: () => { state.dojiBefore = "down"; askDojiConfirm(); } },
      { label: "Sideways", action: () => { state.dojiBefore = "sideways"; askDojiConfirm(); } }
    ],
    4,
    6
  );
}

function askDojiConfirm() {
  renderQuestion(
    "Did you check confirmation indicators?",
    "Because a doji shows indecision, confirmation helps show which side might take control.",
    [
      { label: "MACD confirms", action: () => { state.dojiConfirm = "macd"; askDojiNext(); } },
      { label: "Bollinger confirms", action: () => { state.dojiConfirm = "bollinger"; askDojiNext(); } },
      { label: "Both confirm", action: () => { state.dojiConfirm = "both"; askDojiNext(); } },
      { label: "None", action: () => { state.dojiConfirm = "none"; askDojiNext(); } }
    ],
    5,
    6
  );
}

function askDojiNext() {
  renderQuestion(
    "Did the next candle confirm direction?",
    "The next candle usually tells you what direction wins.",
    [
      { label: "Bullish candle", action: () => finishDoji("bullish") },
      { label: "Bearish candle", action: () => finishDoji("bearish") },
      { label: "No confirmation yet", action: () => finishDoji("none") }
    ],
    6,
    6
  );
}

function finishDoji(nextCandle) {
  const hasConfirm = state.dojiConfirm !== "none";

  if (
    (state.dojiLocation === "support" || state.dojiLocation === "resistance") &&
    hasConfirm &&
    nextCandle !== "none"
  ) {
    showResult(
      "RESULT: POSSIBLE REVERSAL WATCH",
      [
        "The doji is forming at a key level",
        "The market is showing indecision",
        "Other tools are giving confirmation",
        "The next candle is helping show direction"
      ],
      "Enter when the next candle confirms direction."
    );
    return;
  }

  if (nextCandle === "none") {
    showResult(
      "RESULT: WAIT",
      [
        "A doji shows indecision",
        "There is no confirmed direction yet",
        "You need the next candle or another signal to choose a side"
      ],
      "Wait for the next candle to confirm direction."
    );
    return;
  }

  showResult(
    "RESULT: NO TRADE",
    [
      "The doji is not forming in a meaningful place",
      "There is little or no confirmation",
      "The signal is too weak to trust alone"
    ]
  );
}

startTool();
function toggle(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = (el.style.display === "block") ? "none" : "block";
}
