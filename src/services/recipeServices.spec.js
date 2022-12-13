const { index, getPlanners } = require('./recipeServices');
let {
  getPlannerDocumentByProfileID,
  addRecipeToPlannerDocument,
  createPlannerDocument
} = require('../services/plannerService');
const { getMockReq, getMockRes } = require('@jest-mock/express');

jest.mock('../services/plannerService');

describe('#getPlanners', () => {
  describe('when getPlanners is passed valid input...', () => {
    beforeEach(() => {
      getPlannerDocumentByProfileID.mockReset();
    });

    it('should respond with expected output', async () => {
      const expectedOutput = { foo: [] };
      getPlannerDocumentByProfileID.mockResolvedValueOnce(expectedOutput);

      const req = getMockReq({ user: { profile: 'testProfileId' } });
      const { res, next } = getMockRes();

      await getPlanners(req, res);

      expect(getPlannerDocumentByProfileID).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining(expectedOutput)
      );
    });
  });
})