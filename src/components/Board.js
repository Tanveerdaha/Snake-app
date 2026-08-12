import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { COLS, ROWS } from '../game/constants';
import { COLORS, HEAD_RGB, TAIL_RGB } from '../theme';

const lerp = (from, to, t) => Math.round(from + (to - from) * t);

const segmentColor = (index, length) => {
  const t = length > 1 ? index / (length - 1) : 0;
  const r = lerp(HEAD_RGB.r, TAIL_RGB.r, t);
  const g = lerp(HEAD_RGB.g, TAIL_RGB.g, t);
  const b = lerp(HEAD_RGB.b, TAIL_RGB.b, t);
  return `rgb(${r}, ${g}, ${b})`;
};

/** Two eyes set toward whichever edge of the head cell the snake is heading. */
const headEyes = (direction, cell) => {
  const dot = Math.max(2, cell * 0.16);
  const horizontal = direction.x !== 0;
  const forwardX = horizontal ? direction.x * cell * 0.28 : 0;
  const forwardY = horizontal ? 0 : direction.y * cell * 0.28;
  const spreadX = horizontal ? 0 : cell * 0.2;
  const spreadY = horizontal ? cell * 0.2 : 0;
  const center = cell / 2 - dot / 2;

  return {
    size: dot,
    positions: [
      { left: center + forwardX - spreadX, top: center + forwardY - spreadY },
      { left: center + forwardX + spreadX, top: center + forwardY + spreadY },
    ],
  };
};

const GridLines = memo(function GridLines({ cell }) {
  const lines = useMemo(() => {
    const built = [];
    for (let i = 1; i < COLS; i += 1) {
      built.push(
        <View key={`v${i}`} style={[styles.vLine, { left: i * cell }]} pointerEvents="none" />
      );
    }
    for (let i = 1; i < ROWS; i += 1) {
      built.push(
        <View key={`h${i}`} style={[styles.hLine, { top: i * cell }]} pointerEvents="none" />
      );
    }
    return built;
  }, [cell]);

  return lines;
});

function Board({ game, size, responderProps }) {
  const cell = size / COLS;
  const { body, food, direction, walls = [] } = game;
  const eyes = headEyes(direction, cell);

  return (
    <View style={[styles.board, { width: size, height: size }]} {...responderProps}>
      <GridLines cell={cell} />

      {walls.map((wall) => (
        <View
          key={`w${wall.x},${wall.y}`}
          style={[
            styles.wall,
            {
              width: cell - 2,
              height: cell - 2,
              left: wall.x * cell + 1,
              top: wall.y * cell + 1,
              borderRadius: Math.max(2, cell * 0.12),
            },
          ]}
        />
      ))}

      {food !== null && (
        <View
          style={[
            styles.food,
            {
              width: cell * 0.72,
              height: cell * 0.72,
              borderRadius: cell * 0.36,
              left: food.x * cell + cell * 0.14,
              top: food.y * cell + cell * 0.14,
            },
          ]}
        >
          <View
            style={[
              styles.foodShine,
              {
                width: cell * 0.2,
                height: cell * 0.2,
                borderRadius: cell * 0.1,
                left: cell * 0.12,
                top: cell * 0.12,
              },
            ]}
          />
        </View>
      )}

      {body.map((segment, index) => (
        <View
          key={`${segment.x},${segment.y},${index}`}
          style={[
            styles.segment,
            {
              width: cell - 2,
              height: cell - 2,
              borderRadius: Math.max(3, cell * 0.26),
              left: segment.x * cell + 1,
              top: segment.y * cell + 1,
              backgroundColor: segmentColor(index, body.length),
            },
          ]}
        >
          {index === 0 &&
            eyes.positions.map((position, eye) => (
              <View
                key={eye}
                style={[
                  styles.eye,
                  {
                    width: eyes.size,
                    height: eyes.size,
                    borderRadius: eyes.size / 2,
                    // The eye sits inside a cell inset by 1px on each side.
                    left: position.left - 1,
                    top: position.top - 1,
                  },
                ]}
              />
            ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(110, 231, 183, 0.45)',
    backgroundColor: COLORS.board,
  },
  vLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.gridLine,
  },
  hLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.gridLine,
  },
  segment: {
    position: 'absolute',
  },
  wall: {
    position: 'absolute',
    backgroundColor: COLORS.wall,
    borderWidth: 1,
    borderColor: COLORS.wallEdge,
  },
  eye: {
    position: 'absolute',
    backgroundColor: 'rgba(6, 32, 22, 0.85)',
  },
  food: {
    position: 'absolute',
    backgroundColor: COLORS.food,
  },
  foodShine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
});

export default memo(Board);
