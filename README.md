# PubMed Article Fetcher & Exporter

## Overview
This web-based tool allows researchers to perform a comprehensive search of PubMed, fetch metadata and abstracts of articles, and export the results in multiple formats such as **CSV**, **JSON**, and **BibTeX**. This tool is particularly helpful during the early phases of a literature search, where researchers need to gather and organize scientific articles efficiently.
## Why Was This Code Developed?

PubMed is one of the largest databases for biomedical literature, containing millions of scientific articles. However, PubMed's built-in download features come with limitations that can hinder researchers in efficiently managing large datasets for systematic reviews, meta-analyses, or general literature searches.

The primary issues with PubMed’s built-in download capabilities are:
- **CSV format does not include abstracts**: While PubMed offers the ability to download search results in a CSV format, this export lacks essential information like article abstracts. The CSV file only includes metadata such as titles, authors, and publication details, which may not be sufficient for detailed analysis or literature reviews.
- **Text-only abstract downloads**: When downloading abstracts from PubMed, the information is typically provided in plain text format. This format can be cumbersome to analyze or process, especially when working with large volumes of articles.
- **No support for JSON download**: PubMed does not provide a built-in way to export results in **JSON** format, which is highly preferred for data manipulation, analysis, and integration with other tools and platforms.
- **No BibTeX export**: Researchers who need citations in a format suitable for citation managers like Zotero or EndNote may struggle, as PubMed lacks the option to download articles in **BibTeX** format directly.

### How This Tool Benefits Researchers

1. **Comprehensive Data Export**:
   - **CSV Export**: Includes not only metadata (like title, authors, publication year, etc.) but also abstracts. This gives researchers more complete data for their literature review, ensuring they don’t miss out on the context provided in abstracts.
   - **JSON Export**: Provides a structured, machine-readable format for easy integration with other tools, allowing for programmatic analysis, data manipulation, and further processing.
   - **BibTeX Export**: Facilitates seamless integration with citation management software, ensuring that the fetched articles can be easily cited in academic work.

2. **Parallel Requests for Faster Retrieval**:
   - This tool supports **parallel requests** (up to 10 requests at a time), significantly speeding up the process of fetching large sets of articles from PubMed. This can be a real time-saver when dealing with thousands of articles.

3. **User-Controlled Customization**:
   - Researchers can filter results by **year range** and **search query**, ensuring that only the most relevant articles are retrieved.
   - The tool also allows for customization of the **number of parallel requests**, providing flexibility based on internet speed and system capacity.

4. **Easy-to-Use Interface**:
   - The tool features a simple web-based UI that requires minimal setup. Researchers can input their search query, choose how many parallel requests to use, and decide on the file formats they want to export. The process is as simple as clicking a button.

5. **Improved Workflow**:
   - The tool is designed for early-stage research, where quick, organized access to PubMed article metadata is crucial. By providing a range of export options and simplifying the process, researchers can spend less time organizing their data and more time analyzing it.


## Features

- **Search PubMed**: Perform a search using a custom query and optional date range filters (start year, end year).
- **Fetch Article Details**: Retrieve metadata and abstracts for articles based on PubMed IDs (PMID).
- **Parallel Requests**: Speed up the retrieval of large datasets by making multiple requests at once.
- **Download Options**:
  - **CSV**: Includes metadata along with abstracts.
  - **JSON**: Structured, machine-readable format for data analysis.
  - **BibTeX**: Citation format for use in citation managers.
- **Progress Tracking**: Visual progress bar and status updates during data retrieval.

## How to Use

1. Clone the repository:

   ```bash
   git clone https://github.com/drmyo/pubmed2cjb.git

2. Open the index.html file in a browser.
3. Enter your PubMed API key, search query, and any optional filters (start year, end year, etc.).
4. Click the Fetch Articles button to begin the process. The tool will search PubMed, fetch article details, and provide download links for the results.
5. Select the formats you want (CSV, JSON, or BibTeX), and download the results.


## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- PubMed's E-utilities API, which allows us to access PubMed data programmatically.
