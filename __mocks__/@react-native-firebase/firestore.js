const collectionMock = {
    doc: jest.fn(() => ({
      set: jest.fn().mockResolvedValue(true),
      update: jest.fn().mockResolvedValue(true),
      get: jest.fn().mockResolvedValue({ exists: true, data: () => ({}) }),
    })),
    add: jest.fn().mockResolvedValue({ id: 'mocked-id' }),
    get: jest.fn().mockResolvedValue({ docs: [] }),
  };
  
  const firestoreMock = {
    collection: jest.fn(() => collectionMock),
  };
  
  export default () => firestoreMock;
  