(function() {
  function tryInsertQuery() {
    chrome.storage.local.get(["pendingQuery"], (result) => {
      const query = result.pendingQuery;
      if (!query) return;

      const findInput = () => {
        // Specifically look for rich-textarea as requested
        const richTextarea = document.querySelector('rich-textarea');
        if (richTextarea) {
          // Inside rich-textarea, there is usually a contenteditable div
          return richTextarea.querySelector('div[contenteditable="true"]') || richTextarea;
        }
        
        return document.querySelector('.rich-textarea') ||
               document.querySelector('div[contenteditable="true"]') ||
               document.querySelector('textarea');
      };

      const input = findInput();
      if (input) {
        chrome.storage.local.remove("pendingQuery");

        input.focus();
        
        // Use a more robust way to set text for contenteditable
        if (input.isContentEditable) {
          // Clear existing placeholder if any
          input.innerHTML = '';
          
          // Insert text
          const textNode = document.createTextNode(query);
          input.appendChild(textNode);
        } else if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
          input.value = query;
        }

        // Trigger input events so the UI (Angular/React) knows there's content
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Also try 'beforeinput' and 'keydown' if needed for some frameworks
        input.dispatchEvent(new InputEvent('input', { inputType: 'insertText', data: query, bubbles: true }));

      } else {
        // Retry if not found yet (SPA might still be loading)
        setTimeout(tryInsertQuery, 500);
      }
    });
  }

  // Start polling for the input area
  tryInsertQuery();
})();
