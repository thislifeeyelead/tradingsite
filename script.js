const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const resultBox = document.getElementById("result");
const resultText = document.getElementById("result-text");

let state = {};

function renderQuestion(question, options) {
  questionEl.textContent = question;
  answersEl.innerHTML = "";

  options.forEach(option => {
    const button = document.createElement("button");
    button.className = "button";
    button.textContent = option.label;
    button.onclick = () => option.action();
    answersEl.appendChild(button);
  });
}

function showResult(text) {
  resultBox.style.display = "block";
  resultText.textContent = text;
}

function hideResult() {
  resultBox.style.display = "none";
  resultText.textContent = "";
}

function restartTool() {
  state = {};
  hideResult();
  startTool();
}

function startTool() {
  renderQuestion("What are you seeing?", [
    {
      label: "Pattern",
      action: () => {
        state.type = "pattern";
        patternQuestion();
      }
    },
    {
      label: "Indicator",
      action: () => {
        state.type = "indicator";
        indicatorQuestion();
      }
    },
    {
      label: "Candlestick",
      action: () => {
        state.type = "candlestick";
        candlestickQuestion();
      }
    }
  ]);
}

function patternQuestion() {
  renderQuestion("Which pattern are you seeing?", [
    {
      label: "Double Top",
      action: () => {
        state.pattern = "double top";
        supportResistanceQuestion();
      }
    },
    {
      label: "Double Bottom",
      action: () => {
        state.pattern = "double bottom";
        supportResistanceQuestion();
      }
    },
    {
      label: "Triangle",
      action: () => {
        state.pattern = "triangle";
        supportResistanceQuestion();
      }
    },
    {
      label: "Flag",
      action: () => {
        state.pattern = "flag";
        supportResistanceQuestion();
      }
    },
    {
      label: "Head and Shoulders",
      action: () => {
        state.pattern = "head and shoulders";
        supportResistanceQuestion();
      }
    }
  ]);
}

function indicatorQuestion() {
  renderQuestion("Which indicator are you looking at?", [
    {
      label: "MACD",
      action: () => {
        state.indicator = "macd";
        supportResistanceQuestion();
      }
    },
    {
      label: "RSI",
      action: () => {
        state.indicator = "rsi";
        supportResistanceQuestion();
      }
    },
    {
      label: "Bollinger Bands",
      action: () => {
        state.indicator = "bollinger";
        supportResistanceQuestion();
      }
    },
    {
      label: "Moving Average",
      action: () => {
        state.indicator = "moving average";
        supportResistanceQuestion();
      }
    }
  ]);
}

function candlestickQuestion() {
  renderQuestion("Which candlestick are you seeing?", [
    {
      label: "Bullish Engulfing",
      action: () => {
        state.candle = "bullish engulfing";
        supportResistanceQuestion();
      }
    },
    {
      label: "Bearish Engulfing",
      action: () => {
        state.candle = "bearish engulfing";
        supportResistanceQuestion();
      }
    },
    {
      label: "Doji",
      action: () => {
        state.candle = "doji";
        supportResistanceQuestion();
      }
    },
    {
      label: "Hammer",
      action: () => {
        state.candle = "hammer";
        supportResistanceQuestion();
      }
    },
    {
      label: "Shooting Star",
      action: () => {
        state.candle = "shooting star";
        supportResistanceQuestion();
      }
    }
  ]);
}

function supportResistanceQuestion() {
  renderQuestion("Is it touching resistance, support, or neither?", [
    {
      label: "Resistance",
      action: () => {
        state.level = "resistance";
        nextQuestion();
      }
    },
    {
      label: "Support",
      action: () => {
        state.level = "support";
        nextQuestion();
      }
    },
    {
      label: "No",
      action: () => {
        state.level = "no";
        nextQuestion();
      }
    }
  ]);
}

