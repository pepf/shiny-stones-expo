import Level, { LevelConfig } from "@/components/game/components/Level";

const level2Config: LevelConfig = {
  width: 8,
  height: 10,
  showScore: true,
};

/**
 * Should only contain the parts of a level that distinguishes it from others.
 * For example override scoring logic, allow to limit the nr of moves, or override
 * visual appearance of gems.
 */
const Level2 = () => <Level config={level2Config} />;

export default Level2;
