document.getElementById('organize-btn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'organize' });
  });
  
  document.getElementById('focus-btn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'focus' });
  });
  