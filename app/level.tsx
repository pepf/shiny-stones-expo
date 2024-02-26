import { View } from "@/components/Themed";
import { Canvas } from "@react-three/fiber";
import { StyleSheet } from "react-native";
import Grid, { GridItem, GridSwapError } from "../components/game/lib/grid";
import { useEffect, useRef, useState } from "react";
import { Center } from "@react-three/drei";
import Colors from "@/constants/Colors";
import { Stone } from "../components/game/components/Stone";
import useList from "react-use/lib/useList";
import cloneDeep from "lodash.clonedeep";

const theme = Colors["light"];

const GRID_SPACING = 0.1 as const;

interface StoneGridProps {
  width: number;
  height: number;
}
const StoneGrid = ({ width, height }: StoneGridProps) => {
  const gridInstance = useRef<Grid>(null);
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
        const beforeGrid = cloneDeep(gridModel._grid);
        const gridAfterSwap = gridModel.swapPositions(
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
            // console.log('no match, reverting..')
            // console.log(swapStack)
            // const revertGrid = gridModel.swapPositions(swapStack.value[1], swapStack.value[0])
            console.log("no matches, reverting..");
            setGrid(beforeGrid);
          }, 250);
          return () => {
            console.log("stopping early because no match");
          };
        }

        // Recursive function dealing with matches, filling the grid back up
        // And dealing with matches resulting from that...
        const processMatches = (matches: Array<GridItem[]> = []) => {
          // Remove matches, push gems down
          const gridWithoutMatches = matches.reduce((_grid, match) => {
            if (!match) return _grid;
            // if (match.length) setScore((prevScore) => prevScore + match.length * 10)
            gridModel._grid = _grid.removeMatch(match);
            return gridModel;
          }, gridModel);

          // Delay every step a bit so react-spring animations are visible
          // There's probably a better way but this seems to work exactly right :)
          setTimeout(() => {
            setGrid(gridWithoutMatches._grid);
            setTimeout(() => {
              setGrid(gridModel.moveDown());
              setTimeout(() => {
                setGrid(gridModel.fill());
                const chainMatches = gridModel.findAllMatches();
                if (chainMatches.length > 0) {
                  // Recurse here
                  processMatches(chainMatches);
                }
              }, 200);
            }, 200);
          }, 200);
        };

        processMatches([matchA, matchB]);
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
    const active = Boolean(
      swapStack.find((stackItem) => stackItem && stackItem.id === item.id)
    );
    return (
      <Stone
        key={item.id}
        type={item.type}
        active={active}
        position={[x + x * GRID_SPACING, y + y * GRID_SPACING, 0]}
        onClick={() => {
          swapStackPush(item);
        }}
      />
    );
  });

  return <Center position-z={-3}>{gridComponent}</Center>;
};

const Level = () => {
  return (
    <View style={styles.container}>
      <Canvas>
        <directionalLight
          position-z={5}
          position-y={2}
          target-position={[0, 0, 0]}
          intensity={0.75}
        />
        <color attach="background" args={[theme.background]} />
        <StoneGrid width={5} height={8} />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
export default Level;
