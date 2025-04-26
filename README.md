# 📚 PubMed Article Fetcher & Exporter (`PubMedXport`)

**A browser-based tool to fetch PubMed articles and export them in CSV, JSON, or BibTeX—with abstracts included.**

---

## 🚀 Overview

**PubMedXport** is a lightweight, browser-based tool that allows researchers to:

- Perform custom PubMed searches
- Retrieve data faster using **parallel requests**
- Fetch article metadata **including abstracts**
- Export results in **CSV**, **JSON**, or **BibTeX** formats
- Save any **failed PMIDs** for manual review

It's ideal for researchers performing **systematic reviews**, **meta-analyses**, or **evidence gathering** during the early phases of a literature search.

---

## ❓ Why Was This Code Developed?

PubMed is widely recognized as one of the primary resources for biomedical literature—but its export options are limited:

- **CSV files lack abstracts**
- **No JSON support** for programmatic workflows
- **No BibTeX export** for citation managers
- **Downloads with abstracts are in non-structured, hard-to-format text formats**

Some third-party tools attempt to bridge these gaps. For instance, [PubData2XL](https://pubmed2xl.com/xlsx/) (an updated version of PubMed2Data) allows exporting PubMed data to Microsoft Excel and XML files. However, it requires a two-step process: first retrieving PMIDs, then running the tool again to fetch article details. See [PubMed2XL (version 2.01)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4722658/) and [GitHub repository](https://github.com/PubData2XL/PubData2XL) for details.

---

## ❓ What Makes This Tool Different?

**PubMedXport** offers a simple, unified workflow with several advantages:

- ✅ **No installation needed** – works entirely within the browser.
- ✅ **One-step workflow** – search, fetch, and export in a single session.
- ✅ **Export in multiple formats** – CSV (with abstracts), JSON, and BibTeX.
- ✅ **Parallel fetching** – retrieve large datasets faster.
- ✅ **PMID error logging** – failed PMIDs are automatically saved in a `.txt` file for easy manual review.

This tool is especially helpful for researchers, students, and educators who need structured PubMed data quickly—without technical setup or multiple processing steps.

---

## ✅ Benefits for Researchers

### 🔄 Comprehensive Export Formats

- **CSV**: Includes full metadata and abstracts
- **JSON**: Machine-readable for analysis and tool integration
- **BibTeX**: Ready-to-import for citation managers like Zotero and EndNote

### ⚡ Fast Retrieval via Parallel Requests

- Fetch large datasets up to **10x faster**
- Customize the number of parallel requests based on your connection and system

### 🎛️ Flexible and Customizable

- Filter by **year range** and **search query**
- Configure **parallel request** settings
- No software installation required—just open a browser

---

## 🌟 Features

- 🔍 **Custom PubMed searches** with keyword and date range filters
- 📄 **Retrieve metadata + abstracts** for all articles
- 🚀 **Parallel requests** (up to 10 simultaneous fetches)
- 📥 **Export options**:
  - **CSV** (structured table including abstracts)
  - **JSON** (structured, machine-readable format)
  - **BibTeX** (for academic citations)
- 📊 **Progress bar** with live status updates
- 📃 **Failed PMID logging** into downloadable `.txt` file

---

## 🛠️ How to Use

### 1. Clone the Repository

```bash
git clone https://github.com/drmyo/pubmedxport.git
```

### 2. Launch the Tool

- Open `index.html` in the browser.
- Enter the **PubMed API key**, **search query**, number of parallel requests and optional filters (start year, end year).
- Click **"Fetch PubMed Articles"**.

### 3. Download Results

- After completion, download results in .csv, .json, or .bib format.
- If some articles fail to fetch, download the .txt file listing failed PMIDs.

---

## ⚡Disclaimer:
Generative AI tools, including ChatGPT and GitHub Copilot, were used to assist with coding and troubleshooting.
The design, development, and final testing of this tool were led and completed by the author.

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

This tool was built using PubMed’s [E-utilities API](https://www.ncbi.nlm.nih.gov/books/NBK25500/).  
Special thanks to the National Center for Biotechnology Information (NCBI) for providing open access to biomedical literature through their APIs, enabling the development of research tools like this one.
 
