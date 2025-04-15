describe('Performance Test', () => {
    it('Measures app launch time', async () => {
      const startTime = Date.now();
      await $('~login_button').click(); // Replace with an actual element
      const endTime = Date.now();
      
      console.log(`App launch time: ${endTime - startTime} ms`);
    });
  
    it('Checks memory usage', async () => {
      const memory = await driver.execute('mobile: getPerformanceData', {
        packageName: 'com.yourapp.package', // Replace with actual package name
        dataType: 'memoryinfo',
      });
  
      console.log('Memory usage:', memory);
    });
  });
  