import { TileType, Room, DungeonMap } from './types';
import { MAP_WIDTH, MAP_HEIGHT, MIN_ROOM_SIZE, MAX_ROOM_SIZE, ROOM_PADDING } from './constants';

interface BSPNode {
  x: number;
  y: number;
  width: number;
  height: number;
  left: BSPNode | null;
  right: BSPNode | null;
  room: Room | null;
}

function createNode(x: number, y: number, width: number, height: number): BSPNode {
  return { x, y, width, height, left: null, right: null, room: null };
}

function splitNode(node: BSPNode, depth: number): void {
  if (depth <= 0) return;
  if (node.width < MIN_ROOM_SIZE * 2 + ROOM_PADDING * 2 && node.height < MIN_ROOM_SIZE * 2 + ROOM_PADDING * 2) return;

  const splitHorizontally = node.width < node.height
    ? true
    : node.height < node.width
      ? false
      : Math.random() > 0.5;

  if (splitHorizontally) {
    if (node.height < MIN_ROOM_SIZE * 2 + ROOM_PADDING * 2) return;
    const split = Math.floor(
      Math.random() * (node.height - MIN_ROOM_SIZE * 2 - ROOM_PADDING * 2)
    ) + MIN_ROOM_SIZE + ROOM_PADDING;
    node.left = createNode(node.x, node.y, node.width, split);
    node.right = createNode(node.x, node.y + split, node.width, node.height - split);
  } else {
    if (node.width < MIN_ROOM_SIZE * 2 + ROOM_PADDING * 2) return;
    const split = Math.floor(
      Math.random() * (node.width - MIN_ROOM_SIZE * 2 - ROOM_PADDING * 2)
    ) + MIN_ROOM_SIZE + ROOM_PADDING;
    node.left = createNode(node.x, node.y, split, node.height);
    node.right = createNode(node.x + split, node.y, node.width - split, node.height);
  }

  splitNode(node.left, depth - 1);
  splitNode(node.right, depth - 1);
}

function createRoom(node: BSPNode): void {
  if (node.left && node.right) {
    createRoom(node.left);
    createRoom(node.right);
    return;
  }

  const roomWidth = Math.min(
    Math.floor(Math.random() * (MAX_ROOM_SIZE - MIN_ROOM_SIZE + 1)) + MIN_ROOM_SIZE,
    node.width - ROOM_PADDING * 2
  );
  const roomHeight = Math.min(
    Math.floor(Math.random() * (MAX_ROOM_SIZE - MIN_ROOM_SIZE + 1)) + MIN_ROOM_SIZE,
    node.height - ROOM_PADDING * 2
  );
  const roomX = node.x + ROOM_PADDING + Math.floor(Math.random() * Math.max(1, node.width - roomWidth - ROOM_PADDING * 2));
  const roomY = node.y + ROOM_PADDING + Math.floor(Math.random() * Math.max(1, node.height - roomHeight - ROOM_PADDING * 2));

  node.room = {
    x: roomX,
    y: roomY,
    width: roomWidth,
    height: roomHeight,
    centerX: Math.floor(roomX + roomWidth / 2),
    centerY: Math.floor(roomY + roomHeight / 2),
  };
}

function getRooms(node: BSPNode): Room[] {
  if (node.room) return [node.room];
  const rooms: Room[] = [];
  if (node.left) rooms.push(...getRooms(node.left));
  if (node.right) rooms.push(...getRooms(node.right));
  return rooms;
}

function connectRooms(map: TileType[][], node: BSPNode): void {
  if (!node.left || !node.right) return;

  connectRooms(map, node.left);
  connectRooms(map, node.right);

  const leftRooms = getRooms(node.left);
  const rightRooms = getRooms(node.right);

  if (leftRooms.length === 0 || rightRooms.length === 0) return;

  let minDist = Infinity;
  let bestLeft = leftRooms[0];
  let bestRight = rightRooms[0];

  for (const lr of leftRooms) {
    for (const rr of rightRooms) {
      const dist = Math.abs(lr.centerX - rr.centerX) + Math.abs(lr.centerY - rr.centerY);
      if (dist < minDist) {
        minDist = dist;
        bestLeft = lr;
        bestRight = rr;
      }
    }
  }

  carveCorridor(map, bestLeft.centerX, bestLeft.centerY, bestRight.centerX, bestRight.centerY);
}

function carveCorridor(map: TileType[][], x1: number, y1: number, x2: number, y2: number): void {
  let x = x1;
  let y = y1;

  if (Math.random() > 0.5) {
    while (x !== x2) {
      if (map[y][x] === TileType.Wall) map[y][x] = TileType.Corridor;
      x += x < x2 ? 1 : -1;
    }
    while (y !== y2) {
      if (map[y][x] === TileType.Wall) map[y][x] = TileType.Corridor;
      y += y < y2 ? 1 : -1;
    }
  } else {
    while (y !== y2) {
      if (map[y][x] === TileType.Wall) map[y][x] = TileType.Corridor;
      y += y < y2 ? 1 : -1;
    }
    while (x !== x2) {
      if (map[y][x] === TileType.Wall) map[y][x] = TileType.Corridor;
      x += x < x2 ? 1 : -1;
    }
  }
  if (map[y][x] === TileType.Wall) map[y][x] = TileType.Corridor;
}

export function generateDungeon(floor: number): DungeonMap {
  const tiles: TileType[][] = [];
  const explored: boolean[][] = [];
  const visible: boolean[][] = [];

  for (let y = 0; y < MAP_HEIGHT; y++) {
    tiles[y] = [];
    explored[y] = [];
    visible[y] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      tiles[y][x] = TileType.Wall;
      explored[y][x] = false;
      visible[y][x] = false;
    }
  }

  const root = createNode(0, 0, MAP_WIDTH, MAP_HEIGHT);
  const depth = Math.min(4, 2 + Math.floor(floor / 3));
  splitNode(root, depth);
  createRoom(root);

  const rooms = getRooms(root);

  for (const room of rooms) {
    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        if (y >= 0 && y < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
          tiles[y][x] = TileType.Floor;
        }
      }
    }
  }

  connectRooms(tiles, root);

  const stairsRoom = rooms[rooms.length - 1];
  tiles[stairsRoom.centerY][stairsRoom.centerX] = TileType.StairsDown;

  return {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    floor,
    tiles,
    explored,
    visible,
    rooms,
  };
}

export function getRandomFloorPosition(map: DungeonMap, room: Room): { x: number; y: number } {
  const x = room.x + Math.floor(Math.random() * room.width);
  const y = room.y + Math.floor(Math.random() * room.height);
  if (map.tiles[y][x] === TileType.Floor || map.tiles[y][x] === TileType.Corridor) {
    return { x, y };
  }
  return { x: room.centerX, y: room.centerY };
}
