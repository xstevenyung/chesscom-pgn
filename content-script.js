setTimeout(() => {
  const gameReviewButton = document.querySelector('.game-over-review-button-component');
  
  const lichessGameReviewButton = gameReviewButton.cloneNode(true);
  
  const label = lichessGameReviewButton.querySelector('.game-over-review-button-label');
  label.textContent = 'Lichess GR'

  gameReviewButton.parentNode?.insertBefore(lichessGameReviewButton, gameReviewButton.nextSibling);

  lichessGameReviewButton.querySelector('button')?.addEventListener('click', (event) => {
    document.querySelector('.share.live-game-buttons-button')?.click();

    setTimeout(() => {
      const tabs = document.querySelectorAll('.share-menu-tab-selector-tab')
  
      const PGNTab = [...tabs].find(tab => {
        return tab.querySelector('span')?.textContent === 'PGN';
      })
  
      PGNTab.click();

      setTimeout(() => {
        const pgn = document.querySelector('textarea[name="pgn"]')?.value;
        
        chrome.runtime.sendMessage({type: 'pgn', payload: {pgn}}).then(response => console.log(response));
      }, 1000)
      
    }, 2000);
  })
}, 5000)