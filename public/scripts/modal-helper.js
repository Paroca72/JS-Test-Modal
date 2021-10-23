; (function (window) {

    /**
     * ----------------------------------------------------------------------------------
     * Base class
     * ----------------------------------------------------------------------------------
     * Define the modal helper
     */
    function Modal(settings) {
        // Initialize the class.
        this.init(settings);
    };

    // Inheritance
    Modal.prototype = Object.create(Object.prototype);
    Modal.prototype.constructor = Modal;

    // Global references
    window.Modal = Modal;

    // Define the initial options
    Modal.prototype.settings = {
        source: null,
        trigger: "click",
        message: null,
        onConfirm: null,
        onCancel: null,
    };


    // --------------------------------------------------------------------------
    // PRIVATE METHODS

    // Render the modal background
    var renderBackground = function () {
        // Create the div
        const background = document.createElement("div");
        background.classList.add("modal-helper-background");

        // Get it
        return background;
    };

    // Render the content container
    var renderButtons = function (actionCallback) {
        // Create the container
        const container = document.createElement("div");
        container.classList.add("modal-helper-buttons");

        // Add the buttons, just Yes and Cancel
        const confirm = document.createElement("button");
        confirm.type = "button";
        confirm.onclick = actionCallback;
        confirm.innerHTML = "Yes";
        confirm.name = "Yes";
        container.appendChild(confirm);

        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.onclick = actionCallback;
        cancel.innerHTML = "Cancel";
        cancel.name = "Cancel";
        container.appendChild(cancel);

        // Get it
        return container;
    };

    // Render the content container
    var renderContent = function (message, actionCallback) {
        // Create the container
        const content = document.createElement("div");
        content.classList.add("modal-helper-content");

        // Add the text (could be HTML)
        const text = document.createElement("div");
        text.classList.add("modal-helper-text");
        text.innerHTML = message || "";
        content.appendChild(text);

        // Render buttons
        content.appendChild(renderButtons(actionCallback));

        // Get it
        return content;
    };

    // Render the whole modal
    var renderModal = function (settings, actionCallback) {
        // Create the container
        const main = document.createElement("div");
        main.classList.add("modal-helper-main");

        // Add elements
        main.appendChild(renderBackground());
        main.appendChild(renderContent(settings.message, actionCallback));

        // Add to the body
        document.body.appendChild(main);

        // Return the modal refernece
        return main;
    };

    // --------------------------------------------------------------------------
    // PUBBLIC METHODS

    /**
     * Open the modal
     */
    Modal.prototype.open = function () {
        // Need the context
        var context = this;

        // Render
        this.modalContent = renderModal(this.settings, function () {
            // Close the modal
            context.close();

            // Event
            var eventName = this.name == "Yes" ? "onConfirm": "onCancel";
            if (typeof context.settings[eventName] === "function")
                context.settings[eventName]();
        });
    }

    /**
     * Close the modal
     */
    Modal.prototype.close = function () {
        if (this.modalContent)
            this.modalContent.parentElement.removeChild(this.modalContent);
    }

    /**
     * Init the class.
     */
     Modal.prototype.init = function (settings) {
        // Merge settings
        this.settings = Object.assign({}, this.settings, settings);

        // Need to have a soruce element.
        // If missing no error will throw just nothing will happen when try to use other function.
        var source = settings.hasOwnProperty("source") ? settings["source"]: null;
        this.source = source ? document.getElementById(source): null;

        // Attach the event
        var context = this;
        var eventName = "on" + (this.settings.trigger || "").toLowerCase();
        
        if (this.source && typeof this.source[eventName] !== "undefined")
            this.source[eventName] = () => this.open.call(context);
     };

})(window);