function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const intervalId = setInterval(() => {
      const element = document.querySelector(selector);
      if (element && element.offsetParent !== null) {
        clearInterval(intervalId);
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(intervalId);
        reject(new Error(`Element ${selector} not found or not visible within ${timeout}ms`));
      }
    }, 500);

    setTimeout(() => {
      clearInterval(intervalId);
      reject(new Error(`Element ${selector} not found or not visible within ${timeout}ms`));
    }, timeout);
  });
}

waitForElement('.game-over-review-button-component').then((gameReviewButton) => {
  // const lichessGameReviewButton = gameReviewButton.cloneNode(true);
  const lichessGameReviewButton = document.createElement('button');
  lichessGameReviewButton.type = 'button';
  lichessGameReviewButton.textContent = 'Lichess Review';

  gameReviewButton.parentNode?.insertBefore(lichessGameReviewButton, gameReviewButton.nextSibling);

  lichessGameReviewButton.addEventListener('click', async (event) => {
    document.querySelector('.share.live-game-buttons-button')?.click();

    await waitForElement('.share-menu-tab-selector-tab');
    const tabs = document.querySelectorAll('.share-menu-tab-selector-tab')

    const PGNTab = [...tabs].find(tab => {
      return tab.querySelector('span')?.textContent === 'PGN';
    })

    PGNTab.click();

    await waitForElement('textarea[name="pgn"]');
    const pgn = document.querySelector('textarea[name="pgn"]')?.value;
    
    chrome.runtime.sendMessage({type: 'pgn', payload: {pgn}}).then(response => console.log(response));
  });
}).catch(error => console.error('Error:', error));