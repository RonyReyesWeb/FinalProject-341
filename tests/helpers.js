// Builds a fake MongoDB collection so GET tests run without a real database
const fakeCollection = (docs = [], { fail = false } = {}) => ({
  find: jest.fn(() => ({
    toArray: fail ? jest.fn().mockRejectedValue(new Error('DB down')) : jest.fn().mockResolvedValue(docs)
  })),
  findOne: jest.fn(async (query) => {
    if (fail) throw new Error('DB down');
    return docs.find((d) => String(d._id) === String(query._id)) || null;
  })
});

module.exports = { fakeCollection };
