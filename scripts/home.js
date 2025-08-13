document.addEventListener("DOMContentLoaded", () => {
    // load the template using handlebars
    const numericFactsHtml = document.getElementById('numeric-facts-section-template').innerHTML;
    const template = Handlebars.compile(numericFactsHtml);

    // remove template from html
    document.getElementById('numeric-facts-section-template').innerHTML = ""

    // auxiliary function to render the given data inside the facts container
    // using the loaded template to build the html
    const render = (data) => {
        const html = template(data);
        document.getElementById('numeric-facts-container').innerHTML = html;
    };

    // fetch numeric facts from the API
    fetch("https://argentina-internet-history-api.vercel.app/api/v1/home/numeric-facts")
        .then(response => response.json())
        .then(jsonData => render({ loaded: true, facts: jsonData.facts }))
        .catch(error => console.log(error));

    // in the meantime, while data loads, show loading indicators in the webpage
    render({ loaded: false });
})
