export default () => ({
    signInWithCredential: jest.fn(),
  });
  
  export const firebase = {
    auth: {
      GoogleAuthProvider: {
        credential: jest.fn(() => 'mocked-credential'),
      },
    },
  };
  