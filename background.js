chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {
  if (message.type === "pgn") {
    fetch('https://lichess.org/api/import', {
      method:'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'accept': 'application/json',
      },
      body: new URLSearchParams(message.payload),
      redirect: 'manual',
    }).then(response => {
        return response.json()
    }).then(data => chrome.tabs.create({ url: data.url }))
  }
  return true
});