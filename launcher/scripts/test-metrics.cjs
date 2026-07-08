const { app } = require('electron');

app.whenReady().then(() => {
  setTimeout(() => {
    console.log(JSON.stringify(app.getAppMetrics(), null, 2));
    app.quit();
  }, 2000);
});
