# 📚 PubMed Metadata eXporter (`PubMedXport`)

**Structured Export of PubMed Metadata including Abstracts to CSV, JSON, and BibTeX**

<hr style="border: 1px solid blue;">


## 🚀 Overview

**PubMedXport** is a lightweight, browser-based tool that allows researchers to:

- Perform custom PubMed searches
- Retrieve data faster using **parallel requests**
- Fetch article metadata **including abstracts**
- Export results in **CSV**, **JSON**, or **BibTeX** formats
- Save any **failed PMIDs** for manual review

It's ideal for researchers performing **systematic reviews**, **meta-analyses**, or **evidence gathering** during the early phases of a literature search.

<hr style="border: 1px solid green;">

## ❓ Why Was This Code Developed?

PubMed is widely recognized as one of the primary resources for biomedical literature—but its export options are limited:

- **CSV files lack abstracts**
- **No JSON support** for programmatic workflows
- **No BibTeX export** for citation managers
- **Downloads with abstracts are in non-structured, hard-to-format text formats**

Some third-party tools attempt to bridge these gaps. For instance, [PubData2XL](https://pubmed2xl.com/xlsx/) (an updated version of PubMed2Data) allows exporting PubMed data to Microsoft Excel and XML files. However, it requires a two-step process: first retrieving PMIDs, then running the tool again to fetch article details. See [PubMed2XL (version 2.01)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4722658/) and [GitHub repository](https://github.com/PubData2XL/PubData2XL) for details.

<hr style="border: 1px solid green;">

## ❓ What Makes This Tool Different?

**PubMedXport** offers a simple, unified workflow with several advantages:

- ✅ **No installation needed** – works entirely within the browser.
- ✅ **One-step workflow** – search, fetch, and export in a single session.
- ✅ **Export in multiple formats** – CSV (with abstracts), JSON, and BibTeX.
- ✅ **Parallel fetching** – retrieve large datasets faster.
- ✅ **PMID error logging** – failed PMIDs are automatically saved in a `.txt` file for easy manual review.

This tool is especially helpful for researchers, students, and educators who need structured PubMed data quickly—without technical setup or multiple processing steps.

<hr style="border: 1px solid green;">

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

<hr style="border: 1px solid green;">

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

<hr style="border: 1px solid green;">

## 🛠️ How to Use

### 1. Launch the Tool

- Open `https://drmyo.github.io/pubmedxport` in the browser.

### 2. Enter Inputs and Search
- Enter the **PubMed API key**, **search query**, number of parallel requests and optional filters (start year, end year).
- Click **"Fetch PubMed Articles"**.
- Continue or Cancel to fetch articles

<div style="border: 2px solid #ccc; padding: 15px; border-radius: 5px; background-color: rgba(255, 255, 255, 0.85); color: #000;">


#### 🔍 **Search Suggestions**
- Search at [PubMed](https://pubmed.ncbi.nlm.nih.gov/advanced/) using search terms.
- Refine the search term.
- Copy and paste the search term to PubMedXport.

#### <span style="color:red; font-weight:bold;">⚠️ An API key is required to access PubMed reliably and efficiently.</span>
- Create a free API key at: [NCBI Account Settings](https://account.ncbi.nlm.nih.gov/settings/) if you do not have one and keep it private.

#### <span style="color:green;">Default Number of Parallel Requests - 5.</span>
- <span style="color:red; font-weight:bold;">⚠️ Higher Number of Parallel Requests may trigger rate limits and lead to failed fetching of articles.</span>

#### <span style="color:green;">Default Start Year - 1809.</span>
- PubMed, including its predecessor OLDMEDLINE, allows searches as far back as 1809, though the coverage is not entirely complete. While some records are available from 1809, the most comprehensive coverage begins in 1966. PubMed, which became accessible online in 1996, provides citations and abstracts from a broader range of biomedical literature, with early records starting from 1809 and more extensive coverage from 1966 onward.

#### <span style="color:green;">Default End Year - Current Year.</span>

#### <span style="color:red; font-weight:bold;">⚠️ If specific dates of search are done, leave the Start Year and End Year default.</span>
- E.g., (Myanmar) AND (("2024/01/01"[Date - Publication] : "3000"[Date - Publication]))

</div>



### 3. Download Results

- After completion, download results in .csv, .json, or .bib format.
- If some articles fail to fetch, download the .txt file listing failed PMIDs.

<hr style="border: 1px solid green;">

## 📊 Performance Comparison: Parallel Requests, Search Terms and Number of Articles Found

| Parallel requests | Search term | From-To | Articles found | Time taken | Failed to Fetch |
|:-----------------:|:-----------:|:-------:|:--------------:|:-----------|:----------------:|
| 3 | (COVID-19[Title]) AND <br>(Inflammatory markers[Title/Abstract]) | 2024-2025 | 274   | 2m 13s | 0 |
| 5 | (COVID-19[Title]) AND <br>(Inflammatory markers[Title/Abstract]) | 2024-2025 | 274   | 49s | 0 |
| 10 | (COVID-19[Title]) AND <br>(Inflammatory markers[Title/Abstract]) | 2024-2025 | 274   | 31s | 39 |
| 5 | (Osteoporosis[Title]) AND (Asian[Title]) | 1809-2025 | 62 | 11s | 0 |
| 8 | (Osteoporosis[Title]) AND (Asian[Title]) | 1809-2025 | 62 | 8s | 0 |
| 10 | (Osteoporosis[Title]) AND (Asian[Title]) | 1809-2025 | 62 | 6s | 12 |
| 5 | Bronchiolitis[Title/Abstract] AND corticosteroids[Title/Abstract] | 1809-2025 | 575 | 2m 9s | 0 |
| 10 | Bronchiolitis[Title/Abstract] AND corticosteroids[Title/Abstract] | 1809-2025 | 575 | 1m 11s | 72 |
| 10 | Bronchiolitis[Title/Abstract] | 2020-2025 | 3192 | 12m 24s | 16 |
| 5 | (Myanmar[Title/Abstract]) AND <br>(("2024/04/28"[Date - Publication] :<br> "2025/04/27"[Date - Publication])) | *A* | 373 | 2m 8s | *B* |
| 5 | (Myanmar[Title/Abstract]) | 2024-2025 | 503 | 2m 2s | *B* |
| 5 | (Myanmar[Title/Abstract]) | 2025-2025 | 126 | 35s | *B* |
| 5 | Malaysia[Abstract/Title] AND <br>(Thalassaemia[Title/Abstract] OR Thalassemia[Title/Abstract]) | 2020-2025 | 125 | 43s | 0 |
| 5 | (Malaria[Title]) AND <br>("The New England journal of medicine"[Journal]) | 2001-2025 | 114 | 21s | 0 |


- *A - Last 1 year from the date of search*
- *B - Failed to fetch PMID 28722973. This article can't be fetched even with the search term "(Bladder Stones.[Title]) AND (Leslie[Author])*

---

### Dividing Large Searches into Smaller Batches
| Parallel requests | Search term | From-To | Articles found | Time taken | Failed to Fetch |
|:-----------------:|:-----------:|:-------:|:--------------:|:-----------|:----------------:|
| 5 | Bronchiolitis[Title/Abstract] AND corticosteroids[Title/Abstract] | 1809-2004 | 207 | 43s | 0 |
| 5 | Bronchiolitis[Title/Abstract] AND corticosteroids[Title/Abstract] | 2005-2025 | 368 | 1m 28s | 0 |
| 10 | Bronchiolitis[Title/Abstract] AND corticosteroids[Title/Abstract] | 1809-2004 | 207 | 25s | 44 |
| 10 | Bronchiolitis[Title/Abstract] AND corticosteroids[Title/Abstract] | 2005-2025 | 368 | 55s | 48 |

<hr style="border: 1px solid green;">

## Screenshots of PubMedXport

### Screenshot 1
<img src="https://github.com/drmyo/pubmedxport/blob/main/screenshots/1.jpg?raw=true" alt="Screenshot 1" width="600">

### Screenshot 2
<img src="https://github.com/drmyo/pubmedxport/blob/main/screenshots/2.jpg?raw=true" alt="Screenshot 2" width="600">


<hr style="border: 1px solid green;">

## ⚡Disclaimer:
Generative AI tools, including ChatGPT, DeepSeek and GitHub Copilot, were used to assist with coding and troubleshooting.
The design, development, and final testing of this tool were led and completed by the authors.

<hr style="border: 1px solid green;">

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.

<hr style="border: 1px solid green;">

## 🙏 Acknowledgments
We thank the National Library of Medicine (NLM) and the National Center for Biotechnology Information (NCBI) for maintaining PubMed and the [E-utilities API](https://www.ncbi.nlm.nih.gov/books/NBK25500/), which underpin this project.
We also acknowledge the assistance of ChatGPT, DeepSeek and GitHub Copilot in the development of the tool. Their AI-assisted suggestions and code generation features were valuable in helping accelerate the coding process.

 