function nextQuestion() {
  if (state.type === "indicator" && state.indicator === "macd") {
    renderQuestion("What is MACD doing?", [
      {
        label: "Crossing Up",
        action: () => {
          state.signal = "crossing up";
          macdResult();
        }
      },
      {
        label: "Crossing Down",
        action: () => {
          state.signal = "crossing down";
          macdResult();
        }
      },
      {
        label: "No Clear Cross",
        action: () => {
          state.signal = "no clear cross";
          macdResult();
        }
      }
    ]);
      return;
  }

  if (state.type === "indicator" && state.indicator === "rsi") {
    renderQuestion("Where is RSI?", [
      {
        label: "Overbought",
        action: () => {
          state.signal = "overbought";
          rsiResult();
        }
      },
      {
        label: "Oversold",
        action: () => {
          state.signal = "oversold";
          rsiResult();
        }
      },
      {
        label: "Neutral",
        action: () => {
          state.signal = "neutral";
          rsiResult();
        }
      }
    ]);
    return;
  }

  if (state.type === "indicator" && state.indicator === "bollinger") {
    renderQuestion("What is price doing with the band?", [
      {
        label: "Touching Upper Band",
        action: () => {
          state.signal = "upper band";
          bollingerResult();
        }
      },
      {
        label: "Touching Lower Band",
        action: () => {
          state.signal = "lower band";
          bollingerResult();
        }
      },
      {
        label: "Inside Bands",
        action: () => {
          state.signal = "inside bands";
          bollingerResult();
        }
      }
    ]);
    return;
  }

  if (state.type === "indicator" && state.indicator === "moving average") {
    renderQuestion("Where is price compared to the moving average?", [
      {
        label: "Above It",
        action: () => {
          state.signal = "above";
          maResult();
        }
      },
      {
        label: "Below It",
        action: () => {
          state.signal = "below";
          maResult();
        }
      },
      {
        label: "Crossing It",
        action: () => {
          state.signal = "crossing";
          maResult();
        }
      }
    ]);
    return;
  }

  if (state.type === "pattern") {
    renderQuestion("Is there confirmation?", [
      {
        label: "Yes",
        action: () => {
          state.confirmation = "yes";
          patternResult();
        }
      },
      {
        label: "No",
        action: () => {
          state.confirmation = "no";
          patternResult();
        }
      }
    ]);
    return;
  }

  if (state.type === "candlestick") {
    renderQuestion("Is trend matching the candlestick?", [
      {
        label: "Yes",
        action: () => {
          state.confirmation = "yes";
          candlestickResult();
        }
      },
      {
        label: "No",
        action: () => {
          state.confirmation = "no";
          candlestickResult();
        }
      }
    ]);
  }
}

function macdResult() {
  let text = "";

  if (state.level === "support" && state.signal === "crossing up") {
    text = "Possible buy setup. MACD crossing up at support is stronger bullish confirmation.";
  } else if (state.level === "resistance" && state.signal === "crossing down") {
    text = "Possible sell setup. MACD crossing down at resistance supports bearish rejection.";
  } else {
    text = "MACD is not lining up strongly enough here. Wait for clearer confirmation.";
  }

  showResult(text);
}

function rsiResult() {
  let text = "";

  if (state.level === "support" && state.signal === "oversold") {
    text = "Possible buy setup. RSI being oversold at support can support a bullish bounce.";
  } else if (state.level === "resistance" && state.signal === "overbought") {
    text = "Possible sell setup. RSI being overbought at resistance can support a bearish move.";
  } else {
    text = "RSI is not giving a strong support or resistance signal here.";
  }

  showResult(text);
}

function bollingerResult() {
  let text = "";

  if (state.level === "resistance" && state.signal === "upper band") {
    text = "Possible sell setup. Price touching the upper band at resistance may show exhaustion.";
  } else if (state.level === "support" && state.signal === "lower band") {
    text = "Possible buy setup. Price touching the lower band at support may show bounce potential.";
  } else {
    text = "Bollinger Bands are not giving a strong location-based setup here.";
  }

  showResult(text);
}

function maResult() {
  let text = "";

  if (state.level === "support" && state.signal === "above") {
    text = "Possible buy bias. Price staying above the moving average near support supports strength.";
  } else if (state.level === "resistance" && state.signal === "below") {
    text = "Possible sell bias. Price staying below the moving average near resistance supports weakness.";
  } else {
    text = "Moving average position is not giving a strong enough signal here.";
  }

  showResult(text);
}

function patternResult() {
  let text = "";

  if (state.pattern === "double top" && state.level === "resistance" && state.confirmation === "yes") {
    text = "Possible sell setup. Double top at resistance with confirmation is stronger.";
  } else if (state.pattern === "double bottom" && state.level === "support" && state.confirmation === "yes") {
    text = "Possible buy setup. Double bottom at support with confirmation is stronger.";
  } else if (state.pattern === "head and shoulders" && state.level === "resistance" && state.confirmation === "yes") {
    text = "Possible sell setup. Head and shoulders near resistance with confirmation is stronger.";
  } else {
    text = "The pattern is there, but the location or confirmation is weak.";
  }

  showResult(text);
}

function candlestickResult() {
  let text = "";

  if ((state.candle === "bullish engulfing" || state.candle === "hammer") && state.level === "support" && state.confirmation === "yes") {
    text = "Possible buy setup. Bullish candlestick at support with trend agreement is stronger.";
  } else if ((state.candle === "bearish engulfing" || state.candle === "shooting star") && state.level === "resistance" && state.confirmation === "yes") {
    text = "Possible sell setup. Bearish candlestick at resistance with trend agreement is stronger.";
  } else if (state.candle === "doji") {
    text = "Doji shows indecision. Wait for confirmation before doing anything reckless.";
  } else {
    text = "The candlestick signal is not strong enough by itself here.";
  }

  showResult(text);
}

startTool();