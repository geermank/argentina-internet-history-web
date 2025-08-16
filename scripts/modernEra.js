import { CONTENT_MODERN_ERA_ENDPOINT } from './apiConstants.js'
import { loadContentPage } from './content.js';

document.addEventListener("DOMContentLoaded", () => {
    loadContentPage(CONTENT_MODERN_ERA_ENDPOINT, 'modern-era-page-content');
});