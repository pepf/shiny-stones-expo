import { useMemo } from "react";
import { MathUtils } from "three";
import { ThreeEvent } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";

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
  removed: boolean;
  onClick: (e: ThreeEvent<MouseEvent>, type: StoneProps["type"]) => void;
}

const scales = {
  normal: [1, 1, 1],
  active: [1.2, 1.2, 1.2],
  removed: [0, 0, 0],
} as const;

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

  const scale = props.active
    ? scales.active
    : props.removed
    ? scales.removed
    : scales.normal;
  // animate all state changes
  const {
    position,
    scale: scaleSpring,
    rotation,
  } = useSpring({
    scale,
    position: props.position,
    rotation: props.active ? MathUtils.degToRad(90) : 0,
  });

  return (
    <a.group position={position}>
      <a.mesh
        onClick={(e) => props.onClick(e, props.type)}
        scale={scaleSpring}
        rotation-y={rotation}
      >
        <Geometry args={[0.5, 0]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.1}
          metalness={0.5}
          reflectivity={0.5}
        />
      </a.mesh>
      {props.active ? (
        <>
          <mesh position-z={-0.5}>
            <ringGeometry attach="geometry" args={[0, 0.75, 32]} />
            <meshPhysicalMaterial
              color={"white"}
              reflectivity={0}
              emissive={"white"}
              emissiveIntensity={1}
            />
          </mesh>
        </>
      ) : null}
    </a.group>
  );
};
