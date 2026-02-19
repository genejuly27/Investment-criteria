# Company Moat Analyzer

An interactive web app to evaluate a company's moat strength using Hamilton Helmer's **7 Powers** framework.

## What it does

- Captures company + sector context.
- Lets you rate each of the 7 powers from **1 (weak)** to **5 (strong)**.
- Applies lightweight sector biases for a more realistic score.
- Produces:
  - A total moat score out of 100
  - A moat tier (Strong / Moderate / Weak)
  - Per-power strength breakdown
  - Key risk flags and follow-up research questions

## Run locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Disclaimer

This tool is educational and not investment advice.
