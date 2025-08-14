import { CONTENT_EARLY_YEARS_ENDPOINT } from './apiConstants.js'
import { loadContentPage } from './content.js';

/**
 * DOMContentLoaded event listener to load numeric and key facts sections, 
 * loading data from the API
 */
document.addEventListener("DOMContentLoaded", () => {
    loadContentPage(CONTENT_EARLY_YEARS_ENDPOINT, 'early-years-content');
});