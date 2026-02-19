const FACTORS = [
  {
    key: "scaleEconomies",
    label: "Scale Economies",
    hint: "Cost advantage from size and distribution.",
    weight: 15,
  },
  {
    key: "networkEconomies",
    label: "Network Economies",
    hint: "Product value improves with user growth.",
    weight: 15,
  },
  {
    key: "counterPositioning",
    label: "Counter Positioning",
    hint: "Business model incumbents struggle to copy.",
    weight: 10,
  },
  {
    key: "switchingCosts",
    label: "Switching Costs",
    hint: "Customer friction to leave is high.",
    weight: 15,
  },
  {
    key: "branding",
    label: "Branding",
    hint: "Trust or identity supports premium pricing.",
    weight: 15,
  },
  {
    key: "corneredResource",
    label: "Cornered Resource",
    hint: "Unique assets, licenses, data, or talent.",
    weight: 15,
  },
  {
    key: "processPower",
    label: "Process Power",
    hint: "Hard-to-copy operating know-how.",
    weight: 15,
  },
];

const SECTOR_BIASES = {
  software: { switchingCosts: 1, processPower: 1 },
  consumer: { branding: 1 },
  industrial: { scaleEconomies: 1, processPower: 1 },
  financial: { switchingCosts: 1, branding: 1 },
  platform: { networkEconomies: 1, scaleEconomies: 1 },
  semiconductor: { corneredResource: 1, processPower: 1 },
};

const form = document.querySelector("#moatForm");
const factorGrid = document.querySelector("#factorGrid");
const results = document.querySelector("#results");
const companyHeading = document.querySelector("#companyHeading");
const overallSummary = document.querySelector("#overallSummary");
const moatScore = document.querySelector("#moatScore");
const moatTier = document.querySelector("#moatTier");
const powersList = document.querySelector("#powersList");
const risksList = document.querySelector("#risksList");
const questionsList = document.querySelector("#questionsList");

function createFactorInputs() {
  FACTORS.forEach((factor) => {
    const wrapper = document.createElement("label");
    wrapper.className = "factor-card";
    wrapper.innerHTML = `
      ${factor.label}
      <small>${factor.hint}</small>
      <input type="range" min="1" max="5" value="3" name="${factor.key}" />
    `;
    factorGrid.appendChild(wrapper);
  });
}

function scoreTier(score) {
  if (score >= 75) return { text: "Strong moat", className: "strong" };
  if (score >= 50) return { text: "Moderate moat", className: "moderate" };
  return { text: "Weak moat", className: "weak" };
}

function analyze(formData) {
  const sector = formData.get("sector");
  const sectorBias = SECTOR_BIASES[sector] || {};

  let total = 0;
  const rows = FACTORS.map((factor) => {
    const raw = Number(formData.get(factor.key));
    const adjusted = Math.min(5, raw + (sectorBias[factor.key] || 0));
    const weighted = (adjusted / 5) * factor.weight;
    total += weighted;

    return {
      label: factor.label,
      adjusted,
      weighted: Math.round(weighted * 10) / 10,
      status: adjusted >= 4 ? "Strong" : adjusted >= 3 ? "Moderate" : "Weak",
    };
  });

  const score = Math.round(total);
  const weakAreas = rows.filter((row) => row.adjusted <= 2).map((row) => row.label);

  const risks = weakAreas.length
    ? weakAreas.map((area) => `${area}: potential vulnerability if competitors invest aggressively.`)
    : ["No obvious weak power detected from selected inputs; watch for disruption and regulation."];

  const questions = [
    "Has the company improved pricing power over the last 3-5 years?",
    "Are customer retention and repeat behavior stable through downturns?",
    "Can a well-funded competitor replicate the advantage within 24 months?",
  ];

  if (weakAreas.includes("Network Economies")) {
    questions.push("Could partnerships or ecosystem integrations improve user network density?");
  }

  return { score, rows, risks, questions };
}

function render(company, result) {
  const tier = scoreTier(result.score);

  results.hidden = false;
  companyHeading.textContent = `${company} Moat Report`;
  overallSummary.textContent =
    "This score combines your factor ratings with lightweight sector adjustments to estimate moat durability.";
  moatScore.textContent = String(result.score);
  moatTier.textContent = tier.text;
  moatTier.className = `tier status ${tier.className}`;

  powersList.innerHTML = "";
  result.rows.forEach((row) => {
    const li = document.createElement("li");
    li.className = "list-item";
    li.innerHTML = `<strong>${row.label}</strong> · <span class="status ${row.status.toLowerCase()}">${row.status}</span> (weighted contribution: ${row.weighted})`;
    powersList.appendChild(li);
  });

  risksList.innerHTML = "";
  result.risks.forEach((risk) => {
    const li = document.createElement("li");
    li.className = "list-item";
    li.textContent = risk;
    risksList.appendChild(li);
  });

  questionsList.innerHTML = "";
  result.questions.forEach((question) => {
    const li = document.createElement("li");
    li.className = "list-item";
    li.textContent = question;
    questionsList.appendChild(li);
  });
}

createFactorInputs();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const company = formData.get("company").toString().trim();
  if (!company) return;

  const result = analyze(formData);
  render(company, result);
});
