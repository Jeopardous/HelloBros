describe('AUTH', () => {
  // …
  beforeAll(async () => {
    await device.launchApp();
  });
  it('should tap on a button', async () => {
    await element(by.id('SIGN_IN_BUTTON')).tap();
    await expect(element(by.id('SIGN_IN_BOTTOM_SHEET'))).toBeVisible();
  });
  it('should swipe down to close bottom sheet', async () => {
    // Assuming the bottom sheet can be swiped down to close
    const bottomSheet = await element(by.id('SIGN_IN_BOTTOM_SHEET'));

    console.log('bottomSheet', bottomSheet);

    // Get the coordinates of the bottom sheet
    const {x, y, width, height} = await bottomSheet.getViewport();
    console.log('bottomSheet DATA', x, y, width, height);
    // Calculate swipe coordinates for swiping down (from center to bottom)
    // const startY = y + height / 5;
    // const endY = y + height - 10; // Adjust as needed

    // // Perform the swipe gesture from startY to endY
    // await device.swipe({startX: x + width / 2, startY, endY, duration: 500});

    // // Wait for the bottom sheet to be invisible or not present
    // await expect(element(by.id('SIGN_IN_BOTTOM_SHEET'))).not.toBeVisible();
  });
  //   it('should navigate to SignUp screen on tapping Sign Up button', async () => {
  //     // Tap on the Sign Up button
  //     await element(by.id('SIGN_UP_BUTTON')).tap();

  //     // Wait for navigation to SignUp screen (assuming it's a unique element)
  //     await expect(element(by.id('SIGNUP_SCREEN'))).toBeVisible();
  //   });
});
