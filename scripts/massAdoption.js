import { CONTENT_MASS_ADOPTION_ENDPOINT } from './apiConstants.js'
import { loadContentPage } from './contentPage.js';

document.addEventListener("DOMContentLoaded", () => {
    loadContentPage(CONTENT_MASS_ADOPTION_ENDPOINT, 'mass-adoption-page-content');
});