import { Match } from "./grid";

/**
 * Responsible for calculating scores from matches,
 * but also for keeping track of level-related logic.
 * For example determining if a level is completed based on total score or a limited # of available moves.
 */
class LevelRuleEngine {
  currentMultiplier = 0;
  readonly BaseScore = 100;

  incrementComboMultiplier() {
    this.currentMultiplier++;
  }
  decrementComboMultiplier() {
    this.currentMultiplier--;
  }
  resetComboMultiplier() {
    this.currentMultiplier = 0;
  }

  calculateScoreFromMatch(match: Match): number {
    return this.BaseScore * match.length * this.currentMultiplier;
  }
}

export default LevelRuleEngine;
