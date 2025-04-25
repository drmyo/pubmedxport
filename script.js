document.addEventListener('DOMContentLoaded', function() {
    const fetchButton = document.getElementById('fetchButton');
    const progressSection = document.getElementById('progressSection');
    const progressMessages = document.getElementById('progressMessages');
    const progressBar = document.getElementById('progressBar');
    const downloadLinks = document.getElementById('downloadLinks');
    const errorSection = document.getElementById('errorSection');

    fetchButton.addEventListener('click', async function() {
        // Reset UI
        progressMessages.innerHTML = '';
        downloadLinks.innerHTML = '';
        errorSection.style.display = 'none';
        progressSection.style.display = 'block';
        progressBar.style.width = '0%';
        
        // Get input values
        const apiKey = document.getElementById('apiKey').value.trim();
        const parallelRequests = parseInt(document.getElementById('parallelRequests').value) || 5;
        const searchQuery = document.getElementById('searchQuery').value.trim();
        const startYear = document.getElementById('startYear').value.trim();
        const endYear = document.getElementById('endYear').value.trim();
        const outputBaseName = document.getElementById('outputBaseName').value.trim() || 'pubmed_results';
        const exportCSV = document.getElementById('exportCSV').checked;
        const exportJSON = document.getElementById('exportJSON').checked;
        const exportBib = document.getElementById('exportBib').checked;
    
        // Validate inputs
        if (!apiKey) {
            showError("❌ No API key was entered.");
            return;
        }
    
        if (parallelRequests < 3 || parallelRequests > 10) {
            showError("❌ Please enter a number of parallel requests between 3 and 10.");
            return;
        }

        if (!searchQuery) {
            showError("❌ No search query provided.");
            return;
        }
    
        if (startYear && !/^\d{4}$/.test(startYear)) {
            showError("❌ Invalid start year format. Please use YYYY.");
            return;
        }
    
        if (endYear && !/^\d{4}$/.test(endYear)) {
            showError("❌ Invalid end year format. Please use YYYY.");
            return;
        }
    
        // Convert to integers for comparison
        const startYearInt = startYear ? parseInt(startYear) : null;
        const endYearInt = endYear ? parseInt(endYear) : null;
    
        // Additional validations
        const currentYear = new Date().getFullYear();
        
        if (startYearInt && startYearInt < 1809) {
            showError("❌ Start year must be 1809 or later.");
            return;
        }
    
        if (endYearInt && endYearInt > currentYear) {
            showError(`❌ End year cannot be in the future (${currentYear}).`);
            return;
        }
    
        if (startYearInt && endYearInt && endYearInt < startYearInt) {
            showError("❌ End year cannot be earlier than start year.");
            return;
        }
    
        addProgressMessage("✅ Starting PubMed search...", "info");

        try {
            // Step 1: Search for PMIDs
            const pmids = await searchPubMed(apiKey, searchQuery, startYear, endYear);
            
            if (!pmids || pmids.length === 0) {
                addProgressMessage("❌ No articles found matching your criteria.", "error");
                return;
            }

            addProgressMessage(`✅ Found ${pmids.length.toLocaleString()} articles.`, "success");
            addProgressMessage("⏳ Fetching article details...", "info");

            // Step 2: Fetch article details
            const articles = await fetchArticles(apiKey, pmids, parallelRequests);
            
            if (!articles || articles.length === 0) {
                addProgressMessage("❌ Failed to fetch article details.", "error");
                return;
            }

            addProgressMessage(`✅ Successfully fetched ${articles.length.toLocaleString()} articles.`, "success");
            addProgressMessage("⏳ Exporting results...", "info");

            // Step 3: Export results
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            const baseFilename = sanitizeFilename(outputBaseName) + '_' + timestamp;
            
            const exports = [];
            if (exportCSV) exports.push({ format: 'csv', extension: '.csv' });
            if (exportJSON) exports.push({ format: 'json', extension: '.json' });
            if (exportBib) exports.push({ format: 'bib', extension: '.bib' });

            for (const exp of exports) {
                const filename = baseFilename + exp.extension;
                const content = exportData(articles, exp.format);
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
            
                const link = document.createElement('button');
                link.className = `download-button download-link ${exp.format}`;
                link.onclick = function() {
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                };
                link.innerHTML = `Download ${exp.format.toUpperCase()}`; // Remove line break
            
                downloadLinks.appendChild(link);
            }
            
            

            addProgressMessage("✅ All operations completed successfully!", "success");
            progressBar.style.width = '100%';

        } catch (error) {
            console.error('Error:', error);
            addProgressMessage(`❌ An error occurred: ${error.message}`, "error");
            showError(error.message);
        }
    });

    function addProgressMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        progressMessages.appendChild(messageDiv);
        progressMessages.scrollTop = progressMessages.scrollHeight;
    }

    function showError(message) {
        errorSection.textContent = message;
        errorSection.style.display = 'block';
    }

    function sanitizeFilename(filename) {
        return filename.replace(/[\\/:*?"<>|]/g, '');
    }

    async function searchPubMed(apiKey, query, startYear, endYear) {
        const currentYear = new Date().getFullYear();
        
        let fullQuery = query;
        if (startYear || endYear) {
            const effectiveEndYear = endYear || currentYear;
            const dateFilter = `(${startYear || '1809'}[PDAT] : ${effectiveEndYear}[PDAT])`;
            fullQuery = `${query} AND ${dateFilter}`;
        }

        const params = new URLSearchParams({
            db: 'pubmed',
            term: fullQuery,
            retmode: 'xml',
            retmax: 10000, // Max allowed by API
            api_key: apiKey
        });

        try {
            const response = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?${params}`);
            const text = await response.text();
            
            if (!response.ok) {
                throw new Error(text.includes('API key') ? 
                    'Invalid API key. Please check your key and try again.' : 
                    'Failed to fetch data from PubMed.');
            }

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "text/xml");
            const error = xmlDoc.querySelector('ERROR');
            if (error) {
                throw new Error(error.textContent);
            }

            const idElements = xmlDoc.querySelectorAll('IdList Id');
            if (idElements.length === 0) {
                return [];
            }

            return Array.from(idElements).map(el => el.textContent);
        } catch (error) {
            console.error('Search error:', error);
            throw error;
        }
    }

    async function fetchArticles(apiKey, pmids, maxParallel) {
        const results = [];
        const batchSize = 100;  // Process in batches of 100 PMIDs at a time
        const delay = () => new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));  // Random delay to avoid hitting rate limits
    
        let processedCount = 0;  // Track number of processed articles
        progressBar.style.width = '0%';  // Reset progress bar
    
        // Iterate over the PMIDs in batches
        for (let i = 0; i < pmids.length; i += batchSize) {
            const batch = pmids.slice(i, i + batchSize);
            const batchPromises = [];
            
            // Process each PMID in the batch
            for (let j = 0; j < batch.length; j++) {
                const pmid = batch[j];
                batchPromises.push(
                    (async () => {
                        await delay();
                        try {
                            const article = await fetchArticleDetails(apiKey, pmid);
                            if (article) {
                                results.push(article);
                            }
                            processedCount++;
                            // Update the progress bar after each article
                            const progress = Math.min(100, Math.round((processedCount / pmids.length) * 100));
                            progressBar.style.width = `${progress}%`;
                        } catch (error) {
                            console.error(`Error fetching PMID ${pmid}:`, error);
                        }
                    })()
                );
    
                // Limit parallel requests
                if (batchPromises.length >= maxParallel) {
                    await Promise.all(batchPromises);  // Wait for all promises to resolve before continuing
                    batchPromises.length = 0;
                }
            }
    
            // Process any remaining promises in the batch
            if (batchPromises.length > 0) {
                await Promise.all(batchPromises);
            }
        }
    
        return results;  // Return the results after all articles are fetched
    }

    async function fetchArticleDetails(apiKey, pmid) {
        const params = new URLSearchParams({
            db: 'pubmed',
            id: pmid,
            retmode: 'xml',
            api_key: apiKey
        });

        const headers = {
            'User-Agent': 'PubMedFetcher/1.0 (webapp)'
        };

        try {
            const response = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?${params}`, { headers });
            const text = await response.text();
            
            if (!response.ok) {
                throw new Error(text.includes('API key') ? 'Invalid API key' : 'Failed to fetch article');
            }

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "text/xml");
            const error = xmlDoc.querySelector('ERROR');
            if (error) {
                throw new Error(error.textContent);
            }

            const article = xmlDoc.querySelector('PubmedArticle');
            if (!article) {
                throw new Error('No PubmedArticle found');
            }

            function safeExtract(selector, parent = article) {
                const element = parent.querySelector(selector);
                return element && element.textContent ? element.textContent.trim() : '';
            }

            const authors = Array.from(article.querySelectorAll('AuthorList > Author')).map(author => {
                const foreName = safeExtract('ForeName', author);
                const lastName = safeExtract('LastName', author);
                return `${foreName} ${lastName}`.trim();
            }).filter(name => name).join(', ');

            const doiElement = Array.from(article.querySelectorAll('ArticleId')).find(el => 
                el.getAttribute('IdType') === 'doi' && el.textContent
            );
            const doi = doiElement ? `https://doi.org/${doiElement.textContent.trim()}` : '';

            const abstractTexts = Array.from(article.querySelectorAll('AbstractText')).map(el => 
                el.textContent.trim()
            ).filter(text => text).join(' ');

            const publicationTypes = Array.from(article.querySelectorAll('PublicationType')).map(el => 
                el.textContent.trim()
            ).filter(text => text).join(', ');

            return {
                PMID: pmid,
                Title: safeExtract('ArticleTitle'),
                Journal: safeExtract('Journal > Title'),
                Author: authors,
                Year: safeExtract('PubDate > Year') || 
                      safeExtract('PubDate > MedlineDate').slice(0, 4) || '',
                DOI: doi,
                Volume: safeExtract('JournalIssue > Volume'),
                Issue: safeExtract('JournalIssue > Issue'),
                PublicationType: publicationTypes,
                Abstract: abstractTexts
            };
        } catch (error) {
            console.error(`Error processing PMID ${pmid}:`, error);
            return null;
        }
    }

    function exportData(articles, format) {
        switch (format) {
            case 'csv':
                return convertToCSV(articles);
            case 'json':
                return JSON.stringify(articles, null, 2);
            case 'bib':
                return convertToBibTeX(articles);
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }

    function convertToCSV(articles) {
        if (articles.length === 0) return '';
        
        const headers = Object.keys(articles[0]);
        const rows = articles.map(article => 
            headers.map(header => {
                const value = article[header];
                return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
            }).join(',')
        );
        
        return [headers.join(','), ...rows].join('\n');
    }

    function convertToBibTeX(articles) {
        return articles.map(article => {
            // Format authors with " and " separator
            const authors = article.Author
                .split(',')
                .map(author => author.trim())
                .join(' and ');
            
            // Escape special BibTeX characters in the abstract
            const abstract = article.Abstract
                .replace(/[{}]/g, '')  // Remove curly braces
                .replace(/\\/g, '\\\\') // Escape backslashes
                .replace(/"/g, '\\"');   // Escape quotes
            
            return `@article{${article.PMID},
      title = {${article.Title}},
      author = {${authors}},
      journal = {${article.Journal}},
      year = {${article.Year}},
      volume = {${article.Volume}},
      issue = {${article.Issue}},
      doi = {${article.DOI}},
      abstract = {${abstract}},
      publicationtype = {${article.PublicationType}}
    }`;
        }).join('\n');
    }

});
