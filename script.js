const tradeForm = document.getElementById('tradeForm');
const result = document.getElementById('result');

if (tradeForm && result) {
  tradeForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const pattern = document.getElementById('pattern').value;
    const trend = document.getElementById('trend').value;
    const indicator = document.getElementById('indicator').value;

    if (!pattern || !trend || !indicator) {
      result.className = 'result-box result-no';
      result.innerHTML = `
        <h2>Yes/No Outcome</h2>
        <p><strong>No result yet.</strong> Fill out all three fields so the tool can stop guessing.</p>
      `;
      return;
    }

    const bullishPattern = pattern === 'Flag' || pattern === 'Triangle';
    const bearishPattern = pattern === 'Double Top' || pattern === 'Head and Shoulders';

    const trendMatch = (bullishPattern && trend === 'Uptrend') || (bearishPattern && trend === 'Downtrend');
    const strongSetup = trendMatch && indicator === 'Strong';
    const maybeSetup = trendMatch && indicator === 'Partial';

    if (strongSetup) {
      result.className = 'result-box result-yes';
      result.innerHTML = `
        <h2>Yes/No Outcome</h2>
        <p><strong>Yes, this looks more structured.</strong> Your selected pattern fits the current trend direction and has strong indicator confirmation. That does not guarantee a win. It just means the setup has more logic behind it.</p>
      `;
    } else if (maybeSetup) {
      result.className = 'result-box';
      result.innerHTML = `
        <h2>Yes/No Outcome</h2>
        <p><strong>Maybe.</strong> The pattern and trend direction match, but indicator confirmation is only partial. This setup may need more patience or a better entry.</p>
      `;
    } else {
      result.className = 'result-box result-no';
      result.innerHTML = `
        <h2>Yes/No Outcome</h2>
        <p><strong>No.</strong> The trend direction and pattern are not lining up well, or indicator confirmation is weak. Passing on bad trades is still a decision, despite humanity's ongoing war against restraint.</p>
      `;
    }
  });
}