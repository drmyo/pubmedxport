# 📚 PubMedXport: Export PubMed Metadata and Abstracts to CSV, JSON, and BibTeX
[![DOI](https://zenodo.org/badge/972718324.svg)](https://doi.org/10.5281/zenodo.15289544)

**Structured export of PubMed data for systematic reviews, meta-analyses, bibliometric studies, and educational research.**

<hr style="border: 1px solid blue;">

## 🚀 Overview

**PubMedXport** is a lightweight, browser-based tool for retrieving and exporting structured PubMed data. It supports:

- 🔍 Custom PubMed searches with keyword and date filters
- 📄 Retrieval of article metadata and abstracts
- 🚀 Parallel requests for faster data collection
- 📥 Export to CSV, JSON, and BibTeX formats
- 📃 Automatic logging of failed PMIDs for manual review

It is intended for researchers conducting systematic reviews, meta-analyses, evidence syntheses, and bibliometric studies.

**Keywords**: PubMed export, systematic review tool, meta-analysis, bibliographic data, CSV export, JSON export, BibTeX export, evidence synthesis, bibliometrics

<hr style="border: 1px solid green;">

## ❓ Motivation

PubMed’s standard export functionalities are limited:

- CSV exports exclude abstracts
- No native JSON or BibTeX export
- Abstracts available only in unstructured formats

Existing workflows often involve multiple steps, such as separate PMID retrieval and metadata fetching.  
**PubMedXport** integrates these steps into a single browser-based session.

<hr style="border: 1px solid green;">

## 🌟 Key Features

- ✅ **Browser-based**: No installation required
- ✅ **Unified workflow**: Search, retrieve, and export in one session
- ✅ **Parallel fetching**: Configurable simultaneous requests
- ✅ **Multi-format export**: CSV (with abstracts), JSON, BibTeX
- ✅ **Error logging**: Failed PMIDs saved automatically

<hr style="border: 1px solid green;">

## 🔧 Functionality Overview

- 🔍 Custom search queries with keyword and date range filters
- 📄 Retrieval of full metadata and abstracts
- 🚀 Parallel fetching (up to 10 concurrent requests)
- 📥 Export options:
  - **CSV**: Structured table with abstracts
  - **JSON**: Machine-readable format
  - **BibTeX**: Citation manager compatible
- 📊 Progress bar with live status updates
- 📃 Downloadable `.txt` file for failed PMIDs

<hr style="border: 1px solid green;">

## 🛠️ How to Use

### 1. Launch the Tool
- Visit: [`https://drmyo.github.io/pubmedxport`](https://drmyo.github.io/pubmedxport)

### 2. Enter Inputs and Search
- Input your **PubMed API key**, **search query**, desired **number of parallel requests**, and optional **year filters**.
- Click **"Fetch PubMed Articles"**.

<div style="border: 2px solid #ccc; padding: 15px; border-radius: 5px; background-color: rgba(255, 255, 255, 0.85); color: #000;">

#### 🔍 **Search Suggestions**
- Refine your query using [PubMed Advanced Search](https://pubmed.ncbi.nlm.nih.gov/advanced/).
- Copy and paste the query into PubMedXport.

#### ⚠️ **API Key Requirement**
- A PubMed API key is recommended for stable and efficient access.
- Obtain a free key from: [NCBI Account Settings](https://account.ncbi.nlm.nih.gov/settings/).

#### ⚙️ **Defaults and Recommendations**
- **Parallel Requests**: Default = 5  
  Higher values may trigger rate limits and increase failures.
- **Start Year**: Default = 1809  
  (Coverage extensive from 1966 onwards)
- **End Year**: Default = Current Year
- **Note**: When specifying precise dates in your query, retain default year settings.

Example for specific date search:  
`(Myanmar) AND (("2024/01/01"[Date - Publication] : "3000"[Date - Publication]))`

</div>

### 3. Download Results
- Download data in `.csv`, `.json`, or `.bib` formats.
- If any PMIDs fail, download the `.txt` log for manual review.

<hr style="border: 1px solid green;">

## 📊 Performance Comparison

| Parallel requests | Search term | From-To | Articles found | Time taken | Failed to Fetch |
|:-----------------:|:-----------:|:-------:|:--------------:|:-----------|:----------------:|
| 3 | (COVID-19[Title]) AND (Inflammatory markers[Title/Abstract]) | 2024-2025 | 274   | 2m 13s | 0 |
| 5 | (COVID-19[Title]) AND (Inflammatory markers[Title/Abstract]) | 2024-2025 | 274   | 49s | 0 |
| 10 | (COVID-19[Title]) AND (Inflammatory markers[Title/Abstract]) | 2024-2025 | 274   | 31s | 39 |
| 5 | (Osteoporosis[Title]) AND (Asian[Title]) | 1809-2025 | 62 | 11s | 0 |
| 8 | (Osteoporosis[Title]) AND (Asian[Title]) | 1809-2025 | 62 | 8s | 0 |
| 10 | (Osteoporosis[Title]) AND (Asian[Title]) | 1809-2025 | 62 | 6s | 12 |
| 5 | Bronchiolitis[Title/Abstract] AND corticosteroids[Title/Abstract] | 1809-2025 | 575 | 2m 9s | 0 |
| 10 | Bronchiolitis[Title/Abstract] AND corticosteroids[Title/Abstract] | 1809-2025 | 575 | 1m 11s | 72 |
| 10 | Bronchiolitis[Title/Abstract] | 2020-2025 | 3192 | 12m 24s | 16 |

> **Note**: Dividing large searches into smaller batches and keeping the number of parallel requests around 5 improves success rates.

---

## 📷 Screenshots

### Successful Fetch
<img src="https://github.com/drmyo/pubmedxport/blob/main/screenshots/1.jpg?raw=true" alt="Screenshot 1" width="600">

---

### Fetch with Failed PMIDs
<img src="https://github.com/drmyo/pubmedxport/blob/main/screenshots/2.jpg?raw=true" alt="Screenshot 2" width="600">

---

### Mobile/iOS View
<img src="https://github.com/drmyo/pubmedxport/blob/main/screenshots/3.JPG?raw=true" alt="Screenshot 3" width="600">

---

### Example Outputs

#### CSV
<img src="https://github.com/drmyo/pubmedxport/blob/main/screenshots/4.JPG?raw=true" alt="Screenshot 4" width="600">

#### JSON
<img src="https://github.com/drmyo/pubmedxport/blob/main/screenshots/5.JPG?raw=true" alt="Screenshot 5" width="600">

#### BibTeX
<img src="https://github.com/drmyo/pubmedxport/blob/main/screenshots/6.JPG?raw=true" alt="Screenshot 6" width="600">

<hr style="border: 1px solid green;">

## ⚡ Disclaimer

Generative AI tools (e.g., ChatGPT, DeepSeek, GitHub Copilot) were used for coding assistance and troubleshooting.  
The design, development, and final testing were performed and validated by the authors.

<hr style="border: 1px solid green;">

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.

<hr style="border: 1px solid green;">

## 🙏 Acknowledgments

We acknowledge the National Library of Medicine (NLM) and the National Center for Biotechnology Information (NCBI) for maintaining PubMed and its E-utilities API.  
We also thank ChatGPT, DeepSeek, and GitHub Copilot for their assistance in the tool's development.

