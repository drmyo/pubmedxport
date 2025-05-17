---
title: 'PubMedXport: Export PubMed Metadata and Abstracts to CSV, JSON, and BibTeX'
tags:
  - software
  - PubMed
  - data export
  - biomedical
authors:
  - name: Myo Kyi Tha
    orcid: 0000-0003-3973-2412
    affiliation: "1"
  - name: Nilar Khin
    orcid: 0000-0002-9173-0337
    affiliation: "1"
affiliations:
  - name: MAHSA University, Malaysia
    index: "1"
    ror: 00p43ne90
date: 2025-04-27
journal: JOSS
bibliography: paper.bib
---

abstract: |
  Efficient extraction of structured metadata from biomedical literature is critical for systematic reviews, meta-analyses, and bibliometric studies. PubMed [@nlm-pubmed], while central to biomedical research, offers limited export capabilities. We present PubMedXport, a web-based tool that enables users to search PubMed and export results, including abstracts, in CSV, JSON, and BibTeX formats. Featuring an intuitive interface, customizable queries, parallel processing, and error reporting, PubMedXport streamlines data retrieval for systematic reviews, meta-analyses, and educational purposes. Developed through a combination of human expertise and AI-assisted coding, it exemplifies the accelerating role of AI in research tool development.

## Summary

  Efficient literature searching underpins evidence-based practice. PubMed, operated by the U.S. National Library of Medicine, offers robust search capabilities but limited export functionality: abstracts are excluded from CSVs, structured formats like JSON are unavailable, and BibTeX entries must be manually generated. Abstracts are only available as plain, unstructured text, hindering efficient data use.

  PubMedXport addresses these gaps through a lightweight, browser-based application that retrieves full metadata, including abstracts, and exports results in structured formats without requiring installation. Supporting custom queries, year filtering, parallel processing, and error reporting, PubMedXport facilitates systematic reviews, meta-analyses, and educational research.

## Background

  PubMed provides free, high-quality access to MEDLINE and other biomedical resources, distinguishing itself from subscription-based platforms like Scopus and Web of Science. Despite its powerful search capabilities, its data export options are constrained, especially for structured or large-scale computational workflows. Tools that extend PubMed's export features are needed to meet the growing demands of systematic reviews and computational analysis.

## Statement of Need:

  Researchers face several barriers when using PubMed for structured data collection:

  - Abstracts are excluded from CSV exports.
  - JSON format is unavailable.
  - BibTeX citations require manual generation.
  - Abstracts are supplied only as unstructured text files.

  While third-party tools exist, they often require local installation or complex workflows. PubMedXport overcomes these limitations by offering a browser-based, user-friendly platform for exporting PubMed search results, including abstracts, in multiple formats.

## Features

  - PubMed Search: Custom keyword queries with optional year range filters.
  - Data Retrieval: Full metadata and abstract collection.
  - Author Country Extraction: Extract country-level info for all authors (First author, and co-authors, if any, in separate fields - with duplications removed). 
  - Export Options: CSV (with abstracts), JSON (machine-readable), BibTeX (citation-ready).
  - Parallel Requests: Faster data retrieval through simultaneous API calls.
  - Progress Tracking: Real-time indicators during searches.
  - Error Handling: Automated listing of failed PMIDs.
  - Browser-Based: No installation required.

## Usage

  1. Visit [PubMedXport](https://drmyo.github.io/pubmedxport).
  2. Enter your PubMed API key and define query parameters.
  3. Start the search and download results.
  4. Review any retrieval errors from the provided .txt file.

## How to get the code

  Clone or download from [GitHub](https://github.com/drmyo/pubmedxport).

  **Example screenshots of the user interface:**

  - Result with no failed PMID: [Link](https://github.com/drmyo/pubmedxport/blob/main/screenshots/1.jpg)
  - Result with 1 failed PMID: [Link](https://github.com/drmyo/pubmedxport/blob/main/screenshots/2.jpg?raw=true)
  - Result on iOS: [Link](https://github.com/drmyo/pubmedxport/blob/main/screenshots/3.JPG)
  - CSV Output: [Link](https://github.com/drmyo/pubmedxport/blob/main/screenshots/4.JPG)
  - JSON Output: [Link](https://github.com/drmyo/pubmedxport/blob/main/screenshots/5.JPG)
  - BibTeX Output: [Link](https://github.com/drmyo/pubmedxport/blob/main/screenshots/6.JPG)

## Development

  PubMedXport was created using a hybrid approach that blended human expertise with free AI tools (ChatGPT, GitHub Copilot, and DeepSeek) for coding and troubleshooting. The authors designed the concept, chose the features, performed extensive testing, and focused on user-centered design, demonstrating how AI-augmented development can enhance research tool creation.
  
## Limitations and Future Directions

  While PubMedXport extends PubMed's capabilities, it remains dependent on PubMed's data structures and API limits.

  Planned enhancements include:

  - Automated Abstract Summarization: Integration of BioBART, Facebook BART, or other models for rapid abstract review.
  - Research Relevance Check: NLP-based assessment of article relevance to user-defined queries.
  - Expanded Export Options: Additional formats (e.g., XML, TSV) and advanced filtering features.

## Author Contributions

  Myo Kyi Tha and Nilar Khin contributed equally to this work.

## Acknowledgments

  We thank the National Library of Medicine (NLM) and the National Center for Biotechnology Information (NCBI) for maintaining PubMed and the E-utilities API [@ncbi-eutils], which underpin this project. We also acknowledge the assistance of ChatGPT, DeepSeek, and GitHub Copilot in the development of the tool. Their AI-assisted suggestions and code generation features were valuable in helping accelerate the coding process.

## License

  Distributed under the MIT License.

## References
