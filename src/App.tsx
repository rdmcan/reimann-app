import React, { useState } from "react"; // https://mafs.dev/guides/examples/riemann-sums
import "./App.css";
import { Mafs, useMovablePoint, Plot, Polygon, Text, Coordinates } from "mafs";
import "mafs/core.css";
import sumBy from "lodash/sumBy"; // npm install --save lodash  // npm install --save-dev @types/lodash
import range from "lodash/range";

interface Partition {
  polygon: [number, number][];
  area: number;
}

function App() {
  const maxNumPartitions = 200;

  // Inputs
  const [numPartitions, setNumPartitions] = useState(10);
  const a = useMovablePoint([1, 0], {
    constrain: "horizontal",
  });
  const b = useMovablePoint([11, 0], {
    constrain: "horizontal",
  });

  // Mathematical function
  const wave = (x: number) => 2 * Math.cos((Math.PI * x) / 2) + x;

  // Outputs
  const dx = (b.x - a.x) / numPartitions;
  const partitions: Partition[] = range(a.x, b.x - dx / 2, dx).map((x) => {
    const yMid = wave(x + dx / 2);

    return {
      polygon: [
        [x, 0],
        [x, yMid],
        [x + dx, yMid],
        [x + dx, 0],
      ],
      area: dx * yMid,
    };
  });

  const areaApprox = sumBy(partitions, "area");

  return (
    <>
      <Mafs viewBox={{ x: [-1, 10], y: [-4, 10] }}>
        <Coordinates.Cartesian subdivisions={2} />

        <Plot.OfX y={wave} color="#358CF1" />

        {partitions.map((partition, index) => (
          <Polygon
            key={index}
            points={partition.polygon}
            fillOpacity={numPartitions / maxNumPartitions}
            color={
              partition.area >= 0 ? "hsl(112, 100%, 47%)" : "hsl(0, 100%, 47%)"
            }
          />
        ))}

        <Text attach="e" x={-5} y={5.5} size={22}>
          Riemann sum:
        </Text>

        <Text attach="e" x={-4} y={4.5} size={30}>
          {areaApprox.toFixed(4)}
        </Text>

        {a.element}
        {b.element}
      </Mafs>

      <div className="p-4 border-gray-700 border-t bg-black text-white">
        Partitions:{" "}
        <input
          type="range"
          min={20}
          max={100}
          value={numPartitions}
          onChange={(event) => setNumPartitions(+event.target.value)}
        />
      </div>
    </>
  );
}

export default App;
