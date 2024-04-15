import Level, { LevelConfig } from "@/components/game/components/Level";

const level1Config: LevelConfig = {
  width: 5,
  height: 8,
  showScore: true,
};

/**
 * Should only contain the parts of a level that distinguishes it from others.
 * For example override scoring logic, allow to limit the nr of moves, or override
 * visual appearance of gems.
 */
const Level1 = () => <Level config={level1Config} />;

export default Level1;
