export async function loadContentPage(endpoint, containerId) {
    registerPartialsAndHelpers();

    // auxiliary function to load templates
    // use async function here to avoid callback hell, since we have quite a few templates
    async function loadSDUITemplatesDocument(url) {
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
    const templatesDocument = await loadSDUITemplatesDocument("sdui/components.html");
    const navbarTemplate = compileTemplate(templatesDocument, "navbar-template");
    const titleTemplate = compileTemplate(templatesDocument, "title-template");
    const subtitleTemplate = compileTemplate(templatesDocument, "subtitle-template");
    const paragraphTemplate = compileTemplate(templatesDocument, "paragraph-template");
    const verticalSpaceTemplate = compileTemplate(templatesDocument, "space-template");
    const loadingTemplate = compileTemplate(templatesDocument, "loading-template");
    const errorTemplate = compileTemplate(templatesDocument, "error-template");
    const timelineTemplate = compileTemplate(templatesDocument, "timeline-template");

    const container = document.getElementById(containerId);
    container.innerHTML = "";

    // show a loading screen while we get the content and parse it
    container.insertAdjacentHTML("beforeend", loadingTemplate({}));

    fetch(endpoint)
        .then(response => response.json())
        .then(jsonResponse => {
            // maps a 'type' value recived in the SDUI response, to a handlebars template function
            const sduiMapper = {
                navbar: (templateData) => navbarTemplate(templateData),
                title: (templateData) => titleTemplate(templateData),
                subtitle: (templateData) => subtitleTemplate(templateData),
                paragraph: (templateData) => paragraphTemplate(templateData),
                space: (templateData) => verticalSpaceTemplate(templateData),
                timeline: (templateData) => timelineTemplate(templateData)
            };

            // set the title of the page
            if (jsonResponse.page.title) {
                document.title = jsonResponse.page.title
            }

            // remove loading
            container.innerHTML = "";

            // add the navbar first if there's one
            const navbarBlock = jsonResponse.page.content.find(b => b.type === "navbar");
            if (navbarBlock && sduiMapper[navbarBlock.type]) {
                container.insertAdjacentHTML("beforeend", sduiMapper[navbarBlock.type](navbarBlock.data));
            }

            // iterate SDUI components, map them to a template and rendered it in the given container
            for (const block of jsonResponse.page.content) {
                if (block.type === "navbar") 
                    // already added
                    continue;

                const renderFunction = sduiMapper[block.type];
                if (!renderFunction) {
                    // unknown template, go on without failing
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

function registerPartialsAndHelpers() {
    // needed for some templates to work properly. 
    // kinda hacky, but tried a couple of alternatives and couldn't make it work other way
    // this is needed to show the checkmark svg in milestone SDUI component
    Handlebars.registerPartial(
        'IconCheck',
         `
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-5 w-5">
                <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clip-rule="evenodd"
                />
            </svg>
      `
    );
    // isEven is a helper function to use in handlebars templates while iterating a collection
    // returns true if the current index is even, false otherwise 
    Handlebars.registerHelper(
        'isEven',
         function(value, options) {
            return (value % 2 === 0) ? options.fn(this) : options.inverse(this);
        }
    );
}