(function (global) {
  // Constructor for the clipx object
  function clipx() {
    this.attach = this.attach.bind(this); // Bind the attach method to the instance
    this.isProcessing = false; // Flag to prevent multiple executions
    // Global flags to disable specific features
    this.disable = {
      msg: false,
      toast: false,
    };
    this.customStyles = {}; // Store custom styles for the toast notifications
  }

  // Method to copy text to clipboard
  clipx.prototype.copyText = function (text) {
    if (navigator.clipboard) {
      // Use the Clipboard API if available
      return navigator.clipboard.writeText(text);
    } else if (navigator.permissions) {
      // Check permissions if Clipboard API is not available
      return navigator.permissions
        .query({ name: "clipboard-write" })
        .then(function (permissionStatus) {
          if (
            permissionStatus.state === "granted" ||
            permissionStatus.state === "prompt"
          ) {
            return navigator.clipboard.writeText(text);
          } else {
            throw new Error("Clipboard write permission denied.");
          }
        });
    } else {
      // Fallback to using a temporary textarea element for older browsers
      var textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return Promise.resolve();
    }
  };

  // Method to cut (copy and then clear) text from an element
  clipx.prototype.cutText = function (text, element) {
    return this.copyText(text).then(function () {
      if (element) {
        element.value = ""; // Clear value for input elements
        element.textContent = ""; // Clear text content for non-input elements
      }
    });
  };

  // Method to copy text from an element
  clipx.prototype.copyFromElement = function (element) {
    var text = element.value || element.textContent; // Get text from input or non-input element
    return this.copyText(text);
  };

  // Method to cut (copy and then clear) text from an element
  clipx.prototype.cutFromElement = function (element) {
    var text = element.value || element.textContent; // Get text from input or non-input element
    return this.cutText(text, element);
  };

  // Method to attach event listeners to elements matching the selector
  clipx.prototype.attach = function (selector) {
    var elements = document.querySelectorAll(selector);
    elements.forEach(
      function (element) {
        element.addEventListener(
          "click",
          function () {
            if (this.isProcessing) return; // Prevent multiple executions
            this.isProcessing = true;

            var targetSelector = element.getAttribute("data-clipx-target");
            var text = element.getAttribute("data-clipx-text");
            var cut = element.hasAttribute("data-clipx-cut");
            var msgType = element.getAttribute("data-clipx-msg");
            var toastOnly = element.hasAttribute("data-clipx-toast");
            var disableMsg = element.hasAttribute("data-clipx-disable-msg");
            var disableToast = element.hasAttribute("data-clipx-disable-toast");
            var toastPosition =
              element.getAttribute("data-clipx-toast-position") || "bottom";
            var contentDuration =
              parseInt(element.getAttribute("data-clipx-duration"), 10) || 1500;

            var actionPromise;

            // Determine the action based on attributes
            if (targetSelector) {
              var targetElement = document.querySelector(targetSelector);
              if (targetElement) {
                actionPromise = cut
                  ? this.cutFromElement(targetElement)
                  : this.copyFromElement(targetElement);
              }
            } else if (text) {
              actionPromise = cut ? this.cutText(text) : this.copyText(text);
            }

            if (actionPromise) {
              actionPromise
                .then(() =>
                  this.onSuccess(
                    element,
                    msgType,
                    toastOnly,
                    disableMsg,
                    disableToast,
                    toastPosition,
                    contentDuration
                  )
                )
                .catch((err) => this.onError(element, err))
                .finally(() => {
                  this.isProcessing = false;
                });
            }
          }.bind(this)
        );
      }.bind(this)
    );
  };

  // Handle successful copy/cut operation
  clipx.prototype.onSuccess = function (
    element,
    msgType,
    toastOnly,
    disableMsg,
    disableToast,
    toastPosition,
    contentDuration
  ) {
    var originalText = element.textContent; // Store original text content
    var customMessage = msgType || "Copied !"; // Use provided message or default to "Copied!"
    var toastClass =
      toastPosition === "top" ? "clipx-toast top" : "clipx-toast bottom";

    if (!toastOnly && !disableMsg && !this.disable.msg) {
      element.textContent = customMessage; // Update element's text content
    }

    if (!disableToast && !this.disable.toast) {
      var toast = document.createElement("div");
      toast.className = toastClass;
      toast.textContent = customMessage;
      toast.setAttribute("role", "alert");
      toast.setAttribute("aria-live", "assertive");
      toast.style.cssText = this.customStyles.toast || ""; // Apply custom styles if any

      document.body.appendChild(toast);

      // Fade-in and fade-out animation
      toast.style.opacity = 0;
      setTimeout(() => (toast.style.opacity = 1), 0);

      setTimeout(
        function () {
          toast.style.opacity = 0;
          setTimeout(() => document.body.removeChild(toast), 500);

          if (!toastOnly && !disableMsg && !this.disable.msg) {
            element.textContent = originalText; // Restore original text content
          }
        }.bind(this),
        contentDuration
      );
    } else {
      setTimeout(
        function () {
          if (!this.disable.msg) {
            element.textContent = originalText; // Restore original text content
          }
        }.bind(this),
        contentDuration
      );
    }
  };

  // Handle errors during copy/cut operation
  clipx.prototype.onError = function (element, err) {
    console.error("Failed to cut/copy text: ", err);
    var toast = document.createElement("div");
    toast.className = "clipx-toast error";
    toast.textContent = "Failed to copy!";
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.style.cssText = this.customStyles.toast || "";

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = 0;
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 1500);
  };

  // Method to set custom styles for toast notifications
  clipx.prototype.setCustomStyles = function (styles) {
    this.customStyles = styles;
  };

  // Expose the clipx constructor to the global object
  global.clipx = clipx;

  // Add default styles for toast notifications
  var style = document.createElement("style");
  style.textContent = `
        .clipx-toast {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    color: #363636;
    padding: 8px 10px;
    border-radius: 8px;
    z-index: 9999;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
    font-size: 14px;
    text-align: center;
    opacity: 0;
    animation: fadeIn 0.5s ease forwards;
    transition: opacity 0.5s ease;
    max-width: 90%; /* Ensure it fits well on smaller screens */
    width: auto; /* Ensure the width adjusts based on content */
}

.clipx-toast.top {
    top: 20px;
    bottom: auto;
}

.clipx-toast.bottom {
    bottom: 20px;
}

.clipx-toast.error {
    background-color: #f8d7da;
    color: #721c24;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px) translateX(-50%);
    }
    to {
        opacity: 1;
        transform: translateY(0) translateX(-50%);
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
        transform: translateY(0) translateX(-50%);
    }
    to {
        opacity: 0;
        transform: translateY(10px) translateX(-50%);
    }
}`;
  document.head.appendChild(style);
})(this);
