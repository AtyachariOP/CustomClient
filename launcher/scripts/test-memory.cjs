const { app } = require('electron');
app.whenReady().then(async () => {
  const process = require('process');
  const memoryInfo = await process.getProcessMemoryInfo();
  console.log('process.getProcessMemoryInfo():', memoryInfo);
  console.log('app.getAppMetrics()[0].memory:', app.getAppMetrics()[0].memory);
  app.quit();
});
