export async function loadContentPage(endpoint, containerId) {
    // auxiliary function to load templates
    // use async function here to avoid callback hell, since we have quite a few templates
    async function loadTemplatesDoc(url) {
        const html = await fetch(url).then(r => r.text());
        return new DOMParser().parseFromString(html, "text/html");
    }

    // helper function to compile a handlebars template by id
    function compileTemplate(doc, id) {
        // convert a template into a reusable JS function, to which we can pass objects in runtime
        // documentation: https://handlebarsjs.com/api-reference/compilation.html#handlebars-compile-template-options
        return Handlebars.compile(doc.getElementById(id).innerHTML);
    }

    // load the sdui components 
    const templatesDocument = await loadTemplatesDoc("sdui/components.html");
    const navbarTemplate = compileTemplate(templatesDocument, "navbar-template");
    const titleTemplate = compileTemplate(templatesDocument, "title-template");
    const paragraphTemplate = compileTemplate(templatesDocument, "paragraph-template");
    const loadingTemplate = compileTemplate(templatesDocument, "loading-template");
    const errorTemplate = compileTemplate(templatesDocument, "error-template");

    const container = document.getElementById(containerId);
    container.innerHTML = "";

    // show a loading screen while we get the content and parse it
    container.insertAdjacentHTML("beforeend", loadingTemplate);

    fetch(endpoint)
        .then(response => response.json())
        .then(jsonResponse => {
            const sduiMapper = {
                navbar: (templateData) => navbarTemplate(templateData),
                title: (templateData) => titleTemplate(templateData),
                paragraph: (templateData) => paragraphTemplate(templateData)
            };

            // remove loading
            container.innerHTML = "";

            // add the navbar first if there
            const navbarBlock = jsonResponse.response.content.find(b => b.type === "navbar");
            if (navbarBlock && sduiMapper[navbarBlock.type]) {
                container.insertAdjacentHTML("beforeend", sduiMapper[navbarBlock.type](navbarBlock.data));
            }

            for (const block of jsonResponse.response.content) {
                if (block.type === "navbar") 
                    // already added
                    continue;

                const renderFunction = sduiMapper[block.type];
                if (!renderFunction) {
                    // unknown template
                    console.warn(`No template for type "${block.type}"`);
                    continue;
                }
                const html = renderFunction(block.data);
                container.insertAdjacentHTML("beforeend", html);
            }
        })
        .catch(err => {
            console.error(err);
            // show error template in case of error
            container.innerHTML = errorTemplate({ message: "Something went wrong. Please try again later." });
        })
}
