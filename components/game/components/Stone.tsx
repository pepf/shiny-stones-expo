import { ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";

const colors = ["#730943", "#A444A6", "#21BFA2", "#D92D07", "#F2E422"] as const;
const geometries = [
  "octahedron",
  "icosahedron",
  "octahedron",
  "dodecahedron",
  "tetrahedron",
] as const;

interface StoneProps {
  type: 0 | 1 | 2 | 3 | 4;
  position: [number, number, number];
  active: boolean;
  onClick: (e: ThreeEvent<MouseEvent>, type: StoneProps["type"]) => void;
}

/**
 * Single "stone" layed out in a grid. Should be able to support a number of "types",
 * mapped to different appearances.
 */
export const Stone = (props: StoneProps) => {
  const Geometry = useMemo(
    () => `${geometries[props.type]}Geometry`,
    [props.type]
  );
  const color = colors[props.type];

  return (
    <mesh
      onClick={(e) => props.onClick(e, props.type)}
      position={props.position}
      scale={props.active ? 1.2 : 1.0}
    >
      <Geometry attach="geometry" args={[0.5, 0]} />
      <meshLambertMaterial color={color} reflectivity={0.5} />
    </mesh>
  );
};