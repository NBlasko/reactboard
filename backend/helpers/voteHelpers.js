const CommonVote = require("../models/CommonVote");

module.exports = {
  /**
   *
   * @param {Object} calculateAndSaveVoteOptions
   * @param {Object} calculateAndSaveVoteOptions.caseVote Document<any>
   * @param {Number} calculateAndSaveVoteOptions.wantsToVoteValue
   * @param {String} calculateAndSaveVoteOptions.userId
   * @returns {Promise<String[]>} [commonVote: Document<any>, caseVote: caseVote]
   */
  calculateAndSaveVote: async ({ caseVote, wantsToVoteValue, userId }) => {
    const commonVoteOptions = { voteCaseId: caseVote._id, voterId: userId };
    let commonVote = await CommonVote.findOne(commonVoteOptions);
    if (!commonVote) {
      commonVote = new CommonVote(commonVoteOptions);
    }
console.log({ caseVote, wantsToVoteValue, userId })
    const alreadyVotedUp = commonVote && commonVote.value === 1;
    const alreadyVotedDown = commonVote && commonVote.value === -1;
    const wantsToVoteUp = wantsToVoteValue === 1;
    const wantsToVoteDown = wantsToVoteValue === -1;

    if (wantsToVoteUp && alreadyVotedUp) {
      commonVote.value = 0;
      caseVote.voteCountUp--;
    }

    if (wantsToVoteUp && alreadyVotedDown) {
      commonVote.value = 1;
      caseVote.voteCountDown--;
      caseVote.voteCountUp++;
    }

    if (wantsToVoteUp && !alreadyVotedDown && !alreadyVotedUp) {
      commonVote.value = 1;
      caseVote.voteCountUp++;
    }

    if (wantsToVoteDown && alreadyVotedDown) {
      commonVote.value = 0;
      caseVote.voteCountDown--;
    }

    if (wantsToVoteDown && alreadyVotedUp) {
      commonVote.value = -1;
      caseVote.voteCountDown++;
      caseVote.voteCountUp--;
    }

    if (wantsToVoteDown && !alreadyVotedDown && !alreadyVotedUp) {
      commonVote.value = -1;
      caseVote.voteCountDown++;
    }

    console.log("Posle",{ caseVote, wantsToVoteValue, userId })

    if (commonVote.value === 0) {
      await Promise.all([caseVote.save(), CommonVote.deleteOne(commonVoteOptions)]);
    } else {
      await Promise.all([caseVote.save(), await commonVote.save()]);
    }

    return [commonVote, caseVote];
  },
};
