document.addEventListener("DOMContentLoaded", () => {
    const numericFactsHtml = document.getElementById('numeric-facts-section-template').innerHTML;
    const template = Handlebars.compile(numericFactsHtml);

    // remove template from html
    document.getElementById('numeric-facts-section-template').innerHTML = ""

    const render = (data) => {
        const html = template(data);
        document.getElementById('numeric-facts-container').innerHTML = html;
    };

    fetch("https://argentina-internet-history-api.vercel.app/api/v1/home/numeric-facts")
        .then(response => response.json())
        .then(jsonData => render(jsonData))
        .catch(error => console.log(error));
})
