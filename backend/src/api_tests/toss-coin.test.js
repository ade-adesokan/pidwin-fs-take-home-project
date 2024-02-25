import tossCoin from '../api/toss-coin.js';
import Token from "../models/token.js";
import Toss from "../models/toss.js";
import { jest } from '@jest/globals';

describe('tossCoin', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: { wager: 50, toss: 'head' },
      userId: 'someUserId'
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when wager is higher than available tokens', () => {
    it('should respond with an error', async () => {
      jest.spyOn(Token, 'findOne').mockReturnValue({
        exec: () => Promise.resolve({ token: 10, winningStreak: 2 })
      });
      await tossCoin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "Insufficient tokens" });
    });
  });

  describe('when wager is less than available tokens', () => {
    it('should respond a win and the available tokens', async () => {
      const availableToken = 100;
      const TokenFindOneMock = jest.spyOn(Token, 'findOne').mockReturnValue({
        exec: () => Promise.resolve({ token: availableToken, winningStreak: 0 })
      });

      // First call is to simulate the token deduction and the second call is to simulate the token after a win
      const TokenFindOneAndUpdateMock = jest.spyOn(Token, 'findOneAndUpdate').mockResolvedValueOnce({
        token: availableToken - req.body.wager, winningStreak: 0
      }).mockResolvedValue({
        token: (availableToken - req.body.wager) + (req.body.wager * 2), winningStreak: 1
      })
      jest.spyOn(Toss, 'create').mockReturnValue(Promise.resolve());
      // simulate system toss of head
      jest.spyOn(global.Math, 'random').mockReturnValue(0.2);

      await tossCoin(req, res, next);
      expect(TokenFindOneMock).toHaveBeenCalled();
      expect(TokenFindOneAndUpdateMock).toHaveBeenCalledTimes(2);
      // Verifying the update token before system toss
      expect(TokenFindOneAndUpdateMock.mock.calls[0][1]).toEqual({ token: 50 });

      // Verifying the update token (150) after system toss win
      expect(TokenFindOneAndUpdateMock.mock.calls[1][1]).toEqual({ token: 150,  winningStreak: 1});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'head, you won', token: 150 });
    });
    it('should respond a loss and the avaiable tokens', async () => {
      const availableToken = 100;
      const TokenFindOneMock = jest.spyOn(Token, 'findOne').mockReturnValue({
        exec: () => Promise.resolve({ token: availableToken, winningStreak: 0 })
      });

      // First call is to simulate the token deduction and the second call is to simulate the token after a win
      const TokenFindOneAndUpdateMock = jest.spyOn(Token, 'findOneAndUpdate').mockResolvedValue({
        token: availableToken - req.body.wager, winningStreak: 0
      })
      jest.spyOn(Toss, 'create').mockReturnValue(Promise.resolve());
      // simulate system toss of tail
      jest.spyOn(global.Math, 'random').mockReturnValue(1.2);

      await tossCoin(req, res, next);
      expect(TokenFindOneMock).toHaveBeenCalled();
      expect(TokenFindOneAndUpdateMock).toHaveBeenCalledTimes(2);
      // Verifying the update token before system toss
      expect(TokenFindOneAndUpdateMock.mock.calls[0][1]).toEqual({ token: 50 });

      // Verifying the update token (150) after system toss win
      expect(TokenFindOneAndUpdateMock.mock.calls[1][1]).toEqual({ winningStreak: 0});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'tail, you lost', token: 50 });
    });
  });
  
});
