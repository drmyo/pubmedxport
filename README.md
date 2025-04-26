# 📚 PubMed Article Fetcher & Exporter (`pubmed2cjb`)

**A browser-based tool to fetch PubMed articles and export them in CSV, JSON, or BibTeX—with abstracts included.**

---

## 🚀 Overview

**pubmed2cjb** is a lightweight, browser-based tool that allows researchers to:

- Perform custom PubMed searches
- Fetch article metadata **including abstracts**
- Export results in **CSV**, **JSON**, or **BibTeX** formats  
- Retrieve data faster using **parallel requests**
- Save any **failed PMIDs** for manual review

It's ideal for researchers performing **systematic reviews**, **meta-analyses**, or **evidence gathering** during the early phases of a literature search.

---

## ❓ Why This Tool?

PubMed is the gold standard for biomedical literature—but its export options are limited:

- **CSV files lack abstracts**
- **No JSON support** for programmatic workflows
- **No BibTeX export** for citation managers
- **Abstract-only downloads are unstructured**

This tool solves those pain points by providing structured, complete, and export-ready data in user-friendly formats.

---

## ✅ Benefits for Researchers

### 🔄 Comprehensive Export Formats

- **CSV**: Includes full metadata and abstracts
- **JSON**: Ideal for data analysis and tool integration
- **BibTeX**: Ready-to-import for Zotero, EndNote, etc.

### ⚡ Fast Retrieval via Parallel Requests

- Fetch large datasets up to **10x faster**
- Control the number of parallel requests based on your network and system

### 🎛️ Flexible and Customizable

- Filter by **year range** and **search query**
- Choose how many parallel requests to run
- No need to install anything—just open in a browser

### 📂 Fallback for Errors

- If any articles fail to fetch, a `.txt` file of PMIDs will download automatically
- This allows for manual verification or retrying later

---

## 🌟 Features

- 🔍 **Search PubMed** with custom queries and optional filters
- 📄 **Fetch metadata + abstracts** for all results
- 🚀 **Parallel fetching** of articles (up to 10 at a time)
- 📥 **Export Options**:
  - **CSV** (metadata + abstracts)
  - **JSON** (structured, machine-readable)
  - **BibTeX** (for citations)
- 📊 **Progress bar** and live status updates
- 📃 **PMID failover list** in downloadable `.txt` format

---

## 🛠️ How to Use

### 1. Clone the Repository

```bash
git clone https://github.com/drmyo/pubmed2cjb.git
```

### 2. Launch the Tool

- Open `index.html` in your browser
- Enter your **PubMed API key**, **search query**, and optional filters (start year, end year)
- Click **"Fetch Articles"**

### 3. Download Results

- Once fetching is complete, click the buttons to download in your preferred format:
  - `results.csv`
  - `results.json`
  - `results.bib`
- If there are failed PMIDs, a file named `failed_pmids.txt` will download automatically

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

Built using PubMed’s [E-utilities API](https://www.ncbi.nlm.nih.gov/books/NBK25500/).  
Special thanks to NCBI for providing open access to biomedical data.  
