function waitForElement(selector) {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element && element.offsetParent !== null) {
        obs.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Check if the element already exists
    const element = document.querySelector(selector);
    if (element && element.offsetParent !== null) {
      observer.disconnect();
      resolve(element);
    }
  });
}

const observer = new MutationObserver((mutations, obs) => {
  const gameReviewButton = document.querySelector('.game-over-review-button-component:not([data-lichess="true"])') || document.querySelector('.game-review-buttons-component:not([data-lichess="true"])');
  if (gameReviewButton && gameReviewButton.offsetParent !== null) {
    handleGameReviewButton(gameReviewButton);
    gameReviewButton.setAttribute('data-lichess', 'true');
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

function handleGameReviewButton(gameReviewButton) {
  const container = document.createElement('div')
  container.style.marginLeft = "2rem";
  container.style.marginRight = "2rem";
  container.style.marginTop = "1rem";
  container.style.marginBottom = "1rem";

  const lichessGameReviewButton = document.createElement('button');
  lichessGameReviewButton.type = 'button';
  lichessGameReviewButton.textContent = 'Lichess Review';
  lichessGameReviewButton.style.padding = "1.5rem";
  lichessGameReviewButton.style.width = "100%";
  
  container.appendChild(lichessGameReviewButton);

  gameReviewButton.parentNode?.insertBefore(container, gameReviewButton.nextSibling);

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
}