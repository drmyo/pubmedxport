// Country list checked against .json
// First author in one field and other authors in another field
// First author country in one field and other author countries in another field

document.addEventListener('DOMContentLoaded', async function() {
    const fetchButton = document.getElementById('fetchButton');
    const progressSection = document.getElementById('progressSection');
    const progressMessages = document.getElementById('progressMessages');
    const downloadLinks = document.getElementById('downloadLinks');
    const errorSection = document.getElementById('errorSection');
    const progressBar = document.getElementById('progressBar');
    const spinner = document.getElementById('spinner');

    // 🔸 Load standardized country list
    let countryList = [];
    try {
        const response = await fetch('country_list.json');
        if (!response.ok) throw new Error('Failed to load country list.');
        countryList = await response.json();
    } catch (error) {
        showError(`❌ Error loading country list: ${error.message}`);
        return;
    }

    let currentBlobUrls = {};

    fetchButton.addEventListener('click', async function() {
        // Reset UI
        progressMessages.innerHTML = '';
        //downloadLinks.innerHTML = '';
        errorSection.style.display = 'none';
        progressSection.style.display = 'block';
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';

        document.querySelectorAll('.download-button').forEach(btn => btn.remove());
    
        // Clean up previous blob URLs at start of new search
        Object.values(currentBlobUrls).forEach(url => URL.revokeObjectURL(url));
        currentBlobUrls = {};
        
        // Disable all user interactions (buttons, inputs)
        setFormEnabled(false);
        spinner.style.display = 'inline-block';
    
        // Get input values
        const apiKey = document.getElementById('apiKey').value.trim();
        const parallelRequests = parseInt(document.getElementById('parallelRequests').value) || 5;
        const searchQuery = document.getElementById('searchQuery').value.trim();
        const startYear = document.getElementById('startYear').value.trim();
        const endYear = document.getElementById('endYear').value.trim();
    
        // Input validation
        if (!apiKey) return showErrorAndReset("❌ Please enter a PubMed API key.");
        
        addProgressMessage("🔍 Validating API key...", "info");
        try {
            const isValid = await validateApiKey(apiKey);
            if (!isValid) {
                return showErrorAndReset("❌ Invalid API key. Please check your API key and try again.");
            }
            addProgressMessage("✅ API key is valid.", "success");
        } catch (error) {
            return showErrorAndReset("❌ Error validating API key. Please check your network connection and try again.");
        }
    
        if (parallelRequests < 3 || parallelRequests > 10) return showErrorAndReset("❌ Number of parallel requests must be between 3 and 10.");
        if (!searchQuery) return showErrorAndReset("❌ Please enter a search query.");
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
            const articles = await fetchArticles(apiKey, pmids, parallelRequests, {
                downloadLinksElement: downloadLinks,
                addProgressMessage: addProgressMessage
            });
    
            if (!articles || articles.length === 0) {
                addProgressMessage("❌ Failed to fetch article details.", "error");
                return;
            }
    
            addProgressMessage(`✅ Successfully fetched ${articles.length.toLocaleString()} articles.`, "success");
            addProgressMessage("⏳ Exporting results...", "info");
        
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            const baseFilename = 'pubmed_results_' + timestamp;  // Or use user preferred filename

            const exports = [
                { format: 'csv', extension: '.csv' },
                { format: 'json', extension: '.json' },
                { format: 'bib', extension: '.bib' }
            ];
    
            for (const exp of exports) {
                const defaultFilenames = {
                    csv: `pubmed_results_${timestamp}.csv`,
                    json: `pubmed_results_${timestamp}.json`,
                    bib: `pubmed_results_${timestamp}.bib`
                };
                const content = exportData(articles, exp.format);
                const blob = new Blob([content], { type: 'text/plain' });
                currentBlobUrls[exp.format] = URL.createObjectURL(blob);
    
                const link = document.createElement('button');
                link.className = `download-button download-link ${exp.format}`;
                link.onclick = function() {
                    const a = document.createElement('a');
                    a.href = currentBlobUrls[exp.format];
                    a.download = defaultFilenames[exp.format];
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    // No URL.revokeObjectURL here - keep it available for re-downloads
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
            setFormEnabled(true);
            spinner.style.display = 'none';
        }
    
        function showErrorAndReset(msg) {
            showError(msg);
            fetchButton.disabled = false;
            spinner.style.display = 'none';
        }
    });
    
    async function validateApiKey(apiKey) {
        try {
            const params = new URLSearchParams({
                db: 'pubmed',
                term: 'test',
                retmax: 1,
                api_key: apiKey
            });
    
            const response = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?${params}`);
            const text = await response.text();
            
            if (!response.ok) {
                return false;
            }
    
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "text/xml");
            return !xmlDoc.querySelector('ERROR');
        } catch (error) {
            return false;
        }
    }


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
                throw new Error('Failed to reach NCBI server. Please check your network connection and try again.');
            }
        
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "text/xml");
        
            const error = xmlDoc.querySelector('ERROR');
            if (error) {
                throw new Error('NCBI API returned an error. Please verify your API key and parameters.');
            }
        
            const idElements = xmlDoc.querySelectorAll('IdList Id');
            if (idElements.length === 0) {
                throw new Error('No results found for the given search query.');
            }
        
            return Array.from(idElements).map(el => el.textContent);
        
        } catch (error) {
            console.error('Search error:', error);
            throw new Error(error.message || 'An unexpected error occurred. Please try again.');
        }
    }
    

    function setFormEnabled(enabled) {
        const idsToToggle = [
            'apiKey',
            'parallelRequests',
            'searchQuery',
            'startYear',
            'endYear',
            'fetchButton'
        ];
    
        idsToToggle.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.disabled = !enabled;
        });
    }
    
    function resetFormValues() {
        document.getElementById("apiKey").value = "";
        document.getElementById("searchQuery").value = "";
        document.getElementById("startYear").value = "";
        document.getElementById("endYear").value = "";
        document.getElementById("parallelRequests").value = "5";
    }
    
    

    async function fetchArticles(apiKey, pmids, maxParallel, { downloadLinksElement, addProgressMessage }) {
        const results = [];
        const failedPMIDs = [];
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
                                failedPMIDs.push(pmid);
                            }
                        } catch (error) {
                            console.error(`Error fetching PMID ${pmid}:`, error);
                            failedPMIDs.push(pmid); 
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
            
            const tempContainer = document.createElement('div');
            tempContainer.style.display = 'none';
            document.body.appendChild(tempContainer);
    
            const failedPmidsContent = failedPMIDs.join('\n');
            const failedPmidsBlob = new Blob([failedPmidsContent], { type: 'text/plain' });
            const failedPmidsUrl = URL.createObjectURL(failedPmidsBlob);
    
            const failedLink = document.createElement('button');
            failedLink.className = 'download-button download-link failed-pmids';
            failedLink.onclick = function() {
                const a = document.createElement('a');
                a.href = failedPmidsUrl;
                a.download = 'failed_pmids.txt';  // Default name
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
            failedLink.innerHTML = 'Download Failed PMIDs';
            downloadLinksElement.appendChild(failedLink);
    
        }

        
        const finalElapsedTime = (Date.now() - startTime) / 1000;
        const finalMinutes = Math.floor(finalElapsedTime / 60);
        const finalSeconds = Math.floor(finalElapsedTime % 60);
        const finalTimeFormatted = `${finalMinutes}m ${finalSeconds}s`;
        
        progressBar.style.width = `100%`;
        setTimeout(() => {
            progressBar.textContent = `100% - Completed in ${finalTimeFormatted}`;
        }, 0);  
        
        // Reset all input fields to default
        document.getElementById("apiKey").value = "";
        document.getElementById("searchQuery").value = "";
        document.getElementById("startYear").value = "";
        document.getElementById("endYear").value = "";
        document.getElementById("parallelRequests").value = "5";
        
        return results;
        
    }
    
    
    async function fetchArticleDetails(apiKey, pmid) {
        const params = new URLSearchParams({
            db: 'pubmed',
            id: pmid,
            retmode: 'xml',
            api_key: apiKey
        });
    
        try {
            const response = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?${params}`);
            const text = await response.text();
            if (!response.ok) throw new Error('Invalid API Key or Network error');
    
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "text/xml");
            const error = xmlDoc.querySelector('ERROR');
            if (error) throw new Error('Invalid API Key or Network error');
    
            const article = xmlDoc.querySelector('PubmedArticle');
            if (!article) throw new Error('Invalid API Key or Network error');
    
            function safeExtract(selector, parent = article) {
                const element = parent.querySelector(selector);
                return element && element.textContent ? element.textContent.trim() : '';
            }
    
            // Extract all authors and separate first author from co-authors
            const authorElements = Array.from(article.querySelectorAll('AuthorList > Author'));
            let firstAuthor = '';
            const coAuthors = [];
            
            authorElements.forEach((author, index) => {
                const foreName = safeExtract('ForeName', author);
                const lastName = safeExtract('LastName', author);
                const fullName = `${foreName} ${lastName}`.trim();
                
                if (fullName) {
                    if (index === 0) {
                        firstAuthor = fullName;
                    } else {
                        coAuthors.push(fullName);
                    }
                }
            });
    
            const affiliations = Array.from(article.querySelectorAll('AffiliationInfo > Affiliation'))
                .map(el => el.textContent.trim())
                .filter(Boolean);
    
            // Initialize country variables
            let firstAuthorCountry = '';
            const coAuthorCountries = new Set();
    
            if (affiliations.length > 0) {
                // Process all affiliations to find countries
                for (let i = 0; i < affiliations.length; i++) {
                    const affil = affiliations[i].toLowerCase();
                    
                    for (const entry of countryList) {
                        const patterns = [entry.name.toLowerCase(), ...(entry.aliases || []).map(a => a.toLowerCase())];
                        
                        for (const pattern of patterns) {
                            if (affil.includes(pattern)) {
                                if (i === 0) {
                                    firstAuthorCountry = entry.name;
                                } else {
                                    coAuthorCountries.add(entry.name);
                                }
                                break; 
                            }
                        }
                    }
                }
            }

            coAuthorCountries.delete(firstAuthorCountry);
    
            const coAuthorCountriesString = Array.from(coAuthorCountries).map(c => `"${c}"`).join(', ');
            
            const coAuthorsString = coAuthors.join(', ');
    
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
                FirstAuthor: firstAuthor,
                CoAuthors: coAuthorsString,
                FirstAuthorCountry: firstAuthorCountry,
                CoAuthorCountries: coAuthorCountriesString,
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
            throw new Error('Invalid API Key or Network error');
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
        const authors = [article.FirstAuthor, ...article.CoAuthors.split(', ')]
            .filter(a => a) 
            .join(' and ');
        
        const abstract = article.Abstract
            .replace(/[{}]/g, '')    
            .replace(/\\/g, '\\\\')  
            .replace(/"/g, '\\"')    
            .replace(/&/g, '\\&')
            .replace(/%/g, '\\%')
            .replace(/\$/g, '\\$')
            .replace(/#/g, '\\#')
            .replace(/_/g, '\\_');
        
        return `@article{${article.PMID},
            title = {${article.Title}},
            author = {${authors}},
            firstauthorcountry = {${article.FirstAuthorCountry}},
            coauthorscountries = {${article.CoAuthorCountries}},
            journal = {${article.Journal}},
            year = {${article.Year}},
            volume = {${article.Volume}},
            issue = {${article.Issue}},
            doi = {${article.DOI}},
            abstract = {${abstract}},
            publicationtype = {${article.PublicationType}},
            pmid = {${article.PMID}}
        }`;
    }).join('\n');
}
});
