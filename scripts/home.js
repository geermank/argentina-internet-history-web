import { HOME_NUMERIC_FACTS_ENDPOINT } from './apiResources.js'
import { HOME_KEY_FACTS_ENDPOINT } from './apiResources.js'

/**
 * DOMContentLoaded event listener to load numeric facts section from the API
 */
document.addEventListener("DOMContentLoaded", () => {
    // load partial templates. These help us to reuse loading and error sections
    // in both numeric and key fact sections, and avoid repetition of code
    const homeLoadingTemplate = document.getElementById('home-loading-template').innerHTML
    const homeErrorTemplate = document.getElementById('home-error-template').innerHTML
    Handlebars.registerPartial('HomeLoading', homeLoadingTemplate)
    Handlebars.registerPartial('HomeError', homeErrorTemplate)

    // load the template using handlebars
    const numericFactsHtml = document.getElementById('numeric-facts-section-template').innerHTML;
    const template = Handlebars.compile(numericFactsHtml);

    // remove template from html
    document.getElementById('numeric-facts-section-template').innerHTML = ""

    // auxiliary function to render the given data inside the facts container
    // using the loaded template to build the html
    const render = (data) => {
        const html = template(data)
        document.getElementById('numeric-facts-container').innerHTML = html;
    };

    // fetch numeric facts from the API
    fetch(HOME_NUMERIC_FACTS_ENDPOINT)
        .then(response => response.json())
        .then(jsonData => render({ loading: false, facts: jsonData.facts }))
        .catch(_ => render({ loading: false, error: true }));

    // in the meantime, while data loads, show loading indicators in the webpage
    render({ loading: true });
})

/**
 * DOMContentLoaded event listener to load key facts section from the API
 */
document.addEventListener("DOMContentLoaded", () => {
    // load the template using handlebars
    const numericFactsHtml = document.getElementById('key-facts-section-template').innerHTML;
    const template = Handlebars.compile(numericFactsHtml);

    // remove template from html
    document.getElementById('key-facts-section-template').innerHTML = ""

    // auxiliary function to render the given data inside the facts container
    // using the loaded template to build the html
    const render = (data) => {
        const html = template(data);
        document.getElementById('key-facts-container').innerHTML = html;
    };

    // fetch numeric facts from the API
    fetch(HOME_KEY_FACTS_ENDPOINT)
        .then(response => response.json())
        .then(jsonData => render({ loading: false, facts: jsonData.facts }))
        .catch(_ => render({ loading:false, error: true }));

    // in the meantime, while data loads, show loading indicators in the webpage
    render({ loaded: false });
})
