import { CONTENT_EARLY_YEARS_ENDPOINT } from './apiConstants.js'
import { loadContentPage } from './content.js';

document.addEventListener("DOMContentLoaded", () => {
    loadContentPage(CONTENT_EARLY_YEARS_ENDPOINT, 'early-years-page-content');
});