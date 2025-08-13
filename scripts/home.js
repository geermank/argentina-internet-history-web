import { HOME_NUMERIC_FACTS_ENDPOINT } from './apiResources.js'
import { HOME_KEY_FACTS_ENDPOINT } from './apiResources.js'

/**
 * DOMContentLoaded event listener to load numeric and key facts sections, 
 * loading data from the API
 */
document.addEventListener("DOMContentLoaded", () => {
    loadHomeSection(
        HOME_NUMERIC_FACTS_ENDPOINT,
        'numeric-facts-section-template',
        'numeric-facts-container'
    )
    loadHomeSection(
        HOME_KEY_FACTS_ENDPOINT,
        'key-facts-section-template',
        'key-facts-container'
    )
});

function loadHomeSection(endpoint, templateId, containerId) {
    // load partial templates. These help us to reuse loading and error designs
    // in all required sections, avoiding repetition of code
    const homeLoadingTemplate = document.getElementById('home-loading-template').innerHTML
    const homeErrorTemplate = document.getElementById('home-error-template').innerHTML
    Handlebars.registerPartial('HomeLoading', homeLoadingTemplate)
    Handlebars.registerPartial('HomeError', homeErrorTemplate)

    // load the template using handlebars
    const template = Handlebars.compile(document.getElementById(templateId).innerHTML);

    // remove template from html
    document.getElementById(templateId).innerHTML = ""

    // auxiliary function to render the given data inside the facts container
    // using the loaded template to build the html
    const render = (data) => {
        document.getElementById(containerId).innerHTML = template(data);
    };

    // fetch numeric facts from the API
    fetch(endpoint)
        .then(response => response.json())
        .then(jsonData => render({ error: false, loading: false, data: jsonData }))
        .catch(_ => render({ error: true, loading: false, data: null }));

    // in the meantime, while data loads, show loading indicators in the webpage
    render({ loading: true, error: false, data: null });
}
