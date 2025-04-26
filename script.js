document.addEventListener('DOMContentLoaded', function() {
    const fetchButton = document.getElementById('fetchButton');
    const progressSection = document.getElementById('progressSection');
    const progressMessages = document.getElementById('progressMessages');
    
    const downloadLinks = document.getElementById('downloadLinks');
    const errorSection = document.getElementById('errorSection');

   


    fetchButton.addEventListener('click', async function() {
        // Reset UI
        progressMessages.innerHTML = '';
        downloadLinks.innerHTML = '';
        errorSection.style.display = 'none';
        progressSection.style.display = 'block';
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
    
        // Disable all user interactions (buttons, inputs, checkboxes)
        fetchButton.disabled = true;
        document.getElementById('exportCSV').disabled = true;
        document.getElementById('exportJSON').disabled = true;
        document.getElementById('exportBib').disabled = true;
        document.getElementById('apiKey').disabled = true;
        document.getElementById('parallelRequests').disabled = true;
        document.getElementById('searchQuery').disabled = true;
        document.getElementById('startYear').disabled = true;
        document.getElementById('endYear').disabled = true;
        document.getElementById('outputBaseName').disabled = true;
    
        spinner.style.display = 'inline-block';
    
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
        if (!apiKey) return showErrorAndReset("❌ No API key was entered.");
        if (parallelRequests < 3 || parallelRequests > 10) return showErrorAndReset("❌ Please enter a number of parallel requests between 3 and 10.");
        if (!searchQuery) return showErrorAndReset("❌ No search query provided.");
        if (startYear && !/^\d{4}$/.test(startYear)) return showErrorAndReset("❌ Invalid start year format. Please use YYYY.");
        if (endYear && !/^\d{4}$/.test(endYear)) return showErrorAndReset("❌ Invalid end year format. Please use YYYY.");
    
        const startYearInt = startYear ? parseInt(startYear) : null;
        const endYearInt = endYear ? parseInt(endYear) : null;
        const currentYear = new Date().getFullYear();
    
        if (startYearInt && startYearInt < 1809) return showErrorAndReset("❌ Start year must be 1809 or later.");
        if (endYearInt && endYearInt > currentYear) return showErrorAndReset(`❌ End year cannot be in the future (${currentYear}).`);
        if (startYearInt && endYearInt && endYearInt < startYearInt) return showErrorAndReset("❌ End year cannot be earlier than start year.");
    
        addProgressMessage("✅ Starting PubMed search...", "info");
    
        try {
            const pmids = await searchPubMed(apiKey, searchQuery, startYear, endYear);
    
            if (!pmids || pmids.length === 0) {
                addProgressMessage("❌ No articles found matching your criteria.", "error");
                return;
            }
    
            addProgressMessage(`✅ Found ${pmids.length.toLocaleString()} articles.`, "success");
    
            const proceed = confirm(`Found ${pmids.length.toLocaleString()} articles. Do you want to continue fetching their details?`);
            if (!proceed) {
                addProgressMessage("⛔ Operation cancelled by user.", "error");
                return;
            }
    
            addProgressMessage("⏳ Fetching article details...", "info");
            const articles = await fetchArticles(apiKey, pmids, parallelRequests);
    
            if (!articles || articles.length === 0) {
                addProgressMessage("❌ Failed to fetch article details.", "error");
                return;
            }
    
            addProgressMessage(`✅ Successfully fetched ${articles.length.toLocaleString()} articles.`, "success");
            addProgressMessage("⏳ Exporting results...", "info");
    
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
                link.innerHTML = `Download ${exp.format.toUpperCase()}`;
                downloadLinks.appendChild(link);
            }
    
            addProgressMessage("✅ All operations completed successfully!", "success");
            progressBar.style.width = '100%';
            progressBar.textContent = '100%';
    
        } catch (error) {
            console.error('Error:', error);
            addProgressMessage(`❌ An error occurred: ${error.message}`, "error");
            showError(error.message);
        } finally {
            // Enable user interactions after the process
            fetchButton.disabled = false;
            document.getElementById('exportCSV').disabled = false;
            document.getElementById('exportJSON').disabled = false;
            document.getElementById('exportBib').disabled = false;
            document.getElementById('apiKey').disabled = false;
            document.getElementById('parallelRequests').disabled = false;
            document.getElementById('searchQuery').disabled = false;
            document.getElementById('startYear').disabled = false;
            document.getElementById('endYear').disabled = false;
            document.getElementById('outputBaseName').disabled = false;
    
            spinner.style.display = 'none';
        }
    
        function showErrorAndReset(msg) {
            showError(msg);
            fetchButton.disabled = false;
            spinner.style.display = 'none';
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

    function setFormEnabled(enabled) {
        const idsToToggle = [
            'apiKey',
            'parallelRequests',
            'searchQuery',
            'startYear',
            'endYear',
            'outputBaseName',
            'exportCSV',
            'exportJSON',
            'exportBib',
            'fetchButton'
        ];
    
        idsToToggle.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.disabled = !enabled;
        });
    }
    


    async function fetchArticles(apiKey, pmids, maxParallel) {
        const results = [];
        const failedPMIDs = []; // ← Add this line
        const batchSize = 100;
        const delay = () => new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
        let processedCount = 0;
        let startTime = Date.now();
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
    
        for (let i = 0; i < pmids.length; i += batchSize) {
            const batch = pmids.slice(i, i + batchSize);
            const batchPromises = [];
    
            for (let j = 0; j < batch.length; j++) {
                const pmid = batch[j];
                batchPromises.push(
                    (async () => {
                        await delay();
                        try {
                            const article = await fetchArticleDetails(apiKey, pmid);
                            if (article) {
                                results.push(article);
                            } else {
                                failedPMIDs.push(pmid); // ← Track failure here
                            }
                        } catch (error) {
                            console.error(`Error fetching PMID ${pmid}:`, error);
                            failedPMIDs.push(pmid); // ← And here too
                        } finally {
                            processedCount++;
                            const progress = Math.min(100, Math.round((processedCount / pmids.length) * 100));
                            const elapsedTime = (Date.now() - startTime) / 1000;
                            const minutes = Math.floor(elapsedTime / 60);
                            const seconds = Math.floor(elapsedTime % 60);
                            const timeFormatted = `${minutes}m ${seconds}s`;
                            progressBar.style.width = `${progress}%`;
                            progressBar.textContent = `${progress}% - ${timeFormatted}`;
                        }
                    })()
                );
    
                if (batchPromises.length >= maxParallel) {
                    await Promise.all(batchPromises);
                    batchPromises.length = 0;
                }
            }
    
            if (batchPromises.length > 0) {
                await Promise.all(batchPromises);
            }
        }
    
        if (failedPMIDs.length > 0) {
            addProgressMessage(`⚠️ Failed to fetch ${failedPMIDs.length} article(s).`, "warning");
            console.warn('Failed PMIDs:', failedPMIDs);
            addProgressMessage(`PMID(s) of article(s) not fetched: ${failedPMIDs.join(', ')}`, "warning");
        }
        
        const finalElapsedTime = (Date.now() - startTime) / 1000;
        const finalMinutes = Math.floor(finalElapsedTime / 60);
        const finalSeconds = Math.floor(finalElapsedTime % 60);
        const finalTimeFormatted = `${finalMinutes}m ${finalSeconds}s`;
        
        progressBar.style.width = `100%`;
        setTimeout(() => {
            progressBar.textContent = `100% - Completed in ${finalTimeFormatted}`;
        }, 0);  // This ensures DOM update happens after style width change

        // Reset all input fields to default
        document.getElementById("apiKey").value = "";
        document.getElementById("searchQuery").value = "";
        document.getElementById("startYear").value = "";
        document.getElementById("endYear").value = "";
        document.getElementById("parallelRequests").value = "5";
        document.getElementById("outputBaseName").value = "pubmed_results";

        // Reset checkboxes to checked
        document.getElementById("exportCSV").checked = true;
        document.getElementById("exportJSON").checked = true;
        document.getElementById("exportBib").checked = true;



        
        return results;
        
    }
    
    
    async function fetchArticleDetails(apiKey, pmid) {
        const params = new URLSearchParams({
            db: 'pubmed',
            id: pmid,
            retmode: 'xml',
            api_key: apiKey
        });
    
        // Emptying this solved CORS problem
        const headers = {
            
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
    
            const affiliations = Array.from(article.querySelectorAll('AffiliationInfo > Affiliation'))
            .map(el => el.textContent.trim())
            .filter(Boolean);
        
            let country = '';
            if (affiliations.length > 0) {
                const lastAffil = affiliations[0]; // or loop to find one with a country
                const parts = lastAffil.split(/[,;]+/);
                country = parts[parts.length - 1].trim().replace(/\.$/, ''); // Remove trailing period
            }
        

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
                Country: country,
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
                .replace(/[{}]/g, '')          // Remove curly braces
                .replace(/\\/g, '\\\\')        // Escape backslashes
                .replace(/"/g, '\\"')          // Escape quotes
                .replace(/&/g, '\\&')
                .replace(/%/g, '\\%')
                .replace(/\$/g, '\\$')
                .replace(/#/g, '\\#')
                .replace(/_/g, '\\_');
            
            return `@article{${article.PMID},
      title = {${article.Title}},
      author = {${authors}},
      country = {${article.Country}},
      journal = {${article.Journal}},
      year = {${article.Year}},
      volume = {${article.Volume}},
      issue = {${article.Issue}},
      doi = {${article.DOI}},
      abstract = {${abstract}},
      publicationtype = {${article.PublicationType}},
      pmid={${article.PMID}}
    }`;
        }).join('\n');
    }

});
