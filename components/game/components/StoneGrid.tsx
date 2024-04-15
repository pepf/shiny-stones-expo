import Grid, { GridItem, GridSwapError, Match } from "../lib/grid";
import { useEffect, useRef, useState } from "react";
import { Center } from "@react-three/drei";
import { Stone } from "./Stone";
import useList from "react-use/lib/useList";
import LevelRuleEngine from "@/components/game/lib/score";

const GRID_SPACING = 0.1 as const;

interface StoneGridProps {
  width: number;
  height: number;
  cameraZ: number;
  updateScore: React.Dispatch<React.SetStateAction<number>>;
  updateMultiplier: React.Dispatch<React.SetStateAction<number>>;
}

export const StoneGrid = ({
  width,
  height,
  cameraZ = -3,
  updateScore,
  updateMultiplier,
}: StoneGridProps) => {
  const gridInstance = useRef<Grid>(null);
  const levelRuleInstance = useRef<LevelRuleEngine>(new LevelRuleEngine());
  const [grid, setGrid] = useState<GridItem[] | null>(null);

  useEffect(() => {
    gridInstance.current = new Grid(width, height);
    setGrid(gridInstance.current._grid);

    // cleanup
    return () => {
      delete gridInstance.current;
    };
  }, [width, height]);

  const [swapStack, { push: swapStackPush, clear: swapStackClear }] =
    useList<GridItem>([]);
  const [removeStack, { push: removeStackPush, clear: removeStackClear }] =
    useList<GridItem>([]);

  useEffect(() => {
    const gridModel = gridInstance.current;
    if (!gridModel) return;
    console.log("swapstack value: ", swapStack);
    if (swapStack.length > 2) {
      console.warn("sth went wrong, clearing stack");
      swapStackClear();
    }
    if (swapStack.length === 2) {
      try {
        swapStackClear();
        const [gridAfterSwap, revertSwap] = gridModel.swapPositions(
          swapStack[0],
          swapStack[1]
        );

        setGrid(gridAfterSwap);
        // Find out the matches
        const matchA = gridModel.findMatchForField(swapStack[0].pos);
        const matchB = gridModel.findMatchForField(swapStack[1].pos);

        // @todo Swap back on no match, figure out hooks?
        if (!matchA && !matchB) {
          setTimeout(() => {
            console.log("no matches, reverting..");
            setGrid(revertSwap());
          }, 100);
        }

        // Recursive function dealing with matches, filling the grid back up
        // And dealing with matches resulting from that...
        const processMatches = (matches: Match[] = []) => {
          levelRuleInstance.current.incrementComboMultiplier();
          updateMultiplier(levelRuleInstance.current.currentMultiplier);
          // Mark matched GridItems in a special list so we can animate them right before
          // removing them from the grid
          // @note Maybe only for the first match, not consecutive chained matches?
          matches.forEach((match) => {
            removeStackPush(...match);

            // Updates scores
            const matchScore =
              levelRuleInstance.current.calculateScoreFromMatch(match);
            updateScore((oldScore: number) => oldScore + matchScore);
          });

          // Delay every step a bit so react-spring animations are visible
          // There's probably a better way but this seems to work exactly right :)
          setTimeout(() => {
            removeStackClear();
            // Remove matches
            gridModel.removeMatches(matches);

            setGrid(gridModel._grid);
            setTimeout(() => {
              // Push grid down
              setGrid(gridModel.moveDown());
              setTimeout(() => {
                // Refil blank spots
                setGrid(gridModel.fill());
                const chainMatches = gridModel.findAllMatches();
                if (chainMatches.length > 0) {
                  // Recurse here
                  processMatches(chainMatches);
                } else {
                  // We're done here, reset combo multiplier
                  levelRuleInstance.current.resetComboMultiplier();
                  updateMultiplier(levelRuleInstance.current.currentMultiplier);
                }
              }, 200);
            }, 200);
          }, 200);
        };

        processMatches(
          [matchA, matchB].filter(Boolean) as
            | [GridItem[]]
            | [GridItem[], GridItem[]]
        );
      } catch (e: unknown) {
        // No need to log these expected errors
        if (e instanceof GridSwapError) return;
        console.warn(e.toString());
        console.warn(e.stack);
      }
    }

    return () => {
      // console.log('dropping useEffect hook')
    };
  }, [swapStack, setGrid]);

  if (!grid) return null;

  const gridComponent = grid.map((item) => {
    const [x, y] = item.pos;
    const isSelectedForSwapping = Boolean(
      swapStack.find((stackItem) => stackItem && stackItem.id === item.id)
    );
    const isMarkedForRemoval = Boolean(
      removeStack.find((stackItem) => stackItem && stackItem.id === item.id)
    );
    return (
      <Stone
        key={item.id}
        type={item.type}
        active={isSelectedForSwapping}
        removed={isMarkedForRemoval}
        position={[x + x * GRID_SPACING, y + y * GRID_SPACING, 0]}
        onClick={() => {
          swapStackPush(item);
        }}
      />
    );
  });

  return <Center position-z={cameraZ}>{gridComponent}</Center>;
};
