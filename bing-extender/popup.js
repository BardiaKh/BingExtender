const triggerUIChange = async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];
    if (tab.url.startsWith("https://www.bing.com/search?q=")) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          function: () => {
            const textarea = document.querySelector("#b_sydConvCont > cib-serp").shadowRoot.querySelector("#cib-action-bar-main").shadowRoot.querySelector("div > div.main-container.body-2 > div.input-container.as-ghost-placement > cib-text-input").shadowRoot.querySelector("#searchbox");
            const counter = document.querySelector("#b_sydConvCont > cib-serp").shadowRoot.querySelector("#cib-action-bar-main").shadowRoot.querySelector("div > div.main-container.body-2 > div.input-container.as-ghost-placement > div.body-1.bottom-bar > div.letter-counter");
            return textarea && counter && textarea.maxLength !== 50000;
          },
        },
        async (result) => {
          if (result[0].result) {
            document.body.classList = "bing-normal";
            document.getElementById("status-text").innerHTML = "You are using the normal Bing.";
          } else {
            prompts_data = await fetch("prompts.json").then(response => response.json());
            createPromptList(prompts_data)
            document.body.classList = "bing-extended";
            document.getElementById("status-text").innerHTML = "Your Bing is now on turbo charge: <br><br> <span style='font-size:85%'>- 50,000 character limit <br> - Messages with line breaks <br> - Prompt templates: </span>";
          }
        }
      );
    } else {
      document.body.classList = "non-bing";
      document.getElementById("status-text").innerHTML = "You are not using Bing right now. <br><br> <span style='font-size:85%;'><a style='text-decoration:none; font-style:italic; color: #4a72b1' target='_blank' href='https://www.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx'>open Bing</a></span>";
    }
  });
};

triggerUIChange()
document.getElementById("run-script").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];
    if (tab.url.startsWith("https://www.bing.com/search?q=")) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          function: () => {
            const textarea = document.querySelector("#b_sydConvCont > cib-serp").shadowRoot.querySelector("#cib-action-bar-main").shadowRoot.querySelector("div > div.main-container.body-2 > div.input-container.as-ghost-placement > cib-text-input").shadowRoot.querySelector("#searchbox");
            const counter = document.querySelector("#b_sydConvCont > cib-serp").shadowRoot.querySelector("#cib-action-bar-main").shadowRoot.querySelector("div > div.main-container.body-2 > div.input-container.as-ghost-placement > div.body-1.bottom-bar > div.letter-counter");
            if (textarea && counter && textarea.maxLength !== 50000) {
              // Main logic
              textarea.maxLength = 50000;
              const span = counter.querySelector("span");
              let sibling = span.nextSibling;
              while (sibling && sibling.nodeType === Node.TEXT_NODE && sibling.textContent.includes("/")) {
                sibling = sibling.nextSibling;
              }
              if (sibling) {
                const newText = document.createTextNode("50,000");
                sibling.replaceWith(newText);
              }

              // Inject CSS for previous messages
              const targetElement = document.querySelector("#b_sydConvCont > cib-serp").shadowRoot.querySelector("#cib-conversation-main").shadowRoot.querySelector("#cib-chat-main")

              const styleText = `
                .text-message-content {white-space: pre-wrap !important}
              `;
              for (let i = 0; i < targetElement.children.length; i++) {
                let child = targetElement.children[i];
                if (child.tagName === 'CIB-CHAT-TURN') {
                  const style = document.createElement('style')
                  style.innerHTML = styleText;
                  child.shadowRoot.querySelector("cib-message-group:nth-child(1)").shadowRoot.querySelector("cib-message").shadowRoot.appendChild(style);
                }
              }

              // Inject CSS for new messages
              const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                  if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                      if (node.tagName === "CIB-CHAT-TURN"){
                        const style = document.createElement('style')
                        style.innerHTML = styleText;
                        node.shadowRoot.querySelector("cib-message-group:nth-child(1)").shadowRoot.querySelector("cib-message").shadowRoot.appendChild(style);
                      }
                    });
                  }
                });
              });
              
              observer.observe(targetElement, { childList: true, subtree: true });
            } else {
              alert("Unfortunately there was an error. Please contact the developer.");
            }            
          },
        },
        () => triggerUIChange()
      );
    }
  });
});

const createPromptList = (prompts_data) => {
  document.getElementById("prompt-list").innerHTML = "";
  prompts_data.forEach((prompt) => {
    const item = document.createElement("div");
    item.classList = "item";
    const title = document.createElement("div");
    title.classList = "title";
    title.innerHTML = prompt.title;
    const description = document.createElement("div");
    description.classList = "description";
    description.innerHTML = prompt.description;
    item.appendChild(title);
    item.appendChild(description);
    item.addEventListener("click", () => {
      injectPrompt(prompt.prompt);
    });
    document.getElementById("prompt-list").appendChild(item);
  });
};

const injectPrompt = (prompt) => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];
    if (tab.url.startsWith("https://www.bing.com/search?q=")) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          function: (prompt) => {
            const textarea = document.querySelector("#b_sydConvCont > cib-serp").shadowRoot.querySelector("#cib-action-bar-main").shadowRoot.querySelector("div > div.main-container.body-2 > div.input-container.as-ghost-placement > cib-text-input").shadowRoot.querySelector("#searchbox");
            textarea.value = prompt;
            textarea.dispatchEvent(new Event("input", { bubbles: true }));
          },
          args: [prompt],
        }
      );
      window.close();
    }
  });
};
